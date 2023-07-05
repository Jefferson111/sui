// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

use move_binary_format::errors::Location;
use std::sync::Arc;

use move_binary_format::{
    errors::{PartialVMError, PartialVMResult, VMResult},
    file_format::{Ability, AbilitySet, Bytecode},
};
use move_core_types::{account_address::AccountAddress, vm_status::StatusCode};
use move_vm_types::{gas::GasMeter, loaded_data::runtime_types::Type, values::Locals};

use crate::{
    interpreter::{check_ability, FrameInterface, InstrRet, InterpreterInterface},
    loader::{Function, Loader, Resolver},
};

pub struct ParanoidTypeChecker {}

impl ParanoidTypeChecker {
    pub(crate) fn pre_hook_entrypoint(
        interpreter: &mut impl InterpreterInterface,
        function: &Arc<Function>,
        ty_args: &[Type],
        link_context: AccountAddress,
        loader: &Loader,
    ) -> VMResult<()> {
        if function.is_native() {
            ParanoidTypeChecker::push_parameter_types(
                interpreter,
                &function,
                &ty_args,
                link_context,
                loader,
            )?;
            let resolver = function.get_resolver(link_context, loader);
            ParanoidTypeChecker::native_function(interpreter, &function, ty_args, &resolver)
                .map_err(|e| match function.module_id() {
                    Some(id) => e
                        .at_code_offset(function.index(), 0)
                        .finish(Location::Module(id.clone())),
                    None => PartialVMError::new(StatusCode::UNKNOWN_INVARIANT_VIOLATION_ERROR)
                        .with_message(
                            "Unexpected native function not located in a module".to_owned(),
                        )
                        .finish(Location::Undefined),
                })?;
        }
        Ok(())
    }

    pub(crate) fn pre_hook_fn(
        interpreter: &mut impl InterpreterInterface,
        current_frame: &mut FrameInterface,
        function: &Arc<Function>,
        ty_args: &[Type],
        link_context: AccountAddress,
        loader: &Loader,
    ) -> VMResult<()> {
        ParanoidTypeChecker::check_friend_or_private_call(
            interpreter,
            current_frame.function(),
            &function,
        )?;
        if function.is_native() {
            let resolver = function.get_resolver(link_context, loader);
            ParanoidTypeChecker::native_function(interpreter, &function, ty_args, &resolver)
                .map_err(|e| match function.module_id() {
                    Some(id) => {
                        let e = if resolver.loader().vm_config().error_execution_state {
                            e.with_exec_state(interpreter.get_internal_state())
                        } else {
                            e
                        };
                        e.at_code_offset(function.index(), 0)
                            .finish(Location::Module(id.clone()))
                    }
                    None => {
                        let err =
                            PartialVMError::new(StatusCode::UNKNOWN_INVARIANT_VIOLATION_ERROR)
                                .with_message(
                                    "Unexpected native function not located in a module".to_owned(),
                                );
                        interpreter.set_location(err)
                    }
                })?;
        } else {
            ParanoidTypeChecker::non_native_function(
                interpreter,
                &function,
                &ty_args,
                loader,
                link_context,
            )
            .map_err(|e| interpreter.set_location(e))
            .map_err(|err| interpreter.maybe_core_dump(err, current_frame.get_frame()))?;
        }
        Ok(())
    }

    pub(crate) fn post_hook_fn(gas_meter: &mut impl GasMeter, function: &Arc<Function>) -> () {}

    pub(crate) fn pre_hook_instr(
        interpreter: &mut impl InterpreterInterface,
        gas_meter: &mut impl GasMeter,
        function: &Arc<Function>,
        instruction: &Bytecode,
        locals: &Locals,
        ty_args: &[Type],
        resolver: &Resolver,
    ) -> PartialVMResult<()> {
        let local_tys = ParanoidTypeChecker::get_local_types(&resolver, &function, &ty_args)?;

        ParanoidTypeChecker::pre_instr(
            interpreter,
            &local_tys,
            locals,
            ty_args,
            resolver,
            instruction,
        )?;
        Ok(())
    }

    pub(crate) fn post_hook_instr(
        interpreter: &mut impl InterpreterInterface,
        gas_meter: &mut impl GasMeter,
        function: &Arc<Function>,
        instruction: &Bytecode,
        ty_args: &[Type],
        resolver: &Resolver,
        r: &InstrRet,
    ) -> PartialVMResult<()> {
        let local_tys = ParanoidTypeChecker::get_local_types(&resolver, &function, &ty_args)?;

        ParanoidTypeChecker::post_instr(
            interpreter,
            &local_tys,
            ty_args,
            resolver,
            instruction,
            r,
        )?;
        Ok(())
    }

    fn push_parameter_types(
        interpreter: &mut impl InterpreterInterface,
        function: &Function,
        ty_args: &[Type],
        link_context: AccountAddress,
        loader: &Loader,
    ) -> VMResult<()> {
        let resolver = function.get_resolver(link_context, loader);

        for ty in function.parameter_types() {
            let type_ = if ty_args.is_empty() {
                ty.clone()
            } else {
                resolver
                    .subst(ty, &ty_args)
                    .map_err(|e| e.finish(Location::Undefined))?
            };
            interpreter
                .push_ty(type_)
                .map_err(|e| e.finish(Location::Undefined))?;
        }
        Ok(())
    }

    fn check_friend_or_private_call(
        interpreter: &mut impl InterpreterInterface,
        caller: &Arc<Function>,
        callee: &Arc<Function>,
    ) -> VMResult<()> {
        if callee.is_friend_or_private() {
            match (caller.module_id(), callee.module_id()) {
                (Some(caller_id), Some(callee_id)) => {
                    if caller_id.address() == callee_id.address() {
                        Ok(())
                    } else {
                        Err(interpreter.set_location(PartialVMError::new(StatusCode::UNKNOWN_INVARIANT_VIOLATION_ERROR)
                                .with_message(
                                    format!("Private/Friend function invocation error, caller: {:?}::{:?}, callee: {:?}::{:?}", caller_id, caller.name(), callee_id, callee.name()),
                                )))
                    }
                }
                _ => Err(interpreter.set_location(
                    PartialVMError::new(StatusCode::UNKNOWN_INVARIANT_VIOLATION_ERROR)
                        .with_message(format!(
                            "Private/Friend function invocation error caller: {:?}, callee {:?}",
                            caller.name(),
                            callee.name()
                        )),
                )),
            }
        } else {
            Ok(())
        }
    }

    fn non_native_function(
        interpreter: &mut impl InterpreterInterface,
        function: &Function,
        ty_args: &[Type],
        loader: &Loader,
        link_context: AccountAddress,
    ) -> PartialVMResult<()> {
        ParanoidTypeChecker::check_local_types(
            interpreter,
            &function,
            &ty_args,
            loader,
            link_context,
        )?;
        let resolver = function.get_resolver(link_context, loader);
        ParanoidTypeChecker::get_local_types(&resolver, &function, &ty_args)?;
        Ok(())
    }

    fn check_local_types(
        interpreter: &mut impl InterpreterInterface,
        function: &Function,
        ty_args: &[Type],
        loader: &Loader,
        link_context: AccountAddress,
    ) -> PartialVMResult<()> {
        let arg_count = function.arg_count();
        let is_generic = !ty_args.is_empty();

        for i in 0..arg_count {
            let ty = interpreter.pop_ty()?;
            let resolver = function.get_resolver(link_context, loader);
            if is_generic {
                ty.check_eq(
                    &resolver.subst(&function.local_types()[arg_count - i - 1], &ty_args)?,
                )?;
            } else {
                // Directly check against the expected type to save a clone here.
                ty.check_eq(&function.local_types()[arg_count - i - 1])?;
            }
        }
        Ok(())
    }

    fn get_local_types(
        resolver: &Resolver,
        function: &Function,
        ty_args: &[Type],
    ) -> PartialVMResult<Vec<Type>> {
        Ok(if ty_args.is_empty() {
            function.local_types().to_vec()
        } else {
            function
                .local_types()
                .iter()
                .map(|ty| resolver.subst(ty, &ty_args))
                .collect::<PartialVMResult<Vec<_>>>()?
        })
    }

    fn native_function(
        interpreter: &mut impl InterpreterInterface,
        function: &Function,
        ty_args: &[Type],
        resolver: &Resolver,
    ) -> PartialVMResult<()> {
        ParanoidTypeChecker::check_parameter_types(interpreter, &function, ty_args, &resolver)?;
        ParanoidTypeChecker::push_return_types(interpreter, &function, &ty_args)?;
        Ok(())
    }

    fn check_parameter_types(
        interpreter: &mut impl InterpreterInterface,
        function: &Function,
        ty_args: &[Type],
        resolver: &Resolver,
    ) -> PartialVMResult<()> {
        let expected_args = function.arg_count();
        for i in 0..expected_args {
            let expected_ty =
                resolver.subst(&function.parameter_types()[expected_args - i - 1], ty_args)?;
            let ty = interpreter.pop_ty()?;
            ty.check_eq(&expected_ty)?;
        }
        Ok(())
    }

    fn push_return_types(
        interpreter: &mut impl InterpreterInterface,
        function: &Function,
        ty_args: &[Type],
    ) -> PartialVMResult<()> {
        for ty in function.return_types() {
            interpreter.push_ty(ty.subst(ty_args)?)?;
        }
        Ok(())
    }

    fn pre_instr(
        interpreter: &mut impl InterpreterInterface,
        local_tys: &[Type],
        locals: &Locals,
        ty_args: &[Type],
        resolver: &Resolver,
        instruction: &Bytecode,
    ) -> PartialVMResult<()> {
        interpreter.check_balance()?;
        Self::pre_execution_type_stack_transition(
            interpreter,
            local_tys,
            locals,
            ty_args,
            resolver,
            instruction,
        )?;
        Ok(())
    }

    fn post_instr(
        interpreter: &mut impl InterpreterInterface,
        local_tys: &[Type],
        ty_args: &[Type],
        resolver: &Resolver,
        instruction: &Bytecode,
        r: &InstrRet,
    ) -> PartialVMResult<()> {
        if let InstrRet::Ok = r {
            Self::post_execution_type_stack_transition(
                interpreter,
                local_tys,
                ty_args,
                resolver,
                instruction,
            )?;

            interpreter.check_balance()?;
        }
        Ok(())
    }

    /// Paranoid type checks to perform before instruction execution.
    ///
    /// Note that most of the checks should happen after instruction execution, because gas charging will happen during
    /// instruction execution and we want to avoid running code without charging proper gas as much as possible.
    fn pre_execution_type_stack_transition(
        interpreter: &mut impl InterpreterInterface,
        local_tys: &[Type],
        locals: &Locals,
        _ty_args: &[Type],
        resolver: &Resolver,
        instruction: &Bytecode,
    ) -> PartialVMResult<()> {
        match instruction {
            // Call instruction will be checked at execute_main.
            Bytecode::Call(_) | Bytecode::CallGeneric(_) => (),
            Bytecode::BrFalse(_) | Bytecode::BrTrue(_) => {
                interpreter.pop_ty()?;
            }
            Bytecode::Branch(_) => (),
            Bytecode::Ret => {
                for (idx, ty) in local_tys.iter().enumerate() {
                    if !locals.is_invalid(idx)? {
                        check_ability(resolver.loader().abilities(ty)?.has_drop())?;
                    }
                }
            }
            Bytecode::Abort => {
                interpreter.pop_ty()?;
            }
            // StLoc needs to check before execution as we need to check the drop ability of values.
            Bytecode::StLoc(idx) => {
                let ty = local_tys[*idx as usize].clone();
                let val_ty = interpreter.pop_ty()?;
                ty.check_eq(&val_ty)?;
                if !locals.is_invalid(*idx as usize)? {
                    check_ability(resolver.loader().abilities(&ty)?.has_drop())?;
                }
            }
            // We will check the rest of the instructions after execution phase.
            Bytecode::Pop
            | Bytecode::LdU8(_)
            | Bytecode::LdU16(_)
            | Bytecode::LdU32(_)
            | Bytecode::LdU64(_)
            | Bytecode::LdU128(_)
            | Bytecode::LdU256(_)
            | Bytecode::LdTrue
            | Bytecode::LdFalse
            | Bytecode::LdConst(_)
            | Bytecode::CopyLoc(_)
            | Bytecode::MoveLoc(_)
            | Bytecode::MutBorrowLoc(_)
            | Bytecode::ImmBorrowLoc(_)
            | Bytecode::ImmBorrowField(_)
            | Bytecode::MutBorrowField(_)
            | Bytecode::ImmBorrowFieldGeneric(_)
            | Bytecode::MutBorrowFieldGeneric(_)
            | Bytecode::Pack(_)
            | Bytecode::PackGeneric(_)
            | Bytecode::Unpack(_)
            | Bytecode::UnpackGeneric(_)
            | Bytecode::ReadRef
            | Bytecode::WriteRef
            | Bytecode::CastU8
            | Bytecode::CastU16
            | Bytecode::CastU32
            | Bytecode::CastU64
            | Bytecode::CastU128
            | Bytecode::CastU256
            | Bytecode::Add
            | Bytecode::Sub
            | Bytecode::Mul
            | Bytecode::Mod
            | Bytecode::Div
            | Bytecode::BitOr
            | Bytecode::BitAnd
            | Bytecode::Xor
            | Bytecode::Or
            | Bytecode::And
            | Bytecode::Shl
            | Bytecode::Shr
            | Bytecode::Lt
            | Bytecode::Le
            | Bytecode::Gt
            | Bytecode::Ge
            | Bytecode::Eq
            | Bytecode::Neq
            | Bytecode::MutBorrowGlobal(_)
            | Bytecode::ImmBorrowGlobal(_)
            | Bytecode::MutBorrowGlobalGeneric(_)
            | Bytecode::ImmBorrowGlobalGeneric(_)
            | Bytecode::Exists(_)
            | Bytecode::ExistsGeneric(_)
            | Bytecode::MoveTo(_)
            | Bytecode::MoveToGeneric(_)
            | Bytecode::MoveFrom(_)
            | Bytecode::MoveFromGeneric(_)
            | Bytecode::FreezeRef
            | Bytecode::Nop
            | Bytecode::Not
            | Bytecode::VecPack(_, _)
            | Bytecode::VecLen(_)
            | Bytecode::VecImmBorrow(_)
            | Bytecode::VecMutBorrow(_)
            | Bytecode::VecPushBack(_)
            | Bytecode::VecPopBack(_)
            | Bytecode::VecUnpack(_, _)
            | Bytecode::VecSwap(_) => (),
        };
        Ok(())
    }

    /// Paranoid type checks to perform after instruction execution.
    ///
    /// This function and `pre_execution_type_stack_transition` should constitute the full type stack transition for the paranoid mode.
    fn post_execution_type_stack_transition(
        interpreter: &mut impl InterpreterInterface,
        local_tys: &[Type],
        ty_args: &[Type],
        resolver: &Resolver,
        instruction: &Bytecode,
    ) -> PartialVMResult<()> {
        match instruction {
            Bytecode::BrTrue(_) | Bytecode::BrFalse(_) => (),
            Bytecode::Branch(_)
            | Bytecode::Ret
            | Bytecode::Call(_)
            | Bytecode::CallGeneric(_)
            | Bytecode::Abort => {
                // Invariants hold because all of the instructions above will force VM to break from the interpreter loop and thus not hit this code path.
                unreachable!("control flow instruction encountered during type check")
            }
            Bytecode::Pop => {
                let ty = interpreter.pop_ty()?;
                check_ability(resolver.loader().abilities(&ty)?.has_drop())?;
            }
            Bytecode::LdU8(_) => interpreter.push_ty(Type::U8)?,
            Bytecode::LdU16(_) => interpreter.push_ty(Type::U16)?,
            Bytecode::LdU32(_) => interpreter.push_ty(Type::U32)?,
            Bytecode::LdU64(_) => interpreter.push_ty(Type::U64)?,
            Bytecode::LdU128(_) => interpreter.push_ty(Type::U128)?,
            Bytecode::LdU256(_) => interpreter.push_ty(Type::U256)?,
            Bytecode::LdTrue | Bytecode::LdFalse => interpreter.push_ty(Type::Bool)?,
            Bytecode::LdConst(i) => {
                let constant = resolver.constant_at(*i);
                interpreter.push_ty(Type::from_const_signature(&constant.type_)?)?;
            }
            Bytecode::CopyLoc(idx) => {
                let ty = local_tys[*idx as usize].clone();
                check_ability(resolver.loader().abilities(&ty)?.has_copy())?;
                interpreter.push_ty(ty)?;
            }
            Bytecode::MoveLoc(idx) => {
                let ty = local_tys[*idx as usize].clone();
                interpreter.push_ty(ty)?;
            }
            Bytecode::StLoc(_) => (),
            Bytecode::MutBorrowLoc(idx) => {
                let ty = local_tys[*idx as usize].clone();
                interpreter.push_ty(Type::MutableReference(Box::new(ty)))?;
            }
            Bytecode::ImmBorrowLoc(idx) => {
                let ty = local_tys[*idx as usize].clone();
                interpreter.push_ty(Type::Reference(Box::new(ty)))?;
            }
            Bytecode::ImmBorrowField(fh_idx) => {
                let expected_ty = resolver.field_handle_to_struct(*fh_idx);
                let top_ty = interpreter.pop_ty()?;
                top_ty.check_ref_eq(&expected_ty)?;
                interpreter
                    .push_ty(Type::Reference(Box::new(resolver.get_field_type(*fh_idx)?)))?;
            }
            Bytecode::MutBorrowField(fh_idx) => {
                let expected_ty = resolver.field_handle_to_struct(*fh_idx);
                let top_ty = interpreter.pop_ty()?;
                top_ty.check_eq(&Type::MutableReference(Box::new(expected_ty)))?;
                interpreter.push_ty(Type::MutableReference(Box::new(
                    resolver.get_field_type(*fh_idx)?,
                )))?;
            }
            Bytecode::ImmBorrowFieldGeneric(idx) => {
                let expected_ty = resolver.field_instantiation_to_struct(*idx, ty_args)?;
                let top_ty = interpreter.pop_ty()?;
                top_ty.check_ref_eq(&expected_ty)?;
                interpreter.push_ty(Type::Reference(Box::new(
                    resolver.instantiate_generic_field(*idx, ty_args)?,
                )))?;
            }
            Bytecode::MutBorrowFieldGeneric(idx) => {
                let expected_ty = resolver.field_instantiation_to_struct(*idx, ty_args)?;
                let top_ty = interpreter.pop_ty()?;
                top_ty.check_eq(&Type::MutableReference(Box::new(expected_ty)))?;
                interpreter.push_ty(Type::MutableReference(Box::new(
                    resolver.instantiate_generic_field(*idx, ty_args)?,
                )))?;
            }
            Bytecode::Pack(idx) => {
                let field_count = resolver.field_count(*idx);
                let args_ty = resolver.get_struct_fields(*idx)?;
                let output_ty = resolver.get_struct_type(*idx);
                let ability = resolver.loader().abilities(&output_ty)?;

                // If the struct has a key ability, we expects all of its field to have store ability but not key ability.
                let field_expected_abilities = if ability.has_key() {
                    ability
                        .remove(Ability::Key)
                        .union(AbilitySet::singleton(Ability::Store))
                } else {
                    ability
                };

                if field_count as usize != args_ty.fields.len() {
                    return Err(
                        PartialVMError::new(StatusCode::UNKNOWN_INVARIANT_VIOLATION_ERROR)
                            .with_message("Args count mismatch".to_string()),
                    );
                }

                for (ty, expected_ty) in interpreter
                    .popn_tys(field_count)?
                    .into_iter()
                    .zip(args_ty.fields.iter())
                {
                    // Fields ability should be a subset of the struct ability because abilities can be weakened but not the other direction.
                    // For example, it is ok to have a struct that doesn't have a copy capability where its field is a struct that has copy capability but not vice versa.
                    check_ability(
                        field_expected_abilities.is_subset(resolver.loader().abilities(&ty)?),
                    )?;
                    ty.check_eq(expected_ty)?;
                }

                interpreter.push_ty(output_ty)?;
            }
            Bytecode::PackGeneric(idx) => {
                let field_count = resolver.field_instantiation_count(*idx);
                let args_ty = resolver.instantiate_generic_struct_fields(*idx, ty_args)?;
                let output_ty = resolver.instantiate_generic_type(*idx, ty_args)?;
                let ability = resolver.loader().abilities(&output_ty)?;

                // If the struct has a key ability, we expects all of its field to have store ability but not key ability.
                let field_expected_abilities = if ability.has_key() {
                    ability
                        .remove(Ability::Key)
                        .union(AbilitySet::singleton(Ability::Store))
                } else {
                    ability
                };

                if field_count as usize != args_ty.len() {
                    return Err(
                        PartialVMError::new(StatusCode::UNKNOWN_INVARIANT_VIOLATION_ERROR)
                            .with_message("Args count mismatch".to_string()),
                    );
                }

                for (ty, expected_ty) in interpreter
                    .popn_tys(field_count)?
                    .into_iter()
                    .zip(args_ty.iter())
                {
                    // Fields ability should be a subset of the struct ability because abilities can be weakened but not the other direction.
                    // For example, it is ok to have a struct that doesn't have a copy capability where its field is a struct that has copy capability but not vice versa.
                    check_ability(
                        field_expected_abilities.is_subset(resolver.loader().abilities(&ty)?),
                    )?;
                    ty.check_eq(expected_ty)?;
                }

                interpreter.push_ty(output_ty)?;
            }
            Bytecode::Unpack(idx) => {
                let struct_ty = interpreter.pop_ty()?;
                struct_ty.check_eq(&resolver.get_struct_type(*idx))?;
                let struct_decl = resolver.get_struct_fields(*idx)?;
                for ty in struct_decl.fields.iter() {
                    interpreter.push_ty(ty.clone())?;
                }
            }
            Bytecode::UnpackGeneric(idx) => {
                let struct_ty = interpreter.pop_ty()?;
                struct_ty.check_eq(&resolver.instantiate_generic_type(*idx, ty_args)?)?;

                let struct_decl = resolver.instantiate_generic_struct_fields(*idx, ty_args)?;
                for ty in struct_decl.into_iter() {
                    interpreter.push_ty(ty.clone())?;
                }
            }
            Bytecode::ReadRef => {
                let ref_ty = interpreter.pop_ty()?;
                match ref_ty {
                    Type::Reference(inner) | Type::MutableReference(inner) => {
                        check_ability(resolver.loader().abilities(&inner)?.has_copy())?;
                        interpreter.push_ty(inner.as_ref().clone())?;
                    }
                    _ => {
                        return Err(PartialVMError::new(
                            StatusCode::UNKNOWN_INVARIANT_VIOLATION_ERROR,
                        )
                        .with_message("ReadRef expecting a value of reference type".to_string()))
                    }
                }
            }
            Bytecode::WriteRef => {
                let ref_ty = interpreter.pop_ty()?;
                let val_ty = interpreter.pop_ty()?;
                match ref_ty {
                    Type::MutableReference(inner) => {
                        if *inner == val_ty {
                            check_ability(resolver.loader().abilities(&inner)?.has_drop())?;
                        } else {
                            return Err(PartialVMError::new(
                                StatusCode::UNKNOWN_INVARIANT_VIOLATION_ERROR,
                            )
                            .with_message(
                                "WriteRef tried to write references of different types".to_string(),
                            ));
                        }
                    }
                    _ => {
                        return Err(PartialVMError::new(
                            StatusCode::UNKNOWN_INVARIANT_VIOLATION_ERROR,
                        )
                        .with_message(
                            "WriteRef expecting a value of mutable reference type".to_string(),
                        ))
                    }
                }
            }
            Bytecode::CastU8 => {
                interpreter.pop_ty()?;
                interpreter.push_ty(Type::U8)?;
            }
            Bytecode::CastU16 => {
                interpreter.pop_ty()?;
                interpreter.push_ty(Type::U16)?;
            }
            Bytecode::CastU32 => {
                interpreter.pop_ty()?;
                interpreter.push_ty(Type::U32)?;
            }
            Bytecode::CastU64 => {
                interpreter.pop_ty()?;
                interpreter.push_ty(Type::U64)?;
            }
            Bytecode::CastU128 => {
                interpreter.pop_ty()?;
                interpreter.push_ty(Type::U128)?;
            }
            Bytecode::CastU256 => {
                interpreter.pop_ty()?;
                interpreter.push_ty(Type::U256)?;
            }
            Bytecode::Add
            | Bytecode::Sub
            | Bytecode::Mul
            | Bytecode::Mod
            | Bytecode::Div
            | Bytecode::BitOr
            | Bytecode::BitAnd
            | Bytecode::Xor
            | Bytecode::Or
            | Bytecode::And => {
                let lhs = interpreter.pop_ty()?;
                let rhs = interpreter.pop_ty()?;
                lhs.check_eq(&rhs)?;
                interpreter.push_ty(lhs)?;
            }
            Bytecode::Shl | Bytecode::Shr => {
                interpreter.pop_ty()?;
                let rhs = interpreter.pop_ty()?;
                interpreter.push_ty(rhs)?;
            }
            Bytecode::Lt | Bytecode::Le | Bytecode::Gt | Bytecode::Ge => {
                let lhs = interpreter.pop_ty()?;
                let rhs = interpreter.pop_ty()?;
                lhs.check_eq(&rhs)?;
                interpreter.push_ty(Type::Bool)?;
            }
            Bytecode::Eq | Bytecode::Neq => {
                let lhs = interpreter.pop_ty()?;
                let rhs = interpreter.pop_ty()?;
                if lhs != rhs {
                    return Err(
                        PartialVMError::new(StatusCode::UNKNOWN_INVARIANT_VIOLATION_ERROR)
                            .with_message(
                                "Integer binary operation expecting values of same type"
                                    .to_string(),
                            ),
                    );
                }
                check_ability(resolver.loader().abilities(&lhs)?.has_drop())?;
                interpreter.push_ty(Type::Bool)?;
            }
            Bytecode::MutBorrowGlobal(idx) => {
                interpreter.pop_ty()?.check_eq(&Type::Address)?;
                let ty = resolver.get_struct_type(*idx);
                check_ability(resolver.loader().abilities(&ty)?.has_key())?;
                interpreter.push_ty(Type::MutableReference(Box::new(ty)))?;
            }
            Bytecode::ImmBorrowGlobal(idx) => {
                interpreter.pop_ty()?.check_eq(&Type::Address)?;
                let ty = resolver.get_struct_type(*idx);
                check_ability(resolver.loader().abilities(&ty)?.has_key())?;
                interpreter.push_ty(Type::Reference(Box::new(ty)))?;
            }
            Bytecode::MutBorrowGlobalGeneric(idx) => {
                interpreter.pop_ty()?.check_eq(&Type::Address)?;
                let ty = resolver.instantiate_generic_type(*idx, ty_args)?;
                check_ability(resolver.loader().abilities(&ty)?.has_key())?;
                interpreter.push_ty(Type::MutableReference(Box::new(ty)))?;
            }
            Bytecode::ImmBorrowGlobalGeneric(idx) => {
                interpreter.pop_ty()?.check_eq(&Type::Address)?;
                let ty = resolver.instantiate_generic_type(*idx, ty_args)?;
                check_ability(resolver.loader().abilities(&ty)?.has_key())?;
                interpreter.push_ty(Type::Reference(Box::new(ty)))?;
            }
            Bytecode::Exists(_) | Bytecode::ExistsGeneric(_) => {
                interpreter.pop_ty()?.check_eq(&Type::Address)?;
                interpreter.push_ty(Type::Bool)?;
            }
            Bytecode::MoveTo(idx) => {
                let ty = interpreter.pop_ty()?;
                interpreter
                    .pop_ty()?
                    .check_eq(&Type::Reference(Box::new(Type::Signer)))?;
                ty.check_eq(&resolver.get_struct_type(*idx))?;
                check_ability(resolver.loader().abilities(&ty)?.has_key())?;
            }
            Bytecode::MoveToGeneric(idx) => {
                let ty = interpreter.pop_ty()?;
                interpreter
                    .pop_ty()?
                    .check_eq(&Type::Reference(Box::new(Type::Signer)))?;
                ty.check_eq(&resolver.instantiate_generic_type(*idx, ty_args)?)?;
                check_ability(resolver.loader().abilities(&ty)?.has_key())?;
            }
            Bytecode::MoveFrom(idx) => {
                interpreter.pop_ty()?.check_eq(&Type::Address)?;
                let ty = resolver.get_struct_type(*idx);
                check_ability(resolver.loader().abilities(&ty)?.has_key())?;
                interpreter.push_ty(ty)?;
            }
            Bytecode::MoveFromGeneric(idx) => {
                interpreter.pop_ty()?.check_eq(&Type::Address)?;
                let ty = resolver.instantiate_generic_type(*idx, ty_args)?;
                check_ability(resolver.loader().abilities(&ty)?.has_key())?;
                interpreter.push_ty(ty)?;
            }
            Bytecode::FreezeRef => {
                match interpreter.pop_ty()? {
                    Type::MutableReference(ty) => interpreter.push_ty(Type::Reference(ty))?,
                    _ => {
                        return Err(PartialVMError::new(
                            StatusCode::UNKNOWN_INVARIANT_VIOLATION_ERROR,
                        )
                        .with_message("FreezeRef expects a mutable reference".to_string()))
                    }
                };
            }
            Bytecode::Nop => (),
            Bytecode::Not => {
                interpreter.pop_ty()?.check_eq(&Type::Bool)?;
                interpreter.push_ty(Type::Bool)?;
            }
            Bytecode::VecPack(si, num) => {
                let ty = resolver.instantiate_single_type(*si, ty_args)?;
                let elem_tys = interpreter.popn_tys(*num as u16)?;
                for elem_ty in elem_tys.iter() {
                    elem_ty.check_eq(&ty)?;
                }
                interpreter.push_ty(Type::Vector(Box::new(ty)))?;
            }
            Bytecode::VecLen(si) => {
                let ty = resolver.instantiate_single_type(*si, ty_args)?;
                interpreter.pop_ty()?.check_vec_ref(&ty, false)?;
                interpreter.push_ty(Type::U64)?;
            }
            Bytecode::VecImmBorrow(si) => {
                let ty = resolver.instantiate_single_type(*si, ty_args)?;
                interpreter.pop_ty()?.check_eq(&Type::U64)?;
                let inner_ty = interpreter.pop_ty()?.check_vec_ref(&ty, false)?;
                interpreter.push_ty(Type::Reference(Box::new(inner_ty)))?;
            }
            Bytecode::VecMutBorrow(si) => {
                let ty = resolver.instantiate_single_type(*si, ty_args)?;
                interpreter.pop_ty()?.check_eq(&Type::U64)?;
                let inner_ty = interpreter.pop_ty()?.check_vec_ref(&ty, true)?;
                interpreter.push_ty(Type::MutableReference(Box::new(inner_ty)))?;
            }
            Bytecode::VecPushBack(si) => {
                let ty = resolver.instantiate_single_type(*si, ty_args)?;
                interpreter.pop_ty()?.check_eq(&ty)?;
                interpreter.pop_ty()?.check_vec_ref(&ty, true)?;
            }
            Bytecode::VecPopBack(si) => {
                let ty = resolver.instantiate_single_type(*si, ty_args)?;
                let inner_ty = interpreter.pop_ty()?.check_vec_ref(&ty, true)?;
                interpreter.push_ty(inner_ty)?;
            }
            Bytecode::VecUnpack(si, num) => {
                let ty = resolver.instantiate_single_type(*si, ty_args)?;
                let vec_ty = interpreter.pop_ty()?;
                match vec_ty {
                    Type::Vector(v) => {
                        v.check_eq(&ty)?;
                        for _ in 0..*num {
                            interpreter.push_ty(v.as_ref().clone())?;
                        }
                    }
                    _ => {
                        return Err(PartialVMError::new(
                            StatusCode::UNKNOWN_INVARIANT_VIOLATION_ERROR,
                        )
                        .with_message("VecUnpack expect a vector type".to_string()))
                    }
                };
            }
            Bytecode::VecSwap(si) => {
                let ty = resolver.instantiate_single_type(*si, ty_args)?;
                interpreter.pop_ty()?.check_eq(&Type::U64)?;
                interpreter.pop_ty()?.check_eq(&Type::U64)?;
                interpreter.pop_ty()?.check_vec_ref(&ty, true)?;
            }
        }
        Ok(())
    }
}

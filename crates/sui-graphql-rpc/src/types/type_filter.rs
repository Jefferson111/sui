// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

use super::{string_input::impl_string_input, sui_address::SuiAddress};
use crate::data::{DieselBackend, Query};
use async_graphql::*;
use diesel::{
    expression::{is_aggregate::No, ValidGrouping},
    query_builder::QueryFragment,
    sql_types::{Binary, Text},
    AppearsOnTable, BoolExpressionMethods, Expression, ExpressionMethods, QueryDsl, QuerySource,
    TextExpressionMethods,
};
use std::str::FromStr;
use sui_types::{
    parse_sui_address, parse_sui_fq_name, parse_sui_module_id, parse_sui_type_tag, TypeTag,
};

/// GraphQL scalar containing a filter on types.
#[derive(Clone, Debug)]
pub(crate) enum TypeFilter {
    /// Filter the type by the package or module it's from.
    ByModule(ModuleFilter),

    /// If the type tag has type parameters, treat it as an exact filter on that instantiation,
    /// otherwise treat it as either a filter on all generic instantiations of the type, or an exact
    /// match on the type with no type parameters. E.g.
    ///
    ///  0x2::coin::Coin
    ///
    /// would match both 0x2::coin::Coin and 0x2::coin::Coin<0x2::sui::SUI>.
    ByType(TypeTag),
}

/// GraphQL scalar containing a filter on fully-qualified names.
#[derive(Clone, Debug, Eq, PartialEq)]
pub(crate) enum FqNameFilter {
    /// Filter the module member by the package or module it's from.
    ByModule(ModuleFilter),

    /// Exact match on the module member.
    ByFqName(SuiAddress, String, String),
}

/// GraphQL scalar containing a filter on modules.
#[derive(Clone, Debug, Eq, PartialEq)]
pub(crate) enum ModuleFilter {
    /// Filter the module by the package it's from.
    ByPackage(SuiAddress),

    /// Exact match on the module.
    ByModule(SuiAddress, String),
}

#[derive(thiserror::Error, Debug)]
pub(crate) enum Error {
    #[error("Invalid filter, expected: {0}")]
    InvalidFormat(&'static str),
}

impl TypeFilter {
    /// Modify `query` to apply this filter to `field`, returning the new query.
    pub(crate) fn apply<E, QS, ST, GB>(
        &self,
        query: Query<ST, QS, GB>,
        field: E,
    ) -> Query<ST, QS, GB>
    where
        Query<ST, QS, GB>: QueryDsl,
        E: ExpressionMethods + TextExpressionMethods,
        E: Expression<SqlType = Text> + QueryFragment<DieselBackend>,
        E: AppearsOnTable<QS> + ValidGrouping<(), IsAggregate = No>,
        E: Clone + Send + 'static,
        QS: QuerySource,
    {
        match self {
            TypeFilter::ByModule(ModuleFilter::ByPackage(p)) => {
                query.filter(field.like(format!("{p}::%")))
            }

            TypeFilter::ByModule(ModuleFilter::ByModule(p, m)) => {
                query.filter(field.like(format!("{p}::{m}::%")))
            }

            // A type filter without type parameters is interpreted as either an exact match, or a
            // match for all generic instantiations of the type.
            TypeFilter::ByType(TypeTag::Struct(tag)) if tag.type_params.is_empty() => {
                let f1 = field.clone();
                let f2 = field;
                let exact = tag.to_canonical_string(/* with_prefix */ true);
                let prefix = format!("{}<%", tag.to_canonical_display(/* with_prefix */ true));
                query.filter(f1.eq(exact).or(f2.like(prefix)))
            }

            TypeFilter::ByType(tag) => {
                let exact = tag.to_canonical_string(/* with_prefix */ true);
                query.filter(field.eq(exact))
            }
        }
    }
}

impl FqNameFilter {
    /// Modify `query` to apply this filter, treating `package` as the column containing the package
    /// address, `module` as the module containing the module name, and `name` as the column
    /// containing the module member name.
    pub(crate) fn apply<P, M, N, QS, ST, GB>(
        &self,
        query: Query<ST, QS, GB>,
        package: P,
        module: M,
        name: N,
    ) -> Query<ST, QS, GB>
    where
        Query<ST, QS, GB>: QueryDsl,
        P: ExpressionMethods + Expression<SqlType = Binary> + QueryFragment<DieselBackend>,
        M: ExpressionMethods + Expression<SqlType = Text> + QueryFragment<DieselBackend>,
        N: ExpressionMethods + Expression<SqlType = Text> + QueryFragment<DieselBackend>,
        P: AppearsOnTable<QS> + ValidGrouping<(), IsAggregate = No>,
        M: AppearsOnTable<QS> + ValidGrouping<(), IsAggregate = No>,
        N: AppearsOnTable<QS> + ValidGrouping<(), IsAggregate = No>,
        P: Send + 'static,
        M: Send + 'static,
        N: Send + 'static,
        QS: QuerySource,
    {
        match self {
            FqNameFilter::ByModule(filter) => filter.apply(query, package, module),
            FqNameFilter::ByFqName(p, m, n) => query
                .filter(package.eq(p.into_vec()))
                .filter(module.eq(m.clone()))
                .filter(name.eq(n.clone())),
        }
    }

    /// Try to create a filter whose results are the intersection of the results of the input
    /// filters (`self` and `other`). This may not be possible if the resulting filter is
    /// inconsistent (e.g. a filter that requires the module member's package to be at two different
    /// addresses simultaneously), in which case `None` is returned.
    pub(crate) fn intersect(self, other: Self) -> Option<Self> {
        use FqNameFilter as F;
        use ModuleFilter as M;

        match (&self, &other) {
            (F::ByModule(m), F::ByModule(n)) => m.clone().intersect(n.clone()).map(Self::ByModule),
            (F::ByFqName(_, _, _), F::ByFqName(_, _, _)) => (self == other).then_some(self),

            (F::ByFqName(p, _, _), F::ByModule(M::ByPackage(q))) => (p == q).then_some(self),
            (F::ByModule(M::ByPackage(p)), F::ByFqName(q, _, _)) => (p == q).then_some(other),

            (F::ByFqName(p, m, _), F::ByModule(M::ByModule(q, n))) => {
                ((p, m) == (q, n)).then_some(self)
            }

            (F::ByModule(M::ByModule(p, m)), F::ByFqName(q, n, _)) => {
                ((p, m) == (q, n)).then_some(other)
            }
        }
    }
}

impl ModuleFilter {
    /// Modify `query` to apply this filter, treating `package` as the column containing the package
    /// address and `module` as the module containing the module name.
    pub(crate) fn apply<P, M, QS, ST, GB>(
        &self,
        query: Query<ST, QS, GB>,
        package: P,
        module: M,
    ) -> Query<ST, QS, GB>
    where
        Query<ST, QS, GB>: QueryDsl,
        P: ExpressionMethods + Expression<SqlType = Binary> + QueryFragment<DieselBackend>,
        M: ExpressionMethods + Expression<SqlType = Text> + QueryFragment<DieselBackend>,
        P: AppearsOnTable<QS> + ValidGrouping<(), IsAggregate = No>,
        M: AppearsOnTable<QS> + ValidGrouping<(), IsAggregate = No>,
        P: Send + 'static,
        M: Send + 'static,
        QS: QuerySource,
    {
        match self {
            ModuleFilter::ByPackage(p) => query.filter(package.eq(p.into_vec())),
            ModuleFilter::ByModule(p, m) => query
                .filter(package.eq(p.into_vec()))
                .filter(module.eq(m.clone())),
        }
    }

    /// Try to create a filter whose results are the intersection of the results of the input
    /// filters (`self` and `other`). This may not be possible if the resulting filter is
    /// inconsistent (e.g. a filter that requires the module's package to be at two different
    /// addresses simultaneously), in which case `None` is returned.
    pub(crate) fn intersect(self, other: Self) -> Option<Self> {
        match (&self, &other) {
            (Self::ByPackage(_), Self::ByPackage(_))
            | (Self::ByModule(_, _), Self::ByModule(_, _)) => (self == other).then_some(self),

            (Self::ByPackage(p), Self::ByModule(q, _)) => (p == q).then_some(other),
            (Self::ByModule(p, _), Self::ByPackage(q)) => (p == q).then_some(self),
        }
    }
}

impl_string_input!(TypeFilter);
impl_string_input!(FqNameFilter);
impl_string_input!(ModuleFilter);

impl FromStr for TypeFilter {
    type Err = Error;
    fn from_str(s: &str) -> Result<Self, Error> {
        if let Ok(tag) = parse_sui_type_tag(s) {
            Ok(TypeFilter::ByType(tag))
        } else if let Ok(filter) = ModuleFilter::from_str(s) {
            Ok(TypeFilter::ByModule(filter))
        } else {
            Err(Error::InvalidFormat(
                "package[::module[::type[<type_params>]]] or primitive type",
            ))
        }
    }
}

impl FromStr for FqNameFilter {
    type Err = Error;
    fn from_str(s: &str) -> Result<Self, Error> {
        if let Ok((module, name)) = parse_sui_fq_name(s) {
            Ok(FqNameFilter::ByFqName(
                SuiAddress::from(*module.address()),
                module.name().to_string(),
                name,
            ))
        } else if let Ok(filter) = ModuleFilter::from_str(s) {
            Ok(FqNameFilter::ByModule(filter))
        } else {
            Err(Error::InvalidFormat("package[::module[::function]]"))
        }
    }
}

impl FromStr for ModuleFilter {
    type Err = Error;
    fn from_str(s: &str) -> Result<Self, Error> {
        if let Ok(module) = parse_sui_module_id(s) {
            Ok(ModuleFilter::ByModule(
                SuiAddress::from(*module.address()),
                module.name().to_string(),
            ))
        } else if let Ok(package) = parse_sui_address(s) {
            Ok(ModuleFilter::ByPackage(package.into()))
        } else {
            Err(Error::InvalidFormat("package[::module]"))
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use expect_test::expect;

    #[test]
    fn test_valid_type_filters() {
        let inputs = [
            "u8",
            "address",
            "bool",
            "0x2",
            "0x2::coin",
            "0x2::coin::Coin",
            "0x2::coin::Coin<0x2::sui::SUI>",
            "vector<u256>",
            "vector<0x3::staking_pool::StakedSui>",
        ]
        .into_iter();

        let filters: Vec<_> = inputs.map(|i| TypeFilter::from_str(i).unwrap()).collect();

        let expect = expect![[r#"
            [
                ByType(
                    U8,
                ),
                ByType(
                    Address,
                ),
                ByType(
                    Bool,
                ),
                ByModule(
                    ByPackage(
                        SuiAddress(
                            [
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                2,
                            ],
                        ),
                    ),
                ),
                ByModule(
                    ByModule(
                        SuiAddress(
                            [
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                2,
                            ],
                        ),
                        "coin",
                    ),
                ),
                ByType(
                    Struct(
                        StructTag {
                            address: 0000000000000000000000000000000000000000000000000000000000000002,
                            module: Identifier(
                                "coin",
                            ),
                            name: Identifier(
                                "Coin",
                            ),
                            type_params: [],
                        },
                    ),
                ),
                ByType(
                    Struct(
                        StructTag {
                            address: 0000000000000000000000000000000000000000000000000000000000000002,
                            module: Identifier(
                                "coin",
                            ),
                            name: Identifier(
                                "Coin",
                            ),
                            type_params: [
                                Struct(
                                    StructTag {
                                        address: 0000000000000000000000000000000000000000000000000000000000000002,
                                        module: Identifier(
                                            "sui",
                                        ),
                                        name: Identifier(
                                            "SUI",
                                        ),
                                        type_params: [],
                                    },
                                ),
                            ],
                        },
                    ),
                ),
                ByType(
                    Vector(
                        U256,
                    ),
                ),
                ByType(
                    Vector(
                        Struct(
                            StructTag {
                                address: 0000000000000000000000000000000000000000000000000000000000000003,
                                module: Identifier(
                                    "staking_pool",
                                ),
                                name: Identifier(
                                    "StakedSui",
                                ),
                                type_params: [],
                            },
                        ),
                    ),
                ),
            ]"#]];
        expect.assert_eq(&format!("{filters:#?}"))
    }

    #[test]
    fn test_valid_function_filters() {
        let inputs = [
            "0x2",
            "0x2::coin",
            "0x2::object::new",
            "0x2::tx_context::TxContext",
        ]
        .into_iter();

        let filters: Vec<_> = inputs.map(|i| FqNameFilter::from_str(i).unwrap()).collect();

        let expect = expect![[r#"
            [
                ByModule(
                    ByPackage(
                        SuiAddress(
                            [
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                2,
                            ],
                        ),
                    ),
                ),
                ByModule(
                    ByModule(
                        SuiAddress(
                            [
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                2,
                            ],
                        ),
                        "coin",
                    ),
                ),
                ByFqName(
                    SuiAddress(
                        [
                            0,
                            0,
                            0,
                            0,
                            0,
                            0,
                            0,
                            0,
                            0,
                            0,
                            0,
                            0,
                            0,
                            0,
                            0,
                            0,
                            0,
                            0,
                            0,
                            0,
                            0,
                            0,
                            0,
                            0,
                            0,
                            0,
                            0,
                            0,
                            0,
                            0,
                            0,
                            2,
                        ],
                    ),
                    "object",
                    "new",
                ),
                ByFqName(
                    SuiAddress(
                        [
                            0,
                            0,
                            0,
                            0,
                            0,
                            0,
                            0,
                            0,
                            0,
                            0,
                            0,
                            0,
                            0,
                            0,
                            0,
                            0,
                            0,
                            0,
                            0,
                            0,
                            0,
                            0,
                            0,
                            0,
                            0,
                            0,
                            0,
                            0,
                            0,
                            0,
                            0,
                            2,
                        ],
                    ),
                    "tx_context",
                    "TxContext",
                ),
            ]"#]];
        expect.assert_eq(&format!("{filters:#?}"));
    }

    #[test]
    fn test_invalid_function_filters() {
        for invalid_function_filter in [
            "0x2::coin::Coin<0x2::sui::SUI>",
            "vector<u256>",
            "vector<0x3::staking_pool::StakedSui>",
        ] {
            assert!(FqNameFilter::from_str(invalid_function_filter).is_err());
        }
    }

    #[test]
    fn test_invalid_type_filters() {
        for invalid_type_filter in [
            "not_a_real_type",
            "0x1:missing::colon",
            "0x2::trailing::",
            "0x3::mismatched::bra<0x4::ke::ts",
        ] {
            assert!(TypeFilter::from_str(invalid_type_filter).is_err());
        }
    }

    #[test]
    fn test_invalid_module_filters() {
        for invalid_module_filter in [
            "u8",
            "address",
            "bool",
            "0x2::coin::Coin",
            "0x2::coin::Coin<0x2::sui::SUI>",
            "vector<u256>",
            "vector<0x3::staking_pool::StakedSui>",
        ] {
            assert!(ModuleFilter::from_str(invalid_module_filter).is_err());
        }
    }

    #[test]
    fn test_intersection() {
        let sui = FqNameFilter::from_str("0x2").unwrap();
        let coin = FqNameFilter::from_str("0x2::coin").unwrap();
        let take = FqNameFilter::from_str("0x2::coin::take").unwrap();

        let std = FqNameFilter::from_str("0x1").unwrap();
        let string = FqNameFilter::from_str("0x1::string").unwrap();
        let utf8 = FqNameFilter::from_str("0x1::string::utf8").unwrap();

        assert_eq!(sui.clone().intersect(sui.clone()), Some(sui.clone()));
        assert_eq!(sui.clone().intersect(coin.clone()), Some(coin.clone()));
        assert_eq!(sui.clone().intersect(take.clone()), Some(take.clone()));
        assert_eq!(take.clone().intersect(coin.clone()), Some(take.clone()));

        assert_eq!(sui.clone().intersect(std.clone()), None);
        assert_eq!(sui.clone().intersect(string.clone()), None);
        assert_eq!(utf8.clone().intersect(coin.clone()), None);
    }
}

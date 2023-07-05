// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

import { useOnScreen } from '@mysten/core';
import { Check12, EyeClose16, Ooo24 } from '@mysten/icons';
import { get, set } from 'idb-keyval';
import { useRef, useEffect, useCallback, useState } from 'react';
import toast from 'react-hot-toast';
import { Link, NavLink } from 'react-router-dom';

import { Link as InlineLink } from '../../../shared/Link';
import { Text } from '../../../shared/text';
import { useActiveAddress } from '_app/hooks/useActiveAddress';
import Alert from '_components/alert';
import { ErrorBoundary } from '_components/error-boundary';
import Loading from '_components/loading';
import LoadingSpinner from '_components/loading/LoadingIndicator';
import { NFTDisplayCard } from '_components/nft-display';
import { ampli } from '_src/shared/analytics/ampli';
import { useGetNFTs } from '_src/ui/app/hooks/useGetNFTs';
import PageTitle from '_src/ui/app/shared/PageTitle';
import { Menu } from '@headlessui/react';

const HIDDEN_ASSET_IDS = 'hidden-asset-ids';
const TOAST_DURATION_MS = 1005;

const AssetsOptionsMenu = () => {
	return (
		<Menu>
			<Menu.Button
				className="cursor-pointer appearance-none border"
				style={{ border: 'none', background: 'none' }}
			>
				<Ooo24 />
			</Menu.Button>
			<Menu.Items className="absolute top-3 right-0 mt-2 w-40 bg-white border border-gray-90 divide-y divide-gray-200 rounded shadow-lg z-50">
				<Menu.Item>
					{({ active }) => (
						<div className="py-2 hover:bg-sui-light">
							<InlineLink
								to="/hidden-assets"
								color="suiDark"
								weight="semibold"
								text="View Hidden Assets"
							/>
						</div>
					)}
				</Menu.Item>
			</Menu.Items>
		</Menu>
	);
};

function NftsPage() {
	const [internalHiddenAssetIds, internalSetHiddenAssetIds] = useState<string[]>([]);
	const [isHidingDisabled, setIsHidingDisabled] = useState(false);
	const accountAddress = useActiveAddress();
	const {
		data: nfts,
		hasNextPage,
		isInitialLoading,
		isFetchingNextPage,
		error,
		isLoading,
		fetchNextPage,
		isError,
	} = useGetNFTs(accountAddress);
	const observerElem = useRef<HTMLDivElement | null>(null);
	const { isIntersecting } = useOnScreen(observerElem);
	const isSpinnerVisible = isFetchingNextPage && hasNextPage;

	useEffect(() => {
		if (isIntersecting && hasNextPage && !isFetchingNextPage) {
			fetchNextPage();
		}
	}, [nfts.length, isIntersecting, fetchNextPage, hasNextPage, isFetchingNextPage]);

	useEffect(() => {
		(async () => {
			const hiddenAssets = await get<string[]>(HIDDEN_ASSET_IDS);
			if (hiddenAssets) {
				internalSetHiddenAssetIds(hiddenAssets);
			}
		})();
	}, []);

	const hideAssetId = useCallback(
		async (newAssetId: string) => {
			if (internalHiddenAssetIds.includes(newAssetId)) return;

			const newHiddenAssetIds = [...internalHiddenAssetIds, newAssetId];
			internalSetHiddenAssetIds(newHiddenAssetIds);
			await set(HIDDEN_ASSET_IDS, newHiddenAssetIds);

			const undoHideAsset = async (assetId: string) => {
				try {
					const updatedHiddenAssetIds = internalHiddenAssetIds.filter((id) => id !== assetId);
					internalSetHiddenAssetIds(updatedHiddenAssetIds);
					await set(HIDDEN_ASSET_IDS, updatedHiddenAssetIds);
				} catch (error) {
					// Handle any error that occurred during the unhide process
					toast.error('Failed to unhide asset.');
					// Restore the asset ID back to the hidden asset IDs list
					internalSetHiddenAssetIds([...internalHiddenAssetIds, assetId]);
					await set(HIDDEN_ASSET_IDS, internalHiddenAssetIds);
				}
			};

			const showAssetHiddenToast = async (objectId: string) => {
				setTimeout(() => setIsHidingDisabled(false), TOAST_DURATION_MS);
				toast(
					(t) => (
						<div className="flex items-center justify-between gap-2">
							<div className="flex gap-1 items-center">
								<Check12 className="text-gray-90" />
								<div>
									<InlineLink
										to="/hidden-assets"
										color="suiDark"
										weight="semibold"
										before={
											<Text variant="body" color="gray-80">
												Moved to
											</Text>
										}
										text="Hidden Assets"
									/>
								</div>
							</div>

							<div className="w-auto">
								<InlineLink
									size="bodySmall"
									onClick={() => {
										undoHideAsset(objectId);
										toast.dismiss(t.id);
									}}
									color="suiDark"
									weight="semibold"
									text="UNDO"
								/>
							</div>
						</div>
					),
					{
						duration: TOAST_DURATION_MS,
					},
				);
			};

			showAssetHiddenToast(newAssetId);
		},
		[internalHiddenAssetIds],
	);

	const hideAsset = (objectId: string, event: React.MouseEvent<HTMLButtonElement>) => {
		event.stopPropagation();
		event.preventDefault();
		if (isHidingDisabled) {
			toast.error('Please wait to try again.');
			return;
		}
		setIsHidingDisabled(true);
		hideAssetId(objectId);
	};

	if (isInitialLoading) {
		return (
			<div className="mt-1 flex w-full justify-center">
				<LoadingSpinner />
			</div>
		);
	}

	return (
		<div className="flex flex-1 flex-col flex-nowrap items-center gap-4">
			<PageTitle title="Assets" after={<AssetsOptionsMenu />} />
			<Loading loading={isLoading}>
				{isError ? (
					<Alert>
						<div>
							<strong>Sync error (data might be outdated)</strong>
						</div>
						<small>{(error as Error).message}</small>
					</Alert>
				) : null}
				{nfts?.length ? (
					<div className="grid w-full grid-cols-2 gap-x-3.5 gap-y-4">
						{nfts
							.filter((nft) => !internalHiddenAssetIds.includes(nft.objectId))
							.map(({ objectId, type }) => (
								<Link
									to={`/nft-details?${new URLSearchParams({
										objectId,
									}).toString()}`}
									onClick={() => {
										ampli.clickedCollectibleCard({
											objectId,
											collectibleType: type!,
										});
									}}
									key={objectId}
									className="no-underline relative"
								>
									<button
										className="appearance-none bg-transparent border-none flex items-center justify-center z-10 absolute top-2 right-3 pointer-events-auto hover:bg-gray-35 hover:bg-opacity-75 text-gray-60 transition-colors duration-200 rounded-md hover:text-sui-dark p-0"
										onClick={(event) => hideAsset(objectId, event)}
									>
										<div className="w-4 h-4 flex items-center justify-around">
											<EyeClose16 />
										</div>
									</button>
									<ErrorBoundary>
										<NFTDisplayCard
											objectId={objectId}
											size="md"
											showLabel
											animateHover
											borderRadius="xl"
										/>
									</ErrorBoundary>
								</Link>
							))}
						<div ref={observerElem}>
							{isSpinnerVisible ? (
								<div className="mt-1 flex w-full justify-center">
									<LoadingSpinner />
								</div>
							) : null}
						</div>
					</div>
				) : (
					<div className="flex flex-1 items-center self-center text-caption font-semibold text-steel-darker">
						No NFTs found
					</div>
				)}
			</Loading>
		</div>
	);
}

export default NftsPage;

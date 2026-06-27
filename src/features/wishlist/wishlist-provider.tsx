"use client";

import {
	createContext,
	type ReactNode,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useRef,
	useState,
} from "react";

import {
	addToMemberWishlist,
	fetchMemberWishlistIds,
	mergeGuestWishlistOnLogin,
	readLocalWishlistIds,
	removeFromMemberWishlist,
	writeLocalWishlistIds,
} from "@/features/wishlist/wishlist-sdk";
import { useWixAuth, useWixClient } from "@/lib/wix/provider";

type WishlistContextValue = {
	productIds: string[];
	count: number;
	isLoading: boolean;
	isWishlisted: (productId: string | undefined) => boolean;
	toggle: (productId: string) => Promise<void>;
	refresh: () => Promise<void>;
};

const WishlistContext = createContext<WishlistContextValue | null>(null);

function dispatchWishlistUpdated() {
	window.dispatchEvent(new CustomEvent("wishlist-updated"));
}

export function WishlistProvider({ children }: { children: ReactNode }) {
	const wixClient = useWixClient();
	const { isLoggedIn, member, isReady } = useWixAuth();
	const memberId = member?._id;
	const mergedOnLogin = useRef(false);

	const [productIds, setProductIds] = useState<string[]>([]);
	const initialized = useRef(false);

	useEffect(() => {
		if (!initialized.current) {
			initialized.current = true;
			if (typeof window !== "undefined") {
				setProductIds(readLocalWishlistIds());
			}
		}
	}, []);
	const [isLoading, setIsLoading] = useState(true);

	const persistLocal = useCallback((ids: string[]) => {
		const next = [...new Set(ids)];
		writeLocalWishlistIds(next);
		setProductIds(next);
		dispatchWishlistUpdated();
	}, []);

	const refresh = useCallback(async () => {
		let nextIds = readLocalWishlistIds();

		if (wixClient && isLoggedIn && memberId) {
			try {
				const remoteIds = await fetchMemberWishlistIds(wixClient, memberId);
				const localIds = readLocalWishlistIds();
				nextIds = [...new Set([...remoteIds, ...localIds])];
			} catch {
				/* CMS collection may be missing — keep local */
			}
		}

		writeLocalWishlistIds(nextIds);
		setProductIds(nextIds);
		setIsLoading(false);
	}, [wixClient, isLoggedIn, memberId]);

	useEffect(() => {
		if (!isReady) return;
		refresh();
	}, [isReady, refresh]);

	useEffect(() => {
		if (!wixClient || !isLoggedIn || !memberId || mergedOnLogin.current) return;

		mergedOnLogin.current = true;
		mergeGuestWishlistOnLogin(wixClient, memberId)
			.then((merged) => {
				setProductIds(merged);
				writeLocalWishlistIds(merged);
				dispatchWishlistUpdated();
			})
			.catch(() => {
				mergedOnLogin.current = false;
			});
	}, [wixClient, isLoggedIn, memberId]);

	useEffect(() => {
		const onUpdate = () => refresh();
		window.addEventListener("wishlist-updated", onUpdate);
		return () => window.removeEventListener("wishlist-updated", onUpdate);
	}, [refresh]);

	const toggle = useCallback(
		async (productId: string) => {
			if (!productId) return;

			const isCurrentlyWishlisted = productIds.includes(productId);
			const nextIds = isCurrentlyWishlisted
				? productIds.filter((id) => id !== productId)
				: [...productIds, productId];

			persistLocal(nextIds);

			if (wixClient && isLoggedIn && memberId) {
				try {
					if (isCurrentlyWishlisted) {
						await removeFromMemberWishlist(wixClient, memberId, productId);
					} else {
						await addToMemberWishlist(wixClient, memberId, productId);
					}
				} catch {
					await refresh();
				}
			}
		},
		[productIds, persistLocal, wixClient, isLoggedIn, memberId, refresh]
	);

	const value = useMemo<WishlistContextValue>(
		() => ({
			productIds,
			count: productIds.length,
			isLoading,
			isWishlisted: (productId) =>
				Boolean(productId && productIds.includes(productId)),
			toggle,
			refresh,
		}),
		[productIds, isLoading, toggle, refresh]
	);

	return (
		<WishlistContext.Provider value={value}>
			{children}
		</WishlistContext.Provider>
	);
}

export function useWishlist() {
	const ctx = useContext(WishlistContext);
	if (!ctx) {
		throw new Error("useWishlist must be used within WishlistProvider");
	}
	return ctx;
}

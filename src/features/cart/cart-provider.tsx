"use client";

import {
	createContext,
	type ReactNode,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useState,
} from "react";

import { CART_UPDATED_EVENT } from "@/components/commerce/cart-events";

import { fetchCart } from "@/features/cart/cart-actions";
import {
	type CartSnapshot,
	readCartSnapshot,
	syncCartFromWixResponse,
} from "@/features/cart/cart-sdk";

interface CartContextValue {
	count: number;
	snapshot: CartSnapshot | null;
	error: string | null;
	isLoading: boolean;
	refresh: () => Promise<void>;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
	const [snapshot, setSnapshot] = useState<CartSnapshot | null>(() =>
		readCartSnapshot()
	);
	const [error, setError] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(false);

	const applyCart = useCallback((cart: unknown) => {
		if (cart) {
			syncCartFromWixResponse(cart);
			setSnapshot(readCartSnapshot());
		}
	}, []);

	const refresh = useCallback(async () => {
		setIsLoading(true);
		setError(null);
		try {
			const cart = await fetchCart();
			if (cart) {
				applyCart(cart);
			} else {
				setSnapshot(readCartSnapshot());
			}
		} catch {
			setError("Could not load your cart. Please refresh the page.");
		} finally {
			setIsLoading(false);
		}
	}, [applyCart]);

	useEffect(() => {
		const onUpdate = (event: Event) => {
			const detail = (event as CustomEvent<{ cart?: unknown }>).detail;
			if (detail?.cart) {
				applyCart(detail.cart);
			} else {
				setSnapshot(readCartSnapshot());
			}
		};

		window.addEventListener(CART_UPDATED_EVENT, onUpdate);
		return () => window.removeEventListener(CART_UPDATED_EVENT, onUpdate);
	}, [applyCart]);

	const count = useMemo(
		() =>
			snapshot?.lineItems?.reduce(
				(sum, item) => sum + (item.quantity ?? 0),
				0
			) ?? 0,
		[snapshot]
	);

	const value = useMemo(
		() => ({ count, snapshot, error, isLoading, refresh }),
		[count, snapshot, error, isLoading, refresh]
	);

	return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
	const ctx = useContext(CartContext);
	if (!ctx) {
		throw new Error("useCart must be used within CartProvider");
	}
	return ctx;
}

"use client";

import { useCallback, useEffect, useState } from "react";

import { fetchCart } from "@/features/cart/cart-actions";
import {
	countLineItems,
	readCartSnapshot,
	syncCartFromWixResponse,
} from "@/features/cart/cart-sdk";

function countFromCart(cart: unknown): number {
	const snapshot = syncCartFromWixResponse(cart);
	return countLineItems(snapshot.lineItems);
}

export function useCartCount() {
	const [count, setCount] = useState(() => {
		const snapshot = readCartSnapshot();
		return snapshot ? countLineItems(snapshot.lineItems) : 0;
	});

	const refresh = useCallback(async (cartFromEvent?: unknown) => {
		if (cartFromEvent) {
			setCount(countFromCart(cartFromEvent));
			return;
		}

		const cart = await fetchCart();
		if (cart) {
			setCount(countFromCart(cart));
			return;
		}

		const snapshot = readCartSnapshot();
		setCount(snapshot ? countLineItems(snapshot.lineItems) : 0);
	}, []);

	useEffect(() => {
		refresh();

		const onUpdate = (event: Event) => {
			const detail = (event as CustomEvent<{ cart?: unknown }>).detail;
			void refresh(detail?.cart);
		};
		window.addEventListener("cart-updated", onUpdate);
		return () => window.removeEventListener("cart-updated", onUpdate);
	}, [refresh]);

	return count;
}

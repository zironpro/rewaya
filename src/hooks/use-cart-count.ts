"use client";

import { useEffect, useState } from "react";

import { useWixClient } from "@/lib/wix/provider";

export function useCartCount() {
	const wixClient = useWixClient();
	const [count, setCount] = useState(0);

	useEffect(() => {
		if (!wixClient) return;

		const refresh = async () => {
			try {
				const cart = (await wixClient.currentCart.getCurrentCart()) as {
					lineItems?: { quantity?: number | null }[];
				};
				const total =
					cart?.lineItems?.reduce(
						(sum, item) => sum + (item.quantity ?? 0),
						0
					) ?? 0;
				setCount(total);
			} catch {
				setCount(0);
			}
		};

		refresh();

		const onUpdate = () => refresh();
		window.addEventListener("cart-updated", onUpdate);
		return () => window.removeEventListener("cart-updated", onUpdate);
	}, [wixClient]);

	return count;
}

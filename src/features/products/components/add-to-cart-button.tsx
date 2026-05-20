"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";

import { WIX_STORES_APP_ID } from "@/lib/wix/constants";
import { useWixClient } from "@/lib/wix/provider";

interface AddToCartButtonProps {
	productId: string;
	productName: string;
	variantId?: string;
	quantity?: number;
	disabled?: boolean;
	className?: string;
	size?: "default" | "sm" | "lg" | "icon";
	variant?: "default" | "secondary" | "outline" | "ghost";
	children?: React.ReactNode;
}

export function AddToCartButton({
	productId,
	productName,
	variantId,
	quantity = 1,
	disabled,
	className,
	size = "lg",
	variant = "secondary",
	children,
}: AddToCartButtonProps) {
	const wixClient = useWixClient();
	const [status, setStatus] = useState<"idle" | "added" | "error">("idle");

	const handleAddToCart = async () => {
		if (!wixClient) return;

		setStatus("added");
		window.dispatchEvent(
			new CustomEvent("cart-updated", { detail: { delta: quantity } })
		);

		try {
			const catalogOptions: Record<string, unknown> = {};
			if (variantId) catalogOptions.variantId = variantId;

			const { cart } = await wixClient.currentCart.addToCurrentCart({
				lineItems: [
					{
						catalogReference: {
							appId: WIX_STORES_APP_ID,
							catalogItemId: productId,
							options:
								Object.keys(catalogOptions).length > 0
									? catalogOptions
									: undefined,
						},
						quantity,
					},
				],
			});

			window.dispatchEvent(
				new CustomEvent("cart-updated", { detail: { cart } })
			);
			setTimeout(() => setStatus("idle"), 2000);
		} catch {
			setStatus("error");
			window.dispatchEvent(
				new CustomEvent("cart-updated", { detail: { delta: 0 } })
			);
			setTimeout(() => setStatus("idle"), 2000);
		}
	};

	const label =
		status === "added"
			? "Added ✓"
			: status === "error"
				? "Try again"
				: (children ?? "Add to Cart");

	return (
		<Button
			className={className}
			disabled={disabled || status === "added"}
			onClick={handleAddToCart}
			size={size}
			variant={variant}
		>
			{label}
		</Button>
	);
}

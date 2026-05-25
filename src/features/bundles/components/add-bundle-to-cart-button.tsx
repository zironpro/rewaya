"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";

import { addBundle } from "@/features/cart/cart-actions";
import { syncCartFromWixResponse } from "@/features/cart/cart-sdk";

interface AddBundleToCartButtonProps {
	checkoutCatalogItemId: string;
	checkoutCatalogAppId?: string;
	quantity?: number;
	disabled?: boolean;
	className?: string;
	size?: "default" | "sm" | "lg" | "icon";
	variant?: "default" | "secondary" | "outline" | "ghost";
	children?: React.ReactNode;
	onAdded?: () => void;
}

function dispatchCartUpdated(cart?: unknown) {
	window.dispatchEvent(
		new CustomEvent("cart-updated", { detail: cart ? { cart } : undefined })
	);
}

export function AddBundleToCartButton({
	checkoutCatalogItemId,
	checkoutCatalogAppId,
	quantity = 1,
	disabled,
	className,
	size = "lg",
	variant = "secondary",
	children,
	onAdded,
}: AddBundleToCartButtonProps) {
	const [status, setStatus] = useState<"idle" | "loading" | "added" | "error">(
		"idle"
	);

	const canAdd = Boolean(checkoutCatalogItemId);

	const handleAddToCart = async () => {
		if (!canAdd) return;

		setStatus("loading");

		try {
			const { error, cart } = await addBundle(null, {
				catalogItemId: checkoutCatalogItemId,
				catalogAppId: checkoutCatalogAppId,
				quantity,
			});
			if (error) {
				setStatus("error");
				setTimeout(() => setStatus("idle"), 2500);
				return;
			}
			if (cart) {
				syncCartFromWixResponse(cart);
			}
			dispatchCartUpdated(cart);

			setStatus("added");
			onAdded?.();
			setTimeout(() => setStatus("idle"), 2000);
		} catch (e) {
			console.error("[cart] add bundle failed:", e);
			setStatus("error");
			dispatchCartUpdated();
			setTimeout(() => setStatus("idle"), 2500);
		}
	};

	const label =
		status === "loading"
			? "Adding…"
			: status === "added"
				? "Added ✓"
				: status === "error"
					? "Try again"
					: (children ?? "Add to Cart");

	return (
		<Button
			className={className}
			disabled={disabled || !canAdd || status === "added"}
			onClick={handleAddToCart}
			size={size}
			title={!canAdd ? "This bundle is not available for purchase" : undefined}
			variant={variant}
		>
			{label}
		</Button>
	);
}

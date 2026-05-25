"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";

import { addItem } from "@/features/cart/cart-actions";
import { syncCartFromWixResponse } from "@/features/cart/cart-sdk";
import type { ProductVariant } from "@/lib/wix/catalog-types";
import { isCmsCatalogAppId } from "@/lib/wix/purchase-flow";

interface AddToCartButtonProps {
	productId: string;
	productName: string;
	/** `catalogReference.appId` — CMS catalog for BookBundles, Stores for books */
	catalogAppId?: string;
	/** Wix Stores variant / options for catalogReference */
	productVariant?: ProductVariant;
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

export function AddToCartButton({
	productId,
	productName: _productName,
	catalogAppId,
	productVariant,
	quantity = 1,
	disabled,
	className,
	size = "lg",
	variant = "secondary",
	children,
	onAdded,
}: AddToCartButtonProps) {
	const [status, setStatus] = useState<"idle" | "loading" | "added" | "error">(
		"idle"
	);

	const isCmsCatalog = isCmsCatalogAppId(catalogAppId);
	const canAdd =
		Boolean(productId) &&
		(isCmsCatalog || productVariant?.availableForSale !== false);

	const handleAddToCart = async () => {
		if (!productId || !canAdd) return;

		setStatus("loading");

		try {
			const { error, cart } = await addItem(null, {
				productId,
				variant: productVariant,
				quantity,
				catalogAppId,
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
			console.error("[cart] add to cart failed:", e);
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
			variant={variant}
		>
			{label}
		</Button>
	);
}

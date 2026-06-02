"use client";

import { useState } from "react";

import { dispatchCartUpdated } from "@/components/commerce/cart-events";
import { Button } from "@/components/ui/button";

import { isAvailableForPurchase } from "@/domain/product/availability";
import { addItem } from "@/features/cart/cart-actions";
import { syncCartFromWixResponse } from "@/features/cart/cart-sdk";
import { trackMetaEvent } from "@/lib/analytics/meta";
import type { ProductVariant } from "@/lib/wix/catalog-types";
import { isCmsCatalogAppId } from "@/lib/wix/purchase-flow";

interface AddToCartButtonProps {
	productId: string;
	productName: string;
	/** `catalogReference.appId` — CMS catalog for BookBundles, Stores for books */
	catalogAppId?: string;
	/** Wix Stores variant / options for catalogReference */
	productVariant?: ProductVariant;
	availableForSale?: boolean;
	quantity?: number;
	disabled?: boolean;
	className?: string;
	size?: "default" | "sm" | "lg" | "icon";
	variant?: "default" | "secondary" | "outline" | "ghost";
	children?: React.ReactNode;
	onAdded?: () => void;
}

export function AddToCartButton({
	productId,
	productName: _productName,
	catalogAppId,
	productVariant,
	availableForSale,
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
	const inStock = isAvailableForPurchase(availableForSale, productVariant);
	const canAdd = Boolean(productId) && (isCmsCatalog || inStock);
	const outOfStock = Boolean(productId) && !isCmsCatalog && !inStock;

	const handleAddToCart = async () => {
		if (!productId || !canAdd) return;

		setStatus("loading");

		try {
			const { error, cart } = await addItem(null, {
				productId,
				variant: productVariant,
				quantity,
				catalogAppId,
				availableForSale,
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
			// Track Meta AddToCart event
			if (typeof window !== "undefined") {
				trackMetaEvent("AddToCart", {
					event_source_url: window.location.href,
					custom_data: {
						content_ids: [productId],
					},
				});
			}

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
					: outOfStock
						? "Out of Stock"
						: (children ?? "Add to Cart");

	return (
		<Button
			className={className}
			disabled={disabled || !canAdd || status === "added"}
			onClick={handleAddToCart}
			size={size}
			title={outOfStock ? "This item is currently out of stock" : undefined}
			variant={variant}
		>
			{label}
		</Button>
	);
}

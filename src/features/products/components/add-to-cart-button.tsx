"use client";

import { useState } from "react";

import { useOpenPanel } from "@openpanel/nextjs";

import { dispatchCartUpdated } from "@/components/commerce/cart-events";
import { Button } from "@/components/ui/button";
import { toastManager } from "@/components/ui/toast";

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
	trackEventName?: string;
}

export function AddToCartButton({
	productId,
	productName,
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
	trackEventName = "add_to_cart",
}: AddToCartButtonProps) {
	const { track } = useOpenPanel();
	const [status, setStatus] = useState<"idle" | "loading" | "added" | "error">(
		"idle"
	);

	const isCmsCatalog = isCmsCatalogAppId(catalogAppId);
	const inStock = isAvailableForPurchase(availableForSale, productVariant);
	const canAdd = Boolean(productId) && (isCmsCatalog || inStock);
	const outOfStock = Boolean(productId) && !isCmsCatalog && !inStock;

	const handleAddToCart = () => {
		if (!productId || !canAdd) return;

		setStatus("added");
		onAdded?.();
		setTimeout(() => setStatus("idle"), 2000);

		addItem(null, {
			productId,
			variant: productVariant,
			quantity,
			catalogAppId,
			availableForSale,
		})
			.then(({ error, cart }) => {
				if (error) {
					setStatus("error");
					toastManager.add({
						title: "Error",
						description: error,
						type: "error",
					});
					setTimeout(() => setStatus("idle"), 2500);
					return;
				}
				if (cart) {
					syncCartFromWixResponse(cart);
				}
				dispatchCartUpdated(cart);
				toastManager.add({
					title: "Added to cart",
					description: productName,
					type: "success",
				});
				// Track Meta AddToCart event
				if (typeof window !== "undefined") {
					trackMetaEvent("AddToCart", {
						event_source_url: window.location.href,
						custom_data: {
							content_ids: [productId],
							content_name: productName,
							content_type: "product",
							currency: "AED",
						},
					});
				}
				track(trackEventName, {
					product_id: productId,
					product_name: productName,
					quantity,
				});
			})
			.catch((e) => {
				console.error("[cart] add to cart failed:", e);
				setStatus("error");
				toastManager.add({
					title: "Error",
					description: "Could not add to cart.",
					type: "error",
				});
				dispatchCartUpdated();
				setTimeout(() => setStatus("idle"), 2500);
			});
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

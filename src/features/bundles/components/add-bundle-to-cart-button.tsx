"use client";

import { useState } from "react";

import { useOpenPanel } from "@openpanel/nextjs";

import { dispatchCartUpdated } from "@/components/commerce/cart-events";
import { Button } from "@/components/ui/button";
import { toastManager } from "@/components/ui/toast";

import { addBundle } from "@/features/cart/cart-actions";
import { syncCartFromWixResponse } from "@/features/cart/cart-sdk";
import { trackMetaEvent } from "@/lib/analytics/meta";

interface AddBundleToCartButtonProps {
	checkoutCatalogItemId: string;
	checkoutCatalogAppId?: string;
	/** Rewaya bundle slug — server re-resolves checkout ids at click time. */
	bundleSlug?: string;
	quantity?: number;
	disabled?: boolean;
	className?: string;
	size?: "default" | "sm" | "lg" | "icon";
	variant?: "default" | "secondary" | "outline" | "ghost";
	children?: React.ReactNode;
	onAdded?: () => void;
}

export function AddBundleToCartButton({
	checkoutCatalogItemId,
	checkoutCatalogAppId,
	bundleSlug,
	quantity = 1,
	disabled,
	className,
	size = "lg",
	variant = "secondary",
	children,
	onAdded,
}: AddBundleToCartButtonProps) {
	const { track } = useOpenPanel();
	const [status, setStatus] = useState<"idle" | "loading" | "added" | "error">(
		"idle"
	);
	const [errorMessage, setErrorMessage] = useState<string | null>(null);

	const canAdd = Boolean(checkoutCatalogItemId);

	const handleAddToCart = () => {
		if (!canAdd) return;

		setStatus("added");
		setErrorMessage(null);
		onAdded?.();
		setTimeout(() => setStatus("idle"), 2000);

		addBundle(null, {
			catalogItemId: checkoutCatalogItemId,
			catalogAppId: checkoutCatalogAppId,
			bundleSlug,
			quantity,
		})
			.then(({ error, cart }) => {
				if (error) {
					setErrorMessage(error);
					setStatus("error");
					toastManager.add({
						title: "Error",
						description: error,
						type: "error",
					});
					setTimeout(() => {
						setStatus("idle");
						setErrorMessage(null);
					}, 4000);
					return;
				}
				const lineCount =
					(cart as { lineItems?: unknown[] })?.lineItems?.length ?? 0;

				if (lineCount === 0) {
					const errorMsg =
						"Bundle was not added (cart has 0 items). Set bundleProductId in Wix BookBundles.";
					setErrorMessage(errorMsg);
					setStatus("error");
					toastManager.add({
						title: "Error",
						description: errorMsg,
						type: "error",
					});
					setTimeout(() => {
						setStatus("idle");
						setErrorMessage(null);
					}, 4000);
					return;
				}

				if (cart) {
					syncCartFromWixResponse(cart);
				}
				dispatchCartUpdated(cart);
				toastManager.add({
					title: "Bundle added to cart",
					description: bundleSlug ?? "bundle",
					type: "success",
				});
				// Track Meta AddToCart for bundle
				if (typeof window !== "undefined") {
					trackMetaEvent("AddToCart", {
						event_source_url: window.location.href,
						custom_data: {
							content_ids: [checkoutCatalogItemId],
							content_name: bundleSlug ?? "bundle",
							content_type: "product_group",
							currency: "AED",
						},
					});
				}
				track("add_to_cart", {
					product_id: checkoutCatalogItemId,
					product_name: bundleSlug ?? "bundle",
					quantity,
					is_bundle: true,
				});
			})
			.catch(() => {
				const errorMsg = "Could not add bundle to cart. Please try again.";
				setErrorMessage(errorMsg);
				setStatus("error");
				toastManager.add({
					title: "Error",
					description: errorMsg,
					type: "error",
				});
				dispatchCartUpdated();
				setTimeout(() => {
					setStatus("idle");
					setErrorMessage(null);
				}, 4000);
			});
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
		<div className="flex w-full flex-col gap-1">
			<Button
				className={className}
				disabled={disabled || !canAdd || status === "added"}
				onClick={handleAddToCart}
				size={size}
				title={
					!canAdd ? "This bundle is not available for purchase" : undefined
				}
				variant={variant}
			>
				{label}
			</Button>
			{status === "error" && errorMessage ? (
				<p className="text-destructive text-xs">{errorMessage}</p>
			) : null}
		</div>
	);
}

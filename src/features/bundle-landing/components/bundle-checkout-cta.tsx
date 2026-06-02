"use client";

import { useState, useTransition } from "react";
import { ShoppingBag } from "lucide-react";

import type { BundlePresentation } from "@/domain/bundle";
import { Button } from "@/components/ui/button";
import { dispatchCartUpdated } from "@/components/commerce/cart-events";
import { AddBundleToCartButton } from "@/features/bundles/components/add-bundle-to-cart-button";
import { addBundle, redirectToCheckout } from "@/features/cart/cart-actions";
import { syncCartFromWixResponse } from "@/features/cart/cart-sdk";
import { cn } from "@/lib/utils";

interface BundleCheckoutCtaProps {
	bundle: BundlePresentation;
	className?: string;
	size?: "default" | "sm" | "lg" | "icon";
	label?: string;
	shimmerClass?: string;
	/**
	 * "cart": add to cart (default).
	 * "checkout": add to cart then redirect to checkout immediately.
	 */
	mode?: "cart" | "checkout";
}

export function BundleCheckoutCta({
	bundle,
	className,
	size = "lg",
	label = "Add bundle to cart",
	shimmerClass = "btn-shimmer",
	mode = "cart",
}: BundleCheckoutCtaProps) {
	const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
	const [isPending, startCheckout] = useTransition();

	const canCheckout = Boolean(bundle.checkoutCatalogItemId);
	const isDisabled = !canCheckout || status === "loading" || isPending;

	const handleCheckout = async () => {
		if (!canCheckout) return;
		setStatus("loading");

		try {
			const { error, cart } = await addBundle(null, {
				catalogItemId: bundle.checkoutCatalogItemId,
				catalogAppId: bundle.checkoutCatalogAppId,
				bundleSlug: bundle.slug,
				quantity: 1,
			});

			if (error) {
				setStatus("error");
				return;
			}

			if (cart) {
				// Keep any local cart UI in sync in case checkout redirect is delayed.
				syncCartFromWixResponse(cart);
				dispatchCartUpdated(cart);
			}

			// Track Meta "InitiateCheckout" consistently with cart checkout.
			// redirectToCheckout will create checkout from the now-updated current cart.
			startCheckout(() => redirectToCheckout(window.location.origin));
		} catch {
			setStatus("error");
		}
	};

	if (mode === "cart") {
		// Keep existing behavior for PDP & landing CTAs that just add to cart.
		return (
			<AddBundleToCartButton
				bundleSlug={bundle.slug}
				checkoutCatalogAppId={bundle.checkoutCatalogAppId}
				checkoutCatalogItemId={bundle.checkoutCatalogItemId}
				className={cn(
					shimmerClass,
					"min-h-11 w-full shrink-0 gap-2",
					className
				)}
				disabled={!bundle.checkoutCatalogItemId}
				size={size}
			>
				<ShoppingBag className="size-4" />
				{label}
			</AddBundleToCartButton>
		);
	}

	return (
		<div className="flex w-full flex-col gap-1">
			<Button
				className={cn(shimmerClass, "min-h-11 w-full shrink-0", className)}
				disabled={isDisabled}
				onClick={handleCheckout}
				size={size}
				variant="secondary"
				title={
					!canCheckout
						? "This bundle is not available for purchase"
						: undefined
				}
			>
				<ShoppingBag className="size-4" />
				{status === "loading" ? "Redirecting…" : label}
			</Button>
			{status === "error" ? (
				<p className="text-destructive text-xs">
					Could not start checkout. Please try again.
				</p>
			) : null}
		</div>
	);
}

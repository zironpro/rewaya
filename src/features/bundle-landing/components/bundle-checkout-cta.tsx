"use client";

import { ShoppingBag } from "lucide-react";

import type { BundlePresentation } from "@/domain/bundle";
import { AddBundleToCartButton } from "@/features/bundles/components/add-bundle-to-cart-button";
import { cn } from "@/lib/utils";

interface BundleCheckoutCtaProps {
	bundle: BundlePresentation;
	className?: string;
	size?: "default" | "sm" | "lg" | "icon";
	label?: string;
	shimmerClass?: string;
}

export function BundleCheckoutCta({
	bundle,
	className,
	size = "lg",
	label = "Add bundle to cart",
	shimmerClass = "btn-shimmer",
}: BundleCheckoutCtaProps) {
	return (
		<AddBundleToCartButton
			bundleSlug={bundle.slug}
			checkoutCatalogAppId={bundle.checkoutCatalogAppId}
			checkoutCatalogItemId={bundle.checkoutCatalogItemId}
			className={cn(shimmerClass, "min-h-11 w-full shrink-0 gap-2", className)}
			disabled={!bundle.checkoutCatalogItemId}
			size={size}
		>
			<ShoppingBag className="size-4" />
			{label}
		</AddBundleToCartButton>
	);
}

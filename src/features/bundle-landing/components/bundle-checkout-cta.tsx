"use client";

import { ShoppingBag } from "lucide-react";

import { AddToCartButton } from "@/features/products/components/add-to-cart-button";
import { cn } from "@/lib/utils";

import type { BundleData } from "../types/bundle";

interface BundleCheckoutCtaProps {
	bundle: BundleData;
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
		<AddToCartButton
			className={cn(shimmerClass, "min-h-11 w-full shrink-0 gap-2", className)}
			disabled={!bundle.wixProductId}
			productId={bundle.wixProductId ?? ""}
			productName={bundle.name}
			productVariant={bundle.defaultVariant}
			size={size}
		>
			<ShoppingBag className="size-4" />
			{label}
		</AddToCartButton>
	);
}

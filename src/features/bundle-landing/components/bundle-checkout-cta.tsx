"use client";

import Link from "next/link";

import { ShoppingBag } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";

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
	if (bundle.wixProductId) {
		return (
			<AddToCartButton
				className={cn(
					shimmerClass,
					"min-h-11 w-full shrink-0 gap-2",
					className
				)}
				productId={bundle.wixProductId}
				productName={bundle.name}
				size={size}
			>
				<ShoppingBag className="size-4" />
				{label}
			</AddToCartButton>
		);
	}

	return (
		<Link
			className={cn(
				buttonVariants({ size }),
				shimmerClass,
				"inline-flex min-h-11 w-full shrink-0 items-center justify-center gap-2 no-underline hover:no-underline",
				className
			)}
			href="/cart"
		>
			<ShoppingBag className="size-4" />
			{label}
		</Link>
	);
}

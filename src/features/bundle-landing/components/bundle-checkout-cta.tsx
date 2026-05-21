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
}

export function BundleCheckoutCta({
	bundle,
	className,
	size = "lg",
}: BundleCheckoutCtaProps) {
	if (bundle.wixProductId) {
		return (
			<AddToCartButton
				className={cn("btn-shimmer w-full gap-2", className)}
				productId={bundle.wixProductId}
				productName={bundle.name}
				size={size}
			>
				<ShoppingBag className="size-4" />
				Add bundle to cart
			</AddToCartButton>
		);
	}

	return (
		<Link
			className={cn(
				buttonVariants({ size }),
				"btn-shimmer inline-flex w-full items-center justify-center gap-2 no-underline hover:no-underline",
				className
			)}
			href="/cart"
		>
			<ShoppingBag className="size-4" />
			Continue to cart
		</Link>
	);
}

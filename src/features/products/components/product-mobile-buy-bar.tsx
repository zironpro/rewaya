"use client";

import { ShoppingBagIcon } from "lucide-react";

import { AddToCartButton } from "@/features/products/components/add-to-cart-button";
import type { ProductVariant } from "@/lib/wix/catalog-types";

interface ProductMobileBuyBarProps {
	price: number;
	productId?: string;
	productName?: string;
	productVariant?: ProductVariant;
	quantity?: number;
}

export function ProductMobileBuyBar({
	price,
	productId,
	productName = "Product",
	productVariant,
	quantity = 1,
}: ProductMobileBuyBarProps) {
	return (
		<div className="fixed inset-x-0 bottom-16 z-50 border-stone-200 border-t bg-white/95 px-4 py-3 backdrop-blur-md md:hidden">
			<div className="container flex items-center gap-4">
				<span className="min-w-0 flex-1 font-bold text-2xl text-secondary">
					AED {price.toFixed(2)}
				</span>
				<AddToCartButton
					className="shrink-0 gap-2"
					disabled={!productId}
					productId={productId ?? ""}
					productName={productName}
					productVariant={productVariant}
					quantity={quantity}
					size="lg"
					variant="secondary"
				>
					<ShoppingBagIcon size={18} />
					Add to Cart
				</AddToCartButton>
			</div>
		</div>
	);
}

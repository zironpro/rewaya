"use client";

import { ShoppingBagIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

import { AddToCartButton } from "@/features/products/components/add-to-cart-button";

interface ProductMobileBuyBarProps {
	price: number;
	productId?: string;
	productName?: string;
	quantity?: number;
}

export function ProductMobileBuyBar({
	price,
	productId,
	productName,
	quantity = 1,
}: ProductMobileBuyBarProps) {
	return (
		<div className="fixed inset-x-0 bottom-16 z-50 border-stone-200 border-t bg-white/95 px-4 py-3 backdrop-blur-md md:hidden">
			<div className="container flex items-center gap-4">
				<span className="min-w-0 flex-1 font-bold text-2xl text-secondary">
					AED {price.toFixed(2)}
				</span>
				{productId && productName ? (
					<AddToCartButton
						className="shrink-0 gap-2"
						productId={productId}
						productName={productName}
						quantity={quantity}
						size="lg"
						variant="secondary"
					>
						<ShoppingBagIcon size={18} />
						Add to Cart
					</AddToCartButton>
				) : (
					<Button className="shrink-0 gap-2" size="lg" variant="secondary">
						<ShoppingBagIcon size={18} />
						Add to Cart
					</Button>
				)}
			</div>
		</div>
	);
}

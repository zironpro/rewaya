import { ShoppingBagIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

import { CurrencyIcon } from "@/assets/icons/currency";

import type { Bundle } from "@/lib/bundles-data";

interface BundleMobileBuyBarProps {
	bundle: Bundle;
}

export function BundleMobileBuyBar({ bundle }: BundleMobileBuyBarProps) {
	return (
		<div className="fixed inset-x-0 bottom-16 z-50 border-stone-200 border-t bg-card/95 px-4 py-3 backdrop-blur-md md:hidden">
			<div className="container flex items-center gap-4">
				<div className="flex min-w-0 flex-1 items-center gap-1">
					<CurrencyIcon className="size-5 shrink-0 text-primary" />
					<span className="font-bold text-2xl text-primary">
						{bundle.price}
					</span>
				</div>
				<Button className="shrink-0 gap-2" size="lg" variant="secondary">
					<ShoppingBagIcon size={18} />
					Add to Cart
				</Button>
			</div>
		</div>
	);
}

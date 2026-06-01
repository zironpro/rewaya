import { useState, useTransition } from "react";

import { PurchasePanelShell } from "@/components/commerce/purchase-panel-shell";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

import { WishlistToggleButton } from "@/features/wishlist/components/wishlist-toggle-button";
import type { Bundle } from "@/lib/catalog/types";
import { cn } from "@/lib/utils";

import { addToCartAction } from "./add-to-cart-action";

interface BundleBuyBoxProps {
	bundle: Bundle;
	className?: string;
}

export function BundleBuyBox({ bundle, className }: BundleBuyBoxProps) {
	const [isPending, startTransition] = useTransition();
	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const canAdd = Boolean(bundle.checkoutCatalogItemId);
	console.log(" bundle.bundleProductId", bundle.checkoutCatalogItemId);
	const handleAddToCart = () => {
		setErrorMessage(null);
		startTransition(async () => {
			try {
				await addToCartAction({
					checkoutCatalogItemId: bundle.checkoutCatalogItemId,
				});
			} catch (error) {
				console.error("[bundle-cart] BundleBuyBox — add failed:", error);
			}
		});
	};

	return (
		<PurchasePanelShell className={cn("p-6", className)}>
			<div>
				<span className="text-muted-foreground text-xs">Bundle contents</span>
				<h3 className="font-bold text-secondary uppercase">
					{bundle.books.length} Books
				</h3>
			</div>
			<Separator className="my-3" />
			<ScrollArea className="mb-4 max-h-[280px]">
				<div className="space-y-3 pr-2">
					{bundle.books.map((book, i) => (
						<div
							className="group/item flex cursor-pointer items-start"
							key={book.id}
						>
							<span className="mt-0.5 w-6 shrink-0 text-muted-foreground/50 text-xs">
								{(i + 1).toString().padStart(2, "0")}
							</span>
							<p className="font-medium text-sm text-stone-500 leading-tight transition-colors group-hover/item:text-primary">
								{book.title}
							</p>
						</div>
					))}
				</div>
			</ScrollArea>

			<Button disabled={!canAdd || isPending} onClick={handleAddToCart}>
				{isPending ? "Adding…" : "Add to cart"}
			</Button>
			{errorMessage ? (
				<p className="mt-2 text-destructive text-xs">{errorMessage}</p>
			) : null}

			{/* <AddBundleToCartButton
				bundleSlug={bundle.id}
				checkoutCatalogAppId={bundle.checkoutCatalogAppId}
				checkoutCatalogItemId={bundle.checkoutCatalogItemId}
				className="w-full gap-3"
				disabled={!bundle.checkoutCatalogItemId}
				size="lg"
				variant="secondary"
			>
				<ShoppingBagIcon />
				Add to Cart
			</AddBundleToCartButton> */}

			<Separator className="my-4" />

			{bundle.bundleProductId || bundle.storeProductIds[0] ? (
				<WishlistToggleButton
					productId={bundle.bundleProductId || bundle.storeProductIds[0]!}
					variant="row"
				/>
			) : null}
		</PurchasePanelShell>
	);
}

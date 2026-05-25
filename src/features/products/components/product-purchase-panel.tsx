"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import {
	Package,
	RefreshCcw,
	ShieldCheck,
	ShoppingBagIcon,
	Truck,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import { CurrencyIcon } from "@/assets/icons/currency";

import { AddToCartButton } from "@/features/products/components/add-to-cart-button";
import { WishlistToggleButton } from "@/features/wishlist/components/wishlist-toggle-button";
import { cn } from "@/lib/utils";

const TRUST_ITEMS = [
	{ icon: Truck, label: "Express delivery across the UAE " },
	{ icon: RefreshCcw, label: "Easy 30-day returns on eligible items" },
	{ icon: ShieldCheck, label: "100% authentic edition guarantee" },
] as const;

interface ProductPurchasePanelProps {
	title: string;
	price: number;
	compareAtPrice?: number;
	productId?: string;
	productVariant?: import("@/lib/wix/catalog-types").ProductVariant;
	availableForSale?: boolean;
	quantity: number;
	onQuantityChange: (qty: number) => void;
	className?: string;
}

export function ProductPurchasePanel({
	title,
	price,
	compareAtPrice,
	productId,
	productVariant,
	availableForSale,
	quantity,
	onQuantityChange,
	className,
}: ProductPurchasePanelProps) {
	const router = useRouter();
	const inStock = availableForSale !== false;
	const savingsPercent =
		compareAtPrice && compareAtPrice > price
			? Math.round((1 - price / compareAtPrice) * 100)
			: null;

	return (
		<aside className={cn(className)}>
			<div className="rounded-xl border border-border bg-card p-5 shadow-sm lg:sticky lg:top-28">
				<div className="mb-4 flex items-start gap-3">
					<div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
						<Package className="size-5" />
					</div>
					<div className="min-w-0">
						<p className="font-medium text-muted-foreground text-xs uppercase tracking-wider">
							Sold by
						</p>
						<p className="font-bold text-secondary text-sm">Rewaya Books</p>
						<p className="text-muted-foreground text-xs">
							Official store · Curated editions
						</p>
					</div>
				</div>

				<Separator className="mb-4" />

				<div className="mb-4 space-y-1">
					<div className="flex items-baseline gap-2">
						<CurrencyIcon className="size-5 text-primary" />
						<span className="font-black font-display text-2xl text-primary">
							{price.toFixed(2)}
						</span>
					</div>
					{compareAtPrice && compareAtPrice > price && (
						<div className="flex flex-wrap items-center gap-2 text-sm">
							<span className="text-muted-foreground line-through">
								AED {compareAtPrice.toFixed(2)}
							</span>
							{savingsPercent !== null && (
								<span className="font-bold text-success">
									{savingsPercent}% off
								</span>
							)}
						</div>
					)}
				</div>

				<div className="mb-4 flex items-center justify-between rounded-lg border border-border bg-muted/30 px-3 py-2">
					<span className="font-medium text-secondary text-sm">Quantity</span>
					<div className="flex items-center gap-1">
						<Button
							aria-label="Decrease quantity"
							className="size-8"
							disabled={!inStock || quantity <= 1}
							onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
							size="icon"
							type="button"
							variant="outline"
						>
							<span className="text-lg leading-none">−</span>
						</Button>
						<span className="w-10 text-center font-bold text-sm">
							{quantity}
						</span>
						<Button
							aria-label="Increase quantity"
							className="size-8"
							disabled={!inStock}
							onClick={() => onQuantityChange(quantity + 1)}
							size="icon"
							type="button"
							variant="outline"
						>
							<span className="text-lg leading-none">+</span>
						</Button>
					</div>
				</div>

				<div className="flex flex-col gap-2">
					<AddToCartButton
						availableForSale={availableForSale}
						className="hidden w-full gap-2 md:flex"
						disabled={!productId}
						productId={productId ?? ""}
						productName={title}
						productVariant={productVariant}
						quantity={quantity}
						size="lg"
						variant="secondary"
					>
						<ShoppingBagIcon className="size-4" />
						Add to Cart
					</AddToCartButton>

					<AddToCartButton
						availableForSale={availableForSale}
						className="hidden w-full md:flex"
						disabled={!productId}
						onAdded={() => router.push("/cart")}
						productId={productId ?? ""}
						productName={title}
						productVariant={productVariant}
						quantity={quantity}
						size="lg"
						variant="outline"
					>
						Buy Now
					</AddToCartButton>

					{/* {!productId && (
						<p className="text-center text-muted-foreground text-xs">
							Catalog sync required to purchase online.
						</p>
					)} */}
				</div>

				<Separator className="my-4" />

				<ul className="space-y-3">
					{TRUST_ITEMS.map(({ icon: Icon, label }) => (
						<li className="flex gap-3 text-sm" key={label}>
							<Icon
								aria-hidden
								className="mt-0.5 size-4 shrink-0 text-primary"
							/>
							<span className="text-muted-foreground leading-snug">
								{label}
							</span>
						</li>
					))}
				</ul>

				<Separator className="my-4" />

				<WishlistToggleButton productId={productId} variant="row" />

				<Link
					className="mt-3 block text-center font-medium text-primary text-xs hover:underline"
					href="/shop"
				>
					Continue browsing the shop
				</Link>
			</div>
		</aside>
	);
}

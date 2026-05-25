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

import { AvailabilityStatus } from "@/components/commerce/availability-status";
import { PurchasePanelShell } from "@/components/commerce/purchase-panel-shell";
import { QuantitySelector } from "@/components/commerce/quantity-selector";
import { Separator } from "@/components/ui/separator";

import { CurrencyIcon } from "@/assets/icons/currency";

import { isAvailableForPurchase } from "@/domain/product/availability";
import { AddToCartButton } from "@/features/products/components/add-to-cart-button";
import { WishlistToggleButton } from "@/features/wishlist/components/wishlist-toggle-button";

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
	const inStock = isAvailableForPurchase(availableForSale, productVariant);
	const savingsPercent =
		compareAtPrice && compareAtPrice > price
			? Math.round((1 - price / compareAtPrice) * 100)
			: null;

	return (
		<PurchasePanelShell className={className}>
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

			<div className="mb-4 space-y-2">
				<AvailabilityStatus
					availableForSale={availableForSale}
					variant={productVariant}
				/>
				<QuantitySelector
					disabled={!inStock}
					onQuantityChange={onQuantityChange}
					quantity={quantity}
				/>
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
						<Icon aria-hidden className="mt-0.5 size-4 shrink-0 text-primary" />
						<span className="text-muted-foreground leading-snug">{label}</span>
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
		</PurchasePanelShell>
	);
}

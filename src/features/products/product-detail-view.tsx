"use client";

import { useState } from "react";

import Breadcrumbs from "@/components/layout/Breadcrumbs";

import { ProductGallery } from "@/features/products/components/product-gallery";
import { ProductInfoPanel } from "@/features/products/components/product-info-panel";
import { ProductMobileBuyBar } from "@/features/products/components/product-mobile-buy-bar";
import { ProductPurchasePanel } from "@/features/products/components/product-purchase-panel";
import type { ProductDetailData } from "@/features/products/types";

export type { ProductDetailData } from "@/features/products/types";

const getMockProduct = (id: string) => ({
	id: Number.parseInt(id, 10) || 1,
	title:
		id === "1"
			? "The Sealed Nectar"
			: id === "2"
				? "Atomic Habits"
				: "Classic Literature",
	author: id === "1" ? "Safiur Rahman Mubarakpuri" : "Various Authors",
	price: 85.0,
	category: "Islamic",
	image:
		"https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=1200&auto=format&fit=crop",
	description:
		"A comprehensive and authoritative biography of the Prophet Muhammad (PBUH).",
	details: [
		{ label: "Language", value: "English" },
		{ label: "Format", value: "Hardcover" },
		{ label: "Pages", value: "588" },
		{ label: "Publisher", value: "Darussalam Publishing" },
	],
	badge: "best seller" as const,
	images:
		id === "2"
			? [
					"https://images.unsplash.com/photo-1495446815901-a7297e633e8d?q=80&w=800&auto=format&fit=crop",
					"https://images.unsplash.com/photo-1512820790811-8f83e314c1e5?q=80&w=800&auto=format&fit=crop",
				]
			: undefined,
});

function getCompareAtPrice(price: number): number | undefined {
	if (price <= 0) return undefined;
	return Math.round(price * 1.18 * 100) / 100;
}

interface ProductDetailViewProps {
	id: string;
	product: ProductDetailData | null;
}

export const ProductDetailView = ({
	id,
	product: wixProduct,
}: ProductDetailViewProps) => {
	const mock = getMockProduct(id);
	const product: ProductDetailData = wixProduct ?? {
		...mock,
		wixProductId: undefined,
		slug: undefined,
	};
	const [quantity, setQuantity] = useState(1);
	const compareAtPrice = getCompareAtPrice(product.price);

	console.log("product", product);
	return (
		<>
			<main className="bg-background pt-4 pb-28 md:pb-16">
				<div className="container">
					<Breadcrumbs
						className="mb-6"
						items={[
							{ label: "Shop", href: "/shop" },
							...(product.category
								? [{ label: product.category, href: "/shop" }]
								: []),
							{ label: product.title },
						]}
					/>

					<div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-10 xl:gap-12">
						<div className="lg:col-span-4 xl:col-span-5">
							<ProductGallery
								image={product.image}
								images={product.images}
								title={product.title}
								wixProductId={product.id}
							/>
						</div>

						<div className="lg:col-span-5 xl:col-span-4">
							<ProductInfoPanel
								compareAtPrice={compareAtPrice}
								product={product}
							/>
						</div>

						<div className="hidden lg:col-span-3 lg:block xl:col-span-3">
							<ProductPurchasePanel
								compareAtPrice={compareAtPrice}
								onQuantityChange={setQuantity}
								price={product.price}
								productId={product.wixProductId}
								quantity={quantity}
								title={product.title}
							/>
						</div>
					</div>
				</div>
			</main>

			<ProductMobileBuyBar
				price={product.price}
				productId={product.wixProductId}
				productName={product.title}
				quantity={quantity}
			/>
		</>
	);
};

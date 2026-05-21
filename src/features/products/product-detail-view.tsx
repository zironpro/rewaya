"use client";

import { useState } from "react";

import Image from "next/image";

import {
	Heart,
	Minus,
	Plus,
	RefreshCcw,
	Share2,
	ShieldCheck,
	Truck,
} from "lucide-react";

import Breadcrumbs from "@/components/layout/Breadcrumbs";

import { AddToCartButton } from "@/features/products/components/add-to-cart-button";
import { ProductMobileBuyBar } from "@/features/products/components/product-mobile-buy-bar";
import type { BookProps } from "@/lib/store";

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
});

export type ProductDetailData = BookProps & {
	description: string;
	details: Array<{ label: string; value: string }>;
};

interface ProductDetailViewProps {
	id: string;
	product: ProductDetailData | null;
}

export const ProductDetailView = ({
	id,
	product: wixProduct,
}: ProductDetailViewProps) => {
	const mock = getMockProduct(id);
	const product = wixProduct ?? {
		...mock,
		wixProductId: undefined,
		slug: undefined,
	};
	const [quantity, setQuantity] = useState(1);

	return (
		<>
			<main className="pt-20 pb-28 md:pb-16">
				<div className="container">
					<Breadcrumbs
						className="mb-12"
						items={[{ label: "Shop", href: "/shop" }, { label: product.title }]}
					/>

					<div className="grid grid-cols-1 gap-20 md:grid-cols-2">
						<div className="space-y-6">
							<div className="group relative aspect-3/4 overflow-hidden bg-stone-50">
								<Image
									alt={product.title}
									className="object-cover transition-transform duration-1000 group-hover:scale-105"
									fill
									sizes="(max-width: 768px) 100vw, 50vw"
									src={product.image}
								/>
								<button
									className="absolute top-6 right-6 z-10 rounded-full bg-white/80 p-3 backdrop-blur-md transition-colors hover:bg-primary hover:text-white"
									type="button"
								>
									<Heart size={20} />
								</button>
							</div>
						</div>

						<div className="flex flex-col">
							<span className="mb-4 font-bold text-primary text-sm">
								{product.category}
							</span>
							<h1 className="mb-2 font-black font-serif text-3xl tracking-tight sm:text-4xl md:text-5xl lg:text-6xl">
								{product.title}
							</h1>
							<p className="mb-8 font-bold text-base text-stone-400">
								{product.author}
							</p>

							<div className="mb-10 font-bold text-2xl text-secondary">
								AED {product.price.toFixed(2)}
							</div>

							<p className="mb-12 max-w-lg text-sm text-stone-500 leading-relaxed">
								{product.description}
							</p>

							<div className="mb-16 space-y-8">
								<div className="flex flex-wrap items-center gap-4 sm:gap-8">
									<div className="flex items-center border border-stone-100 px-4 py-2">
										<button
											className="p-2 transition-colors hover:text-primary"
											onClick={() => setQuantity(Math.max(1, quantity - 1))}
											type="button"
										>
											<Minus size={14} />
										</button>
										<span className="w-12 text-center font-bold text-sm">
											{quantity}
										</span>
										<button
											className="p-2 transition-colors hover:text-primary"
											onClick={() => setQuantity(quantity + 1)}
											type="button"
										>
											<Plus size={14} />
										</button>
									</div>
									<button
										className="flex items-center gap-2 font-bold text-sm transition-colors hover:text-primary"
										type="button"
									>
										<Share2 size={14} /> Share
									</button>
								</div>

								{product.wixProductId ? (
									<AddToCartButton
										className="hidden w-full md:flex"
										productId={product.wixProductId}
										productName={product.title}
										quantity={quantity}
										variant="default"
									>
										Add to Collection
									</AddToCartButton>
								) : (
									<button
										className="hidden w-full bg-primary py-6 font-bold text-sm text-white shadow-lg transition-all duration-500 hover:scale-[1.02] hover:bg-secondary hover:shadow-2xl active:scale-[0.98] md:block"
										type="button"
									>
										Add to Collection
									</button>
								)}
							</div>

							<div className="space-y-6 border-stone-100 border-t pt-12">
								<div className="grid grid-cols-2 gap-y-4">
									{product.details.map((detail, i) => (
										<div
											className="flex flex-col"
											key={`${Number(i)}-${detail.label}`}
										>
											<span className="mb-1 font-bold text-sm text-stone-400">
												{detail.label}
											</span>
											<span className="font-bold text-sm">{detail.value}</span>
										</div>
									))}
								</div>

								<div className="flex flex-col gap-4 pt-6">
									<div className="flex items-center gap-4 text-sm">
										<Truck className="text-primary" size={18} />
										<span>Express Shipping Available (2-3 Days)</span>
									</div>
									<div className="flex items-center gap-4 text-sm">
										<RefreshCcw className="text-primary" size={18} />
										<span>30-Day Spiritual Reflection Returns</span>
									</div>
									<div className="flex items-center gap-4 text-sm">
										<ShieldCheck className="text-primary" size={18} />
										<span>100% Authentic Edition Guarantee</span>
									</div>
								</div>
							</div>
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

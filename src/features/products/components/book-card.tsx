"use client";

import Image from "next/image";
import Link from "next/link";

import { Eye, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";

import { AddToCartButton } from "@/features/products/components/add-to-cart-button";
import { WishlistToggleButton } from "@/features/wishlist/components/wishlist-toggle-button";
import type { BookProps } from "@/lib/store";
import { cn } from "@/lib/utils";

export function BookCard({
	id,
	wixProductId,
	slug,
	title,
	author,
	price,
	image,
	category,
	badge,
}: BookProps) {
	const productHref = `/product/${slug ?? id}`;

	return (
		<div className="group relative">
			<Link className="absolute inset-0 z-10" href={productHref} />
			<div className="relative mb-4 aspect-3/4 overflow-hidden rounded-lg bg-stone-50">
				<Image
					alt={title}
					className="object-cover transition-transform duration-700 group-hover:scale-105"
					fill
					sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
					src={image}
				/>

				<div className="absolute top-4 right-4 z-20 flex flex-col gap-2 opacity-0 transition-opacity group-hover:opacity-100">
					<WishlistToggleButton
						className={cn(
							"size-9 rounded-full backdrop-blur-sm",
							"bg-white/80 text-stone-900 hover:bg-white"
						)}
						productId={wixProductId}
					/>

					<Dialog>
						<DialogTrigger
							render={
								<Button
									className="size-9 rounded-full bg-white/80 backdrop-blur-sm"
									size="icon"
									variant="ghost"
								/>
							}
						>
							<Eye size={16} strokeWidth={1.5} />
						</DialogTrigger>
						<DialogContent className="max-w-3xl">
							<div className="grid grid-cols-1 gap-8 pt-6 md:grid-cols-2">
								<div className="relative aspect-3/4 overflow-hidden bg-stone-50">
									<Image
										alt={title}
										className="object-cover"
										fill
										sizes="(max-width: 768px) 100vw, 400px"
										src={image}
									/>
								</div>
								<div className="flex flex-col justify-between py-4">
									<DialogHeader>
										<DialogDescription>{category}</DialogDescription>
										<DialogTitle className="mt-2 text-4xl">{title}</DialogTitle>
										<p className="mt-2 text-sm text-stone-400">{author}</p>
									</DialogHeader>

									<div className="space-y-6">
										<p className="font-black font-serif text-3xl text-primary">
											AED {price.toFixed(2)}
										</p>
										<p className="text-base text-stone-500 leading-relaxed">
											Experience the profound wisdom and timeless narrative of{" "}
											{title}. A curated masterpiece now available in the Rewaya
											collection.
										</p>
										<div className="flex gap-4">
											<AddToCartButton
												className="h-14 flex-1"
												disabled={!wixProductId}
												productId={wixProductId ?? ""}
												productName={title}
												variant="default"
											>
												Add to Bag
											</AddToCartButton>
											<WishlistToggleButton
												className="h-14 w-14 shrink-0 border"
												productId={wixProductId}
												size="md"
											/>
										</div>
									</div>
								</div>
							</div>
						</DialogContent>
					</Dialog>
				</div>

				<div className="absolute right-0 bottom-0 left-0 z-20 translate-y-full bg-primary transition-transform duration-300 group-hover:translate-y-0">
					<AddToCartButton
						className="h-auto w-full rounded-none p-6 text-white hover:text-white"
						disabled={!wixProductId}
						productId={wixProductId ?? ""}
						productName={title}
						variant="ghost"
					>
						<Plus className="mr-2" size={14} /> Add to Bag
					</AddToCartButton>
				</div>

				<div className="absolute top-4 left-0 z-10 flex flex-col items-start gap-1">
					{badge === "best seller" && (
						<span className="bg-secondary px-3 py-1 font-medium text-white text-xs shadow-md">
							Best Seller
						</span>
					)}
					{badge === "new arrival" && (
						<span className="bg-primary px-3 py-1 font-medium text-white text-xs shadow-md">
							New Arrival
						</span>
					)}
					{badge === "new seller" && (
						<span className="border-primary border-l-4 bg-stone-800 px-3 py-1 font-medium text-white text-xs shadow-md">
							New Seller
						</span>
					)}
					{price < 50 && !badge && (
						<span className="bg-primary px-3 py-1 font-medium text-white text-xs italic shadow-md">
							Special Offer
						</span>
					)}
				</div>
			</div>

			<div className="flex cursor-pointer flex-col gap-1 px-1">
				<div className="flex items-start justify-between gap-4">
					<h3 className="flex-1 font-semibold text-base text-primary leading-tight transition-colors">
						{title}
					</h3>
					<span className="whitespace-nowrap font-medium text-secondary text-sm">
						AED {price.toFixed(2)}
					</span>
				</div>
				<p className="font-medium text-sm text-stone-400">{author}</p>
			</div>
		</div>
	);
}

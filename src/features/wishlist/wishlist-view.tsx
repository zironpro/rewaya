"use client";

import Link from "next/link";

import { useAtom } from "jotai";
import { Heart, ShoppingBag } from "lucide-react";

import Breadcrumbs from "@/components/layout/Breadcrumbs";
import { Button } from "@/components/ui/button";

import { BookCard } from "@/features/products/components/book-card";
import { wishlistAtom } from "@/lib/store";

export const WishlistView = () => {
	const [wishlist] = useAtom(wishlistAtom);

	return (
		<main className="grow pt-20">
			{/* Header */}
			<section className="container mx-auto mb-12 px-6">
				<Breadcrumbs className="mb-8" items={[{ label: "Wishlist" }]} />
				<div className="text-center">
					<span className="mb-6 block font-bold text-sm text-stone-400">
						Your Collection
					</span>
					<h1 className="mb-8 font-black font-serif text-5xl md:text-7xl">
						Saved <span className="font-normal italic">Stories</span>.
					</h1>
				</div>
			</section>

			{/* Wishlist Grid */}
			<section className="container mx-auto mb-32 px-6">
				{wishlist.length > 0 ? (
					<div className="grid grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
						{wishlist.map((book) => (
							<BookCard key={book.id} {...book} />
						))}
					</div>
				) : (
					<div className="mx-auto max-w-lg rounded-[3rem] border border-stone-100 bg-white p-12 text-center shadow-soft md:p-20">
						<div className="mx-auto mb-8 flex size-24 items-center justify-center rounded-full bg-stone-50">
							<Heart className="text-stone-200" size={40} strokeWidth={1} />
						</div>
						<h2 className="mb-4 font-serif text-3xl">Your wishlist is empty</h2>
						<p className="mb-10 text-stone-500 leading-relaxed">
							Save your favorite books to your wishlist and they'll appear here.
							Start exploring our curated collection today.
						</p>
						<Link href="/shop">
							<Button className="h-14 px-10 text-base" variant="premium">
								<ShoppingBag className="mr-2" size={18} />
								Continue Shopping
							</Button>
						</Link>
					</div>
				)}
			</section>
		</main>
	);
};

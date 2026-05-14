"use client";

import React from "react";

import Image from "next/image";
import Link from "next/link";

import { useSetAtom } from "jotai";
import { Eye, Heart, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";

import { CartItem, cartAtom } from "@/lib/store";

export interface BookProps {
	id: number;
	title: string;
	author: string;
	price: number;
	image: string;
	category: string;
	badge?: "new seller" | "new arrival" | "best seller";
}

export default function BookCard({
	id,
	title,
	author,
	price,
	image,
	category,
	badge,
}: BookProps) {
	const setCart = useSetAtom(cartAtom);

	const addToBag = (e?: React.MouseEvent) => {
		if (e) e.stopPropagation();
		setCart((prev: CartItem[]) => {
			const existing = prev.find((item) => item.id === id);
			if (existing) {
				return prev.map((item) =>
					item.id === id ? { ...item, quantity: item.quantity + 1 } : item
				);
			}
			return [...prev, { id, title, author, price, image, quantity: 1 }];
		});
	};

	return (
		<Dialog>
			{/* Image Container */}
			<div className="book-shadow relative mb-4 aspect-3/4 overflow-hidden rounded-lg bg-stone-50">
				<Link className="relative block h-full w-full" href={`/product/${id}`}>
					<Image
						alt={title}
						className="object-cover transition-transform duration-700 group-hover:scale-105"
						fill
						sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
						src={image}
					/>
				</Link>

				{/* Icons Overlay */}
				<div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 transition-opacity group-hover:opacity-100">
					<Button
						className="h-9 w-9 rounded-full bg-white/80 backdrop-blur-sm"
						size="icon"
						variant="ghost"
					>
						<Heart size={16} strokeWidth={1.5} />
					</Button>
					<DialogTrigger
						render={
							<Button
								className="h-9 w-9 rounded-full bg-white/80 backdrop-blur-sm"
								size="icon"
								variant="ghost"
							/>
						}
					>
						<Eye size={16} strokeWidth={1.5} />
					</DialogTrigger>
				</div>

				{/* Quick Add (Bottom) */}
				<div className="absolute right-0 bottom-0 left-0 translate-y-full bg-primary p-4 transition-transform duration-300 group-hover:translate-y-0">
					<Button
						className="h-10 w-full text-white text-xm hover:bg-white/10"
						onClick={addToBag}
						variant="ghost"
					>
						<Plus className="mr-2" size={14} /> Add to Bag
					</Button>
				</div>

				{/* Status Badges */}
				<div className="absolute top-4 left-0 z-10 flex flex-col items-start gap-1">
					{badge === "best seller" && (
						<span className="bg-secondary px-3 py-1.5 font-bold text-white text-xm shadow-lg">
							Best Seller
						</span>
					)}
					{badge === "new arrival" && (
						<span className="bg-primary px-3 py-1.5 font-bold text-white text-xm shadow-lg">
							New Arrival
						</span>
					)}
					{badge === "new seller" && (
						<span className="border-primary border-l-4 bg-stone-800 px-3 py-1.5 font-bold text-white text-xm shadow-lg">
							New Seller
						</span>
					)}
					{price < 50 && !badge && (
						<span className="bg-primary px-3 py-1.5 font-bold text-white text-xm italic shadow-lg">
							Special Offer
						</span>
					)}
				</div>
			</div>

			{/* Info Container */}
			<Link
				className="flex cursor-pointer flex-col gap-1 px-1"
				href={`/product/${id}`}
			>
				<div className="flex items-start justify-between gap-4">
					<h3 className="flex-1 font-bold text-base text-primary leading-tight transition-colors">
						{title}
					</h3>
					<span className="whitespace-nowrap font-bold text-base text-primary">
						AED {price.toFixed(2)}
					</span>
				</div>
				<p className="font-medium text-sm text-stone-400">{author}</p>
			</Link>

			{/* Quick View Dialog Content */}
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
								Experience the profound wisdom and timeless narrative of {title}
								. A curated masterpiece now available in the Rewaya collection.
							</p>
							<div className="flex gap-4">
								<Button
									className="h-14 flex-1"
									onClick={() => addToBag()}
									variant="premium"
								>
									Add to Bag
								</Button>
								<Button className="h-14 w-14" size="icon" variant="outline">
									<Heart size={20} strokeWidth={1.5} />
								</Button>
							</div>
						</div>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}

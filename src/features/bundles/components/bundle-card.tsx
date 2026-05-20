"use client";

import Image from "next/image";
import Link from "next/link";

import { Eye, Heart, Plus } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";

import type { Bundle } from "@/lib/bundles-data";

export function BundleCard({
	id,
	title,
	count,
	price,
	originalPrice,
	mainImage,
	tag,
}: Bundle) {
	return (
		<div className="group relative">
			<Link className="absolute inset-0 z-10" href={`/bundles/${id}`} />

			<div className="book-shadow relative mb-4 aspect-4/5 w-full overflow-hidden rounded-lg bg-stone-50 sm:aspect-3/4">
				<Image
					alt={title}
					className="object-cover transition-transform duration-700 group-hover:scale-105"
					fill
					sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
					src={mainImage}
				/>

				<div className="absolute top-4 right-4 z-10 flex flex-col gap-2 opacity-0 transition-opacity group-hover:opacity-100">
					<Button
						className="size-9 rounded-full bg-white/80 backdrop-blur-sm"
						size="icon"
						variant="ghost"
					>
						<Heart size={16} strokeWidth={1.5} />
					</Button>

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
						<BundleQuickViewDialog
							count={count}
							mainImage={mainImage}
							originalPrice={originalPrice}
							price={price}
							title={title}
						/>
					</Dialog>
				</div>

				<div className="absolute right-0 bottom-0 left-0 z-10 translate-y-full bg-primary transition-transform duration-300 group-hover:translate-y-0">
					<Button
						className="w-full p-6 text-white hover:text-white hover:brightness-125"
						variant="ghost"
					>
						<Plus className="mr-2" size={14} /> Add to Bag
					</Button>
				</div>

				<div className="absolute top-4 left-4 z-10 flex flex-wrap items-start gap-3">
					{tag && <Badge size="lg">{tag}</Badge>}
					<Badge size="lg" variant="outline">
						{count} Book Set
					</Badge>
				</div>
			</div>

			<div className="relative z-0 flex cursor-pointer flex-col gap-1 px-1">
				<div className="flex items-start justify-between gap-4">
					<h3 className="line-clamp-2 min-h-10 flex-1 font-semibold text-base text-primary leading-tight sm:text-lg">
						{title}
					</h3>
					<div className="flex flex-col items-end">
						<span className="whitespace-nowrap font-bold text-primary text-sm">
							AED {price.toFixed(2)}
						</span>
						<span className="text-sm text-stone-300 line-through">
							AED {originalPrice.toFixed(2)}
						</span>
					</div>
				</div>
				{/* <p className="flex items-center gap-2 text-sm text-stone-500">
					<Package size={11} /> {count} Volumes Collection
				</p> */}
			</div>
		</div>
	);
}

type BundleQuickViewDialogProps = Pick<
	Bundle,
	"title" | "count" | "price" | "originalPrice" | "mainImage"
>;

function BundleQuickViewDialog({
	title,
	count,
	price,
	originalPrice,
	mainImage,
}: BundleQuickViewDialogProps) {
	return (
		<DialogContent className="max-w-3xl">
			<div className="grid grid-cols-1 gap-8 pt-6 md:grid-cols-2">
				<div className="relative aspect-4/5 w-full overflow-hidden bg-stone-50 sm:aspect-3/4">
					<Image
						alt={title}
						className="object-cover"
						fill
						sizes="(max-width: 768px) 100vw, 400px"
						src={mainImage}
					/>
				</div>
				<div className="flex flex-col justify-between py-4">
					<DialogHeader>
						<DialogDescription>Bundle Collection</DialogDescription>
						<DialogTitle className="mt-2 text-4xl">{title}</DialogTitle>
						<p className="mt-2 text-sm text-stone-400">
							Exclusive {count}-Book Anthology
						</p>
					</DialogHeader>

					<div className="space-y-6">
						<div className="flex items-baseline gap-4">
							<p className="font-bold font-serif text-3xl text-primary">
								AED {price.toFixed(2)}
							</p>
							<p className="text-lg text-stone-300 line-through">
								AED {originalPrice.toFixed(2)}
							</p>
						</div>
						<p className="text-base text-stone-500 leading-relaxed">
							Experience the full spectrum of this curated theme. This bundle
							includes {count} essential volumes carefully selected to provide a
							comprehensive journey through {title}.
						</p>
						<div className="flex gap-4">
							<Button className="h-14 flex-1" variant="premium">
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
	);
}

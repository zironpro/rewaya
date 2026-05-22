import Image from "next/image";
import Link from "next/link";

import { Tag } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Tooltip, TooltipPopup, TooltipTrigger } from "@/components/ui/tooltip";

import type { Bundle } from "@/lib/bundles-data";

interface BundleSetCardProps {
	bundle: Bundle;
}

export function BundleSetCard({ bundle }: BundleSetCardProps) {
	const stackImages = [
		bundle.books[2]?.image,
		bundle.books[1]?.image,
		bundle.coverImage,
	].filter(Boolean) as string[];

	return (
		<div className="group relative flex cursor-pointer flex-col items-center gap-12 rounded-sm border bg-card p-6 transition-all duration-500 hover:border-gold sm:flex-row md:p-9">
			<Link className="absolute inset-0" href={`/bundles/${bundle.id}`} />
			<div className="relative mb-6 flex w-full max-w-xs shrink-0 items-end justify-center gap-3 sm:mb-0 sm:block sm:aspect-4/5 sm:w-32 sm:max-w-none md:w-48">
				{stackImages[0] && (
					<div className="relative aspect-4/5 w-20 shrink-0 -rotate-6 overflow-hidden rounded-sm border border-stone-100 bg-stone-200 shadow-md transition-transform duration-500 sm:absolute sm:inset-0 sm:w-auto sm:translate-x-[-15px] sm:-rotate-12 sm:transform group-hover:sm:-rotate-15">
						<Image
							alt=""
							className="object-cover opacity-60"
							fill
							sizes="(max-width: 640px) 80px, 128px"
							src={stackImages[0]}
						/>
					</div>
				)}

				{stackImages[1] && (
					<div className="relative aspect-4/5 w-20 shrink-0 rotate-3 overflow-hidden rounded-sm border border-stone-200 bg-stone-100 shadow-lg transition-transform duration-500 sm:absolute sm:inset-0 sm:w-auto sm:translate-x-[15px] sm:rotate-6 sm:transform group-hover:sm:rotate-12">
						<Image
							alt=""
							className="object-cover opacity-80"
							fill
							sizes="(max-width: 640px) 80px, 128px"
							src={stackImages[1]}
						/>
					</div>
				)}
				<div className="relative aspect-4/5 w-20 shrink-0 overflow-hidden rounded-sm border border-stone-300 bg-white shadow-sm transition-transform duration-500 sm:absolute sm:inset-0 sm:w-auto sm:rotate-0 sm:transform group-hover:sm:-translate-y-2">
					<Image
						alt={bundle.title}
						className="object-cover"
						fill
						sizes="(max-width: 640px) 80px, 128px"
						src={stackImages[2] ?? bundle.coverImage}
					/>
				</div>

				<Tooltip>
					<TooltipTrigger
						render={
							<span className="absolute -top-3 -right-3 z-20 flex size-8 flex-col items-center justify-center rounded-full border-2 border-white bg-primary text-white shadow-md" />
						}
					>
						<span className="-translate-y-0.5 font-bold font-display text-sm leading-none">
							{bundle.books.length}
						</span>
					</TooltipTrigger>
					<TooltipPopup>{bundle.books.length} Books sets</TooltipPopup>
				</Tooltip>
			</div>
			<div className="flex h-full grow flex-col justify-between">
				<div>
					{bundle.tag && (
						<p className="mb-3 flex w-fit items-center gap-1.5 rounded bg-card px-1.5 py-1 font-medium text-primary text-xs uppercase">
							<Tag size={12} />
							{bundle.tag}
						</p>
					)}
					<h3 className="mb-2 font-semibold font-serif text-secondary text-xl transition-colors group-hover:text-primary sm:text-2xl md:text-3xl">
						{bundle.title}
					</h3>
					<p className="mb-6 line-clamp-2 font-medium text-muted-foreground">
						{bundle.books.map((book) => book.title).join(", ")}
					</p>
				</div>
				<div className="flex items-center justify-between">
					<div>
						<span className="mr-2 font-medium text-muted-foreground/60 line-through">
							AED {bundle.originalPrice.toFixed(2)}
						</span>
						<span className="font-bold text-lg text-secondary">
							AED {bundle.price.toFixed(2)}
						</span>
					</div>
					<Button>Buy Set</Button>
				</div>
			</div>
		</div>
	);
}

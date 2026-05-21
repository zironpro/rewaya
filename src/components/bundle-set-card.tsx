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
		<div className="group relative flex cursor-pointer flex-col items-center gap-12 rounded-sm border bg-muted p-6 transition-all duration-500 hover:border-primary sm:flex-row md:p-9">
			<Link className="absolute inset-0" href={`/bundles/${bundle.id}`} />
			<div className="relative mb-6 aspect-4/5 w-32 shrink-0 sm:mb-0 md:w-48">
				{stackImages[0] && (
					<div className="absolute inset-0 translate-x-[-15px] -rotate-12 transform overflow-hidden rounded-sm border border-stone-100 bg-stone-200 shadow-lg transition-transform duration-500 group-hover:-rotate-15">
						<Image
							alt=""
							className="object-cover opacity-60"
							fill
							sizes="128px"
							src={stackImages[0]}
						/>
					</div>
				)}

				{stackImages[1] && (
					<div className="absolute inset-0 translate-x-[15px] rotate-6 transform overflow-hidden rounded-sm border border-stone-200 bg-stone-100 shadow-xl transition-transform duration-500 group-hover:rotate-12">
						<Image
							alt=""
							className="object-cover opacity-80"
							fill
							sizes="128px"
							src={stackImages[1]}
						/>
					</div>
				)}
				<div className="absolute inset-0 rotate-0 transform overflow-hidden rounded-sm border border-stone-300 bg-white shadow-2xl transition-transform duration-500 group-hover:-translate-y-2">
					<Image
						alt={bundle.title}
						className="object-cover"
						fill
						sizes="128px"
						src={stackImages[2] ?? bundle.coverImage}
					/>
				</div>

				<Tooltip>
					<TooltipTrigger
						render={
							<span className="absolute -top-3 -right-3 z-20 flex size-8 flex-col items-center justify-center rounded-full border-2 border-white bg-primary text-white shadow-lg" />
						}
					>
						<span className="font-bold text-xs leading-none">
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

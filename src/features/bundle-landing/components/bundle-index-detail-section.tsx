"use client";

import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/utils";

import type { BundleData } from "../types/bundle";
import { BundlesCampaignActions } from "./bundles-campaign-actions";

interface BundleIndexDetailSectionProps {
	bundle: BundleData;
	featuredSlug: string;
	index: number;
}

function BookRow({
	book,
	index: bookIndex,
}: {
	book: BundleData["books"][number];
	index: number;
}) {
	return (
		<div className="grid items-center gap-4 rounded-xl border border-border bg-card p-4 md:grid-cols-[8rem_minmax(0,1fr)] md:p-5">
			<div className="relative mx-auto aspect-4/5 w-28 overflow-hidden rounded-md book-shadow md:mx-0 md:w-full">
				<Image
					alt={book.title}
					className="object-contain"
					fill
					sizes="120px"
					src={book.coverUrl}
				/>
			</div>
			<div>
				<p className="font-medium text-gold text-xs uppercase tracking-wider">
					Volume {String(bookIndex + 1).padStart(2, "0")}
				</p>
				<h4 className="mt-1 font-bold font-display text-lg text-secondary md:text-xl">
					{book.title}
				</h4>
				<p className="mt-1 text-muted-foreground text-sm">{book.author}</p>
				<p className="mt-2 text-muted-foreground text-sm leading-relaxed">
					{book.description}
				</p>
			</div>
		</div>
	);
}

export function BundleIndexDetailSection({
	bundle,
	featuredSlug,
	index,
}: BundleIndexDetailSectionProps) {
	const reversed = index % 2 === 1;

	return (
		<section
			className="scroll-mt-24 border-border/40 border-t py-14 md:py-20"
			id={`bundle-${bundle.slug}`}
		>
			<div className="container">
				<div
					className={cn(
						"grid items-start gap-10 lg:grid-cols-2 lg:gap-16",
						reversed && "lg:[&>div:first-child]:order-2"
					)}
				>
					<div>
						<p className="font-medium text-primary text-xs uppercase tracking-[0.2em]">
							Bundle details
						</p>
						<h2 className="mt-2 font-bold font-display text-2xl text-secondary md:text-3xl">
							{bundle.name}
						</h2>
						<p className="mt-2 text-muted-foreground">{bundle.tagline}</p>
						<p className="mt-4 text-muted-foreground text-sm leading-relaxed">
							{bundle.description}
						</p>
						<p className="mt-4 font-medium text-secondary text-sm">
							Lock in this bundle price before the offer ends.
						</p>
						<div className="mt-4 font-bold text-primary text-xl">
							AED {bundle.price}
							<span className="ml-2 font-normal text-muted-foreground text-base line-through">
								AED {bundle.originalPrice}
							</span>
						</div>
						<div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
							<BundlesCampaignActions
								bundle={bundle}
								buyLabel={`Buy ${bundle.name} now`}
								featuredSlug={featuredSlug}
								variant="buy-bundle"
							/>
							<Link
								className="text-center font-medium text-primary text-sm hover:underline sm:text-left"
								href={`/bundle/${bundle.slug}`}
							>
								Full bundle page →
							</Link>
						</div>
					</div>

					<div className="relative aspect-5/3 overflow-hidden rounded-2xl book-shadow">
						<Image
							alt={bundle.name}
							className="object-cover"
							fill
							sizes="(max-width: 1024px) 100vw, 45vw"
							src={bundle.coverImage}
						/>
					</div>
				</div>

				<div className="mt-12">
					<h3 className="font-display text-secondary text-xl">
						Title by title
					</h3>
					<p className="mt-1 text-muted-foreground text-sm">
						Everything included in this set.
					</p>
					<div className="mt-6 flex flex-col gap-3">
						{bundle.books.map((book, bookIndex) => (
							<BookRow book={book} index={bookIndex} key={book.id} />
						))}
					</div>
				</div>
			</div>
		</section>
	);
}

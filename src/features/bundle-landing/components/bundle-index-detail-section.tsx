"use client";

import Image from "next/image";
import Link from "next/link";

import { ArrowUpRight, BookOpen } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

import { CurrencyIcon } from "@/assets/icons/currency";

import { cn } from "@/lib/utils";

import type { BundleData } from "../types/bundle";
import { BundlesCampaignActions } from "./bundles-campaign-actions";

interface BundleIndexDetailSectionProps {
	bundle: BundleData;
	featuredSlug: string;
	index: number;
}

function CompactBookTile({
	book,
	index: bookIndex,
}: {
	book: BundleData["books"][number];
	index: number;
}) {
	return (
		<li className="w-[min(100%,220px)] shrink-0 snap-start sm:w-[240px] lg:w-full">
			<div className="group flex gap-3 rounded-xl border border-border/80 bg-card/80 p-3 transition-colors hover:border-primary/30 hover:bg-card">
				<div className="book-shadow relative aspect-3/4 w-14 shrink-0 overflow-hidden rounded-md">
					<Image
						alt={book.title}
						className="object-cover"
						fill
						sizes="56px"
						src={book.coverUrl}
					/>
				</div>
				<div className="min-w-0 flex-1">
					<p className="font-medium text-[0.65rem] text-gold uppercase tracking-wider">
						Vol. {String(bookIndex + 1).padStart(2, "0")}
					</p>
					<h4 className="mt-0.5 line-clamp-2 font-display font-semibold text-secondary text-sm leading-snug">
						{book.title}
					</h4>
					<p className="mt-0.5 truncate text-muted-foreground text-xs">
						{book.author}
					</p>
				</div>
			</div>
		</li>
	);
}

function StickyBundleCard({
	bundle,
	featuredSlug,
	reversed,
}: {
	bundle: BundleData;
	featuredSlug: string;
	reversed: boolean;
}) {
	const stackCovers = bundle.books
		.slice(0, 3)
		.map((b) => b.coverUrl)
		.reverse();

	return (
		<aside
			className={cn(
				"lg:w-[min(100%,20rem)] lg:shrink-0",
				reversed ? "lg:order-first" : "lg:order-last"
			)}
		>
			<div className="book-shadow lg:sticky lg:top-28">
				<article className="overflow-hidden rounded-2xl border border-border bg-card">
					<div className="relative aspect-5/2 overflow-hidden">
						<Image
							alt={bundle.name}
							className="object-cover"
							fill
							priority={false}
							sizes="320px"
							src={bundle.coverImage}
						/>
						<div className="absolute inset-0 bg-linear-to-t from-card via-card/20 to-transparent" />
						{stackCovers.length > 0 && (
							<div className="absolute right-4 bottom-3 flex items-end">
								{stackCovers.map((src, i) => (
									<div
										className="book-shadow relative -ml-3 aspect-3/4 w-10 overflow-hidden rounded-sm border border-background first:ml-0"
										key={src}
										style={{
											transform: `rotate(${(i - 1) * 8}deg) translateY(${i * -2}px)`,
											zIndex: i + 1,
										}}
									>
										<Image
											alt=""
											className="object-cover"
											fill
											sizes="40px"
											src={src}
										/>
									</div>
								))}
							</div>
						)}
					</div>

					<div className="relative -mt-6 space-y-4 px-5 pb-5">
						<div>
							<Badge size="sm" variant="success">
								Save AED {bundle.savingsAmount}
							</Badge>
							<h2 className="mt-2 font-bold font-display text-secondary text-xl leading-tight">
								{bundle.name}
							</h2>
							<p className="mt-1 line-clamp-2 text-muted-foreground text-sm">
								{bundle.tagline}
							</p>
						</div>

						<p className="line-clamp-3 text-muted-foreground text-xs leading-relaxed">
							{bundle.description}
						</p>

						<Separator />

						<div className="flex items-end justify-between gap-3">
							<div>
								<p className="text-[0.65rem] text-muted-foreground uppercase tracking-wider">
									Bundle price
								</p>
								<div className="mt-0.5 flex items-baseline gap-2">
									<span className="font-black font-display text-2xl text-primary">
										AED {bundle.price}
									</span>
									<span className="relative flex items-center gap-0.5 text-muted-foreground/70 text-sm">
										<CurrencyIcon className="size-3" />
										{bundle.originalPrice}
										<span className="absolute top-1/2 left-0 h-px w-full -translate-y-1/2 bg-muted-foreground/50" />
									</span>
								</div>
							</div>
							<div className="flex shrink-0 flex-col items-center gap-0.5 rounded-lg border border-border bg-muted/40 px-2.5 py-1.5">
								<BookOpen aria-hidden className="size-3.5 text-primary" />
								<span className="font-bold text-secondary text-xs leading-none">
									{bundle.books.length}
								</span>
								<span className="text-[0.6rem] text-muted-foreground uppercase">
									books
								</span>
							</div>
						</div>

						<div className="flex flex-col gap-2">
							<BundlesCampaignActions
								bundle={bundle}
								buttonSize="default"
								buyLabel={`Get ${bundle.name}`}
								featuredSlug={featuredSlug}
								variant="buy-bundle"
							/>
							<Link
								className="inline-flex items-center justify-center gap-1 font-medium text-primary text-xs hover:underline"
								href={`/bundle/${bundle.slug}`}
							>
								Full bundle page
								<ArrowUpRight className="size-3" />
							</Link>
						</div>
					</div>
				</article>
			</div>
		</aside>
	);
}

export function BundleIndexDetailSection({
	bundle,
	featuredSlug,
	index,
}: BundleIndexDetailSectionProps) {
	const reversed = index % 2 === 1;
	const sectionNum = String(index + 1).padStart(2, "0");

	return (
		<section
			className="scroll-mt-24 border-border/30 border-t py-8 md:py-10"
			id={`bundle-${bundle.slug}`}
		>
			<div className="container">
				<div
					className={cn(
						"flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-8",
						reversed && "lg:flex-row-reverse"
					)}
				>
					<div className="min-w-0 flex-1 lg:py-1">
						<div className="mb-4 flex items-start justify-between gap-4">
							<div>
								<p className="font-medium text-[0.65rem] text-primary uppercase tracking-[0.2em]">
									Set {sectionNum}
								</p>
								<h3 className="mt-1 font-display font-semibold text-lg text-secondary">
									What&apos;s inside
								</h3>
								<p className="mt-0.5 text-muted-foreground text-sm">
									{bundle.books.length} titles · swipe on mobile
								</p>
							</div>
							<span className="hidden rounded-full border border-border bg-muted/40 px-3 py-1 font-medium text-muted-foreground text-xs sm:inline-block">
								{bundle.books.length} books
							</span>
						</div>

						<ul
							className={cn(
								"scrollbar-thin -mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-smooth px-4 pb-1",
								"lg:mx-0 lg:flex-col lg:gap-2 lg:overflow-visible lg:px-0 lg:pb-0"
							)}
						>
							{bundle.books.map((book, bookIndex) => (
								<CompactBookTile book={book} index={bookIndex} key={book.id} />
							))}
						</ul>
					</div>

					<StickyBundleCard
						bundle={bundle}
						featuredSlug={featuredSlug}
						reversed={reversed}
					/>
				</div>
			</div>
		</section>
	);
}

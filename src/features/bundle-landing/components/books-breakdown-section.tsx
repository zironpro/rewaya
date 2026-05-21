"use client";

import Image from "next/image";

import { cn } from "@/lib/utils";

import { useFadeRise } from "../hooks/useFadeRise";
import type { BundleData } from "../types/bundle";

interface BooksBreakdownSectionProps {
	bundle: BundleData;
}

function BookRow({
	book,
	index,
}: {
	book: BundleData["books"][number];
	index: number;
}) {
	const { ref, visible } = useFadeRise<HTMLDivElement>();
	const delayClass =
		index % 4 === 0
			? ""
			: index % 4 === 1
				? "fade-rise-delay-1"
				: index % 4 === 2
					? "fade-rise-delay-2"
					: "fade-rise-delay-3";

	return (
		<div
			className={cn(
				"fade-rise grid gap-6 border-gold/10 border-b py-10 md:grid-cols-[120px_minmax(0,1fr)]",
				delayClass,
				visible && "is-visible"
			)}
			ref={ref}
		>
			<div className="relative mx-auto aspect-[2/3] w-24 overflow-hidden rounded-sm shadow md:mx-0 md:w-full">
				<Image
					alt={book.title}
					className="object-cover"
					fill
					sizes="120px"
					src={book.coverUrl}
				/>
			</div>
			<div>
				<p className="font-medium text-gold text-xs uppercase tracking-wider">
					Volume {(index + 1).toString().padStart(2, "0")}
				</p>
				<h3 className="mt-1 font-display text-[var(--bundle-ink)] text-xl">
					{book.title}
				</h3>
				<p className="mt-1 text-[var(--bundle-muted)] text-sm">{book.author}</p>
				<p className="mt-3 line-clamp-3 text-[var(--bundle-ink)]/90 text-sm leading-relaxed md:line-clamp-none md:text-base">
					{book.description}
				</p>
			</div>
		</div>
	);
}

export function BooksBreakdownSection({ bundle }: BooksBreakdownSectionProps) {
	return (
		<section className="bg-[#f3ece4]/55 py-14 md:py-20">
			<div className="mx-auto max-w-6xl px-4 sm:px-6">
				<h2 className="font-display text-2xl text-[var(--bundle-ink)] tracking-tight md:text-3xl">
					Title by title
				</h2>
				<p className="mt-2 max-w-2xl text-[var(--bundle-muted)]">
					A quick tour of what you are bringing home — no spoilers, just why
					each book earned its place.
				</p>
				<div className="mt-4">
					{bundle.books.map((book, index) => (
						<BookRow book={book} index={index} key={book.id} />
					))}
				</div>
			</div>
		</section>
	);
}

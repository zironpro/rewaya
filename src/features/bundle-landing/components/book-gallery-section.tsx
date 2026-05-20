"use client";

import Image from "next/image";

import type { BundleData } from "../types/bundle";

interface BookGallerySectionProps {
	bundle: BundleData;
}

export function BookGallerySection({ bundle }: BookGallerySectionProps) {
	return (
		<section className="border-[var(--bundle-gold)]/15 border-y bg-white/40 py-12 md:py-16">
			<div className="mx-auto max-w-6xl px-4 sm:px-6">
				<h2 className="font-display text-2xl text-[var(--bundle-ink)] tracking-tight md:text-3xl">
					Inside the bundle
				</h2>
				<p className="mt-2 max-w-2xl font-[family-name:var(--font-editorial)] text-[var(--bundle-muted)]">
					Five physical volumes — mix of seerah, remembrance, reflection, and
					habits — chosen to read well together.
				</p>

				<div className="mt-8 md:hidden">
					<div className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2">
						{bundle.books.map((book) => (
							<div
								className="w-[42vw] shrink-0 snap-center sm:w-[200px]"
								key={book.id}
							>
								<div className="relative aspect-[2/3] overflow-hidden rounded-sm shadow-md">
									<Image
										alt={book.title}
										className="object-cover"
										fill
										sizes="42vw"
										src={book.coverUrl}
									/>
								</div>
								<p className="mt-2 font-[family-name:var(--font-body)] font-semibold text-[var(--bundle-ink)] text-xs">
									{book.title}
								</p>
							</div>
						))}
					</div>
				</div>

				<div className="mt-8 hidden gap-6 md:grid md:grid-cols-5">
					{bundle.books.map((book) => (
						<div key={book.id}>
							<div className="relative aspect-[2/3] overflow-hidden rounded-sm shadow-md">
								<Image
									alt={book.title}
									className="object-cover"
									fill
									sizes="(max-width: 1200px) 18vw, 200px"
									src={book.coverUrl}
								/>
							</div>
							<p className="mt-2 font-[family-name:var(--font-body)] font-semibold text-[var(--bundle-ink)] text-xs leading-snug">
								{book.title}
							</p>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}

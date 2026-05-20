"use client";

import { Star } from "lucide-react";

import type { BundleData } from "../types/bundle";

interface SocialProofSectionProps {
	bundle: BundleData;
}

export function SocialProofSection({ bundle }: SocialProofSectionProps) {
	const doubled = [...bundle.reviews, ...bundle.reviews];

	return (
		<section className="py-14 md:py-16">
			<div className="mx-auto max-w-6xl px-4 sm:px-6">
				<h2 className="font-display text-2xl text-[var(--bundle-ink)] tracking-tight md:text-3xl">
					Readers are stacking it
				</h2>
				<p className="mt-2 font-[family-name:var(--font-editorial)] text-[var(--bundle-muted)]">
					Early feedback from UAE customers who picked up curated bundles.
				</p>

				<div className="mt-8 md:hidden">
					<div className="-mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2">
						{bundle.reviews.map((r) => (
							<figure
								className="w-[min(88vw,360px)] shrink-0 snap-center rounded-lg border border-[var(--bundle-gold)]/15 bg-white/70 p-5 shadow-sm"
								key={r.id}
							>
								<div className="flex gap-0.5 text-[var(--bundle-gold)]">
									{Array.from({ length: r.rating }).map((_, i) => (
										<Star className="size-3.5 fill-current" key={Number(i)} />
									))}
								</div>
								<blockquote className="mt-3 font-[family-name:var(--font-editorial)] text-[var(--bundle-ink)] text-sm leading-relaxed">
									“{r.quote}”
								</blockquote>
								<figcaption className="mt-3 font-[family-name:var(--font-body)] text-[var(--bundle-muted)] text-xs">
									{r.name} · {r.location}
								</figcaption>
							</figure>
						))}
					</div>
				</div>

				<div className="marquee-wrap mt-8 hidden md:block">
					<div className="marquee-track gap-6 pr-6">
						{doubled.map((r, idx) => (
							<figure
								className="w-[340px] shrink-0 rounded-lg border border-[var(--bundle-gold)]/15 bg-white/70 p-6 shadow-sm"
								key={`${r.id}-${Number(idx)}`}
							>
								<div className="flex gap-0.5 text-[var(--bundle-gold)]">
									{Array.from({ length: r.rating }).map((_, i) => (
										<Star className="size-4 fill-current" key={Number(i)} />
									))}
								</div>
								<blockquote className="mt-3 font-[family-name:var(--font-editorial)] text-[var(--bundle-ink)] text-sm leading-relaxed">
									“{r.quote}”
								</blockquote>
								<figcaption className="mt-4 font-[family-name:var(--font-body)] text-[var(--bundle-muted)] text-xs">
									{r.name} · {r.location}
								</figcaption>
							</figure>
						))}
					</div>
				</div>
			</div>
		</section>
	);
}

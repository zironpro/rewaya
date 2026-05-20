"use client";

import Image from "next/image";
import Link from "next/link";

import type { BundleData } from "../types/bundle";

interface RelatedBundlesSectionProps {
	bundle: BundleData;
}

export function RelatedBundlesSection({ bundle }: RelatedBundlesSectionProps) {
	return (
		<section className="border-[var(--bundle-gold)]/15 border-t bg-white/35 py-14 md:py-16">
			<div className="mx-auto max-w-6xl px-4 sm:px-6">
				<h2 className="font-display text-2xl text-[var(--bundle-ink)] tracking-tight md:text-3xl">
					You may also like
				</h2>
				<p className="mt-2 font-[family-name:var(--font-editorial)] text-[var(--bundle-muted)]">
					Explore more ready-made stacks on the main bundles page.
				</p>
				<div className="mt-8 grid gap-6 sm:grid-cols-2">
					{bundle.relatedBundles.map((rel) => (
						<Link
							className="group flex overflow-hidden rounded-lg border border-[var(--bundle-gold)]/20 bg-white/80 shadow-sm transition hover:border-[var(--bundle-gold)]/50"
							href={rel.href}
							key={rel.name}
						>
							<div className="relative h-full w-32 shrink-0 sm:w-40">
								<Image
									alt=""
									className="object-cover transition duration-500 group-hover:scale-105"
									fill
									sizes="160px"
									src={rel.imageUrl}
								/>
							</div>
							<div className="flex flex-1 flex-col justify-center p-4">
								{rel.tag ? (
									<span className="font-[family-name:var(--font-body)] font-semibold text-[10px] text-[var(--bundle-gold)] uppercase tracking-wider">
										{rel.tag}
									</span>
								) : null}
								<p className="mt-1 font-display text-[var(--bundle-ink)] text-lg">
									{rel.name}
								</p>
								<p className="mt-2 font-[family-name:var(--font-body)] text-[var(--bundle-muted)] text-sm">
									<span className="font-semibold text-[var(--bundle-ink)]">
										AED {rel.price}
									</span>{" "}
									<span className="line-through">AED {rel.originalPrice}</span>
								</p>
							</div>
						</Link>
					))}
				</div>
			</div>
		</section>
	);
}

"use client";

import { forwardRef } from "react";

import Image from "next/image";

import { cn } from "@/lib/utils";

import type { BundleData } from "../types/bundle";
import { CountdownTimer } from "./countdown-timer";

interface HeroSectionProps {
	bundle: BundleData;
	/** After mount, reveals fade-rise blocks (avoids SSR/hydration issues). */
	revealed: boolean;
}

export const HeroSection = forwardRef<HTMLElement, HeroSectionProps>(
	function HeroSection({ bundle, revealed }, ref) {
		const rotations = [
			"-rotate-6",
			"rotate-3",
			"-rotate-2",
			"rotate-6",
			"-rotate-3",
		];
		const lead = bundle.books[0];
		const mosaic = bundle.books.slice(0, 5);

		return (
			<section
				className="relative min-h-[calc(100svh-(--spacing(16)))] overflow-hidden"
				ref={ref}
			>
				<div
					aria-hidden
					className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(44,36,28,0.06)_0%,transparent_55%)]"
				/>

				<div className="relative z-1 mx-auto grid max-w-6xl grid-cols-1 gap-8 px-4 pt-10 pb-16 md:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] md:items-center md:gap-12 md:px-8 md:pt-16 md:pb-20">
					<div className="order-2 flex flex-col justify-center md:order-1">
						<p
							className={cn(
								"fade-rise fade-rise-delay-1 font-medium text-(--bundle-muted) text-xs uppercase tracking-[0.2em]",
								revealed && "is-visible"
							)}
						>
							Limited bundle
						</p>
						<h1
							className={cn(
								"fade-rise fade-rise-delay-2 mt-3 font-display text-(--bundle-ink) text-[clamp(2rem,5vw,3.25rem)] leading-[1.08] tracking-tight",
								revealed && "is-visible"
							)}
						>
							{bundle.name}
						</h1>
						<p
							className={cn(
								"fade-rise fade-rise-delay-3 font-(family-name:--font-editorial) mt-4 max-w-xl text-(--bundle-muted) text-base leading-relaxed sm:text-lg",
								revealed && "is-visible"
							)}
						>
							{bundle.tagline}
						</p>
						<div
							className={cn(
								"fade-rise fade-rise-delay-4 mt-6 flex flex-wrap items-center gap-4",
								revealed && "is-visible"
							)}
						>
							<div className="flex items-baseline gap-2">
								<span className="font-display font-semibold text-3xl text-[var(--bundle-ink)]">
									AED {bundle.price}
								</span>
								<span className="text-[var(--bundle-muted)] text-lg line-through">
									{bundle.originalPrice}
								</span>
							</div>
							<span className="rounded-full border border-[var(--bundle-gold)]/40 bg-white/60 px-3 py-1 font-medium text-[var(--bundle-ink)] text-xs">
								Save AED {bundle.savingsAmount}
							</span>
						</div>
						<div
							className={cn(
								"fade-rise fade-rise-delay-4 mt-6 max-w-md",
								revealed && "is-visible"
							)}
						>
							<CountdownTimer slug={bundle.slug} />
						</div>
					</div>

					<div className="order-1 flex min-h-[40vh] items-center justify-center md:order-2 md:min-h-0">
						<div className="relative mx-auto aspect-4/5 w-full max-w-[320px] sm:max-w-[380px] md:max-w-none">
							<div className="absolute inset-0 flex items-center justify-center">
								{mosaic.map((book, i) => {
									const isLead = book.id === lead?.id;
									const zLayers = [
										"z-[12]",
										"z-[11]",
										"z-[10]",
										"z-[9]",
										"z-[8]",
									] as const;
									const z = isLead ? "z-20" : (zLayers[i] ?? "z-[8]");
									const offset =
										i === 0
											? "translate-x-0 translate-y-0"
											: i === 1
												? "translate-x-[18%] -translate-y-[6%]"
												: i === 2
													? "-translate-x-[20%] translate-y-[8%]"
													: i === 3
														? "translate-x-[12%] translate-y-[22%]"
														: "-translate-x-[8%] -translate-y-[18%]";
									return (
										<div
											className={`absolute ${offset} ${rotations[i] ?? ""} ${z} w-[46%] max-w-[180px] shadow-[0_18px_40px_-12px_rgba(44,36,28,0.45)] transition-transform duration-500 hover:z-30 hover:scale-[1.02]`}
											key={book.id}
										>
											<div
												className={`relative aspect-2/3 overflow-hidden rounded-sm bg-neutral-200 ${isLead ? "ring-(--bundle-gold) ring-2 ring-offset-2 ring-offset-[#FBF6EE]" : ""}`}
											>
												<Image
													alt={book.title}
													className="object-cover"
													fill
													priority={i < 2}
													sizes="(max-width: 768px) 45vw, 200px"
													src={book.coverUrl}
												/>
											</div>
										</div>
									);
								})}
							</div>
						</div>
					</div>
				</div>
			</section>
		);
	}
);

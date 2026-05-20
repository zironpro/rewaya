"use client";

import type { BundleData } from "../types/bundle";
import { BundleCheckoutCta } from "./bundle-checkout-cta";
import { CountdownTimer } from "./countdown-timer";

interface CtaSectionProps {
	bundle: BundleData;
}

export function CtaSection({ bundle }: CtaSectionProps) {
	return (
		<section
			className="relative overflow-hidden border-white/10 border-t bg-[var(--bundle-ink)] py-16 text-[var(--bundle-cream)] md:py-24"
			id="checkout"
		>
			<div
				aria-hidden
				className="pointer-events-none absolute inset-0 opacity-[0.07]"
				style={{
					backgroundImage:
						"repeating-linear-gradient(-12deg, transparent, transparent 3px, rgba(255,255,255,0.35) 3px, rgba(255,255,255,0.35) 4px)",
				}}
			/>
			<svg
				aria-hidden
				className="pointer-events-none absolute -top-10 -right-16 h-64 w-64 text-[var(--bundle-gold)]/25"
				viewBox="0 0 120 120"
			>
				<title>Ornament</title>
				<path
					d="M60 8c12 18 28 32 44 40-16 10-32 24-44 42-12-18-28-32-44-40 16-10 32-24 44-42z"
					fill="currentColor"
				/>
			</svg>

			<div className="relative z-[1] mx-auto max-w-3xl px-4 text-center sm:px-6">
				<p className="font-[family-name:var(--font-body)] font-medium text-[var(--bundle-gold)] text-xs uppercase tracking-[0.25em]">
					Checkout
				</p>
				<h2 className="mt-3 font-display text-3xl tracking-tight md:text-4xl">
					Bring home {bundle.name}
				</h2>
				<p className="mt-4 font-[family-name:var(--font-editorial)] text-base text-white/75 leading-relaxed">
					{bundle.description} Use the same Rewaya cart and delivery you already
					use on the main store.
				</p>
				<div className="mx-auto mt-6 flex max-w-xs justify-center">
					<CountdownTimer slug={bundle.slug} variant="dark" />
				</div>
				<div className="mx-auto mt-8 max-w-md">
					<BundleCheckoutCta bundle={bundle} />
				</div>
				<p className="mt-4 font-[family-name:var(--font-body)] text-white/55 text-xs">
					AED {bundle.price} · List AED {bundle.originalPrice} · Save AED{" "}
					{bundle.savingsAmount}
				</p>
			</div>
		</section>
	);
}

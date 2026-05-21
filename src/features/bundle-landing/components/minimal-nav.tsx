"use client";

import { Button } from "@/components/ui/button";

import { cn } from "@/lib/utils";

import { useStickyNav } from "../hooks/useStickyNav";

interface MinimalNavProps {
	bundleName: string;
	priceLabel: string;
	/** `dark` for timer strip over dark CTA */
	variant?: "default" | "dark";
}

export function MinimalNav({
	bundleName,
	priceLabel,
	variant = "default",
}: MinimalNavProps) {
	const { pastHero } = useStickyNav();

	const surface =
		variant === "dark"
			? "border-white/10 bg-[var(--bundle-ink)]/92 text-[var(--bundle-cream)]"
			: "border-gold/20 bg-[#FBF6EE]/92 text-[var(--bundle-ink)] shadow-sm";

	return (
		<header
			className={cn(
				"fixed inset-x-0 bottom-0 z-50 border-b backdrop-blur-md transition-transform duration-300 ease-out",
				surface,
				pastHero ? "translate-y-0" : "translate-y-full"
			)}
		>
			<div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
				<p className="min-w-0 truncate font-bold font-display text-xl tracking-tight sm:text-2xl">
					{bundleName}
				</p>
				<div className="flex shrink-0 items-center gap-2 sm:gap-3">
					<span className="hidden text-sm sm:inline">{priceLabel}</span>
					<Button className="btn-shimmer" type="button">
						Checkout
					</Button>
				</div>
			</div>
		</header>
	);
}

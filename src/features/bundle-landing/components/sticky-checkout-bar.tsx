"use client";

import { cn } from "@/lib/utils";

import { useStickyNav } from "../hooks/useStickyNav";
import type { BundleData } from "../types/bundle";
import { BundleCheckoutCta } from "./bundle-checkout-cta";

interface StickyCheckoutBarProps {
	bundle: BundleData;
}

export function StickyCheckoutBar({ bundle }: StickyCheckoutBarProps) {
	const { pastHero } = useStickyNav();
	return (
		<div
			className={cn(
				"fixed inset-x-0 bottom-0 z-40 md:hidden",
				"border-(--bundle-gold)/25 border-t bg-[#FBF6EE]/95 px-4 py-3 shadow-[0_-8px_30px_rgba(44,36,28,0.12)] backdrop-blur-md transition-transform duration-300 ease-out will-change-transform",
				pastHero ? "translate-y-0" : "translate-y-full"
			)}
		>
			<div className="mx-auto flex max-w-lg items-center gap-3">
				<div className="min-w-0 flex-1">
					<p className="truncate font-display text-(--bundle-ink) text-sm">
						{bundle.name}
					</p>
					<p className="text-[var(--bundle-muted)] text-xs">
						<span className="font-semibold text-[var(--bundle-ink)]">
							AED {bundle.price}
						</span>{" "}
						<span className="line-through">AED {bundle.originalPrice}</span>
					</p>
				</div>
				<div className="w-[min(52vw,220px)] shrink-0">
					<BundleCheckoutCta bundle={bundle} className="text-sm" size="sm" />
				</div>
			</div>
		</div>
	);
}

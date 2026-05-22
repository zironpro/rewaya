import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";

import { cn } from "@/lib/utils";

import type { BundleCampaignBannerSlot } from "../data/bundle-campaign-banners";
import type { BundleData } from "../types/bundle";
import { BundlesCampaignActions } from "./bundles-campaign-actions";

interface BundlesCampaignBannerProps {
	slot: BundleCampaignBannerSlot;
	priority?: boolean;
	showOverlayCta?: boolean;
	featuredSlug?: string;
	featuredBundle?: BundleData;
	className?: string;
}

export function BundlesCampaignBanner({
	slot,
	priority = false,
	showOverlayCta = true,
	featuredSlug,
	featuredBundle,
	className,
}: BundlesCampaignBannerProps) {
	const isHero = slot.aspect === "hero";

	return (
		<div
			className={cn(
				"relative overflow-hidden rounded-xl shadow-sm",
				isHero
					? "aspect-4/3 min-h-[280px] md:min-h-[360px]"
					: "min-h-[200px] md:aspect-21/9",
				className
			)}
		>
			<Image
				alt={slot.imageAlt}
				className="object-cover"
				fill
				priority={priority}
				sizes="(max-width: 1024px) 100vw, 60vw"
				src={slot.imageSrc}
			/>
			<div className="absolute inset-0 bg-linear-to-t from-10% from-card to-75%" />

			{(slot.title || showOverlayCta) && (
				<div className="absolute inset-0 flex max-w-md flex-col items-start justify-end p-6 text-start text-secondary md:p-8">
					{slot.title ? (
						<h2 className="font-bold font-display text-2xl uppercase tracking-tight md:text-4xl">
							{slot.title}
						</h2>
					) : null}
					{slot.subtitle ? (
						<p className="mt-1 max-w-lg font-medium text-secondary/85 text-sm md:text-base">
							{slot.subtitle}
						</p>
					) : null}
					{showOverlayCta ? (
						<div className="mt-6 flex flex-col items-center gap-3">
							{featuredSlug ? (
								<div className="hidden sm:block">
									<BundlesCampaignActions
										featuredSlug={featuredSlug}
										variant="countdown-compact"
									/>
								</div>
							) : null}
							{featuredBundle && featuredSlug ? (
								<BundlesCampaignActions
									featuredBundle={featuredBundle}
									featuredSlug={featuredSlug}
									variant="buy-featured"
								/>
							) : (
								<Button
									className="campaign-shimmer"
									nativeButton={false}
									render={<Link href={slot.ctaHref ?? "#bundles"} />}
									size="lg"
								>
									{slot.ctaLabel ?? "Buy the bundle now"}
								</Button>
							)}
						</div>
					) : null}
				</div>
			)}
		</div>
	);
}

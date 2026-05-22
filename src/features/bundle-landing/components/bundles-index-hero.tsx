import { Badge } from "@/components/ui/badge";

import type { Bundle } from "@/lib/bundles-data";

import type { BundleCampaignBannerSlot } from "../data/bundle-campaign-banners";
import type { BundleData } from "../types/bundle";
import { BundlesCampaignActions } from "./bundles-campaign-actions";
import { BundlesCampaignBanner } from "./bundles-campaign-banner";

interface BundlesIndexHeroProps {
	featuredSlug: string;
	featuredBundle: BundleData;
	maxSavings: number;
	bundles: Bundle[];
	heroBanner: BundleCampaignBannerSlot;
}

export function BundlesIndexHero({
	featuredSlug,
	featuredBundle,
	maxSavings,
	heroBanner,
}: BundlesIndexHeroProps) {
	return (
		<section className="campaign-gradient-hero relative overflow-hidden py-12 md:py-20">
			<div className="container">
				<div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-12">
					<div className="flex flex-col items-start gap-5 lg:col-span-5">
						<Badge variant="warning">Limited-time bundle offer</Badge>
						<h1 className="font-bold font-display text-3xl text-secondary leading-tight tracking-tight md:text-4xl lg:text-5xl">
							Curated book bundles: one cart, one great price
						</h1>
						<p className="max-w-md text-muted-foreground leading-relaxed">
							Save up to{" "}
							<span className="font-semibold text-primary">
								AED {maxSavings}
							</span>{" "}
							per set. Prices return to list value when the offer window ends.
						</p>
						<BundlesCampaignActions
							featuredSlug={featuredSlug}
							variant="countdown"
						/>
						<div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center">
							<BundlesCampaignActions
								buttonSize="lg"
								className="flex-1"
								featuredBundle={featuredBundle}
								featuredSlug={featuredSlug}
								variant="buy-featured"
							/>
							<BundlesCampaignActions
								buttonSize="lg"
								featuredSlug={featuredSlug}
								variant="scroll-bundles"
							/>
						</div>
						<ul className="flex flex-wrap gap-x-4 gap-y-1 text-muted-foreground text-xs">
							<li>UAE delivery</li>
							<li>Curated sets</li>
							<li>Secure checkout</li>
						</ul>
					</div>

					<div className="relative lg:col-span-7">
						<BundlesCampaignBanner
							priority
							showOverlayCta={false}
							slot={heroBanner}
						/>
						{/* <div className="book-shadow absolute -bottom-4 left-4 z-10 max-w-[220px] rounded-2xl border border-border bg-card p-4 md:left-6">
							<p className="font-medium text-muted-foreground text-xs uppercase tracking-wider">
								Featured set
							</p>
							<p className="mt-1 font-bold font-display text-lg text-secondary">
								{featuredBundle.name}
							</p>
							<p className="mt-1 font-bold text-primary">
								AED {featuredBundle.price}
								<span className="ml-2 font-normal text-muted-foreground text-sm line-through">
									{featuredBundle.originalPrice}
								</span>
							</p>
						</div>

						<div className="book-shadow relative size-14 overflow-hidden rounded-lg border-2 border-white">
							<Image
								alt=""
								className="object-cover"
								fill
								sizes="56px"
								src="/bundles/bundle-hero.webp"
							/>
						</div> */}
					</div>
				</div>
			</div>
		</section>
	);
}

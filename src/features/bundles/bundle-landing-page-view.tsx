import { BundleSetCard } from "@/components/bundle-set-card";

import { BundleIndexDetailSection } from "@/features/bundle-landing/components/bundle-index-detail-section";
import { BundlesBookMarquee } from "@/features/bundle-landing/components/bundles-book-marquee";
import { BundlesCampaignBanner } from "@/features/bundle-landing/components/bundles-campaign-banner";
import { BundlesIndexCta } from "@/features/bundle-landing/components/bundles-index-cta";
import { BundlesIndexFaqSection } from "@/features/bundle-landing/components/bundles-index-faq-section";
import { BundlesIndexHero } from "@/features/bundle-landing/components/bundles-index-hero";
import { BundlesIndexSocialProof } from "@/features/bundle-landing/components/bundles-index-social-proof";
import { BundlesIndexStickyBar } from "@/features/bundle-landing/components/bundles-index-sticky-bar";
import { BundlesIndexTrust } from "@/features/bundle-landing/components/bundles-index-trust";
import { BundlesUrgencyCallout } from "@/features/bundle-landing/components/bundles-urgency-callout";
import type { BundleCampaignBannerSlot } from "@/features/bundle-landing/data/bundle-campaign-banners";
import type { BundlesIndexPageData } from "@/features/bundle-landing/lib/bundlesIndexData";

interface BundleLandingPageViewProps {
	data: BundlesIndexPageData;
	banners: {
		hero: BundleCampaignBannerSlot;
		mid: BundleCampaignBannerSlot;
	};
}

export function BundleLandingPageView({
	data,
	banners,
}: BundleLandingPageViewProps) {
	const featuredSlug = data.featuredBundle.id;

	return (
		<main className="bg-background pb-24 md:pb-0">
			<BundlesIndexHero
				bundles={data.bundles}
				featuredBundle={data.featuredBundleData}
				featuredSlug={featuredSlug}
				heroBanner={banners.hero}
				maxSavings={data.maxSavings}
			/>

			<BundlesBookMarquee slides={data.bookSlides} />

			<BundlesUrgencyCallout featuredSlug={featuredSlug} />

			<section className="container scroll-mt-24 py-14 md:py-20" id="bundles">
				<div className="mb-10 text-center md:text-left">
					<p className="font-medium text-primary text-xs uppercase tracking-[0.2em]">
						Pick your set
					</p>
					<h2 className="mt-2 font-bold font-display text-2xl text-secondary md:text-4xl">
						Bundle deals
					</h2>
					<p className="mt-2 max-w-xl text-muted-foreground">
						Compare curated stacks — add to cart in one tap.
					</p>
				</div>

				<div className="grid grid-cols-1 gap-8 md:grid-cols-2">
					{data.bundles.map((bundle) => (
						<BundleSetCard bundle={bundle} key={bundle.id} />
					))}
				</div>
			</section>

			<section className="container py-10 md:py-14">
				<BundlesCampaignBanner
					featuredBundle={data.featuredBundleData}
					featuredSlug={featuredSlug}
					slot={banners.mid}
				/>
			</section>

			{data.bundleDataList.map((bundle, index) => (
				<BundleIndexDetailSection
					bundle={bundle}
					featuredSlug={featuredSlug}
					index={index}
					key={bundle.slug}
				/>
			))}

			<BundlesIndexTrust />
			<BundlesIndexSocialProof reviews={data.reviews} />
			<BundlesIndexFaqSection faqs={data.faqs} />
			<BundlesIndexCta
				featuredBundle={data.featuredBundleData}
				featuredSlug={featuredSlug}
			/>
			<BundlesIndexStickyBar featuredSlug={featuredSlug} />
		</main>
	);
}

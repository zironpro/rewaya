import type { Bundle } from "@/lib/bundles-data";
import { cn } from "@/lib/utils";

import type { BundleData } from "./types/bundle";

import "./styles/bundleAnimations.css";

import { BookGallerySection } from "./components/book-gallery-section";
import { BooksBreakdownSection } from "./components/books-breakdown-section";
import { BundleFaqSection } from "./components/bundle-faq-section";
import { CtaSection } from "./components/cta-section";
import { HeroSection } from "./components/hero-section";
import { MinimalNav } from "./components/minimal-nav";
import { OverviewSection } from "./components/overview-section";
import { RelatedBundlesSection } from "./components/related-bundles-section";
import { SocialProofSection } from "./components/social-proof-section";
import { StickyCheckoutBar } from "./components/sticky-checkout-bar";

interface BundleLandingPageProps {
	bundle: BundleData;
	relatedBundles: Bundle[];
}

export function BundleLandingPage({
	bundle,
	relatedBundles,
}: BundleLandingPageProps) {
	const priceLabel = `AED ${bundle.price} · was ${bundle.originalPrice}`;

	return (
		<main className={cn("bundle-page pb-20 md:pb-0")}>
			<MinimalNav bundleName={bundle.name} priceLabel={priceLabel} />
			<HeroSection bundle={bundle} />
			<BookGallerySection bundle={bundle} />
			<OverviewSection bundle={bundle} />
			<BooksBreakdownSection bundle={bundle} />
			<SocialProofSection bundle={bundle} />
			<RelatedBundlesSection bundles={relatedBundles} />
			<BundleFaqSection bundle={bundle} />
			<CtaSection bundle={bundle} />
			<StickyCheckoutBar bundle={bundle} />
		</main>
	);
}

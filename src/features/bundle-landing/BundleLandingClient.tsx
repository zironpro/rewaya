"use client";

import { useCallback, useEffect, useState } from "react";

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
import { useStickyNav } from "./hooks/useStickyNav";
import type { BundleData } from "./types/bundle";

interface BundleLandingClientProps {
	bundle: BundleData;
}

export function BundleLandingClient({ bundle }: BundleLandingClientProps) {
	const { heroRef, pastHero } = useStickyNav();
	const [revealHero, setRevealHero] = useState(false);

	useEffect(() => {
		setRevealHero(true);
	}, []);

	const scrollToCheckout = useCallback(() => {
		document.getElementById("checkout")?.scrollIntoView({ behavior: "smooth" });
	}, []);

	const priceLabel = `AED ${bundle.price} · was ${bundle.originalPrice}`;

	return (
		<>
			<MinimalNav
				bundleName={bundle.name}
				onCheckoutClick={scrollToCheckout}
				priceLabel={priceLabel}
				visible={pastHero}
			/>
			<HeroSection bundle={bundle} ref={heroRef} revealed={revealHero} />
			<BookGallerySection bundle={bundle} />
			<OverviewSection bundle={bundle} />
			<BooksBreakdownSection bundle={bundle} />
			<SocialProofSection bundle={bundle} />
			<RelatedBundlesSection bundle={bundle} />
			<BundleFaqSection bundle={bundle} />
			<CtaSection bundle={bundle} />
			<StickyCheckoutBar bundle={bundle} visible={pastHero} />
		</>
	);
}

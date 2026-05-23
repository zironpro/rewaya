import Image from "next/image";
import Link from "next/link";

import { MapPin } from "lucide-react";

import { BundleSection } from "@/components/BundleSection";
import { CategoryStrip } from "@/components/CategoryStrip";
import { PolicyCards } from "@/components/PolicyCards";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { HeroCarousel } from "@/features/home/components/hero-carousel";
import { ProductStrip } from "@/features/products/components/product-strip";
import type { Bundle } from "@/lib/bundles-data";
import type { BookProps } from "@/lib/store";
import type { StoreCategory } from "@/lib/wix/categories";

interface HomepageViewProps {
	books: BookProps[];
	bundles: Bundle[];
	categories?: StoreCategory[];
}

export const HomepageView = ({
	books,
	bundles,
	categories = [],
}: HomepageViewProps) => {
	const featured = [...books, ...books];
	return (
		<main className="overflow-hidden">
			<HeroCarousel />
			<CategoryStrip categories={categories} />

			{/* 1. RECOMMENDED FOR YOU */}
			<ProductStrip
				books={featured.map((book) => ({
					...book,
				}))}
				subtitle="Based on your taste"
				title="Recommended for You"
			/>

			{/* 2. TODAY'S DEALS */}
			<ProductStrip
				books={featured.map((book) => ({
					...book,
				}))}
				subtitle="Limited Time"
				title="Today's Deals"
			/>

			{/* INTERSTITIAL BANNER 1 — Dubai Book Fair recap */}
			<section className="container mb-16">
				<div className="group relative min-h-[300px] overflow-hidden rounded-2xl shadow-lg md:min-h-[360px]">
					<Image
						alt="Rewaya Books at the Dubai Book Fair"
						className="object-cover transition-transform duration-300 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-102"
						fill
						sizes="(max-width: 1280px) 100vw, 1280px"
						src="/banners/book-fair-banner.webp"
					/>
					{/* <div className="absolute inset-0 bg-linear-to-r from-stone-950/95 via-stone-950/75 to-stone-950/25 md:to-transparent" /> */}
					<div className="relative z-10 flex min-h-[300px] flex-col items-start justify-center p-6 text-white sm:p-10 md:min-h-[360px] md:max-w-4xl md:p-12">
						<Badge
							className="border-white/20 bg-white/10 text-white tracking-normal backdrop-blur-sm"
							size="lg"
							variant="outline"
						>
							Event recap
						</Badge>
						<h3 className="mt-3 font-bold font-display text-3xl leading-tight md:text-5xl">
							Rewaya at the{" "}
							<span className="text-accent italic">Dubai Book Fair</span>
						</h3>
						<p className="mt-4 font-light text-base text-white/90">
							Thank you to everyone who visited our stand. We loved meeting
							readers, signing books, and sharing stories from across the
							Islamic world.
						</p>
						<p className="mt-3 flex items-center gap-1.5 text-sm text-white/75">
							<MapPin aria-hidden className="size-4 shrink-0" />
							Dubai, United Arab Emirates
						</p>
						<Button
							className="mt-8"
							nativeButton={false}
							render={<Link href="/shop" />}
							size="lg"
						>
							Browse the collection
						</Button>
					</div>
				</div>
			</section>

			{/* 2. NEW SELLERS */}
			<ProductStrip
				books={featured.map((book) => ({
					...book,
					badge: "new seller",
				}))}
				subtitle="Latest Arrivals"
				title="New Sellers"
			/>

			{/* BUNDLES SECTION */}
			<BundleSection bundles={bundles} />

			{/* 3. BEST SELLERS */}
			<ProductStrip
				books={featured.map((book) => ({
					...book,
					badge: "best seller",
				}))}
				subtitle="Top Rated"
				title="Best Sellers"
			/>

			{/* INTERSTITIAL BANNER 2 */}
			<section className="container mb-12 pb-16">
				<div className="group relative overflow-hidden rounded-2xl shadow-lg">
					<Image
						alt="Children's Books"
						className="object-cover transition-transform duration-300 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-105"
						fill
						sizes="(max-width: 1280px) 100vw, 1280px"
						src="/banners/kids-banner.webp"
					/>
					<div className="relative z-10 flex flex-col items-center justify-center p-6 sm:p-10 md:p-16 lg:p-20">
						<Badge
							className="bg-secondary px-2 text-secondary-foreground tracking-normal"
							size="lg"
						>
							Special Release
						</Badge>
						<h3 className="mt-2 mb-8 max-w-xl text-center font-bold font-display text-4xl text-secondary leading-tight md:text-5xl">
							Nurturing the
							<span className="text-accent italic">Next Generation</span> of
							Seekers.
						</h3>
						<Button size="lg">Shop Children books</Button>
					</div>
				</div>
			</section>

			{/* 4. CHILDREN'S COLLECTION */}
			<ProductStrip
				books={featured.map((book) => ({
					...book,
					badge: "new arrival",
				}))}
				subtitle="For Young Readers"
				title="Children's Collection"
			/>

			<PolicyCards />
		</main>
	);
};

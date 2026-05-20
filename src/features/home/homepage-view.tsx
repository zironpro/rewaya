import Image from "next/image";

import { BundleSection } from "@/components/BundleSection";
import { CategoryStrip } from "@/components/CategoryStrip";
import { PolicyCards } from "@/components/PolicyCards";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { HeroCarousel } from "@/features/home/components/hero-carousel";
import { ProductStrip } from "@/features/products/components/product-strip";
import type { BookProps } from "@/lib/store";

interface HomepageViewProps {
	books: BookProps[];
}

export const HomepageView = ({ books }: HomepageViewProps) => {
	const featured = [...books, ...books];
	return (
		<main className="overflow-hidden">
			<HeroCarousel />
			<CategoryStrip />

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

			{/* INTERSTITIAL BANNER 1 */}
			<section className="relative mb-16 overflow-hidden bg-stone-900 py-16">
				<Image
					alt="Promotion"
					className="object-cover opacity-60"
					fill
					sizes="100vw"
					src="https://images.unsplash.com/photo-1476275466078-4007374efbbe?q=80&w=2000&auto=format&fit=crop"
				/>
				<div className="relative z-10 flex flex-col items-center justify-center text-center text-white">
					<h3 className="mb-4 font-serif text-3xl italic md:text-5xl">
						Explore <span className="font-normal italic">Islamic</span> History
					</h3>
					<p className="mb-8 font-medium text-base md:text-lg">
						Curated collection for the modern seeker
					</p>
					<Button size="lg" variant="outline">
						Shop Now
					</Button>
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
			<BundleSection />

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
				<div className="group relative overflow-hidden rounded-2xl shadow-2xl">
					<Image
						alt="Children's Books"
						className="object-cover transition-transform group-hover:scale-110"
						fill
						sizes="(max-width: 1280px) 100vw, 1280px"
						src="https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?q=80&w=2000&auto=format&fit=crop"
					/>
					<div className="relative z-10 flex flex-col items-start justify-center bg-linear-to-r from-secondary p-6 sm:p-10 md:p-16 lg:p-20">
						<Badge variant="secondary">Special Release</Badge>
						<h3 className="mt-2 mb-9 max-w-2xl font-serif text-4xl text-white leading-tight md:text-6xl">
							Nurturing the
							<span className="font-normal text-accent italic">
								Next Generation
							</span>{" "}
							of Seekers.
						</h3>
						<Button size="lg">Shop Children&apos;s</Button>
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

import Image from "next/image";

import BundleSection from "@/components/BundleSection";
import CategoryStrip from "@/components/CategoryStrip";
import PolicyCards from "@/components/PolicyCards";
import ProductStrip from "@/components/ProductStrip";
import { Button } from "@/components/ui/button";

import HeroCarousel from "@/features/home/components/hero-carousel";
import { allBooks } from "@/features/products/data/products";

export const HomepageView = () => {
	return (
		<main className="overflow-hidden">
			<HeroCarousel />
			<CategoryStrip />

			{/* 1. RECOMMENDED FOR YOU */}
			<ProductStrip
				books={[...allBooks, ...allBooks].map((book) => ({
					...book,
				}))}
				subtitle="Based on your taste"
				title="Recommended for You"
			/>

			{/* 2. TODAY'S DEALS */}
			<ProductStrip
				books={[...allBooks, ...allBooks].map((book) => ({
					...book,
				}))}
				subtitle="Limited Time"
				title="Today's Deals"
			/>

			{/* INTERSTITIAL BANNER 1 */}
			<section className="relative my-16 h-[400px] overflow-hidden bg-stone-900">
				<Image
					alt="Promotion"
					className="h-full w-full object-cover opacity-60"
					fill
					sizes="100vw"
					src="https://images.unsplash.com/photo-1476275466078-4007374efbbe?q=80&w=2000&auto=format&fit=crop"
				/>
				<div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center text-white">
					<h3 className="mb-6 font-serif text-3xl italic md:text-5xl">
						Explore <span className="font-normal italic">Islamic</span> History
					</h3>
					<p className="mb-8 font-bold text-base opacity-80 md:text-lg">
						Curated collection for the modern seeker
					</p>
					<Button
						className="h-12 rounded-none border-white px-10 font-bold text-base text-white transition-all hover:bg-white hover:text-black"
						variant="outline"
					>
						Shop Now
					</Button>
				</div>
			</section>

			{/* 2. NEW SELLERS */}
			<ProductStrip
				books={[...allBooks, ...allBooks].map((book) => ({
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
				books={[...allBooks, ...allBooks].map((book) => ({
					...book,
					badge: "best seller",
				}))}
				subtitle="Top Rated"
				title="Best Sellers"
			/>

			{/* INTERSTITIAL BANNER 2 */}
			<section className="container mx-auto px-6 py-16">
				<div className="group relative overflow-hidden rounded-2xl shadow-2xl">
					<Image
						alt="Children's Books"
						className="object-cover transition-transform group-hover:scale-110"
						fill
						sizes="(max-width: 1280px) 100vw, 1280px"
						src="https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?q=80&w=2000&auto=format&fit=crop"
					/>
					<div className="relative z-10 flex flex-col items-start justify-center bg-linear-to-r from-secondary/80 p-12 md:p-24">
						<span className="mb-6 block font-bold text-base text-white uppercase tracking-widest">
							Special Release
						</span>
						<h3 className="mb-10 max-w-xl font-serif text-4xl text-white leading-tight md:text-6xl">
							Nurturing the <br />
							<span className="font-normal text-white/60 italic">
								Next Generation
							</span>{" "}
							<br /> of Seekers.
						</h3>
						<Button>Shop Children&apos;s</Button>
					</div>
				</div>
			</section>

			{/* 4. CHILDREN'S COLLECTION */}
			<ProductStrip
				books={[...allBooks, ...allBooks].map((book) => ({
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

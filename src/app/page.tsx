"use client";

import Image from "next/image";

import BundleSection from "@/components/BundleSection";
import CategoryStrip from "@/components/CategoryStrip";
import HeroCarousel from "@/components/HeroCarousel";
import PolicyCards from "@/components/PolicyCards";
import ProductStrip from "@/components/ProductStrip";
import { Button } from "@/components/ui/button";

const featuredBooks = [
	{
		id: 1,
		title: "The Sealed Nectar",
		author: "Safiur Rahman Mubarakpuri",
		price: 85.0,
		category: "Islamic",
		image:
			"https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=800&auto=format&fit=crop",
	},
	{
		id: 2,
		title: "Atomic Habits",
		author: "James Clear",
		price: 65.0,
		category: "Self-Help",
		image:
			"https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=800&auto=format&fit=crop",
	},
	{
		id: 3,
		title: "The Alchemist",
		author: "Paulo Coelho",
		price: 45.0,
		category: "Fiction",
		image:
			"https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=800&auto=format&fit=crop",
	},
	{
		id: 4,
		title: "Fortress of the Muslim",
		author: "Sa'id bin Ali al-Qahtani",
		price: 25.0,
		category: "Islamic",
		image:
			"https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=800&auto=format&fit=crop",
	},
];

const allBooks = [
	...featuredBooks,
	{
		id: 5,
		title: "Reclaim Your Heart",
		author: "Yasmin Mogahed",
		price: 55,
		category: "Islamic",
		image:
			"https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=800&auto=format&fit=crop",
	},
	{
		id: 6,
		title: "Deep Work",
		author: "Cal Newport",
		price: 70,
		category: "Self-Help",
		image:
			"https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=800&auto=format&fit=crop",
	},
	{
		id: 7,
		title: "The 5 AM Club",
		author: "Robin Sharma",
		price: 60,
		category: "Self-Help",
		image:
			"https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=800&auto=format&fit=crop",
	},
	{
		id: 8,
		title: "The Power of Now",
		author: "Eckhart Tolle",
		price: 50,
		category: "Spirituality",
		image:
			"https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=800&auto=format&fit=crop",
	},
];

export default function Home() {
	return (
		<main className="overflow-hidden pt-20 lg:pt-32">
			<HeroCarousel />
			<CategoryStrip />

			{/* 1. RECOMMENDED FOR YOU */}
			<ProductStrip
				books={[...allBooks, ...allBooks].map((book, i) => ({
					...book,
				}))}
				subtitle="Based on your taste"
				title="Recommended for You"
			/>

			{/* 2. TODAY'S DEALS */}
			<ProductStrip
				books={[...allBooks, ...allBooks].map((book, i) => ({
					...book,
				}))}
				subtitle="Limited Time"
				title="Today's Deals"
			/>

			{/* INTERSTITIAL BANNER 1 */}
			<section className="relative my-16 h-[400px] overflow-hidden bg-stone-900">
				<img
					alt="Promotion"
					className="h-full w-full object-cover opacity-60"
					src="https://images.unsplash.com/photo-1476275466078-4007374efbbe?q=80&w=2000&auto=format&fit=crop"
				/>
				<div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center text-white">
					<h3 className="mb-6 font-serif text-3xl uppercase italic tracking-widest md:text-5xl">
						Explore <span className="font-normal italic">Islamic</span> History
					</h3>
					<p className="mb-8 font-bold text-[10px] uppercase tracking-[0.4em] opacity-80">
						Curated collection for the modern seeker
					</p>
					<Button
						className="h-12 rounded-none border-white px-10 font-bold text-[10px] text-white uppercase tracking-widest transition-all hover:bg-white hover:text-black"
						variant="outline"
					>
						Shop Now
					</Button>
				</div>
			</section>

			{/* 2. NEW SELLERS */}
			<ProductStrip
				books={[...allBooks, ...allBooks].map((book, i) => ({
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
				books={[...allBooks, ...allBooks].map((book, i) => ({
					...book,
					badge: "best seller",
				}))}
				subtitle="Top Rated"
				title="Best Sellers"
			/>

			{/* INTERSTITIAL BANNER 2 */}
			<section className="py-16">
				<div className="container mx-auto px-6">
					<div className="group relative h-[400px] overflow-hidden rounded-2xl shadow-2xl">
						<Image
							alt="Children's Books"
							className="h-full w-full object-cover transition-transform duration-[3s] group-hover:scale-110"
							fill
							src="https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?q=80&w=2000&auto=format&fit=crop"
						/>
						<div className="absolute inset-0 flex flex-col items-start justify-center bg-linear-to-r from-secondary/80 to-transparent px-12 md:px-24">
							<span className="mb-6 block font-bold text-[10px] text-white uppercase tracking-[0.4em]">
								Special Release
							</span>
							<h3 className="mb-10 max-w-xl font-serif text-4xl text-white uppercase leading-tight md:text-6xl">
								Nurturing the <br />
								<span className="font-normal text-white/60 italic">
									Next Generation
								</span>{" "}
								<br /> of Seekers.
							</h3>
							<Button className="h-14 rounded-none border-none bg-primary px-12 font-bold text-[10px] uppercase tracking-widest transition-all hover:bg-primary-dark">
								Shop Children&apos;s
							</Button>
						</div>
					</div>
				</div>
			</section>

			{/* 4. CHILDREN'S COLLECTION */}
			<ProductStrip
				books={[...allBooks, ...allBooks].map((book, i) => ({
					...book,
					badge: "new arrival",
				}))}
				subtitle="For Young Readers"
				title="Children's Collection"
			/>

			<PolicyCards />
		</main>
	);
}

"use client";

import { motion } from "framer-motion";
import { ArrowRight, Tag } from "lucide-react";

import Image from "next/image";
import Link from "next/link";

import { Button } from "./ui/button";

const bundles = [
	{
		id: "seeker-set",
		title: "The Modern Seeker",
		count: 5,
		price: 249,
		originalPrice: 310,
		tag: "MOST POPULAR",
		image:
			"https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=800&auto=format&fit=crop",
		books: [
			"Reclaim Your Heart",
			"The Sealed Nectar",
			"Atomic Habits",
			"Deep Work",
			"5 AM Club",
		],
	},
	{
		id: "history-set",
		title: "Islamic History Core",
		count: 4,
		price: 199,
		originalPrice: 260,
		tag: "BEST VALUE",
		image:
			"https://images.unsplash.com/photo-1585032226651-759b368d7246?q=80&w=800&auto=format&fit=crop",
		books: [
			"History of Islam",
			"The Caliphate",
			"Great Explorers",
			"Golden Age",
		],
	},
];

export default function BundleSection() {
	return (
		<section className="relative overflow-hidden border-stone-100 border-y bg-white py-16">
			<div className="container relative z-10 mx-auto px-6">
				<div className="mb-12 flex flex-col items-center justify-between gap-6 text-center md:flex-row md:text-left">
					<div className="max-w-xl">
						<span className="mb-3 block font-black text-[9px] text-primary uppercase tracking-[0.4em]">
							Special Campaigns
						</span>
						<h2 className="font-black font-serif text-4xl text-secondary uppercase leading-tight md:text-5xl">
							CURATED{" "}
							<span className="font-normal text-primary italic">SETS</span>.
						</h2>
					</div>
					<Link href="/bundles">
						<Button
							className="gap-2 font-black text-[9px] text-primary uppercase tracking-widest hover:text-secondary"
							variant="ghost"
						>
							View All <ArrowRight size={14} />
						</Button>
					</Link>
				</div>

				<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
					{bundles.map((bundle, i) => (
						<Link href={`/bundle/${bundle.id}`} key={bundle.id} className="block">
							<motion.div
								className="group relative flex cursor-pointer flex-col items-center gap-12 border border-stone-100 bg-stone-50 p-6 transition-all duration-500 hover:border-primary/30 sm:flex-row md:p-8"
								initial={{ opacity: 0, y: 20 }}
								viewport={{ once: true }}
								whileInView={{ opacity: 1, y: 0 }}
							>
								{/* Triple Visual Stack */}
								<div className="relative mb-6 h-44 w-32 flex-shrink-0 sm:mb-0">
									{/* Book 3 (Back) */}
									<div className="absolute inset-0 translate-x-[-15px] -rotate-12 transform overflow-hidden border border-stone-100 bg-stone-200 shadow-lg transition-transform duration-500 group-hover:-rotate-15">
										<img
											alt="Book 3"
											className="h-full w-full object-cover opacity-60"
											src="https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=300&auto=format&fit=crop"
										/>
									</div>
									{/* Book 2 (Middle) */}
									<div className="absolute inset-0 translate-x-[15px] rotate-6 transform overflow-hidden border border-stone-200 bg-stone-100 shadow-xl transition-transform duration-500 group-hover:rotate-12">
										<img
											alt="Book 2"
											className="h-full w-full object-cover opacity-80"
											src="https://images.unsplash.com/photo-1585032226651-759b368d7246?q=80&w=300&auto=format&fit=crop"
										/>
									</div>
									{/* Book 1 (Front) */}
									<div className="absolute inset-0 rotate-0 transform overflow-hidden border border-stone-300 bg-white shadow-2xl transition-transform duration-500 group-hover:-translate-y-2">
										<img
											alt={bundle.title}
											className="h-full w-full object-cover"
											src={bundle.image}
										/>
									</div>

									{/* Floating Badge */}
									<div className="absolute -top-3 -right-3 z-20 flex h-10 w-10 flex-col items-center justify-center rounded-full border-2 border-white bg-primary text-white shadow-lg">
										<span className="font-black text-xs leading-none">
											{bundle.count}
										</span>
										<span className="font-bold text-[6px] uppercase tracking-tighter">
											Sets
										</span>
									</div>
								</div>

								{/* Content */}
								<div className="flex-grow">
									<div className="mb-3 flex items-center gap-2">
										<Tag className="text-primary" size={10} />
										<span className="font-black text-[8px] text-primary uppercase tracking-widest">
											{bundle.tag}
										</span>
									</div>
									<h3 className="mb-2 font-black font-serif text-secondary text-xl uppercase transition-colors group-hover:text-primary">
										{bundle.title}
									</h3>
									<p className="mb-6 line-clamp-1 font-bold text-[9px] text-stone-400 uppercase tracking-widest">
										{bundle.books.slice(0, 3).join(", ")}...
									</p>
									<div className="flex items-center justify-between">
										<div>
											<span className="mr-2 font-bold text-[9px] text-stone-300 uppercase tracking-widest line-through">
												AED {bundle.originalPrice}
											</span>
											<span className="font-black text-lg text-secondary">
												AED {bundle.price}
											</span>
										</div>
										<Button className="h-10 rounded-none bg-primary px-6 font-black text-[8px] text-white uppercase tracking-widest shadow-md transition-all hover:bg-secondary">
											Buy Set
										</Button>
									</div>
								</div>
							</motion.div>
						</Link>
					))}
				</div>
			</div>
		</section>
	);
}

"use client";

import { useEffect, useState } from "react";

import Image from "next/image";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";

const banners = [
	{
		id: 1,
		title: "Ramadan Special",
		subtitle: "Up to 40% off on all Islamic literature",
		cta: "Shop the Sale",
		bg: "bg-stone-900",
		image:
			"https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?q=80&w=2000&auto=format&fit=crop",
	},
	{
		id: 2,
		title: "New Arrivals",
		subtitle: "The latest from global authors",
		cta: "Explore New",
		bg: "bg-secondary",
		image:
			"https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?q=80&w=2000&auto=format&fit=crop",
	},
	{
		id: 3,
		title: "Book Bundles",
		subtitle: "Buy 4 get 2 free on selected collections",
		cta: "View Bundles",
		bg: "bg-primary",
		image:
			"https://images.unsplash.com/photo-1495446815901-a7297e633e8d?q=80&w=2000&auto=format&fit=crop",
	},
];

export default function HeroCarousel() {
	const [current, setCurrent] = useState(0);

	useEffect(() => {
		const timer = setInterval(() => {
			setCurrent((prev) => (prev === banners.length - 1 ? 0 : prev + 1));
		}, 6000);
		return () => clearInterval(timer);
	}, []);

	const next = () =>
		setCurrent((prev) => (prev === banners.length - 1 ? 0 : prev + 1));
	const prev = () =>
		setCurrent((prev) => (prev === 0 ? banners.length - 1 : prev - 1));

	return (
		<div className="relative h-[70vh] w-full overflow-hidden bg-stone-50 md:h-[85vh]">
			<AnimatePresence mode="wait">
				<motion.div
					animate={{ opacity: 1 }}
					className="absolute inset-0 h-full w-full"
					exit={{ opacity: 0 }}
					initial={{ opacity: 0 }}
					key={current}
					transition={{ duration: 1 }}
				>
					{/* Background Image with Overlay */}
					<div className="absolute inset-0">
						<Image
							alt={banners[current].title}
							className="h-full w-full object-cover"
							fill
							priority={current === 0}
							sizes="100vw"
							src={banners[current].image}
						/>
						<div className="absolute inset-0 bg-black/40 backdrop-brightness-75" />
					</div>

					{/* Content */}
					<div className="container relative mx-auto flex h-full flex-col items-center justify-center px-6 text-center text-white">
						<motion.span
							animate={{ opacity: 1, y: 0 }}
							className="mb-6 font-bold text-base uppercase tracking-widest md:text-lg"
							initial={{ opacity: 0, y: 20 }}
							transition={{ delay: 0.2 }}
						>
							{banners[current].subtitle}
						</motion.span>
						<motion.h2
							animate={{ opacity: 1, y: 0 }}
							className="mb-10 font-black font-serif text-5xl leading-none md:text-8xl"
							initial={{ opacity: 0, y: 30 }}
							transition={{ delay: 0.4 }}
						>
							{banners[current].title.split(" ").map((word, i) => (
								<span
									className={i % 2 !== 0 ? "font-normal italic" : ""}
									key={Number(i + 1)}
								>
									{word}{" "}
								</span>
							))}
						</motion.h2>
						<motion.div
							animate={{ opacity: 1, y: 0 }}
							initial={{ opacity: 0, y: 20 }}
							transition={{ delay: 0.6 }}
						>
							<Button
								className="h-14 rounded-none bg-primary px-10 font-bold text-base text-white hover:bg-primary-dark"
								size="lg"
							>
								{banners[current].cta} <ArrowRight className="ml-2" size={16} />
							</Button>
						</motion.div>
					</div>
				</motion.div>
			</AnimatePresence>

			{/* Navigation Arrows */}
			<div className="absolute right-6 bottom-10 z-10 flex gap-4 md:right-12">
				<button
					className="border border-white/30 p-3 text-white transition-all hover:bg-white hover:text-black"
					onClick={prev}
				>
					<ChevronLeft size={24} />
				</button>
				<button
					className="border border-white/30 p-3 text-white transition-all hover:bg-white hover:text-black"
					onClick={next}
				>
					<ChevronRight size={24} />
				</button>
			</div>

			{/* Progress Indicators */}
			<div className="absolute bottom-10 left-6 z-10 flex gap-3 md:left-12">
				{banners.map((_, i) => (
					<div
						className={`h-1 cursor-pointer transition-all duration-500 ${current === i ? "w-12 bg-primary" : "w-6 bg-white/30 hover:bg-white/50"}`}
						key={Number(i + 1)}
						onClick={() => setCurrent(i)}
					/>
				))}
			</div>
		</div>
	);
}

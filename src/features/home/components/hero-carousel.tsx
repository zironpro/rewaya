"use client";

import { useEffect, useState } from "react";

import Image from "next/image";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";

import { cn } from "@/lib/utils";

import { BANNERS } from "../data/banners";

export default function HeroCarousel() {
	const [current, setCurrent] = useState(0);

	useEffect(() => {
		const timer = setInterval(() => {
			setCurrent((prev) => (prev === BANNERS.length - 1 ? 0 : prev + 1));
		}, 5000);
		return () => clearInterval(timer);
	}, []);

	const next = () =>
		setCurrent((prev) => (prev === BANNERS.length - 1 ? 0 : prev + 1));
	const prev = () =>
		setCurrent((prev) => (prev === 0 ? BANNERS.length - 1 : prev - 1));

	return (
		<div className="relative h-[70vh] w-full overflow-hidden bg-stone-50 md:h-[calc(100vh-113px)]">
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
							alt={BANNERS[current].title}
							className="h-full w-full object-cover"
							fill
							priority={current === 0}
							sizes="100vw"
							src={BANNERS[current].image}
						/>
						<div className="absolute inset-0 bg-black/40 backdrop-brightness-75" />
					</div>

					{/* Content */}
					<div className="container relative mx-auto flex h-full flex-col items-center justify-center text-center text-card">
						<h1 className="sr-only">
							Al Rewaya Book world: Your Premier Islamic Bookstore
						</h1>
						<motion.span
							animate={{ opacity: 1, y: 0 }}
							className="font-light text-base md:text-xl"
							initial={{ opacity: 0, y: 20 }}
							transition={{ delay: 0.2 }}
						>
							{BANNERS[current].subtitle}
						</motion.span>
						<motion.h2
							animate={{ opacity: 1, y: 0 }}
							className="mb-8 font-black font-serif text-5xl uppercase leading-none md:text-8xl"
							initial={{ opacity: 0, y: 30 }}
							transition={{ delay: 0.4 }}
						>
							{BANNERS[current].title.split(" ").map((word, i) => (
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
							<Button className="hover:px-6" size="lg">
								{BANNERS[current].cta} <ArrowRight className="ml-2" size={16} />
							</Button>
						</motion.div>
					</div>
				</motion.div>
			</AnimatePresence>

			{/* Navigation Arrows */}
			<div className="absolute right-6 bottom-10 z-10 flex gap-2 md:right-20">
				<Button
					className="text-card"
					onClick={prev}
					size="icon-lg"
					variant="outline"
				>
					<ChevronLeft size={24} />
				</Button>
				<Button
					className="text-card"
					onClick={next}
					size="icon-lg"
					variant="outline"
				>
					<ChevronRight size={24} />
				</Button>
			</div>

			{/* Progress Indicators */}
			<div className="absolute bottom-10 left-6 z-10 flex gap-1 md:left-20">
				{BANNERS.map((_, i) => (
					<div
						className={cn(
							"h-1 cursor-pointer rounded-full transition-all duration-500",
							current === i
								? "w-12 bg-primary"
								: "w-6 bg-card/30 hover:bg-card/50"
						)}
						key={Number(i + 1)}
						onClick={() => setCurrent(i)}
					/>
				))}
			</div>
		</div>
	);
}

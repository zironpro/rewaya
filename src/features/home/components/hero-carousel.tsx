"use client";

import { useEffect, useState } from "react";

import Image from "next/image";
import Link from "next/link";

import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

import { Button } from "@/components/ui/button";

import { cn } from "@/lib/utils";
import type { HomeBanner } from "@/lib/wix/cms/homepage";

import { BANNERS as FALLBACK_BANNERS } from "../data/banners";

interface HeroCarouselProps {
	banners?: HomeBanner[];
}

export function HeroCarousel({ banners = [] }: HeroCarouselProps) {
	const slides =
		banners.length > 0
			? banners.map((b) => ({
					title: b.title,
					subtitle: b.subtitle ?? "",
					cta: b.ctaLabel ?? "Shop now",
					href: b.ctaHref ?? "/shop",
					image: b.image,
				}))
			: FALLBACK_BANNERS.map((b) => ({
					title: b.title,
					subtitle: b.subtitle,
					cta: b.cta,
					href: "/shop",
					image: b.image,
				}));

	const [current, setCurrent] = useState(0);

	useEffect(() => {
		if (slides.length <= 1) return;
		const timer = setInterval(() => {
			setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
		}, 5000);
		return () => clearInterval(timer);
	}, [slides.length]);

	if (slides.length === 0) return null;

	const next = () =>
		setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
	const prev = () =>
		setCurrent((prev) => (prev === 0 ? slides.length - 1 : prev - 1));

	const slide = slides[current];

	return (
		<div className="relative h-[60vh] w-full overflow-hidden bg-stone-50 sm:h-[70vh] md:h-[calc(100vh-113px)]">
			<AnimatePresence mode="wait">
				<motion.div
					animate={{ opacity: 1 }}
					className="absolute inset-0 h-full w-full"
					exit={{ opacity: 0 }}
					initial={{ opacity: 0 }}
					key={current}
					transition={{ duration: 1 }}
				>
					<div className="absolute inset-0">
						<Image
							alt={slide.title}
							className="h-full w-full object-cover"
							fill
							priority={current === 0}
							sizes="100vw"
							src={slide.image}
						/>
						<div className="absolute inset-0 bg-black/40 backdrop-brightness-75" />
					</div>

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
							{slide.subtitle}
						</motion.span>
						<motion.h2
							animate={{ opacity: 1, y: 0 }}
							className="mb-8 font-black font-serif text-5xl uppercase leading-none md:text-8xl"
							initial={{ opacity: 0, y: 30 }}
							transition={{ delay: 0.4 }}
						>
							{slide.title.split(" ").map((word, i) => (
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
								className="hover:px-6"
								nativeButton={false}
								render={<Link href={slide.href} />}
								size="lg"
							>
								{slide.cta} <ArrowRight className="ml-2" size={16} />
							</Button>
						</motion.div>
					</div>
				</motion.div>
			</AnimatePresence>

			{slides.length > 1 && (
				<>
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

					<div className="absolute bottom-10 left-6 z-10 flex gap-1 md:left-20">
						{slides.map((_, i) => (
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
				</>
			)}
		</div>
	);
}

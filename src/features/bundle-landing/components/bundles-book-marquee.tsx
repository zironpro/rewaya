"use client";

import * as React from "react";

import Image from "next/image";

import AutoScroll from "embla-carousel-auto-scroll";

import {
	Carousel,
	type CarouselApi,
	CarouselContent,
	CarouselItem,
} from "@/components/ui/carousel";

import type { BundleBookSlide } from "../lib/bundlesIndexData";

interface BundlesBookMarqueeProps {
	slides: BundleBookSlide[];
}

const MARQUEE_CAROUSEL_OPTS = {
	align: "start" as const,
	dragFree: true,
	loop: true,
};

function usePrefersReducedMotion() {
	return React.useSyncExternalStore(
		(onStoreChange) => {
			const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
			mq.addEventListener("change", onStoreChange);
			return () => mq.removeEventListener("change", onStoreChange);
		},
		() => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
		() => false
	);
}

function BookSlideCard({ slide }: { slide: BundleBookSlide }) {
	return (
		<figure className="w-[120px] shrink-0 sm:w-[140px] md:w-[160px]">
			<div className="book-shadow relative aspect-3/4 overflow-hidden rounded-md">
				<Image
					alt={slide.title}
					className="object-cover"
					fill
					sizes="(max-width: 640px) 120px, 160px"
					src={slide.image}
				/>
			</div>
			<figcaption className="mt-2 line-clamp-2 text-secondary text-xs">
				{slide.title}
			</figcaption>
		</figure>
	);
}

export function BundlesBookMarquee({ slides }: BundlesBookMarqueeProps) {
	const prefersReducedMotion = usePrefersReducedMotion();
	const [api, setApi] = React.useState<CarouselApi>();

	const autoScrollPlugin = React.useRef(
		AutoScroll({
			direction: "forward",
			playOnInit: true,
			speed: 1.15,
			stopOnInteraction: true,
			stopOnMouseEnter: true,
		})
	);

	const plugins = React.useMemo(
		() => (prefersReducedMotion ? [] : [autoScrollPlugin.current]),
		[prefersReducedMotion]
	);

	React.useEffect(() => {
		if (!api || prefersReducedMotion) return;
		api.plugins()?.autoScroll?.play();
	}, [api, prefersReducedMotion]);

	if (slides.length === 0) return null;

	return (
		<section
			aria-label="Books included in our bundles"
			className="border-border/60 border-y bg-muted/50 py-10 md:py-12"
		>
			<div className="container mb-6 text-center">
				<p className="font-medium text-primary text-xs uppercase tracking-[0.2em]">
					Inside every bundle
				</p>
				<h2 className="mt-2 font-display text-secondary text-xl md:text-2xl">
					Every title you bring home
				</h2>
			</div>

			{prefersReducedMotion ? (
				<div className="container">
					<div className="flex flex-wrap justify-center gap-4">
						{slides.map((slide) => (
							<BookSlideCard key={slide.id} slide={slide} />
						))}
					</div>
				</div>
			) : (
				<div className="container px-0 sm:px-4">
					<Carousel
						className="w-full"
						opts={MARQUEE_CAROUSEL_OPTS}
						plugins={plugins}
						setApi={setApi}
					>
						<CarouselContent className="-ml-3 md:-ml-4">
							{slides.map((slide) => (
								<CarouselItem
									className="basis-[120px] pl-3 sm:basis-[140px] md:basis-[160px] md:pl-4"
									key={slide.id}
								>
									<BookSlideCard slide={slide} />
								</CarouselItem>
							))}
						</CarouselContent>
					</Carousel>
				</div>
			)}
		</section>
	);
}

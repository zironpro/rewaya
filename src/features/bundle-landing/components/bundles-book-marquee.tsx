"use client";

import * as React from "react";

import AutoScroll from "embla-carousel-auto-scroll";

import {
	Carousel,
	type CarouselApi,
	CarouselContent,
	CarouselItem,
} from "@/components/ui/carousel";

import type { BundleBookSlide } from "../lib/bundlesIndexData";
import { BookSlideCard } from "./ui/book-slide-card";

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

export function BundlesBookMarquee({ slides }: BundlesBookMarqueeProps) {
	const prefersReducedMotion = usePrefersReducedMotion();
	const [api, setApi] = React.useState<CarouselApi>();

	const autoScrollPlugin = React.useRef(
		AutoScroll({
			direction: "forward",
			playOnInit: true,
			speed: 1.15,
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
			<div className="mb-6 text-center">
				<p className="font-medium text-primary text-xs uppercase tracking-[0.2em]">
					Inside every bundle
				</p>
				<h2 className="mt-1 font-bold font-display text-2xl text-secondary md:text-3xl">
					Every title you bring home
				</h2>
			</div>

			{prefersReducedMotion ? (
				<div>
					<div className="flex flex-wrap justify-center gap-4">
						{slides.map((slide) => (
							<BookSlideCard key={slide.id} slide={slide} />
						))}
					</div>
				</div>
			) : (
				<div className="campaign-marquee-wrap">
					<Carousel
						className="w-full"
						opts={MARQUEE_CAROUSEL_OPTS}
						plugins={plugins}
						setApi={setApi}
					>
						<CarouselContent className="-ml-4 flex gap-6">
							{slides.map((slide) => (
								<CarouselItem
									className="basis-[120px] pl-3 sm:basis-[140px] md:basis-[220px] md:pl-6"
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

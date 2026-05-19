"use client";

import * as React from "react";

import Image from "next/image";

import WheelGestures from "embla-carousel-wheel-gestures";

import {
	Carousel,
	type CarouselApi,
	CarouselContent,
	CarouselItem,
} from "@/components/ui/carousel";

import type { Bundle } from "@/lib/bundles-data";
import { cn } from "@/lib/utils";

interface BundleImageGalleryProps {
	bundle: Bundle;
}

export function BundleImageGallery({ bundle }: BundleImageGalleryProps) {
	const [api, setApi] = React.useState<CarouselApi>();
	const [current, setCurrent] = React.useState(0);

	const carouselImages = [
		bundle.mainImage,
		...bundle.books.map((book) => book.image),
	];

	React.useEffect(() => {
		if (!api) return;
		setCurrent(api.selectedScrollSnap());
		api.on("select", () => {
			setCurrent(api.selectedScrollSnap());
		});
	}, [api]);

	return (
		<div className="lg:sticky lg:top-28">
			{/* Mobile horizontal thumbs */}
			<div className="no-scrollbar mb-3 flex gap-2 overflow-x-auto md:hidden">
				{carouselImages.map((src, i) => (
					<button
						className={cn(
							"relative size-12 shrink-0 overflow-hidden rounded-lg border-2 transition-all",
							current === i
								? "border-primary"
								: "border-stone-100"
						)}
						key={`mobile-${src}`}
						onClick={() => api?.scrollTo(i)}
						type="button"
					>
						<Image
							alt={`Thumb ${i}`}
							className="object-cover"
							fill
							sizes="48px"
							src={src}
						/>
					</button>
				))}
			</div>

			<div className="flex gap-4">
				{/* Desktop vertical thumbs */}
				<div className="no-scrollbar hidden max-h-[500px] shrink-0 flex-col gap-2 overflow-y-auto md:flex">
					{carouselImages.map((src, i) => (
						<button
							className={cn(
								"relative size-14 shrink-0 overflow-hidden rounded-lg border-2 transition-all",
								current === i
									? "scale-105 border-primary"
									: "border-stone-100 hover:border-primary/40"
							)}
							key={src}
							onMouseEnter={() => api?.scrollTo(i)}
							type="button"
						>
							<Image
								alt={`Thumb ${i}`}
								className="object-cover"
								fill
								sizes="56px"
								src={src}
							/>
						</button>
					))}
				</div>

				<div className="w-full min-w-0">
					<Carousel
						className="w-full"
						opts={{ loop: false }}
						plugins={[WheelGestures()]}
						setApi={setApi}
					>
						<CarouselContent>
							{carouselImages.map((src) => (
								<CarouselItem key={src}>
									<div className="group relative flex aspect-square w-full items-center justify-center overflow-hidden rounded-2xl">
										<Image
											alt={bundle.title}
											className="object-cover transition-transform duration-300 group-hover:scale-105"
											fill
											sizes="(max-width: 1024px) 100vw, 400px"
											src={src}
										/>
									</div>
								</CarouselItem>
							))}
						</CarouselContent>
					</Carousel>

					{/* Dot indicators — mobile only */}
					<div className="mt-3 flex justify-center gap-1.5 md:hidden">
						{carouselImages.map((src, i) => (
							<button
								aria-label={`Go to image ${i + 1}`}
								className={cn(
									"size-2 rounded-full transition-colors",
									current === i ? "bg-primary" : "bg-stone-200"
								)}
								key={`dot-${src}`}
								onClick={() => api?.scrollTo(i)}
								type="button"
							/>
						))}
					</div>
				</div>
			</div>
		</div>
	);
}

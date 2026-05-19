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
		<div className="sticky top-28">
			<div className="flex gap-4">
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
			</div>
		</div>
	);
}

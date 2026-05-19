"use client";

import Image from "next/image";

import WheelGestures from "embla-carousel-wheel-gestures";
import { User as UserIcon } from "lucide-react";

import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from "@/components/ui/carousel";

import type { Book } from "@/lib/bundles-data";

import { BundleSectionHeading } from "./bundle-section-heading";

interface BundleIncludedVolumesProps {
	books: Book[];
}

export function BundleIncludedVolumes({ books }: BundleIncludedVolumesProps) {
	return (
		<section className="my-20">
			<div className="mb-6 flex items-end justify-between">
				<BundleSectionHeading
					eyebrow="The collection archive"
					highlight="volumes"
					title="Included"
				/>
			</div>

			<Carousel
				className="w-full"
				opts={{ align: "start", loop: false }}
				plugins={[WheelGestures()]}
			>
				<CarouselContent className="-ml-6">
					{books.map((book) => (
						<CarouselItem
							className="pl-6 md:basis-1/2 lg:basis-2/3 xl:basis-1/2"
							key={book.id}
						>
							<div className="group relative flex h-full flex-col items-start gap-8 rounded-lg border bg-secondary-foreground p-6 transition-all hover:border-primary/20 hover:bg-white md:flex-row">
								<div className="relative aspect-square shrink-0 transform overflow-hidden rounded-md bg-white shadow-sm transition-transform group-hover:scale-105 md:w-60">
									<Image
										alt={book.title}
										className="object-cover"
										fill
										sizes="(max-width: 768px) 100vw, 176px"
										src={book.image}
									/>
								</div>

								<div className="flex h-full grow flex-col">
									<div className="mb-4">
										<h4 className="mb-1 font-black text-2xl text-secondary leading-tight tracking-tight transition-colors group-hover:text-primary">
											{book.title}
										</h4>
										<div className="flex items-center gap-2 font-bold text-primary text-sm">
											<UserIcon size={12} />
											<span>{book.author}</span>
										</div>
									</div>

									<p className="mb-6 line-clamp-3 font-medium text-[12px] text-stone-500 leading-relaxed">
										{book.overview}
									</p>

									<div className="mt-auto grid grid-cols-2 gap-x-8 gap-y-4 border-stone-100 border-t">
										<BookMeta label="ISBN" value={book.isbn} />
										<BookMeta label="Publisher" value={book.publisher} />
										<BookMeta label="Language" value={book.language} />
										<BookMeta label="Genre" value={book.genre} />
									</div>
								</div>
							</div>
						</CarouselItem>
					))}
				</CarouselContent>

				<CarouselPrevious />
				<CarouselNext />
			</Carousel>
		</section>
	);
}

function BookMeta({ label, value }: { label: string; value: string }) {
	return (
		<div className="flex flex-col">
			<span className="mb-1 font-bold text-sm text-stone-300">{label}</span>
			<span className="font-bold text-secondary text-sm">{value}</span>
		</div>
	);
}

import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from "@/components/ui/carousel";

import { CountdownTimer } from "@/features/products/components/timer";

import BookCard, { BookProps } from "./book-card";

const navButtonClass =
	"static size-11 translate-x-0 translate-y-0 rounded-full border-stone-100 text-stone-400 hover:border-primary hover:bg-stone-50 hover:text-primary disabled:opacity-40";

interface ProductStripProps {
	title: string;
	subtitle?: string;
	books: BookProps[];
}

export default function ProductStrip({
	title,
	subtitle,
	books,
}: ProductStripProps) {
	return (
		<section className="group/strip container mx-auto pb-16">
			<Carousel
				className="w-full"
				opts={{ align: "start", dragFree: true, loop: false }}
			>
				<div className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
					<div>
						{subtitle && (
							<span className="mb-3 block font-bold text-base text-primary uppercase tracking-wider">
								{subtitle}
							</span>
						)}
						<div className="flex flex-wrap items-center gap-4 md:gap-6">
							<h2 className="whitespace-nowrap font-black font-serif text-2xl md:text-4xl">
								{title.split(" ").map((word, i) => (
									<span
										className={i % 2 !== 0 ? "font-normal italic" : ""}
										key={Number(i + 1)}
									>
										{word}{" "}
									</span>
								))}
							</h2>
							{title === "Today's Deals" && <CountdownTimer />}
						</div>
					</div>
					<div className="flex gap-2">
						<CarouselPrevious
							className={navButtonClass}
							size="icon"
							variant="outline"
						/>
						<CarouselNext
							className={navButtonClass}
							size="icon"
							variant="outline"
						/>
					</div>
				</div>

				<CarouselContent className="-ml-6 pb-8">
					{books.map((book, i) => (
						<CarouselItem
							className="basis-[240px] pl-6 md:basis-[280px]"
							key={`${book.id}-${Number(i + 1)}`}
						>
							<BookCard {...book} />
						</CarouselItem>
					))}
					<CarouselItem className="flex basis-[240px] pl-6 md:basis-[280px]">
						<div className="group flex h-full min-h-0 w-full cursor-pointer items-center justify-center border-2 border-stone-100 border-dashed transition-colors hover:border-primary/30">
							<div className="text-center">
								<span className="font-bold text-stone-300 text-xm transition-colors group-hover:text-primary">
									View All <br /> Collection
								</span>
							</div>
						</div>
					</CarouselItem>
				</CarouselContent>
			</Carousel>
		</section>
	);
}

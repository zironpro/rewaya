import Image from "next/image";
import Link from "next/link";

import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from "@/components/ui/carousel";
import type { StoreCategory } from "@/lib/wix/categories";

const fallbackCategories = [
	{
		name: "Islamic",
		image: "/categories/islamic.png",
		href: "/shop?category=islamic",
	},
	{
		name: "Children",
		image: "/categories/children.png",
		href: "/shop?category=children",
	},
	{
		name: "Academic",
		image: "/categories/academic.png",
		href: "/shop?category=academic",
	},
	{
		name: "Fiction",
		image: "/categories/fiction.png",
		href: "/shop?category=fiction",
	},
	{
		name: "Self-Help",
		image: "/categories/selfhelp.png",
		href: "/shop?category=selfhelp",
	},
	{
		name: "History",
		image: "/categories/history.png",
		href: "/shop?category=history",
	},
	{
		name: "Biographies",
		image: "/categories/biographies.png",
		href: "/shop?category=biographies",
	},
];

interface CategoryStripProps {
	categories?: StoreCategory[];
}

export function CategoryStrip({ categories = [] }: CategoryStripProps) {
	const items =
		categories.length > 0
			? categories.map((cat) => ({
					name: cat.name,
					image: cat.imageUrl ?? "/categories/islamic.png",
					href: cat.href,
				}))
			: fallbackCategories;

	return (
		<section className="container w-full py-16">
			<Carousel
				className="w-full"
				opts={{ align: "start", dragFree: true, loop: false }}
			>
				<CarouselContent className="-ml-6">
					{items.map((cat) => (
						<CarouselItem
							className="basis-[70%] pl-6 sm:basis-[45%] md:basis-1/3 lg:basis-1/5"
							key={cat.href}
						>
							<Link
								className="group flex flex-col items-center gap-4"
								href={cat.href}
							>
								<div className="relative mx-auto size-32 overflow-hidden rounded-sm border-2 border-stone-100 bg-stone-50 shadow-sm transition-all group-hover:border-primary/30 group-hover:shadow-xl md:size-48">
									<Image
										alt={cat.name}
										className="object-cover transition-transform duration-700 group-hover:scale-110"
										fill
										sizes="(max-width: 768px) 128px, 192px"
										src={cat.image}
										unoptimized={cat.image.startsWith("http")}
									/>
								</div>
								<span className="text-center font-semibold text-muted-foreground text-sm transition-colors group-hover:text-primary">
									{cat.name}
								</span>
							</Link>
						</CarouselItem>
					))}
				</CarouselContent>

				<CarouselPrevious />
				<CarouselNext />
			</Carousel>
		</section>
	);
}

import Image from "next/image";
import Link from "next/link";

import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from "@/components/ui/carousel";

const categories = [
	{
		name: "Islamic",
		image: "/categories/islamic.png",
		href: "/#islamic",
	},
	{
		name: "Children",
		image: "/categories/children.png",
		href: "/#children",
	},
	{
		name: "Academic",
		image: "/categories/academic.png",
		href: "/#academic",
	},
	{
		name: "Fiction",
		image: "/categories/fiction.png",
		href: "/#fiction",
	},
	{
		name: "Self-Help",
		image: "/categories/selfhelp.png",
		href: "/#selfhelp",
	},
	{
		name: "History",
		image: "/categories/history.png",
		href: "/#history",
	},
	{
		name: "Biographies",
		image: "/categories/biographies.png",
		href: "/#biographies",
	},
];

export default function CategoryStrip() {
	return (
		<section className="container mx-auto w-full py-16">
			<Carousel
				className="w-full"
				opts={{ align: "start", dragFree: true, loop: false }}
			>
				<CarouselContent className="-ml-6">
					{categories.map((cat) => (
						<CarouselItem
							className="basis-[42%] pl-6 sm:basis-1/3 md:basis-1/4 lg:basis-1/5 xl:basis-1/7"
							key={cat.name}
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

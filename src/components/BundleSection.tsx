import Image from "next/image";
import Link from "next/link";

import { ArrowRight, Tag } from "lucide-react";

import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Tooltip, TooltipPopup, TooltipTrigger } from "./ui/tooltip";

const bundles = [
	{
		id: "seeker-set",
		title: "The Modern Seeker",
		count: 5,
		price: 249,
		originalPrice: 310,
		tag: "MOST POPULAR",
		image:
			"https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=800&auto=format&fit=crop",
		books: [
			"Reclaim Your Heart",
			"The Sealed Nectar",
			"Atomic Habits",
			"Deep Work",
			"5 AM Club",
		],
	},
	{
		id: "history-set",
		title: "Islamic History Core",
		count: 4,
		price: 199,
		originalPrice: 260,
		tag: "BEST VALUE",
		image:
			"https://images.unsplash.com/photo-1585032226651-759b368d7246?q=80&w=800&auto=format&fit=crop",
		books: [
			"History of Islam",
			"The Caliphate",
			"Great Explorers",
			"Golden Age",
		],
	},
];

export function BundleSection() {
	return (
		<section className="relative mb-16 overflow-hidden border-y bg-card py-16">
			<div className="container relative z-10 mx-auto">
				<div className="mb-9 flex flex-col items-center justify-between gap-6 text-center md:flex-row md:text-left">
					<div className="max-w-xl">
						<Badge variant="secondary">Special Campaigns</Badge>
						<h2 className="font-bold font-serif text-4xl text-secondary leading-tight md:text-5xl">
							Curated{" "}
							<span className="font-normal text-primary italic">Sets.</span>
						</h2>
					</div>

					<Button
						nativeButton={false}
						render={<Link href="/bundles" />}
						variant="ghost"
					>
						View All <ArrowRight />
					</Button>
				</div>

				<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
					{bundles.map((bundle) => (
						<div
							className="group relative flex cursor-pointer flex-col items-center gap-12 rounded-sm border bg-muted p-6 transition-all duration-500 hover:border-primary sm:flex-row md:p-9"
							key={bundle.id}
						>
							<Link
								className="absolute inset-0"
								href={`/bundle/${bundle.id}`}
							/>
							<div className="relative mb-6 h-44 w-32 shrink-0 sm:mb-0">
								<div className="absolute inset-0 translate-x-[-15px] -rotate-12 transform overflow-hidden border border-stone-100 bg-stone-200 shadow-lg transition-transform duration-500 group-hover:-rotate-15">
									<Image
										alt="Book 3"
										className="object-cover opacity-60"
										fill
										sizes="128px"
										src="https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=300&auto=format&fit=crop"
									/>
								</div>

								<div className="absolute inset-0 translate-x-[15px] rotate-6 transform overflow-hidden border border-stone-200 bg-stone-100 shadow-xl transition-transform duration-500 group-hover:rotate-12">
									<Image
										alt="Book 2"
										className="object-cover opacity-80"
										fill
										sizes="128px"
										src="https://images.unsplash.com/photo-1585032226651-759b368d7246?q=80&w=300&auto=format&fit=crop"
									/>
								</div>
								{/* Book 1 (Front) */}
								<div className="absolute inset-0 rotate-0 transform overflow-hidden border border-stone-300 bg-white shadow-2xl transition-transform duration-500 group-hover:-translate-y-2">
									<Image
										alt={bundle.title}
										className="object-cover"
										fill
										sizes="128px"
										src={bundle.image}
									/>
								</div>

								<Tooltip>
									<TooltipTrigger
										render={
											<span className="absolute -top-3 -right-3 z-20 flex size-8 flex-col items-center justify-center rounded-full border-2 border-white bg-primary text-white shadow-lg" />
										}
									>
										<span className="font-bold text-xs leading-none">
											{bundle.count}
										</span>
									</TooltipTrigger>
									<TooltipPopup>{bundle.count} Books sets</TooltipPopup>
								</Tooltip>
							</div>
							{/* Content */}
							<div className="flex h-full grow flex-col justify-between">
								<div>
									<p className="mb-3 flex items-center gap-2 text-primary text-sm">
										<Tag size={14} />
										{bundle.tag}
									</p>
									<h3 className="mb-2 font-semibold font-serif text-4xl text-secondary transition-colors group-hover:text-primary">
										{bundle.title}
									</h3>
									<p className="mb-6 line-clamp-2 font-medium text-muted-foreground">
										{bundle.books.join(", ")}
									</p>
								</div>
								<div className="flex items-center justify-between">
									<div>
										<span className="mr-2 font-medium text-muted-foreground/60 line-through">
											AED {bundle.originalPrice}
										</span>
										<span className="font-bold text-lg text-secondary">
											AED {bundle.price}
										</span>
									</div>
									<Button>Buy Set</Button>
								</div>
							</div>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}

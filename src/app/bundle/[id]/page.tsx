"use client";

import * as React from "react";

import Link from "next/link";
import { useParams } from "next/navigation";

import WheelGestures from "embla-carousel-wheel-gestures";
import {
	ArrowRight,
	BookOpen,
	Building,
	ChevronDown,
	Globe,
	Heart,
	Mail,
	Share2,
	Star,
	User as UserIcon,
} from "lucide-react";

import BundleCard from "@/components/BundleCard";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import { Button } from "@/components/ui/button";
import {
	Carousel,
	type CarouselApi,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from "@/components/ui/carousel";

import { bundles } from "@/lib/bundles-data";
import { cn } from "@/lib/utils";

export default function BundleDetailPage() {
	const params = useParams();
	const id = params.id as string;
	const [api, setApi] = React.useState<CarouselApi>();
	const [current, setCurrent] = React.useState(0);

	const bundle = bundles.find((b) => b.id === id) || bundles[0];
	const relatedBundles = bundles.filter((b) => b.id !== bundle.id);

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
		<main className="min-h-screen bg-white pt-24 pb-12 font-sans text-secondary">
			<div className="container mx-auto px-4 md:px-8">
				<Breadcrumbs
					className="mt-12 mb-8"
					items={[
						{ label: "Shop", href: "/shop" },
						{ label: "Bundles", href: "/bundles" },
						{ label: bundle.title },
					]}
				/>

				<div className="mb-16 grid grid-cols-1 items-start gap-10 lg:grid-cols-12">
					{/* Column 1: Visuals (lg:col-span-4) */}
					<div className="lg:col-span-4">
						<div className="sticky top-28">
							<div className="flex gap-4">
								{/* Thumbnails */}
								<div className="no-scrollbar hidden max-h-[500px] shrink-0 flex-col gap-2 overflow-y-auto md:flex">
									{carouselImages.map((src, i) => (
										<button
											className={cn(
												"h-14 w-14 overflow-hidden rounded-lg border-2 transition-all",
												current === i
													? "scale-105 border-primary"
													: "border-stone-100 hover:border-primary/40"
											)}
											key={Number(i)}
											onMouseEnter={() => api?.scrollTo(i)}
										>
											<img
												alt={`Thumb ${i}`}
												className="h-full w-full object-cover"
												src={src}
											/>
										</button>
									))}
								</div>

								{/* Main Image */}
								<div className="flex-grow">
									<Carousel
										className="w-full"
										opts={{ loop: false }}
										plugins={[WheelGestures()]}
										setApi={setApi}
									>
										<CarouselContent>
											{carouselImages.map((src, index) => (
												<CarouselItem key={Number(index)}>
													<div className="group relative flex aspect-square w-full items-center justify-center overflow-hidden rounded-2xl border border-stone-100 bg-stone-50">
														<img
															alt={bundle.title}
															className="max-h-[90%] max-w-[90%] object-contain transition-transform duration-700 group-hover:scale-105"
															src={src}
														/>
													</div>
												</CarouselItem>
											))}
										</CarouselContent>
									</Carousel>
								</div>
							</div>
						</div>
					</div>

					{/* Column 2: Product Info (lg:col-span-5) */}
					<div className="space-y-6 lg:col-span-5">
						<div className="space-y-4 border-stone-100 border-b pb-6">
							<div className="flex items-start justify-between gap-4">
								<h1 className="font-black text-3xl text-secondary uppercase leading-tight tracking-tight md:text-4xl">
									{bundle.title}
								</h1>
								<button className="shrink-0 rounded-full border border-stone-100 p-3 transition-colors hover:bg-stone-50">
									<Share2 className="text-stone-500" size={20} />
								</button>
							</div>

							<div className="flex items-center gap-4 text-sm">
								<div className="flex items-center gap-0.5">
									{[1, 2, 3, 4, 5].map((i) => (
										<Star
											className={cn("fill-primary text-primary")}
											key={i}
											size={16}
										/>
									))}
									<ChevronDown className="ml-1 text-stone-400" size={14} />
								</div>
								<Link
									className="font-bold text-primary hover:underline"
									href="#"
								>
									1,171 Verified Ratings
								</Link>
								<div className="h-4 w-px bg-stone-200" />
								<span className="font-medium text-stone-400">
									Curated Collection
								</span>
							</div>
						</div>

						<div className="space-y-4">
							<div className="flex items-baseline gap-4">
								<div className="flex items-baseline">
									<span className="mr-1 font-black text-lg text-primary">
										AED
									</span>
									<span className="font-black text-5xl text-primary">
										{bundle.price}
									</span>
								</div>
								<div className="flex flex-col">
									<span className="font-bold text-lg text-stone-300 line-through">
										AED {bundle.originalPrice}
									</span>
									<span className="font-black text-[12px] text-green-600 uppercase tracking-widest">
										You Save{" "}
										{Math.round(
											(1 - bundle.price / bundle.originalPrice) * 100
										)}
										%
									</span>
								</div>
							</div>
							<p className="max-w-lg text-sm text-stone-500 leading-relaxed">
								The ultimate sequence of literature designed for the profound
								intellectual and spiritual development of the modern seeker.
								Includes {bundle.count} hardcover volumes and exclusive rewards.
							</p>
						</div>

						{/* Product Specs Grid */}
						<div className="grid grid-cols-2 gap-4 pt-4">
							{[
								{
									icon: <UserIcon size={16} />,
									label: "Author",
									value: "Multiple Authors",
								},
								{
									icon: <Building size={16} />,
									label: "Publisher",
									value: "Al-Rewaya Press",
								},
								{
									icon: <Globe size={16} />,
									label: "Language",
									value: "English & Arabic",
								},
								{
									icon: <BookOpen size={16} />,
									label: "Format",
									value: "Hardcover Set",
								},
							].map((spec, i) => (
								<div
									className="flex items-center gap-3 rounded-xl border border-stone-100 bg-stone-50 p-3"
									key={Number(i)}
								>
									<div className="text-primary">{spec.icon}</div>
									<div>
										<p className="font-black text-[9px] text-stone-400 uppercase tracking-widest">
											{spec.label}
										</p>
										<p className="font-bold text-[11px] text-secondary uppercase tracking-wider">
											{spec.value}
										</p>
									</div>
								</div>
							))}
						</div>
					</div>

					{/* Column 3: Buy Box (lg:col-span-3) */}
					<div className="lg:col-span-3">
						<div className="sticky top-28 space-y-6 rounded-[2rem] border-2 border-stone-100 bg-white p-6">
							<div className="space-y-4">
								<div className="border-stone-50 border-b pb-4">
									<span className="font-black text-[10px] text-stone-400 uppercase tracking-widest">
										Bundle Contents
									</span>
									<h3 className="mt-1 font-black text-secondary text-sm uppercase">
										{bundle.count} Essential Volumes
									</h3>
								</div>

								<div className="group/scroll relative">
									<div className="custom-scrollbar no-scrollbar max-h-[280px] space-y-3 overflow-y-auto pr-2">
										{bundle.books.map((book, i) => (
											<div
												className="group/item flex cursor-pointer items-start gap-3"
												key={book.id}
											>
												<span className="mt-0.5 font-black text-[10px] text-primary">
													0{i + 1}
												</span>
												<p className="font-bold text-[11px] text-stone-500 uppercase leading-tight transition-colors group-hover/item:text-primary">
													{book.title}
												</p>
											</div>
										))}
									</div>
									{/* Subtle fade effect at the bottom */}
									<div className="pointer-events-none absolute right-0 bottom-0 left-0 h-8 bg-gradient-to-t from-white to-transparent transition-opacity group-hover/scroll:opacity-0" />
								</div>
							</div>

							<div className="space-y-3 pt-6">
								<Button className="h-14 w-full rounded-2xl bg-secondary font-black text-white text-xs uppercase tracking-[0.2em] transition-all hover:bg-primary active:scale-[0.98]">
									Add to Cart
								</Button>
							</div>

							<button className="group w-full pt-6">
								<div className="flex items-center justify-between border-stone-50 border-t pt-6">
									<span className="font-black text-[11px] uppercase tracking-widest transition-colors group-hover:text-primary">
										Add to Wish List
									</span>
									<Heart
										className="text-stone-300 transition-all group-hover:fill-primary group-hover:text-primary"
										size={16}
									/>
								</div>
							</button>
						</div>
					</div>
				</div>

				{/* Included Volumes Carousel Section */}
				<section className="mt-16 border-stone-100 border-t pt-16">
					<div className="mb-12 flex items-end justify-between">
						<div>
							<span className="mb-2 block font-black text-[10px] text-primary uppercase tracking-[0.4em]">
								The Collection Archive
							</span>
							<h2 className="font-black font-serif text-4xl text-secondary uppercase leading-none tracking-tight md:text-5xl">
								Included{" "}
								<span className="font-normal text-primary italic">Volumes</span>
							</h2>
						</div>
					</div>

					<Carousel
						className="w-full"
						opts={{ align: "start", loop: false }}
						plugins={[WheelGestures()]}
					>
						<CarouselContent className="-ml-6">
							{bundle.books.map((book, i) => (
								<CarouselItem
									className="pl-6 md:basis-1/2 lg:basis-2/3 xl:basis-1/2"
									key={book.id}
								>
									<div className="group relative flex h-full flex-col items-start gap-8 rounded-[2rem] border border-stone-100 bg-stone-50/50 p-8 transition-all hover:border-primary/20 hover:bg-white md:flex-row">
										{/* Book Image */}
										<div className="aspect-[3/4] w-full shrink-0 transform overflow-hidden rounded-2xl bg-white shadow-sm transition-transform group-hover:scale-105 md:w-44">
											<img
												alt={book.title}
												className="h-full w-full object-cover"
												src={book.image}
											/>
										</div>

										{/* Book Info */}
										<div className="flex h-full grow flex-col">
											<div className="mb-4">
												<h4 className="mb-1 font-black text-2xl text-secondary uppercase leading-tight tracking-tight transition-colors group-hover:text-primary">
													{book.title}
												</h4>
												<div className="flex items-center gap-2 font-black text-[10px] text-primary uppercase tracking-widest">
													<UserIcon size={12} />
													<span>{book.author}</span>
												</div>
											</div>

											<p className="mb-6 line-clamp-3 font-medium text-[12px] text-stone-500 leading-relaxed">
												{book.overview}
											</p>

											<div className="mt-auto grid grid-cols-2 gap-x-8 gap-y-4 border-stone-100 border-t pt-6">
												<div className="flex flex-col">
													<span className="mb-1 font-black text-[9px] text-stone-300 uppercase tracking-widest">
														ISBN
													</span>
													<span className="font-bold text-[11px] text-secondary uppercase">
														{book.isbn}
													</span>
												</div>
												<div className="flex flex-col">
													<span className="mb-1 font-black text-[9px] text-stone-300 uppercase tracking-widest">
														Publisher
													</span>
													<span className="font-bold text-[11px] text-secondary uppercase">
														{book.publisher}
													</span>
												</div>
												<div className="flex flex-col">
													<span className="mb-1 font-black text-[9px] text-stone-300 uppercase tracking-widest">
														Language
													</span>
													<span className="font-bold text-[11px] text-secondary uppercase">
														{book.language}
													</span>
												</div>
												<div className="flex flex-col">
													<span className="mb-1 font-black text-[9px] text-stone-300 uppercase tracking-widest">
														Genre
													</span>
													<span className="font-bold text-[11px] text-secondary uppercase">
														{book.genre}
													</span>
												</div>
											</div>
										</div>
									</div>
								</CarouselItem>
							))}
						</CarouselContent>
						<div className="mt-8 flex justify-end gap-3">
							<CarouselPrevious className="static h-12 w-12 translate-y-0 rounded-full border-stone-100 shadow-none transition-all hover:bg-primary hover:text-white" />
							<CarouselNext className="static h-12 w-12 translate-y-0 rounded-full border-stone-100 shadow-none transition-all hover:bg-primary hover:text-white" />
						</div>
					</Carousel>
				</section>

				{/* Related Bundles Section */}
				{relatedBundles.length > 0 && (
					<section className="mt-12 border-stone-100 border-t pt-12">
						<div className="mb-12 flex items-end justify-between">
							<div>
								<span className="mb-2 block font-black text-[10px] text-primary uppercase tracking-[0.4em]">
									Continue Exploring
								</span>
								<h2 className="font-black font-serif text-4xl text-secondary uppercase leading-none tracking-tight md:text-5xl">
									Related{" "}
									<span className="font-normal text-primary italic">
										Collections
									</span>
								</h2>
							</div>
						</div>

						<div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
							{relatedBundles.slice(0, 4).map((b) => (
								<BundleCard key={b.id} {...b} />
							))}
						</div>
					</section>
				)}

				{/* Compact Newsletter CTA */}
				<section className="mx-auto mt-16 mb-8 max-w-5xl">
					<div className="relative overflow-hidden rounded-[2.5rem] border border-stone-100 bg-stone-50 p-8 md:p-12">
						<div className="relative z-10 flex flex-col items-center gap-10 md:flex-row">
							<div className="flex-1 space-y-4">
								<div className="flex items-center gap-3">
									<div className="h-px w-8 bg-primary/30" />
									<span className="font-black text-[9px] text-primary uppercase tracking-[0.4em]">
										The Weekly Review
									</span>
								</div>
								<h2 className="font-black font-serif text-3xl text-secondary uppercase leading-none tracking-tight md:text-4xl">
									JOIN THE{" "}
									<span className="font-normal text-primary italic">
										INNER CIRCLE
									</span>
								</h2>
								<p className="max-w-sm font-medium text-[12px] text-stone-400 leading-relaxed">
									Exclusive access to limited drops, curated sets, and scholarly
									insights.
								</p>
							</div>

							<div className="w-full md:w-auto">
								<div className="flex flex-col gap-3 sm:flex-row">
									<div className="relative">
										<Mail
											className="absolute top-1/2 left-5 -translate-y-1/2 text-stone-300"
											size={16}
										/>
										<input
											className="h-14 w-full rounded-2xl border border-stone-200 bg-white pr-6 pl-12 font-black text-[10px] text-secondary uppercase tracking-widest transition-all focus:border-primary focus:outline-none sm:w-[260px]"
											placeholder="EMAIL ADDRESS"
											type="email"
										/>
									</div>
									<Button className="group h-14 rounded-2xl bg-secondary px-8 font-black text-[10px] text-white uppercase tracking-[0.2em] transition-all hover:bg-primary">
										JOIN NOW{" "}
										<ArrowRight
											className="ml-2 transition-transform group-hover:translate-x-1"
											size={14}
										/>
									</Button>
								</div>
								<p className="mt-3 text-center text-[9px] text-stone-300 uppercase tracking-widest md:text-left">
									Agreed to our{" "}
									<Link
										className="underline transition-colors hover:text-secondary"
										href="#"
									>
										Privacy Policy
									</Link>
								</p>
							</div>
						</div>
					</div>
				</section>
			</div>
		</main>
	);
}

"use client";

import Link from "next/link";
import { useState } from "react";

import { SlidersHorizontal, Search } from "lucide-react";

import Breadcrumbs from "@/components/layout/Breadcrumbs";
import { MobileFilterDrawer } from "@/components/layout/mobile-filter-drawer";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";

import { BookCard } from "@/features/products/components/book-card";
import type { BookProps } from "@/lib/store";
import type { StoreCategory } from "@/lib/wix/categories";

interface ShopViewProps {
	books: BookProps[];
	categories?: StoreCategory[];
	activeCategory?: string;
	searchQuery?: string;
}

export const ShopView = ({
	books,
	categories = [],
	activeCategory,
	searchQuery,
}: ShopViewProps) => {
	const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

	const sidebarCategories: Array<
		| { type: "all"; name: string; count: number }
		| { type: "wix"; category: StoreCategory }
	> = [
		{ type: "all", name: "All", count: books.length },
		...categories.map((category) => ({ type: "wix" as const, category })),
	];

	const FilterContent = ({ onClose }: { onClose?: () => void }) => (
		<div className="space-y-12">
			<div className="lg:hidden">
				<h3 className="mb-4 border-stone-100 border-b pb-4 font-bold text-sm">
					Sort by
				</h3>
				<select className="h-12 w-full cursor-pointer border border-stone-100 bg-stone-50 px-4 font-bold text-sm outline-none">
					<option>Newest first</option>
					<option>Price: Low to high</option>
					<option>Price: High to low</option>
				</select>
			</div>

			<div>
				<h3 className="mb-8 border-stone-100 border-b pb-4 font-bold text-sm">
					Categories
				</h3>
				<div className="flex flex-col gap-2">
					{sidebarCategories.map((item) => {
						if (item.type === "all") {
							const isActive = !activeCategory;
							return (
								<Link
									className={`inline-flex h-10 w-full items-center justify-between rounded-sm px-2 text-sm transition-colors hover:bg-stone-50 ${isActive ? "bg-stone-50" : ""}`}
									href="/shop"
									key="all"
								>
									<span>{item.name}</span>
									<span className="text-[8px] text-stone-300">({item.count})</span>
								</Link>
							);
						}

						const { category } = item;
						const isActive = activeCategory === category.slug;
						const count = category.productCount ?? 0;

						return (
							<Link
								className={`inline-flex h-10 w-full items-center justify-between rounded-sm px-2 text-sm transition-colors hover:bg-stone-50 ${isActive ? "bg-stone-50" : ""}`}
								href={category.href}
								key={category.id}
							>
								<span>{category.name}</span>
								<span className="text-[8px] text-stone-300">({count})</span>
							</Link>
						);
					})}
				</div>
			</div>

			<div>
				<h3 className="mb-8 border-stone-100 border-b pb-4 font-bold text-sm">
					Price Range
				</h3>
				<div className="space-y-4">
					<div className="flex flex-col gap-2">
						<input
							className="w-full accent-primary"
							max="200"
							min="0"
							type="range"
						/>
						<div className="flex justify-between font-bold text-sm text-stone-400">
							<span>$0</span>
							<span>$200+</span>
						</div>
					</div>
				</div>
			</div>

			<div>
				<h3 className="mb-8 border-stone-100 border-b pb-4 font-bold text-sm">
					Availability
				</h3>
				<div className="space-y-4">
					<div className="flex items-center space-x-3">
						<Checkbox id="in-stock" />
						<label
							className="cursor-pointer font-bold text-sm"
							htmlFor="in-stock"
						>
							In stock
						</label>
					</div>
					<div className="flex items-center space-x-3">
						<Checkbox id="pre-order" />
						<label
							className="cursor-pointer font-bold text-sm"
							htmlFor="pre-order"
						>
							Pre-order
						</label>
					</div>
				</div>
			</div>

			<div className="pt-8 lg:hidden">
				<Button
					className="h-12 w-full text-sm"
					onClick={onClose}
					variant="outline"
				>
					Apply Filters
				</Button>
			</div>
		</div>
	);

	return (
		<>
			<main className="grow pt-6 pb-28 md:pb-16">
				<section className="container md:mb-12">
					<Breadcrumbs className="mb-4 md:mb-8" items={[{ label: "Shop" }]} />
					<div className="text-center">
						<span className="mb-2 block font-medium text-muted-foreground text-xs sm:text-sm">
							Collection
						</span>
						<h1 className="mb-4 font-bold font-display text-4xl text-secondary sm:text-5xl md:mb-8 md:text-6xl lg:text-7xl">
							The <span className="text-primary italic">Library.</span>
						</h1>
					</div>
				</section>

				<section className="container mb-8">
					<form action="/shop" className="relative mx-auto max-w-xl" method="get">
						{activeCategory ? (
							<input name="category" type="hidden" value={activeCategory} />
						) : null}
						<Search
							className="absolute top-1/2 left-4 -translate-y-1/2 text-stone-400"
							size={18}
						/>
						<Input
							className="h-12 border-stone-100 bg-stone-50 pr-24 pl-11"
							defaultValue={searchQuery}
							name="q"
							placeholder="Search books..."
							type="search"
						/>
						<Button
							className="absolute top-1/2 right-1.5 -translate-y-1/2"
							size="sm"
							type="submit"
						>
							Search
						</Button>
					</form>
				</section>

				<section className="container mb-8 flex gap-4 lg:hidden">
					<Button
						className="h-12 flex-1 border-stone-100 font-bold text-sm"
						onClick={() => setIsMobileFilterOpen(true)}
						variant="outline"
					>
						<SlidersHorizontal className="mr-2" size={14} /> Filter & Sort
					</Button>
				</section>

				<section className="container mb-32">
					<div className="flex flex-col gap-16 lg:flex-row">
						<aside className="scrollbar-thin sticky top-32 hidden h-fit max-h-[calc(100vh-160px)] w-64 shrink-0 space-y-12 overflow-y-auto pr-4 lg:block">
							<FilterContent />
						</aside>

						<div className="grow">
							<div className="mb-12 hidden items-center justify-between border-stone-100 border-b pb-4 lg:flex">
								<p className="font-bold text-sm text-stone-400">
									Showing {books.length} results
									{searchQuery ? ` for "${searchQuery}"` : ""}
									{activeCategory
										? ` in ${categories.find((c) => c.slug === activeCategory)?.name ?? activeCategory}`
										: ""}
								</p>
								<div className="flex items-center gap-6">
									<span className="font-bold text-sm text-stone-400">
										Sort by:
									</span>
									<select className="cursor-pointer bg-transparent font-bold text-sm outline-none">
										<option>Newest first</option>
										<option>Price: Low to high</option>
										<option>Price: High to low</option>
									</select>
								</div>
							</div>

							{books.length === 0 ? (
								<p className="py-16 text-center text-muted-foreground">
									No books found. Try another search or category.
								</p>
							) : (
								<div className="grid grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
									{books.map((book) => (
										<BookCard key={book.wixProductId ?? book.id} {...book} />
									))}
								</div>
							)}
						</div>
					</div>
				</section>
			</main>

			<MobileFilterDrawer
				onOpenChange={setIsMobileFilterOpen}
				open={isMobileFilterOpen}
			>
				<FilterContent onClose={() => setIsMobileFilterOpen(false)} />
			</MobileFilterDrawer>
		</>
	);
};

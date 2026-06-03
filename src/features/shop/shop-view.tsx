"use client";

import { useState } from "react";

import Link from "next/link";

import { SlidersHorizontal } from "lucide-react";

import Breadcrumbs from "@/components/layout/Breadcrumbs";
import { MobileFilterDrawer } from "@/components/layout/mobile-filter-drawer";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

import { BookCard } from "@/features/products/components/book-card";
import { type BookProps, getBookReactKey } from "@/lib/store";
import { cn } from "@/lib/utils";
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
				<h3 className="mb-4 border-b pb-1 font-semiboldtext-sm">Sort by</h3>
				<select className="h-12 w-full cursor-pointer border px-4 font-bold text-sm outline-none">
					<option>Newest first</option>
					<option>Price: Low to high</option>
					<option>Price: High to low</option>
				</select>
			</div>

			<div>
				<h3 className="mb-4 border-b pb-1 font-semibold text-sm">Categories</h3>
				<div className="flex flex-col gap-1">
					{sidebarCategories.map((item) => {
						if (item.type === "all") {
							const isActive = !activeCategory;
							return (
								<Link
									className={cn(
										"inline-flex h-8 w-full items-center justify-between rounded-sm px-2 text-sm transition-colors hover:bg-accent/80",
										isActive ? "bg-accent text-accent-foreground" : ""
									)}
									href="/shop"
									key="all"
								>
									<span>{item.name}</span>
									<span className="text-[9px] text-mauve-500 tabular-nums">
										{item.count}
									</span>
								</Link>
							);
						}

						const { category } = item;
						const isActive = activeCategory === category.slug;
						const count = category.productCount ?? 0;

						return (
							<Link
								className={cn(
									"inline-flex h-8 w-full items-center justify-between rounded-sm px-2 text-sm transition-colors hover:bg-accent/80 hover:text-accent-foreground",
									isActive ? "bg-accent text-accent-foreground" : ""
								)}
								href={category.href}
								key={`${category.slug}-${category.name}`}
							>
								<span>{category.name}</span>
								<span className="text-[9px] text-mauve-500 tabular-nums">
									{count}
								</span>
							</Link>
						);
					})}
				</div>
			</div>

			<div>
				<h3 className="mb-4 border-b pb-1 font-semibold text-sm">
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
						<div className="flex justify-between font-medium text-muted-foreground text-sm">
							<span>AED 0</span>
							<span>AED 200+</span>
						</div>
					</div>
				</div>
			</div>

			<div>
				<h3 className="mb-4 border-b pb-1 font-semibold text-sm">
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
			<main className="grow pt-4 pb-28 md:pt-6 md:pb-16">
				<section className="container md:mb-4">
					<Breadcrumbs className="mb-3" items={[{ label: "Shop" }]} />
					<div className="flex items-center justify-between text-center">
						{/* <span className="mb-2 block font-medium text-muted-foreground text-xs sm:text-sm">
							Collection
						</span> */}
						<h1 className="mb-4 font-bold font-display text-3xl text-secondary sm:text-4xl md:mb-4 md:text-5xl">
							The <span className="text-primary italic">Library.</span>
						</h1>

						<Button
							onClick={() => setIsMobileFilterOpen(true)}
							variant="outline"
						>
							<SlidersHorizontal className="mr-2" size={14} /> Filter & Sort
						</Button>
					</div>
				</section>

				<section className="container mb-32">
					<div className="flex flex-col gap-9 lg:flex-row">
						<aside className="scrollbar-thin sticky top-32 hidden h-fit max-h-[calc(100vh-160px)] w-64 shrink-0 space-y-12 overflow-y-auto pr-4 lg:block">
							<FilterContent />
						</aside>

						<div className="grow">
							<div className="lg:medium mb-4 hidden items-center justify-between border-mauve-100 border-b font-semibold">
								<p className="font-bold text-mauve-400 text-sm">
									Showing {books.length} results
									{searchQuery ? ` for "${searchQuery}"` : ""}
									{activeCategory
										? ` in ${categories.find((c) => c.slug === activeCategory)?.name ?? activeCategory}`
										: ""}
								</p>
								<div className="flex items-center gap-6">
									<span className="font-bold text-mauve-400 text-sm">
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
								<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
									{books.map((book, index) => (
										<BookCard key={getBookReactKey(book, index)} {...book} />
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

"use client";

import { useState } from "react";

import { AnimatePresence, motion } from "framer-motion";
import { SlidersHorizontal, X } from "lucide-react";

import Breadcrumbs from "@/components/layout/Breadcrumbs";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

import BookCard from "@/features/products/components/book-card";
import { allBooks } from "@/features/products/data/products";

const categories = [
	"All",
	"Islamic",
	"Self-Help",
	"Fiction",
	"Philosophy",
	"Spirituality",
];

export const ShopView = () => {
	const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

	const FilterContent = () => (
		<div className="space-y-12">
			<div>
				<h3 className="mb-8 border-stone-100 border-b pb-4 font-bold text-xm">
					Categories
				</h3>
				<div className="flex flex-col gap-2">
					{categories.map((cat) => (
						<Button
							className="h-10 justify-between px-2 hover:bg-stone-50"
							key={cat}
							variant="ghost"
						>
							<span className="text-xm">{cat}</span>
							<span className="text-[8px] text-stone-300 group-hover:text-black">
								(
								{cat === "ALL"
									? allBooks.length
									: allBooks.filter(
											(b) => b.category.toLowerCase() === cat.toLowerCase()
										).length}
								)
							</span>
						</Button>
					))}
				</div>
			</div>

			<div>
				<h3 className="mb-8 border-stone-100 border-b pb-4 font-bold text-xm">
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
						<div className="flex justify-between font-bold text-stone-400 text-xm">
							<span>$0</span>
							<span>$200+</span>
						</div>
					</div>
				</div>
			</div>

			<div>
				<h3 className="mb-8 border-stone-100 border-b pb-4 font-bold text-xm">
					Availability
				</h3>
				<div className="space-y-4">
					<div className="flex items-center space-x-3">
						<Checkbox id="in-stock" />
						<label
							className="cursor-pointer font-bold text-xm"
							htmlFor="in-stock"
						>
							In stock
						</label>
					</div>
					<div className="flex items-center space-x-3">
						<Checkbox id="pre-order" />
						<label
							className="cursor-pointer font-bold text-xm"
							htmlFor="pre-order"
						>
							Pre-order
						</label>
					</div>
				</div>
			</div>

			<div className="pt-8">
				<Button
					className="h-12 w-full text-xm"
					onClick={() => setIsMobileFilterOpen(false)}
					variant="outline"
				>
					Apply Filters
				</Button>
			</div>
		</div>
	);

	return (
		<>
			<main className="grow pt-20">
				{/* Header */}
				<section className="container mx-auto mb-12 px-6">
					<Breadcrumbs className="mb-8" items={[{ label: "Shop" }]} />
					<div className="text-center">
						<span className="mb-6 block font-bold text-stone-400 text-xm">
							Collection
						</span>
						<h1 className="mb-8 font-black font-serif text-5xl md:text-7xl">
							The <span className="font-normal italic">Library</span>.
						</h1>
					</div>
				</section>

				{/* Mobile Filter Toggle */}
				<section className="container mx-auto mb-8 flex gap-4 px-6 lg:hidden">
					<Button
						className="h-12 flex-1 border-stone-100 font-bold text-xm"
						onClick={() => setIsMobileFilterOpen(true)}
						variant="outline"
					>
						<SlidersHorizontal className="mr-2" size={14} /> Filter & Sort
					</Button>
				</section>

				{/* Main Content Area */}
				<section className="container mx-auto mb-32 px-6">
					<div className="flex flex-col gap-16 lg:flex-row">
						{/* Sidebar Filters (Desktop Only) */}
						<aside className="scrollbar-thin sticky top-32 hidden h-fit max-h-[calc(100vh-160px)] w-64 shrink-0 space-y-12 overflow-y-auto pr-4 lg:block">
							<FilterContent />
						</aside>

						{/* Product Grid Area */}
						<div className="grow">
							<div className="mb-12 hidden items-center justify-between border-stone-100 border-b pb-4 lg:flex">
								<p className="font-bold text-stone-400 text-xm">
									Showing {allBooks.length} results
								</p>
								<div className="flex items-center gap-6">
									<span className="font-bold text-stone-400 text-xm">
										Sort by:
									</span>
									<select className="cursor-pointer bg-transparent font-bold text-xm outline-none">
										<option>Newest first</option>
										<option>Price: Low to high</option>
										<option>Price: High to low</option>
									</select>
								</div>
							</div>

							<div className="grid grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-2 xl:grid-cols-3">
								{allBooks.map((book) => (
									<BookCard key={book.id} {...book} />
								))}
							</div>
						</div>
					</div>
				</section>
			</main>

			{/* Mobile Filter Drawer */}
			<AnimatePresence>
				{isMobileFilterOpen && (
					<>
						<motion.div
							animate={{ opacity: 1 }}
							className="fixed inset-0 z-100 bg-black/40 backdrop-blur-sm lg:hidden"
							exit={{ opacity: 0 }}
							initial={{ opacity: 0 }}
							onClick={() => setIsMobileFilterOpen(false)}
						/>
						<motion.div
							animate={{ y: 0 }}
							className="fixed right-0 bottom-0 left-0 z-101 max-h-[85vh] overflow-y-auto rounded-t-3xl bg-white p-8 shadow-heavy lg:hidden"
							exit={{ y: "100%" }}
							initial={{ y: "100%" }}
							transition={{ type: "spring", damping: 25, stiffness: 200 }}
						>
							<div className="mb-10 flex items-center justify-between border-stone-100 border-b pb-4">
								<h2 className="font-bold text-xm">Refine selection</h2>
								<button onClick={() => setIsMobileFilterOpen(false)}>
									<X className="text-stone-400" size={20} />
								</button>
							</div>
							<FilterContent />
							<div className="h-20" /> {/* Extra space for mobile nav */}
						</motion.div>
					</>
				)}
			</AnimatePresence>
		</>
	);
};

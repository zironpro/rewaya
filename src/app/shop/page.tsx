"use client";

import { useState } from "react";

import { AnimatePresence, motion } from "framer-motion";
import { SlidersHorizontal, X } from "lucide-react";

import BookCard from "@/components/BookCard";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

const allBooks = [
	{
		id: 1,
		title: "The Sealed Nectar",
		author: "Safiur Rahman Mubarakpuri",
		price: 85.0,
		category: "Islamic",
		image:
			"https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=800&auto=format&fit=crop",
	},
	{
		id: 2,
		title: "Atomic Habits",
		author: "James Clear",
		price: 65.0,
		category: "Self-Help",
		image:
			"https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=800&auto=format&fit=crop",
	},
	{
		id: 3,
		title: "The Alchemist",
		author: "Paulo Coelho",
		price: 45.0,
		category: "Fiction",
		image:
			"https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=800&auto=format&fit=crop",
	},
	{
		id: 4,
		title: "Fortress of the Muslim",
		author: "Sa'id bin Ali al-Qahtani",
		price: 25.0,
		category: "Islamic",
		image:
			"https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=800&auto=format&fit=crop",
	},
	{
		id: 5,
		title: "Think and Grow Rich",
		author: "Napoleon Hill",
		price: 55.0,
		category: "Self-Help",
		image:
			"https://images.unsplash.com/photo-1491841573634-28140fc7ced7?q=80&w=800&auto=format&fit=crop",
	},
	{
		id: 6,
		title: "Muhammad: His Life",
		author: "Martin Lings",
		price: 95.0,
		category: "Islamic",
		image:
			"https://images.unsplash.com/photo-1589998059171-988d887df646?q=80&w=800&auto=format&fit=crop",
	},
	{
		id: 7,
		title: "Meditations",
		author: "Marcus Aurelius",
		price: 40.0,
		category: "Philosophy",
		image:
			"https://images.unsplash.com/photo-1516979187457-637abb4f9353?q=80&w=800&auto=format&fit=crop",
	},
	{
		id: 8,
		title: "The Great Gatsby",
		author: "F. Scott Fitzgerald",
		price: 35.0,
		category: "Fiction",
		image:
			"https://images.unsplash.com/photo-1543004218-2c433391740d?q=80&w=800&auto=format&fit=crop",
	},
];

const categories = ["ALL", "ISLAMIC", "SELF-HELP", "FICTION", "PHILOSOPHY"];

export default function ShopPage() {
	const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

	const FilterContent = () => (
		<div className="space-y-12">
			<div>
				<h3 className="mb-8 border-stone-100 border-b pb-4 font-bold text-[10px] uppercase tracking-[0.2em]">
					Categories
				</h3>
				<div className="flex flex-col gap-2">
					{categories.map((cat) => (
						<Button
							className="h-10 justify-between px-2 hover:bg-stone-50"
							key={cat}
							variant="ghost"
						>
							<span className="text-[10px] tracking-widest">{cat}</span>
							<span className="text-[8px] text-stone-300 group-hover:text-black">
								(
								{cat === "ALL"
									? allBooks.length
									: allBooks.filter((b) => b.category.toUpperCase() === cat)
											.length}
								)
							</span>
						</Button>
					))}
				</div>
			</div>

			<div>
				<h3 className="mb-8 border-stone-100 border-b pb-4 font-bold text-[10px] uppercase tracking-[0.2em]">
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
						<div className="flex justify-between font-bold text-[9px] text-stone-400 uppercase tracking-widest">
							<span>$0</span>
							<span>$200+</span>
						</div>
					</div>
				</div>
			</div>

			<div>
				<h3 className="mb-8 border-stone-100 border-b pb-4 font-bold text-[10px] uppercase tracking-[0.2em]">
					Availability
				</h3>
				<div className="space-y-4">
					<div className="flex items-center space-x-3">
						<Checkbox id="in-stock" />
						<label
							className="cursor-pointer font-bold text-[10px] uppercase tracking-widest"
							htmlFor="in-stock"
						>
							In Stock
						</label>
					</div>
					<div className="flex items-center space-x-3">
						<Checkbox id="pre-order" />
						<label
							className="cursor-pointer font-bold text-[10px] uppercase tracking-widest"
							htmlFor="pre-order"
						>
							Pre-Order
						</label>
					</div>
				</div>
			</div>

			<div className="pt-8">
				<Button
					className="h-12 w-full text-[9px]"
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
			<main className="grow pt-32">
				{/* Header */}
				<section className="container mx-auto mb-12 px-6">
					<Breadcrumbs className="mt-8 mb-8" items={[{ label: "Shop" }]} />
					<div className="text-center">
						<span className="mb-6 block font-bold text-[10px] text-stone-400 uppercase tracking-[0.4em]">
							Collection
						</span>
						<h1 className="mb-8 font-black font-serif text-5xl md:text-7xl">
							THE <span className="font-normal italic">LIBRARY</span>.
						</h1>
					</div>
				</section>

				{/* Mobile Filter Toggle */}
				<section className="container mx-auto mb-8 flex gap-4 px-6 lg:hidden">
					<Button
						className="h-12 flex-1 border-stone-100 font-bold text-[10px] uppercase tracking-widest"
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
								<p className="font-bold text-[10px] text-stone-400 uppercase tracking-widest">
									Showing {allBooks.length} Results
								</p>
								<div className="flex items-center gap-6">
									<span className="font-bold text-[10px] text-stone-400 uppercase tracking-widest">
										Sort By:
									</span>
									<select className="cursor-pointer bg-transparent font-bold text-[10px] uppercase tracking-widest outline-none">
										<option>Newest First</option>
										<option>Price: Low to High</option>
										<option>Price: High to Low</option>
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
								<h2 className="font-bold text-[10px] uppercase tracking-[0.3em]">
									Refine Selection
								</h2>
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
}

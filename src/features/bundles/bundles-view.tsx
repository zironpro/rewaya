"use client";

import { useState } from "react";

import { AnimatePresence, motion } from "framer-motion";
import { Search, SlidersHorizontal, X } from "lucide-react";

import BundleCard from "@/components/BundleCard";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

import { bundles } from "@/lib/bundles-data";
import { cn } from "@/lib/utils";

const categories = ["All", "Kids", "Educational", "Spiritual", "History"];

export const BundlesView = () => {
	const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

	const FilterContent = () => (
		<div className="space-y-12">
			{/* Search */}
			<div>
				<h3 className="mb-8 border-stone-100 border-b pb-4 font-bold text-primary text-xm">
					Search Archive
				</h3>
				<div className="relative">
					<Search
						className="absolute top-1/2 left-4 -translate-y-1/2 text-stone-300"
						size={16}
					/>
					<input
						className="h-12 w-full border border-stone-100 bg-stone-50 pr-4 pl-12 font-bold text-xm transition-all focus:border-primary focus:outline-none"
						placeholder="Find a set..."
						type="text"
					/>
				</div>
			</div>

			<div>
				<h3 className="mb-8 border-stone-100 border-b pb-4 font-bold text-primary text-xm">
					Curations
				</h3>
				<div className="flex flex-col gap-2">
					{categories.map((cat) => (
						<Button
							className="h-10 justify-between px-2 hover:bg-stone-50"
							key={cat}
							variant="ghost"
						>
							<span
								className={cn(
									"font-bold text-xm",
									cat === "ALL" && "text-primary"
								)}
							>
								{cat}
							</span>
							<span className="text-stone-300 text-xm group-hover:text-black">
								(
								{cat === "ALL"
									? bundles.length
									: bundles.filter(
											(b) =>
												b.tag.includes(cat) || b.id.includes(cat.toLowerCase())
										).length}
								)
							</span>
						</Button>
					))}
				</div>
			</div>

			<div>
				<h3 className="mb-8 border-stone-100 border-b pb-4 font-bold text-primary text-xm">
					Volume Count
				</h3>
				<div className="space-y-4">
					<div className="flex items-center space-x-3">
						<Checkbox id="vol-5" />
						<label className="cursor-pointer font-bold text-xm" htmlFor="vol-5">
							5+ Volumes
						</label>
					</div>
					<div className="flex items-center space-x-3">
						<Checkbox id="vol-10" />
						<label
							className="cursor-pointer font-bold text-xm"
							htmlFor="vol-10"
						>
							10+ Volumes
						</label>
					</div>
				</div>
			</div>

			<div className="pt-8">
				<Button
					className="h-12 w-full bg-primary font-bold text-white text-xm hover:bg-primary-dark"
					onClick={() => setIsMobileFilterOpen(false)}
				>
					Apply Filters
				</Button>
			</div>
		</div>
	);

	return (
		<>
			<main className="min-h-screen grow pt-20">
				{/* Header */}
				<section className="container mx-auto mb-12 px-6">
					<Breadcrumbs className="mb-8" items={[{ label: "Bundles" }]} />
					<div className="text-center">
						<span className="mb-6 block font-bold text-primary text-xm">
							Curated Collections
						</span>
						<h1 className="mb-8 font-black font-serif text-5xl text-primary md:text-7xl">
							The{" "}
							<span className="font-normal text-secondary italic">Archive</span>
							.
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
								<p className="font-bold text-primary text-xm">
									Showing {bundles.length} Curations
								</p>
								<div className="flex items-center gap-6">
									<span className="font-bold text-stone-400 text-xm">
										Sort by:
									</span>
									<select className="cursor-pointer bg-transparent font-bold text-xm outline-none">
										<option>Exclusive first</option>
										<option>Price: Low to high</option>
										<option>Price: High to low</option>
									</select>
								</div>
							</div>

							<div className="grid grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-2 xl:grid-cols-3">
								{bundles.map((bundle) => (
									<BundleCard key={bundle.id} {...bundle} />
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
							className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm lg:hidden"
							exit={{ opacity: 0 }}
							initial={{ opacity: 0 }}
							onClick={() => setIsMobileFilterOpen(false)}
						/>
						<motion.div
							animate={{ y: 0 }}
							className="fixed right-0 bottom-0 left-0 z-[101] max-h-[85vh] overflow-y-auto rounded-t-3xl bg-white p-8 shadow-heavy lg:hidden"
							exit={{ y: "100%" }}
							initial={{ y: "100%" }}
							transition={{ type: "spring", damping: 25, stiffness: 200 }}
						>
							<div className="mb-10 flex items-center justify-between border-stone-100 border-b pb-4">
								<h2 className="font-bold text-xm">Refine Archive</h2>
								<button onClick={() => setIsMobileFilterOpen(false)}>
									<X className="text-stone-400" size={20} />
								</button>
							</div>
							<FilterContent />
							<div className="h-20" />
						</motion.div>
					</>
				)}
			</AnimatePresence>
		</>
	);
};

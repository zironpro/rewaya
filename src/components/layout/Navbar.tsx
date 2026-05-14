"use client";

import { useState } from "react";

import Image from "next/image";
import Link from "next/link";

import { AnimatePresence, motion } from "framer-motion";
import { useAtom } from "jotai";
import {
	Baby,
	BookOpen,
	ChevronDown,
	Feather,
	Menu,
	Moon,
	Package,
	Search,
	ShoppingBag,
	Sparkles,
	Star,
	User,
	X,
	Zap,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import { cartCountAtom } from "@/lib/store";

const megaMenuData = {
	categories: [
		{
			name: "Islamic Studies",
			items: ["Theology", "Hadith", "Quranic Tafsir", "Seerah", "Fiqh"],
		},
		{
			name: "Literature",
			items: ["Contemporary Fiction", "Arabic Classics", "Poetry", "Drama"],
		},
		{
			name: "Self-Development",
			items: ["Productivity", "Spirituality", "Psychology", "Leadership"],
		},
		{
			name: "Children & YA",
			items: [
				"Picture Books",
				"Graphic Novels",
				"Arabic Learning",
				"Young Adult",
			],
		},
	],
	featured: {
		title: "Collection of the Month",
		image:
			"https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=800&auto=format&fit=crop",
		tag: "CURATED",
	},
};

export function Navbar() {
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
	const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
	const [searchQuery, setSearchQuery] = useState("");
	const [cartCount] = useAtom(cartCountAtom);

	const categories = [
		{
			name: "Shop All",
			href: "/shop",
			icon: <Sparkles className="text-secondary" size={14} />,
		},
		{
			name: "Today's Deals",
			href: "/#deals",
			icon: <Zap className="text-secondary" size={14} />,
		},
		{
			name: "Islamic",
			href: "/#islamic",
			icon: <Moon className="text-secondary" size={14} />,
		},
		{
			name: "Fiction",
			href: "/#fiction",
			icon: <Feather className="text-secondary" size={14} />,
		},
		{
			name: "Children",
			href: "/#children",
			icon: <Baby className="text-secondary" size={14} />,
		},
		{
			name: "Bundles",
			href: "/bundles",
			icon: <Package className="text-secondary" size={14} />,
		},
		{
			name: "New Arrivals",
			href: "/#new",
			icon: <Sparkles className="text-secondary" size={14} />,
		},
	];

	return (
		<>
			<header className="fixed top-0 right-0 left-0 z-40 bg-white shadow-sm">
				{/* Top Bar: Logo, Search, Icons */}
				<div className="h-20 border-stone-100 border-b">
					<div className="container mx-auto flex h-full items-center gap-4 px-6 md:gap-8">
						{/* Logo */}
						<Link className="flex shrink-0 items-center gap-3" href="/">
							<Image
								alt="Al Rewaya Logo"
								className="h-16 w-auto object-contain"
								height={64}
								src="/logo.png"
								width={260}
							/>
							<div className="hidden flex-col leading-none xl:flex">
								<span className="font-bold text-3xl text-secondary tracking-tight">
									Al Rewaya
								</span>
								<span className="font-bold text-primary text-sm uppercase tracking-widest">
									Book World
								</span>
							</div>
						</Link>

						{/* Reduced Noon-style Search Bar */}
						<div className="relative mx-auto hidden max-w-xl grow md:block">
							<div className="group relative">
								<Search
									className="absolute top-1/2 left-4 -translate-y-1/2 text-stone-400 transition-colors group-focus-within:text-primary"
									size={22}
								/>
								<input
									className="w-full rounded-lg border border-stone-100 bg-stone-50 py-4 pr-4 pl-12 text-base outline-none transition-all placeholder:text-stone-300 focus:border-primary/30 focus:bg-white"
									onChange={(e) => setSearchQuery(e.target.value)}
									placeholder="What are you looking for?"
									type="text"
									value={searchQuery}
								/>
							</div>
						</div>

						{/* Right Icons */}
						<div className="ml-auto flex items-center gap-1 text-secondary md:gap-2">
							{/* Language Toggle (Ghost Style to match others) */}
							<Button
								className="flex h-10 gap-2 px-3 hover:text-primary"
								variant="ghost"
							>
								<svg
									className="text-secondary"
									fill="none"
									height="20"
									stroke="currentColor"
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth="1.5"
									viewBox="0 0 24 24"
									width="20"
								>
									<path d="m5 8 6 6" />
									<path d="m4 14 6-6 2-3" />
									<path d="M2 5h12" />
									<path d="M7 2h1" />
									<path d="m22 22-5-10-5 10" />
									<path d="M14 18h6" />
								</svg>
								<span className="font-bold text-base">العربية</span>
							</Button>

							<Button
								className="hover:text-primary md:hidden"
								size="icon"
								variant="ghost"
							>
								<Search size={20} />
							</Button>
							<Link href="/login">
								<Button
									className="h-10 gap-2 px-3 hover:text-primary"
									variant="ghost"
								>
									<User size={20} strokeWidth={1.5} />
									<span className="hidden font-bold text-xm xl:block">
										Sign In
									</span>
								</Button>
							</Link>
							<Link href="/cart">
								<Button
									className="relative h-10 gap-2 px-3 hover:text-primary"
									variant="ghost"
								>
									<ShoppingBag size={24} strokeWidth={1.5} />
									<span className="hidden font-bold text-sm xl:block">
										Cart
									</span>
									{cartCount > 0 && (
										<span className="absolute -top-1 -right-1 flex h-[20px] min-w-[20px] items-center justify-center rounded-full bg-primary px-1 font-bold text-white text-xs ring-2 ring-white">
											{cartCount}
										</span>
									)}
								</Button>
							</Link>
							<Button
								className="lg:hidden"
								onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
								size="icon"
								variant="ghost"
							>
								{isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
							</Button>
						</div>
					</div>
				</div>

				{/* Sub-Nav: Categories */}
				<nav className="relative hidden overflow-visible border-stone-50 border-b bg-white lg:block">
					<div className="container mx-auto flex h-12 items-center gap-10 px-6">
						<button
							className="flex items-center gap-2 border-stone-100 border-r pr-10 font-bold text-secondary text-sm transition-colors hover:text-primary"
							onClick={() => setIsMegaMenuOpen(!isMegaMenuOpen)}
							onMouseEnter={() => setIsMegaMenuOpen(true)}
						>
							<Menu size={16} /> All Categories{" "}
							<ChevronDown
								className={`transition-transform duration-300 ${isMegaMenuOpen ? "rotate-180" : ""}`}
								size={12}
							/>
						</button>
						{categories.map((cat) => (
							<Link
								className="flex items-center gap-2 whitespace-nowrap font-bold text-secondary text-sm transition-colors hover:text-primary"
								href={cat.href}
								key={cat.name}
							>
								{cat.icon}
								{cat.name}
							</Link>
						))}
					</div>

					{/* Mega Menu Dropdown */}
					<AnimatePresence>
						{isMegaMenuOpen && (
							<>
								{/* Backdrop */}
								<motion.div
									animate={{ opacity: 1 }}
									className="fixed inset-0 top-32 z-30 bg-black/20 backdrop-blur-sm"
									exit={{ opacity: 0 }}
									initial={{ opacity: 0 }}
									onClick={() => setIsMegaMenuOpen(false)}
								/>

								{/* Menu Panel */}
								<motion.div
									animate={{ opacity: 1, y: 0 }}
									className="absolute top-full right-0 left-0 z-40 overflow-hidden border-stone-100 border-b bg-white shadow-2xl"
									exit={{ opacity: 0, y: -20 }}
									initial={{ opacity: 0, y: -20 }}
									onMouseLeave={() => setIsMegaMenuOpen(false)}
								>
									<div className="container mx-auto px-6 py-12">
										<div className="grid grid-cols-5 gap-12">
											{megaMenuData.categories.map((group) => (
												<div className="space-y-6" key={group.name}>
													<h4 className="border-stone-100 border-b pb-3 font-bold text-secondary text-sm">
														{group.name}
													</h4>
													<ul className="space-y-3">
														{group.items.map((item) => (
															<li key={item}>
																<Link
																	className="group/item flex items-center gap-2 text-base text-secondary transition-colors hover:text-primary"
																	href="/shop"
																>
																	<div className="h-1 w-1 rounded-full bg-secondary/30 transition-colors group-hover/item:bg-primary" />
																	{item}
																</Link>
															</li>
														))}
													</ul>
												</div>
											))}

											{/* Featured Section */}
											<div className="col-span-1 border-stone-100 border-l pl-12">
												<div className="group/feat relative mb-4 aspect-[3/4] overflow-hidden rounded-lg">
													<Image
														alt="Featured"
														className="object-cover transition-transform duration-700 group-hover/feat:scale-110"
														fill
														sizes="(max-width: 1024px) 20vw, 300px"
														src={megaMenuData.featured.image}
													/>
													<div className="absolute inset-0 bg-secondary/10 transition-colors group-hover/feat:bg-transparent" />
													<div className="absolute bottom-4 left-4">
														<span className="bg-primary px-2 py-1 font-bold text-white text-xm">
															{megaMenuData.featured.tag}
														</span>
													</div>
												</div>
												<h4 className="mb-2 font-bold text-secondary text-xm">
													{megaMenuData.featured.title}
												</h4>
												<Link
													className="font-bold text-primary text-xm hover:underline"
													href="/shop"
												>
													Discover Collection
												</Link>
											</div>
										</div>

										{/* Bottom Utility links inside Mega Menu */}
										<div className="mt-12 flex items-center justify-between border-stone-100 border-t pt-8">
											<div className="flex gap-8">
												<div className="flex items-center gap-3">
													<div className="rounded-full bg-stone-50 p-2 text-primary">
														<BookOpen size={16} />
													</div>
													<div>
														<p className="font-bold text-secondary text-xm">
															New Releases
														</p>
														<p className="text-stone-400 text-xm">
															Updated Daily
														</p>
													</div>
												</div>
												<div className="flex items-center gap-3">
													<div className="rounded-full bg-stone-50 p-2 text-secondary">
														<Star size={16} />
													</div>
													<div>
														<p className="font-bold text-secondary text-xm">
															Best Sellers
														</p>
														<p className="text-stone-400 text-xm">
															Top 100 Books
														</p>
													</div>
												</div>
											</div>
											<div className="flex gap-4">
												<div className="flex items-center gap-2 rounded-lg bg-primary/5 px-4 py-2 text-primary">
													<Zap fill="currentColor" size={14} />
													<span className="font-bold text-xm">
														Sale: Up to 40% Off
													</span>
												</div>
											</div>
										</div>
									</div>
								</motion.div>
							</>
						)}
					</AnimatePresence>
				</nav>
			</header>

			{/* Mobile Menu */}
			{/* Mobile Menu Overlay */}
			<AnimatePresence>
				{isMobileMenuOpen && (
					<>
						{/* Backdrop */}
						<motion.div
							animate={{ opacity: 1 }}
							className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm lg:hidden"
							exit={{ opacity: 0 }}
							initial={{ opacity: 0 }}
							onClick={() => setIsMobileMenuOpen(false)}
						/>

						{/* Menu Content */}
						<motion.div
							animate={{ opacity: 1, y: 0 }}
							className="fixed inset-x-0 top-20 z-40 overflow-hidden border-stone-100 border-t bg-white py-8 shadow-2xl lg:hidden"
							exit={{ opacity: 0, y: -20 }}
							initial={{ opacity: 0, y: -20 }}
						>
							<div className="flex flex-col gap-6 px-6">
								{["Shop", "Islamic", "Fiction", "New", "About", "Log In"].map(
									(item) => (
										<Link
											className="nav-link text-xl"
											href={
												item === "Log In"
													? "/login"
													: item === "Shop"
														? "/shop"
														: item === "About"
															? "/about"
															: "#"
											}
											key={item}
											onClick={() => setIsMobileMenuOpen(false)}
										>
											{item}
										</Link>
									)
								)}
							</div>
						</motion.div>
					</>
				)}
			</AnimatePresence>
		</>
	);
}

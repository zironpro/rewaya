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
	Heart,
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

import { LanguageIcon } from "@/assets/icons/language";
import { Logo } from "@/assets/logo";

import { cartCountAtom, wishlistCountAtom } from "@/lib/store";

import { SearchInput } from "./components/search-input";

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
const categories = [
	{
		name: "Shop All",
		href: "/shop",
		icon: Sparkles,
	},
	{
		name: "Today's Deals",
		href: "/#deals",
		icon: Zap,
	},
	{
		name: "Islamic",
		href: "/#islamic",
		icon: Moon,
	},
	{
		name: "Fiction",
		href: "/#fiction",
		icon: Feather,
	},
	{
		name: "Children",
		href: "/#children",
		icon: Baby,
	},
	{
		name: "Bundles",
		href: "/bundles",
		icon: Package,
	},
	{
		name: "New Arrivals",
		href: "/#new",
		icon: Sparkles,
	},
];

export function Navbar() {
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
	const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
	const [cartCount] = useAtom(cartCountAtom);
	const [wishlistCount] = useAtom(wishlistCountAtom);

	return (
		<>
			<header className="sticky inset-x-0 top-0 z-40 bg-white shadow-sm">
				<div className="h-16 border-stone-100 border-b">
					<div className="container mx-auto flex h-full items-center gap-4 md:gap-8">
						<Link href="/">
							<Logo />
						</Link>

						<SearchInput className="relative mx-auto hidden max-w-xl grow md:inline-flex" />

						<div className="ml-auto flex items-center gap-1 text-secondary md:gap-2">
							<Button variant="ghost">
								<LanguageIcon />
								<span className="text-base">العربية</span>
							</Button>

							<Button className="md:hidden" size="icon" variant="ghost">
								<Search size={20} />
							</Button>

							<Button
								className="relative h-10 gap-2 px-3 hover:text-primary"
								nativeButton={false}
								render={<Link href="/wishlist" />}
								variant="ghost"
							>
								<Heart size={20} strokeWidth={1.5} />
								<span className="hidden text-sm xl:block">Wishlist</span>
								{wishlistCount > 0 && (
									<span className="absolute -top-1 -right-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-primary px-1 font-bold text-[10px] text-white ring-2 ring-white">
										{wishlistCount}
									</span>
								)}
							</Button>

							<Button
								className="relative h-10 gap-2 px-3 hover:text-primary"
								nativeButton={false}
								render={<Link href="/cart" />}
								variant="ghost"
							>
								<ShoppingBag size={24} strokeWidth={1.5} />
								<span className="hidden text-sm xl:block">Cart</span>
								{cartCount > 0 && (
									<span className="absolute -top-1 -right-1 flex h-[20px] min-w-[20px] items-center justify-center rounded-full bg-primary px-1 font-bold text-white text-xs ring-2 ring-white">
										{cartCount}
									</span>
								)}
							</Button>

							<Button
								className="h-10 gap-2 px-3 hover:text-primary"
								nativeButton={false}
								render={<Link href="/login" />}
								variant="ghost"
							>
								<User size={20} strokeWidth={1.5} />
								<span className="hidden text-sm xl:block">Sign In</span>
							</Button>

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
					<div className="container mx-auto flex h-12 items-center gap-10">
						<button
							className="flex items-center gap-2 border-stone-100 border-r pr-10 font-medium text-secondary text-sm transition-colors hover:text-primary"
							onClick={() => setIsMegaMenuOpen(!isMegaMenuOpen)}
							onMouseEnter={() => setIsMegaMenuOpen(true)}
						>
							<Menu size={16} /> All Categories{" "}
							<ChevronDown
								className={`transition-transform duration-300 ${isMegaMenuOpen ? "rotate-180" : ""}`}
								size={12}
							/>
						</button>
						{categories.map(({ icon: Icon, ...cat }) => (
							<Link
								className="flex items-center gap-2 whitespace-nowrap font-medium text-secondary text-sm transition-colors hover:text-primary"
								href={cat.href}
								key={cat.name}
							>
								<Icon className="size-4" />
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
													<h4 className="border-b pb-3 font-bold font-display text-lg text-secondary uppercase">
														{group.name}
													</h4>
													<ul className="space-y-3">
														{group.items.map((item) => (
															<li key={item}>
																<Link
																	className="group/item flex items-center gap-2 font-medium text-secondary transition-colors hover:text-primary"
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
												<div className="group/feat relative mb-4 aspect-3/4 overflow-hidden rounded-lg">
													<Image
														alt="Featured"
														className="object-cover transition-transform duration-700 group-hover/feat:scale-110"
														fill
														sizes="(max-width: 1024px) 20vw, 300px"
														src={megaMenuData.featured.image}
													/>
													<div className="absolute inset-0 bg-secondary/10 transition-colors group-hover/feat:bg-transparent" />
													<div className="absolute bottom-4 left-4">
														<span className="bg-primary px-2 py-1 font-bold text-sm text-white">
															{megaMenuData.featured.tag}
														</span>
													</div>
												</div>
												<h4 className="mb-2 font-bold text-secondary text-sm">
													{megaMenuData.featured.title}
												</h4>
												<Link
													className="font-bold text-primary text-sm hover:underline"
													href="/shop"
												>
													Discover Collection
												</Link>
											</div>
										</div>

										{/* Bottom Utility links inside Mega Menu */}
										<div className="mt-12 flex items-center justify-between border-t pt-8">
											<div className="flex gap-8">
												<div className="flex items-center gap-3">
													<div className="grid size-9 place-content-center rounded-full bg-muted text-primary">
														<BookOpen className="size-4" />
													</div>
													<div>
														<p className="font-bold font-display text-secondary">
															New Releases
														</p>
														<p className="text-muted-foreground text-xs">
															Updated Daily
														</p>
													</div>
												</div>
												<div className="flex items-center gap-3">
													<div className="grid size-9 place-content-center rounded-full bg-muted text-secondary">
														<Star className="size-4" />
													</div>
													<div>
														<p className="font-bold font-display text-secondary">
															Best Sellers
														</p>
														<p className="text-muted-foreground text-xs">
															Top 100 Books
														</p>
													</div>
												</div>
											</div>
											<div className="flex gap-4">
												<div className="flex items-center gap-2 rounded-lg bg-primary/5 px-4 py-2 text-primary">
													<Zap fill="currentColor" size={14} />
													<span className="font-bold text-sm">
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
								{[
									"Shop",
									"Islamic",
									"Fiction",
									"New",
									"Wishlist",
									"About",
									"Log In",
								].map((item) => (
									<Link
										className="nav-link text-xl"
										href={
											item === "Log In"
												? "/login"
												: item === "Shop"
													? "/shop"
													: item === "About"
														? "/about"
														: item === "Wishlist"
															? "/wishlist"
															: "#"
										}
										key={item}
										onClick={() => setIsMobileMenuOpen(false)}
									>
										{item}
									</Link>
								))}
							</div>
						</motion.div>
					</>
				)}
			</AnimatePresence>
		</>
	);
}

"use client";

import { useState } from "react";

import Link from "next/link";

import { Heart, Menu, Search, ShoppingBag, User, X } from "lucide-react";

import { Button } from "@/components/ui/button";

import { LanguageIcon } from "@/assets/icons/language";
import { Logo } from "@/assets/logo";

import { useCartCount } from "@/hooks/use-cart-count";
import { useWixAuth } from "@/lib/wix/provider";

import { CategoriesMenu } from "./components/categories-menu";
import { MobileNavigationDrawer } from "./components/mobile-navigation-drawer";
import { ProductSearch } from "./components/product-search";

interface NavbarProps {
	showCategories?: boolean;
	showSearch?: boolean;
	showActions?: boolean;
	children?: React.ReactNode;
}

export function Navbar({
	showCategories = true,
	showSearch = true,
	showActions = true,
	children,
}: NavbarProps) {
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
	const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);

	const wixCartCount = useCartCount();
	const { isReady, isLoggedIn, memberDisplayName } = useWixAuth();

	const closeMobileSearch = () => setIsMobileSearchOpen(false);

	return (
		<header className="sticky inset-x-0 top-0 z-40 bg-white shadow-xs">
			<div className="h-16 border-stone-100 border-b">
				<div className="container mx-auto flex h-full items-center gap-4 md:gap-8">
					{!(showSearch && isMobileSearchOpen) && (
						<Link className="shrink-0" href="/">
							<Logo />
						</Link>
					)}

					{showSearch && isMobileSearchOpen && (
						<ProductSearch
							autoFocus
							className="min-w-0 flex-1 md:hidden"
							onNavigate={closeMobileSearch}
						/>
					)}

					{showSearch && !isMobileSearchOpen && (
						<ProductSearch className="relative mx-auto hidden max-w-xl grow md:inline-flex" />
					)}

					<div
						className={
							showSearch && isMobileSearchOpen
								? "ml-auto flex shrink-0 items-center gap-1"
								: "ml-auto flex items-center gap-1 text-secondary md:gap-2"
						}
					>
						{children}
						{showSearch && (
							<Button
								aria-expanded={isMobileSearchOpen}
								aria-label={isMobileSearchOpen ? "Close search" : "Open search"}
								className="md:hidden"
								onClick={() => {
									setIsMobileSearchOpen((open) => {
										if (!open) setIsMobileMenuOpen(false);
										return !open;
									});
								}}
								size="icon"
								variant="ghost"
							>
								{isMobileSearchOpen ? <X size={20} /> : <Search size={20} />}
							</Button>
						)}

						{showActions && !(showSearch && isMobileSearchOpen) && (
							<>
								<Button className="hidden md:inline-flex" variant="ghost">
									<LanguageIcon />
									<span className="text-base">العربية</span>
								</Button>

								<Button
									className="hidden md:inline-flex"
									nativeButton={false}
									render={<Link href="/wishlist" />}
									variant="ghost"
								>
									<Heart size={20} strokeWidth={1.5} />
									<span className="hidden text-sm xl:block">Wishlist</span>
								</Button>

								<Button
									className="relative hidden md:inline-flex"
									nativeButton={false}
									render={<Link href="/cart" />}
									variant="ghost"
								>
									<ShoppingBag size={24} strokeWidth={1.5} />
									<span className="hidden text-sm xl:block">Cart</span>
									{wixCartCount > 0 && (
										<span className="absolute -top-1 -right-1 flex h-[20px] min-w-[20px] items-center justify-center rounded-full bg-primary px-1 font-bold text-white text-xs ring-2 ring-white">
											{wixCartCount}
										</span>
									)}
								</Button>

								<Button
									className="hidden md:inline-flex"
									nativeButton={false}
									render={<Link href={isLoggedIn ? "/profile" : "/login"} />}
								>
									<User size={20} strokeWidth={1.5} />
									<span className="hidden text-sm xl:block">
										{isReady && isLoggedIn
											? memberDisplayName.split(" ")[0] || "Profile"
											: "Sign In"}
									</span>
								</Button>

								<Button
									className="lg:hidden"
									onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
									size="icon"
									variant="ghost"
								>
									{isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
								</Button>
							</>
						)}
					</div>
				</div>
			</div>

			{/* Sub-Nav: Categories */}
			{showCategories && <CategoriesMenu />}

			<MobileNavigationDrawer
				onOpenChange={setIsMobileMenuOpen}
				open={isMobileMenuOpen}
			/>
		</header>
	);
}

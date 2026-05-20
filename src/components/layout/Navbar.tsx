"use client";

import { useState } from "react";

import Link from "next/link";

import { useAtom } from "jotai";
import { Heart, Menu, Search, ShoppingBag, User, X } from "lucide-react";

import { Button } from "@/components/ui/button";

import { LanguageIcon } from "@/assets/icons/language";
import { Logo } from "@/assets/logo";

import { useCartCount } from "@/hooks/use-cart-count";
import { wishlistCountAtom } from "@/lib/store";

import { CategoriesMenu } from "./components/categories-menu";
import { MobileNavigationDrawer } from "./components/mobile-navigation-drawer";
import { SearchInput } from "./components/search-input";

interface NavbarProps {
	showCategories?: boolean;
	showSearch?: boolean;
}

export function Navbar({
	showCategories = true,
	showSearch = true,
}: NavbarProps) {
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

	const wixCartCount = useCartCount();
	const [wishlistCount] = useAtom(wishlistCountAtom);

	return (
		<header className="sticky inset-x-0 top-0 z-40 bg-white shadow-sm">
			<div className="h-16 border-stone-100 border-b">
				<div className="container mx-auto flex h-full items-center gap-4 md:gap-8">
					<Link href="/">
						<Logo />
					</Link>

					{showSearch && (
						<SearchInput className="relative mx-auto hidden max-w-xl grow md:inline-flex" />
					)}

					<div className="ml-auto flex items-center gap-1 text-secondary md:gap-2">
						<Button variant="ghost">
							<LanguageIcon />
							<span className="text-base">العربية</span>
						</Button>

						<Button className="md:hidden" size="icon" variant="ghost">
							<Search size={20} />
						</Button>

						<Button
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

						<Button nativeButton={false} render={<Link href="/login" />}>
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
			{showCategories && <CategoriesMenu />}

			<MobileNavigationDrawer
				onOpenChange={setIsMobileMenuOpen}
				open={isMobileMenuOpen}
			/>
		</header>
	);
}

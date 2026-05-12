"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { motion } from "framer-motion";
import { useAtom } from "jotai";
import { Grid, Home, ShoppingBag, User } from "lucide-react";

import { cartCountAtom } from "@/lib/store";

export default function MobileBottomNav() {
	const pathname = usePathname();
	const [cartCount] = useAtom(cartCountAtom);

	const navItems = [
		{ label: "Home", icon: Home, href: "/" },
		{ label: "Shop", icon: Grid, href: "/shop" },
		{ label: "Cart", icon: ShoppingBag, href: "/cart", badge: cartCount },
		{ label: "Profile", icon: User, href: "/login" },
	];

	return (
		<div className="fixed right-0 bottom-0 left-0 z-50 border-stone-100 border-t bg-white/80 pb-safe backdrop-blur-lg md:hidden">
			<div className="flex h-16 items-center justify-around px-2">
				{navItems.map((item) => {
					const isActive = pathname === item.href;
					const Icon = item.icon;

					return (
						<Link
							className="group relative flex h-full w-full flex-col items-center justify-center"
							href={item.href}
							key={item.label}
						>
							{isActive && (
								<motion.div
									className="absolute top-0 h-[2px] w-8 bg-primary"
									layoutId="activeTab"
									transition={{ type: "spring", stiffness: 500, damping: 30 }}
								/>
							)}

							<div className="flex flex-col items-center">
								<div className="relative">
									<Icon
										className={isActive ? "text-primary" : "text-stone-400"}
										size={24}
										strokeWidth={isActive ? 2 : 1.2}
									/>
									{item.label === "Cart" && item.badge && item.badge > 0 && (
										<span className="absolute -top-2 -right-2 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-primary px-1 font-bold text-[9px] text-white ring-2 ring-white">
											{item.badge}
										</span>
									)}
								</div>

								<span
									className={`mt-2 font-black text-[9px] uppercase tracking-widest ${isActive ? "text-primary" : "text-stone-300"}`}
								>
									{item.label}
								</span>
							</div>
						</Link>
					);
				})}
			</div>
		</div>
	);
}

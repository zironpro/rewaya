"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAtom } from "jotai";
import { Home, Grid, ShoppingBag, Info, User } from "lucide-react";
import { motion } from "framer-motion";
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
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-t border-stone-100 pb-safe">
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link 
              key={item.label} 
              href={item.href}
              className="relative flex flex-col items-center justify-center w-full h-full group"
            >
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute top-0 w-8 h-[2px] bg-primary"
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
              
              <div className="flex flex-col items-center">
                <div className="relative">
                  <Icon 
                    size={24} 
                    strokeWidth={isActive ? 2 : 1.2} 
                    className={isActive ? "text-primary" : "text-stone-400"} 
                  />
                  {item.label === "Cart" && item.badge > 0 && (
                    <span className="absolute -top-2 -right-2 min-w-[18px] h-[18px] bg-primary text-white text-[9px] flex items-center justify-center rounded-full font-bold px-1 ring-2 ring-white">
                      {item.badge}
                    </span>
                  )}
                </div>
                
                <span className={`text-[9px] mt-2 font-black uppercase tracking-[0.1em] ${isActive ? "text-primary" : "text-stone-300"}`}>
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

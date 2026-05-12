"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Search, ShoppingBag, User, Menu, X, Globe } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useAtom, useSetAtom } from "jotai";
import { cartCountAtom, authModalAtom } from "@/lib/store";
import { ChevronDown, Sparkles, BookOpen, Star, Zap, Moon, Feather, Baby, Package } from "lucide-react";

const megaMenuData = {
  categories: [
    { name: "Islamic Studies", items: ["Theology", "Hadith", "Quranic Tafsir", "Seerah", "Fiqh"] },
    { name: "Literature", items: ["Contemporary Fiction", "Arabic Classics", "Poetry", "Drama"] },
    { name: "Self-Development", items: ["Productivity", "Spirituality", "Psychology", "Leadership"] },
    { name: "Children & YA", items: ["Picture Books", "Graphic Novels", "Arabic Learning", "Young Adult"] },
  ],
  featured: {
    title: "Collection of the Month",
    image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=800&auto=format&fit=crop",
    tag: "CURATED"
  }
};

const searchBooks = [
  { id: 1, title: "The Sealed Nectar", author: "Safiur Rahman", price: 85.00 },
  { id: 2, title: "Atomic Habits", author: "James Clear", price: 65.00 },
  { id: 3, title: "The Alchemist", author: "Paulo Coelho", price: 45.00 },
  { id: 4, title: "Think and Grow Rich", author: "Napoleon Hill", price: 55.00 },
];

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [cartCount] = useAtom(cartCountAtom);
  const setAuthModal = useSetAtom(authModalAtom);

  const categories = [
    { name: "Shop All", href: "/shop", icon: <Sparkles size={14} className="text-primary" /> },
    { name: "Today's Deals", href: "/#deals", icon: <Zap size={14} /> },
    { name: "Islamic", href: "/#islamic", icon: <Moon size={14} /> },
    { name: "Fiction", href: "/#fiction", icon: <Feather size={14} /> },
    { name: "Children", href: "/#children", icon: <Baby size={14} /> },
    { name: "Bundles", href: "/#bundles", icon: <Package size={14} /> },
    { name: "New Arrivals", href: "/#new", icon: <Sparkles size={14} /> },
  ];

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-40 bg-white shadow-sm">
        {/* Top Bar: Logo, Search, Icons */}
        <div className="border-b border-stone-100 h-20">
          <div className="container mx-auto px-6 h-full flex items-center gap-4 md:gap-8">
            {/* Logo */}
            <Link href="/" className="flex-shrink-0 flex items-center gap-3">
              <img
                src="/Al%20Rewaya%20Book%20World%20Approved%20Logo%201%20-%20Copy.png"
                alt="Rewaya"
                className="h-10 md:h-12 w-auto object-contain"
              />
              <div className="hidden xl:flex flex-col leading-none">
                <span className="text-xl font-bold tracking-tighter text-secondary uppercase">alrewaya</span>
                <span className="text-[10px] font-black tracking-[0.2em] text-primary">BOOK WORLD</span>
              </div>
            </Link>

            {/* Reduced Noon-style Search Bar */}
            <div className="flex-grow max-w-xl relative hidden md:block mx-auto">
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 group-focus-within:text-primary transition-colors" size={18} />
                <input
                  type="text"
                  placeholder="What are you looking for?"
                  className="w-full bg-stone-50 border border-stone-100 rounded-lg py-3 pl-12 pr-4 text-sm outline-none focus:bg-white focus:border-primary/30 transition-all placeholder:text-stone-300"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* Right Icons */}
            <div className="flex items-center gap-1 md:gap-2 ml-auto text-secondary">
              {/* Language Toggle (Ghost Style to match others) */}
              <Button
                variant="ghost"
                className="gap-2 hover:text-primary h-10 px-3 flex"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-secondary">
                  <path d="m5 8 6 6" /><path d="m4 14 6-6 2-3" /><path d="M2 5h12" /><path d="M7 2h1" /><path d="m22 22-5-10-5 10" /><path d="M14 18h6" />
                </svg>
                <span className="text-base font-bold">العربية</span>
              </Button>

              <Button variant="ghost" size="icon" className="md:hidden hover:text-primary">
                <Search size={20} />
              </Button>
              <Button
                variant="ghost"
                className="gap-2 hover:text-primary h-10 px-3"
                onClick={() => setAuthModal({ isOpen: true, view: 'login' })}
              >
                <User size={20} strokeWidth={1.5} />
                <span className="text-[10px] font-bold uppercase tracking-widest hidden xl:block">Sign In</span>
              </Button>
              <Link href="/cart">
                <Button variant="ghost" className="gap-2 hover:text-primary h-10 px-3 relative">
                  <ShoppingBag size={20} strokeWidth={1.5} />
                  <span className="text-[10px] font-bold uppercase tracking-widest hidden xl:block">Cart</span>
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-primary text-white text-[9px] flex items-center justify-center rounded-full font-bold px-1 ring-2 ring-white">
                      {cartCount}
                    </span>
                  )}
                </Button>
              </Link>
              <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setIsMobileMenuOpen(true)}>
                <Menu size={22} />
              </Button>
            </div>
          </div>
        </div>

        {/* Sub-Nav: Categories */}
        <nav className="bg-white border-b border-stone-50 hidden lg:block overflow-visible relative">
          <div className="container mx-auto px-6 h-12 flex items-center gap-10">
            <button
              onMouseEnter={() => setIsMegaMenuOpen(true)}
              onClick={() => setIsMegaMenuOpen(!isMegaMenuOpen)}
              className="flex items-center gap-2 text-[10px] font-black tracking-widest uppercase text-secondary hover:text-primary transition-colors border-r border-stone-100 pr-10"
            >
              <Menu size={16} /> All Categories <ChevronDown size={12} className={`transition-transform duration-300 ${isMegaMenuOpen ? 'rotate-180' : ''}`} />
            </button>
            {categories.map((cat) => (
              <Link
                key={cat.name}
                href={cat.href}
                className="text-[10px] font-bold tracking-widest uppercase text-stone-400 hover:text-primary transition-colors whitespace-nowrap flex items-center gap-2"
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
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setIsMegaMenuOpen(false)}
                  className="fixed inset-0 top-[144px] bg-black/20 backdrop-blur-sm z-30"
                />

                {/* Menu Panel */}
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  onMouseLeave={() => setIsMegaMenuOpen(false)}
                  className="absolute top-full left-0 right-0 bg-white border-b border-stone-100 shadow-2xl z-40 overflow-hidden"
                >
                  <div className="container mx-auto px-6 py-12">
                    <div className="grid grid-cols-5 gap-12">
                      {megaMenuData.categories.map((group) => (
                        <div key={group.name} className="space-y-6">
                          <h4 className="text-[11px] font-black tracking-[0.2em] text-secondary uppercase border-b border-stone-100 pb-3">{group.name}</h4>
                          <ul className="space-y-3">
                            {group.items.map((item) => (
                              <li key={item}>
                                <Link href="/shop" className="text-xs text-stone-400 hover:text-primary transition-colors flex items-center gap-2 group/item">
                                  <div className="w-1 h-1 rounded-full bg-stone-200 group-hover/item:bg-primary transition-colors" />
                                  {item}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}

                      {/* Featured Section */}
                      <div className="col-span-1 border-l border-stone-100 pl-12">
                        <div className="relative aspect-[3/4] overflow-hidden group/feat rounded-lg mb-4">
                          <img
                            src={megaMenuData.featured.image}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover/feat:scale-110"
                            alt="Featured"
                          />
                          <div className="absolute inset-0 bg-secondary/10 group-hover/feat:bg-transparent transition-colors" />
                          <div className="absolute bottom-4 left-4">
                            <span className="bg-primary text-white text-[8px] font-black px-2 py-1 uppercase tracking-widest">{megaMenuData.featured.tag}</span>
                          </div>
                        </div>
                        <h4 className="text-[10px] font-black tracking-widest text-secondary uppercase mb-2">{megaMenuData.featured.title}</h4>
                        <Link href="/shop" className="text-[10px] font-bold text-primary hover:underline uppercase tracking-widest">Discover Collection</Link>
                      </div>
                    </div>

                    {/* Bottom Utility links inside Mega Menu */}
                    <div className="mt-12 pt-8 border-t border-stone-100 flex items-center justify-between">
                      <div className="flex gap-8">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-stone-50 rounded-full text-primary"><BookOpen size={16} /></div>
                          <div>
                            <p className="text-[9px] font-black uppercase tracking-widest text-secondary">New Releases</p>
                            <p className="text-[8px] text-stone-400 uppercase">Updated Daily</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-stone-50 rounded-full text-secondary"><Star size={16} /></div>
                          <div>
                            <p className="text-[9px] font-black uppercase tracking-widest text-secondary">Best Sellers</p>
                            <p className="text-[8px] text-stone-400 uppercase">Top 100 Books</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-4">
                        <div className="flex items-center gap-2 px-4 py-2 bg-primary/5 text-primary rounded-lg">
                          <Zap size={14} fill="currentColor" />
                          <span className="text-[10px] font-black uppercase tracking-widest">Sale: Up to 40% Off</span>
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
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-stone-100 py-8 overflow-hidden"
          >
            <div className="flex flex-col gap-6 px-6">
              {["Shop", "Islamic", "Fiction", "New", "About", "Log In"].map((item) => (
                <Link
                  key={item}
                  href={item === "Log In" ? "/login" : (item === "Shop" ? "/shop" : (item === "About" ? "/about" : "#"))}
                  className="nav-link text-xl"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

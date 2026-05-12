"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Search, ShoppingBag, User, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useAtom } from "jotai";
import { cartCountAtom } from "@/lib/store";

const searchBooks = [
  { id: 1, title: "The Sealed Nectar", author: "Safiur Rahman", price: 85.00 },
  { id: 2, title: "Atomic Habits", author: "James Clear", price: 65.00 },
  { id: 3, title: "The Alchemist", author: "Paulo Coelho", price: 45.00 },
  { id: 4, title: "Think and Grow Rich", author: "Napoleon Hill", price: 55.00 },
];

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [cartCount] = useAtom(cartCountAtom);

  const filteredBooks = searchBooks.filter(book => 
    book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    book.author.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-stone-100 h-20">
      <div className="container mx-auto px-6 h-full flex items-center justify-between relative">
        {/* Left: Mobile Toggle */}
        <div className="md:hidden">
          <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </Button>
        </div>

        {/* Left-ish: Logo & Text */}
        <div className="flex-shrink-0 flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2 group">
            <img
              src="/Al%20Rewaya%20Book%20World%20Approved%20Logo%201%20-%20Copy.png"
              alt="Rewaya Icon"
              className="h-8 md:h-10 w-auto object-contain transition-transform group-hover:scale-110"
            />
            <div className="flex flex-col leading-none">
              <span className="text-xl md:text-2xl font-bold tracking-tighter text-secondary">
                alrewaya
              </span>
              <span className="text-[10px] md:text-xs font-black tracking-[0.2em] text-primary">
                BOOK WORLD
              </span>
            </div>
          </Link>
        </div>

        {/* Center: Desktop Nav */}
        {!isSearchOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="hidden md:flex items-center gap-10 absolute left-1/2 transform -translate-x-1/2"
          >
            <Link href="/shop" className="group relative nav-link text-secondary transition-colors py-2">
              Shop
              <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-primary transition-all duration-300 group-hover:w-full" />
            </Link>
            {["Islamic", "Fiction", "New"].map((item) => (
              <Link
                key={item}
                href={`/#${item.toLowerCase()}`}
                className="group relative nav-link text-secondary transition-colors py-2"
              >
                {item}
                <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-primary transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
            <Link href="/about" className="group relative nav-link text-secondary transition-colors py-2">
              About
              <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-primary transition-all duration-300 group-hover:w-full" />
            </Link>
          </motion.div>
        )}

        {/* Right: Icons & Search Bar */}
        <div className="flex items-center gap-2 text-secondary">
          <div className="relative flex items-center">
            <AnimatePresence>
              {isSearchOpen && (
                <motion.div
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: 300, opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  className="mr-2 overflow-hidden"
                >
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="SEARCH BOOKS..."
                    className="w-full bg-stone-50 border-none outline-none px-4 py-2 text-[10px] tracking-widest font-bold uppercase rounded-sm"
                    autoFocus
                  />
                </motion.div>
              )}
            </AnimatePresence>
            <Button 
              variant="ghost" 
              size="icon" 
              className="hover:text-primary"
              onClick={() => {
                if (isSearchOpen) setSearchQuery("");
                setIsSearchOpen(!isSearchOpen);
              }}
            >
              {isSearchOpen ? <X size={20} /> : <Search size={20} strokeWidth={1.5} />}
            </Button>

            {/* Live Search Results List */}
            <AnimatePresence>
              {isSearchOpen && searchQuery.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute top-full right-0 mt-4 w-80 bg-white border border-stone-100 shadow-heavy z-50 overflow-hidden"
                >
                  <div className="max-h-[400px] overflow-y-auto">
                    {filteredBooks.length > 0 ? (
                      filteredBooks.map(book => (
                        <Link 
                          key={book.id} 
                          href={`/product/${book.id}`}
                          onClick={() => {
                            setIsSearchOpen(false);
                            setSearchQuery("");
                          }}
                          className="flex items-center gap-4 p-4 hover:bg-stone-50 transition-colors border-b border-stone-50 last:border-none"
                        >
                          <div className="w-10 h-14 bg-stone-100 flex-shrink-0" />
                          <div className="flex flex-col">
                            <span className="text-[10px] font-bold uppercase tracking-wider">{book.title}</span>
                            <span className="text-[8px] text-stone-400 uppercase tracking-widest">{book.author}</span>
                          </div>
                          <span className="ml-auto text-[9px] font-bold text-primary">AED {book.price}</span>
                        </Link>
                      ))
                    ) : (
                      <div className="p-8 text-center">
                        <p className="text-[9px] text-stone-400 uppercase tracking-widest font-bold">No results found</p>
                      </div>
                    )}
                  </div>
                  <div className="p-3 bg-stone-50 text-center border-t border-stone-100">
                    <button className="text-[9px] font-bold uppercase tracking-widest text-stone-400 hover:text-black transition-colors">
                      View All Results
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <Link href="/login" className="hidden md:block">
            <Button variant="ghost" size="icon" className="hover:text-primary">
              <User size={20} strokeWidth={1.5} />
            </Button>
          </Link>
          <Link href="/cart" className="hidden md:block">
            <Button variant="ghost" size="icon" className="hover:text-primary relative">
              <ShoppingBag size={20} strokeWidth={1.5} />
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-primary text-white text-[9px] flex items-center justify-center rounded-full font-bold">
                  {cartCount}
                </span>
              )}
            </Button>
          </Link>
        </div>
      </div>

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
    </nav>
  );
}

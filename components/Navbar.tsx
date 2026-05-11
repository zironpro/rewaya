"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Search, ShoppingBag, User, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-stone-100 h-20">
      <div className="container mx-auto px-6 h-full flex items-center justify-between relative">
        {/* Left: Mobile Toggle */}
        <div className="md:hidden">
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
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
        <div className="hidden md:flex items-center gap-10 absolute left-1/2 transform -translate-x-1/2">
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
        </div>

        {/* Right: Icons */}
        <div className="flex items-center gap-6 text-secondary">
          <button className="hidden sm:block p-1 hover:text-primary hover:scale-110 transition-all">
            <Search size={20} strokeWidth={1.5} />
          </button>
          <button className="p-1 hover:text-primary hover:scale-110 transition-all">
            <User size={20} strokeWidth={1.5} />
          </button>
          <button className="p-1 hover:text-primary hover:scale-110 transition-all relative">
            <ShoppingBag size={20} strokeWidth={1.5} />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary text-white text-[9px] flex items-center justify-center rounded-full font-bold">
              0
            </span>
          </button>
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
              {["Shop", "Islamic", "Fiction", "New", "About"].map((item) => (
                <Link
                  key={item}
                  href="#"
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

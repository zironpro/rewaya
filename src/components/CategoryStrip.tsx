"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";

const categories = [
  { name: "Islamic", image: "https://images.unsplash.com/photo-1542810634-71277d95dcbb?q=80&w=300&auto=format&fit=crop", href: "/#islamic" },
  { name: "Children", image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=300&auto=format&fit=crop", href: "/#children" },
  { name: "Academic", image: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?q=80&w=300&auto=format&fit=crop", href: "/#academic" },
  { name: "Fiction", image: "https://images.unsplash.com/photo-1474932430478-367dbb6832c1?q=80&w=300&auto=format&fit=crop", href: "/#fiction" },
  { name: "Self-Help", image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=300&auto=format&fit=crop", href: "/#selfhelp" },
  { name: "History", image: "https://images.unsplash.com/photo-1461360228754-6e81c478b882?q=80&w=300&auto=format&fit=crop", href: "/#history" },
  { name: "Biographies", image: "https://images.unsplash.com/photo-1471107340929-a87cd0f5b5f3?q=80&w=300&auto=format&fit=crop", href: "/#biographies" },
];

export default function CategoryStrip() {
  return (
    <section className="py-16 bg-white border-b border-stone-50">
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-center overflow-x-auto no-scrollbar gap-6 md:gap-10 py-4">
          {categories.map((cat, i) => (
            <Link 
              key={cat.name} 
              href={cat.href}
              className="flex flex-col items-center gap-4 flex-shrink-0 group"
            >
              <motion.div 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-32 h-32 md:w-48 md:h-48 rounded-[2.5rem] md:rounded-[3.5rem] overflow-hidden bg-stone-50 border-2 border-stone-100 shadow-sm transition-all group-hover:shadow-xl group-hover:border-primary/30"
              >
                <img 
                  src={cat.image} 
                  alt={cat.name} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </motion.div>
              <span className="text-[11px] md:text-xs font-black tracking-[0.2em] uppercase text-stone-500 group-hover:text-primary transition-colors text-center">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

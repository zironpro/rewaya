"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

const categories = [
  {
    id: 1,
    name: "Islamic Literature",
    description: "Spiritual wisdom for the modern soul.",
    image: "https://images.unsplash.com/photo-1541963463532-d68292c34b19?q=80&w=1200&auto=format&fit=crop",
    className: "md:col-span-2 md:row-span-2",
    color: "bg-emerald-900",
  },
  {
    id: 2,
    name: "Self Improvement",
    description: "Unlock your full potential.",
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=1200&auto=format&fit=crop",
    className: "md:col-span-1 md:row-span-1",
    color: "bg-blue-900",
  },
  {
    id: 3,
    name: "Modern Fiction",
    description: "Stories that stay with you.",
    image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=1200&auto=format&fit=crop",
    className: "md:col-span-1 md:row-span-2",
    color: "bg-amber-900",
  },
  {
    id: 4,
    name: "Children's World",
    description: "Where imagination knows no bounds.",
    image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=1200&auto=format&fit=crop",
    className: "md:col-span-1 md:row-span-1",
    color: "bg-rose-900",
  },
];

export default function CategoryBento() {
  return (
    <section className="py-32 bg-white">
      <div className="container mx-auto px-6">
        <div className="flex flex-col items-center mb-20 text-center">
          <span className="nav-link text-stone-400 mb-4 tracking-[0.3em]">Shop by Category</span>
          <h2 className="text-4xl md:text-5xl font-serif font-black">
            ESSENTIALS <span className="italic font-normal">&</span> CLASSICS.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-auto">
          {categories.slice(0, 2).map((cat, index) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              className="relative group aspect-[16/10] overflow-hidden cursor-pointer"
            >
              <img
                src={cat.image}
                alt={cat.name}
                className="absolute inset-0 w-full h-full object-cover transition-all duration-1000 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500" />
              <div className="absolute inset-0 flex flex-col justify-center items-center text-white">
                <h3 className="text-4xl md:text-5xl font-serif font-black uppercase tracking-tighter mb-4">{cat.name}</h3>
                <span className="nav-link text-white border-b border-white pb-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  Discover More
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

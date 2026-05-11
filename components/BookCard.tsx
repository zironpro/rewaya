"use client";

import React from "react";
import { motion } from "framer-motion";
import { Heart, Plus } from "lucide-react";

import Link from "next/link";

interface BookProps {
  id: number;
  title: string;
  author: string;
  price: number;
  image: string;
  category: string;
}

export default function BookCard({ id, title, author, price, image, category }: BookProps) {
  return (
    <Link href={`/product/${id}`}>
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        className="group cursor-pointer"
      >
        {/* Image Container */}
        <div className="relative aspect-[3/4] overflow-hidden bg-stone-50 mb-4">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
          
          {/* Wishlist Icon */}
          <button className="absolute top-4 right-4 p-2 bg-white/80 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
            <Heart size={16} strokeWidth={1.5} />
          </button>

          {/* Quick Add (Bottom) */}
          <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-primary">
            <button className="w-full py-2 text-white text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-2">
              <Plus size={14} /> Add to Bag
            </button>
          </div>

          {/* Sale Badge if applicable */}
          {price < 50 && (
            <div className="absolute top-4 left-0">
              <span className="sale-badge bg-primary">Sale</span>
            </div>
          )}
        </div>

        {/* Info Container */}
        <div className="flex flex-col gap-1 px-1">
          <div className="flex justify-between items-start gap-2">
            <h3 className="text-xs font-bold uppercase tracking-wider leading-tight flex-1 text-secondary">
              {title}
            </h3>
            <span className="text-xs font-bold text-primary">AED {price.toFixed(2)}</span>
          </div>
          <p className="text-[10px] text-stone-400 uppercase tracking-widest">
            {author}
          </p>
        </div>
      </motion.div>
    </Link>
  );
}

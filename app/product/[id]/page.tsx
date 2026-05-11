"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Heart, Plus, Minus, Share2, ShieldCheck, Truck, RefreshCcw } from "lucide-react";
import { motion } from "framer-motion";

// Mock data fetch for a single product
const getProduct = (id: string) => ({
  id: parseInt(id),
  title: id === "1" ? "The Sealed Nectar" : id === "2" ? "Atomic Habits" : "Classic Literature",
  author: id === "1" ? "Safiur Rahman Mubarakpuri" : "Various Authors",
  price: 85.00,
  category: "Islamic",
  image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=1200&auto=format&fit=crop",
  description: "A comprehensive and authoritative biography of the Prophet Muhammad (PBUH). This book is considered one of the most reliable sources on the life of the Prophet, winner of the worldwide competition on the biography of the Prophet Muhammad held by the Muslim World League.",
  details: [
    { label: "Language", value: "English" },
    { label: "Format", value: "Hardcover" },
    { label: "Pages", value: "588" },
    { label: "Publisher", value: "Darussalam Publishing" }
  ]
});

export default function ProductDetailPage() {
  const { id } = useParams();
  const product = getProduct(id as string);
  const [quantity, setQuantity] = useState(1);

  return (
    <div className="min-h-screen bg-white text-secondary">
      <Navbar />

      <main className="pt-24 pb-32">
        <div className="container mx-auto px-6">
          {/* Breadcrumbs */}
          <nav className="flex gap-2 text-[10px] uppercase tracking-widest text-stone-400 mb-12">
            <a href="/" className="hover:text-primary">Home</a>
            <span>/</span>
            <a href="/shop" className="hover:text-primary">Shop</a>
            <span>/</span>
            <span className="text-secondary font-bold">{product.title}</span>
          </nav>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-20">
            {/* Image Gallery Side */}
            <div className="space-y-6">
              <div className="relative aspect-[4/5] bg-stone-50 overflow-hidden group">
                <img 
                  src={product.image} 
                  alt={product.title}
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                />
                <button className="absolute top-6 right-6 p-3 bg-white/80 backdrop-blur-md rounded-full hover:bg-primary hover:text-white transition-colors">
                  <Heart size={20} />
                </button>
              </div>
              <div className="grid grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="aspect-square bg-stone-50 cursor-pointer opacity-50 hover:opacity-100 transition-opacity">
                    <img src={product.image} className="w-full h-full object-cover grayscale" alt="thumbnail" />
                  </div>
                ))}
              </div>
            </div>

            {/* Content Side */}
            <div className="flex flex-col">
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary mb-4">
                {product.category}
              </span>
              <h1 className="text-4xl md:text-6xl font-serif font-black uppercase tracking-tight mb-2">
                {product.title}
              </h1>
              <p className="text-sm font-bold tracking-[0.2em] text-stone-400 uppercase mb-8">
                {product.author}
              </p>

              <div className="text-2xl font-bold mb-10 text-secondary">
                AED {product.price.toFixed(2)}
              </div>

              <p className="text-sm text-stone-500 leading-relaxed mb-12 max-w-lg uppercase tracking-wider text-[11px]">
                {product.description}
              </p>

              {/* Action Section */}
              <div className="space-y-8 mb-16">
                <div className="flex items-center gap-12">
                  <div className="flex items-center border border-stone-100 px-4 py-2">
                    <button 
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-2 hover:text-primary transition-colors"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="w-12 text-center text-xs font-bold">{quantity}</span>
                    <button 
                      onClick={() => setQuantity(quantity + 1)}
                      className="p-2 hover:text-primary transition-colors"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                  <button className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest hover:text-primary transition-colors">
                    <Share2 size={14} /> Share
                  </button>
                </div>

                <button className="w-full py-6 bg-primary text-white text-[10px] font-bold uppercase tracking-[0.4em] hover:bg-secondary hover:scale-[1.02] hover:shadow-2xl transition-all duration-500 shadow-lg active:scale-[0.98]">
                  Add to Collection
                </button>
              </div>

              {/* Details & Shipping */}
              <div className="space-y-6 pt-12 border-t border-stone-100">
                <div className="grid grid-cols-2 gap-y-4">
                  {product.details.map((detail, i) => (
                    <div key={i} className="flex flex-col">
                      <span className="text-[9px] font-bold uppercase tracking-widest text-stone-400 mb-1">{detail.label}</span>
                      <span className="text-[11px] font-black uppercase tracking-tight">{detail.value}</span>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col gap-4 pt-6">
                  <div className="flex items-center gap-4 text-xs">
                    <Truck size={18} className="text-primary" />
                    <span className="uppercase tracking-widest text-[10px]">Express Shipping Available (2-3 Days)</span>
                  </div>
                  <div className="flex items-center gap-4 text-xs">
                    <RefreshCcw size={18} className="text-primary" />
                    <span className="uppercase tracking-widest text-[10px]">30-Day Spiritual Reflection Returns</span>
                  </div>
                  <div className="flex items-center gap-4 text-xs">
                    <ShieldCheck size={18} className="text-primary" />
                    <span className="uppercase tracking-widest text-[10px]">100% Authentic Edition Guarantee</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

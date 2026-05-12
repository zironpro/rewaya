"use client";

import React from "react";
import { motion } from "framer-motion";
import { Button } from "./ui/button";
import { ArrowRight, Sparkles, Tag } from "lucide-react";

const bundles = [
  {
    id: "seeker-set",
    title: "The Modern Seeker",
    count: 5,
    price: 249,
    originalPrice: 310,
    tag: "MOST POPULAR",
    image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=800&auto=format&fit=crop",
    books: ["Reclaim Your Heart", "The Sealed Nectar", "Atomic Habits", "Deep Work", "5 AM Club"]
  },
  {
    id: "history-set",
    title: "Islamic History Core",
    count: 4,
    price: 199,
    originalPrice: 260,
    tag: "BEST VALUE",
    image: "https://images.unsplash.com/photo-1585032226651-759b368d7246?q=80&w=800&auto=format&fit=crop",
    books: ["History of Islam", "The Caliphate", "Great Explorers", "Golden Age"]
  }
];

export default function BundleSection() {
  return (
    <section className="py-16 bg-white border-y border-stone-100 overflow-hidden relative">
      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6 text-center md:text-left">
          <div className="max-w-xl">
            <span className="text-[9px] tracking-[0.4em] text-primary uppercase font-black mb-3 block">Special Campaigns</span>
            <h2 className="text-4xl md:text-5xl font-serif font-black text-secondary leading-tight uppercase">
              CURATED <span className="italic font-normal text-primary">SETS</span>.
            </h2>
          </div>
          <Button variant="ghost" className="text-primary hover:text-secondary text-[9px] tracking-widest uppercase font-black gap-2">
            View All <ArrowRight size={14} />
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {bundles.map((bundle, i) => (
            <motion.div 
              key={bundle.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="group relative bg-stone-50 border border-stone-100 hover:border-primary/30 transition-all duration-500 p-6 md:p-8 cursor-pointer flex flex-col sm:flex-row gap-12 items-center"
            >
              {/* Triple Visual Stack */}
              <div className="relative w-32 h-44 flex-shrink-0 mb-6 sm:mb-0">
                {/* Book 3 (Back) */}
                <div className="absolute inset-0 bg-stone-200 shadow-lg transform -rotate-12 translate-x-[-15px] transition-transform group-hover:-rotate-15 duration-500 overflow-hidden border border-stone-100">
                  <img src="https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=300&auto=format&fit=crop" className="w-full h-full object-cover opacity-60" alt="Book 3" />
                </div>
                {/* Book 2 (Middle) */}
                <div className="absolute inset-0 bg-stone-100 shadow-xl transform rotate-6 translate-x-[15px] transition-transform group-hover:rotate-12 duration-500 overflow-hidden border border-stone-200">
                  <img src="https://images.unsplash.com/photo-1585032226651-759b368d7246?q=80&w=300&auto=format&fit=crop" className="w-full h-full object-cover opacity-80" alt="Book 2" />
                </div>
                {/* Book 1 (Front) */}
                <div className="absolute inset-0 bg-white shadow-2xl transform rotate-0 transition-transform group-hover:-translate-y-2 duration-500 overflow-hidden border border-stone-300">
                  <img src={bundle.image} className="w-full h-full object-cover" alt={bundle.title} />
                </div>
                
                {/* Floating Badge */}
                <div className="absolute -top-3 -right-3 w-10 h-10 bg-primary text-white flex flex-col items-center justify-center rounded-full shadow-lg z-20 border-2 border-white">
                  <span className="text-xs font-black leading-none">{bundle.count}</span>
                  <span className="text-[6px] font-bold uppercase tracking-tighter">Sets</span>
                </div>
              </div>

              {/* Content */}
              <div className="flex-grow">
                <div className="flex items-center gap-2 mb-3">
                  <Tag size={10} className="text-primary" />
                  <span className="text-[8px] font-black tracking-widest text-primary uppercase">
                    {bundle.tag}
                  </span>
                </div>
                <h3 className="text-xl font-serif font-black uppercase mb-2 text-secondary group-hover:text-primary transition-colors">
                  {bundle.title}
                </h3>
                <p className="text-[9px] text-stone-400 uppercase tracking-widest font-bold mb-6 line-clamp-1">
                  {bundle.books.slice(0, 3).join(", ")}...
                </p>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[9px] text-stone-300 uppercase tracking-widest font-bold line-through mr-2">AED {bundle.originalPrice}</span>
                    <span className="text-lg font-black text-secondary">AED {bundle.price}</span>
                  </div>
                  <Button className="bg-primary hover:bg-secondary text-white rounded-none h-10 px-6 text-[8px] font-black tracking-widest uppercase transition-all shadow-md">
                    Buy Set
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const banners = [
  {
    id: 1,
    title: "RAMADAN SPECIAL",
    subtitle: "UP TO 40% OFF ON ALL ISLAMIC LITERATURE",
    cta: "Shop the Sale",
    bg: "bg-stone-900",
    image: "https://images.unsplash.com/photo-1585036156171-3839efc2296c?q=80&w=2000&auto=format&fit=crop",
  },
  {
    id: 2,
    title: "NEW ARRIVALS",
    subtitle: "THE LATEST FROM GLOBAL AUTHORS",
    cta: "Explore New",
    bg: "bg-secondary",
    image: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?q=80&w=2000&auto=format&fit=crop",
  },
  {
    id: 3,
    title: "BOOK BUNDLES",
    subtitle: "BUY 4 GET 2 FREE ON SELECTED COLLECTIONS",
    cta: "View Bundles",
    bg: "bg-primary",
    image: "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?q=80&w=2000&auto=format&fit=crop",
  },
];

export default function HeroCarousel() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev === banners.length - 1 ? 0 : prev + 1));
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const next = () => setCurrent((prev) => (prev === banners.length - 1 ? 0 : prev + 1));
  const prev = () => setCurrent((prev) => (prev === 0 ? banners.length - 1 : prev - 1));

  return (
    <div className="relative h-[70vh] md:h-[85vh] w-full overflow-hidden bg-stone-50">
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="absolute inset-0 w-full h-full"
        >
          {/* Background Image with Overlay */}
          <div className="absolute inset-0">
            <img 
              src={banners[current].image} 
              alt={banners[current].title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40 backdrop-brightness-75" />
          </div>

          {/* Content */}
          <div className="relative container mx-auto px-6 h-full flex flex-col justify-center items-center text-center text-white">
            <motion.span 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xs md:text-sm font-bold tracking-[0.4em] uppercase mb-6"
            >
              {banners[current].subtitle}
            </motion.span>
            <motion.h2 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-5xl md:text-8xl font-serif font-black mb-10 leading-none"
            >
              {banners[current].title.split(' ').map((word, i) => (
                <span key={i} className={i % 2 !== 0 ? "italic font-normal" : ""}>
                  {word}{" "}
                </span>
              ))}
            </motion.h2>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Button size="lg" className="bg-primary hover:bg-primary-dark text-white px-10 h-14 text-xs font-bold uppercase tracking-widest rounded-none">
                {banners[current].cta} <ArrowRight size={16} className="ml-2" />
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Arrows */}
      <div className="absolute bottom-10 right-6 md:right-12 flex gap-4 z-10">
        <button onClick={prev} className="p-3 border border-white/30 text-white hover:bg-white hover:text-black transition-all">
          <ChevronLeft size={24} />
        </button>
        <button onClick={next} className="p-3 border border-white/30 text-white hover:bg-white hover:text-black transition-all">
          <ChevronRight size={24} />
        </button>
      </div>

      {/* Progress Indicators */}
      <div className="absolute bottom-10 left-6 md:left-12 flex gap-3 z-10">
        {banners.map((_, i) => (
          <div 
            key={i}
            onClick={() => setCurrent(i)}
            className={`h-1 transition-all duration-500 cursor-pointer ${current === i ? "w-12 bg-primary" : "w-6 bg-white/30 hover:bg-white/50"}`}
          />
        ))}
      </div>
    </div>
  );
}

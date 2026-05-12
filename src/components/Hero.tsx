"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export default function Hero() {
  return (
    <div className="relative min-h-screen flex items-center pt-16 overflow-hidden bg-white">
      <div className="container mx-auto px-6 py-10">
        <div className="flex flex-col items-center text-center mb-10">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-8xl font-serif font-black tracking-tight leading-[0.85] mb-6"
          >
            THE NEW <br /> 
            <span className="italic font-normal">LITERARY</span> <br />
            STANDARD.
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="nav-link max-w-md text-stone-500 mb-8"
          >
            Curating the finest collection of Islamic and international literature for the modern seeker.
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex gap-4"
          >
            <button className="px-10 py-4 bg-primary text-white text-xs font-bold uppercase tracking-widest hover:bg-primary-dark transition-colors">
              Shop Now
            </button>
            <button className="px-10 py-4 border border-primary text-primary text-xs font-bold uppercase tracking-widest hover:bg-primary hover:text-white transition-colors">
              Our Story
            </button>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="relative w-full aspect-[21/7] overflow-hidden"
        >
          <img
            src="https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=2000&auto=format&fit=crop"
            alt="Library"
            className="w-full h-full object-cover grayscale brightness-75"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-white text-xs font-bold uppercase tracking-[0.5em] border-b-2 border-white pb-2">
              Explore the Collection
            </span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

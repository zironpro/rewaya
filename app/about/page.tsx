"use client";

import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <main className="pt-24 pb-32">
        {/* Typographic Hero */}
        <section className="py-32 border-b border-stone-100">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto text-center">
              <motion.span 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="nav-link text-primary mb-8 inline-block tracking-[0.4em]"
              >
                Our Legacy
              </motion.span>
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-6xl md:text-9xl font-serif font-black text-secondary leading-[0.85] mb-16 uppercase tracking-tighter"
              >
                BEYOND <br /> THE <span className="italic font-normal text-primary">PAGES</span>.
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-xl text-stone-500 leading-relaxed mx-auto max-w-2xl uppercase tracking-widest text-[14px]"
              >
                Rewaya was born from a simple belief: that books are not just objects, but vessels of transformation. We curate wisdom for the modern soul, bridging the gap between ancient knowledge and contemporary living.
              </motion.p>
            </div>
          </div>
        </section>

        {/* Philosophy Section */}
        <section className="py-40 bg-stone-50">
          <div className="container mx-auto px-6">
            <div className="max-w-5xl mx-auto text-center">
              <h2 className="text-4xl md:text-6xl font-serif font-black text-secondary mb-16 uppercase tracking-tight">
                READ. REFLECT. <span className="italic font-normal text-primary">EVOLVE</span>.
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-20 text-left">
                <p className="text-sm text-stone-600 leading-relaxed uppercase tracking-widest">
                  In a world of fleeting digital noise, we champion the permanence of printed literature. Our collection is hand-picked for its depth, quality, and spiritual resonance. Every title is a seed for future wisdom.
                </p>
                <p className="text-sm text-stone-600 leading-relaxed uppercase tracking-widest">
                  Founded in the United Arab Emirates, Rewaya serves a global community of seekers and lifelong learners. We believe that true growth happens in the moments of quiet reflection between the lines of a great book.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Values - Pure Text */}
        <section className="py-40">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-24">
              {[
                { title: "Curation", desc: "Hand-picked titles that prioritize depth over volume." },
                { title: "Community", desc: "A sanctuary for those who seek knowledge and growth." },
                { title: "Preservation", desc: "Honoring the tradition of physical books in a digital age." }
              ].map((value, i) => (
                <div key={i} className="flex flex-col border-l border-stone-100 pl-8">
                  <span className="text-xs font-black uppercase tracking-[0.4em] mb-6 text-primary">0{i+1}</span>
                  <h3 className="text-xl font-serif font-black uppercase tracking-tight mb-4 text-secondary">{value.title}</h3>
                  <p className="text-xs text-stone-400 leading-relaxed uppercase tracking-widest">
                    {value.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Founder Note - Typographic */}
        <section className="py-40 border-t border-stone-100 bg-secondary text-white">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto text-center">
              <span className="nav-link text-primary mb-10 inline-block">A Note from the Founder</span>
              <p className="text-3xl md:text-5xl font-serif italic text-stone-100 leading-tight mb-12">
                "Knowledge is the only treasure that grows when shared. Rewaya is my humble attempt to share the treasures that changed my life."
              </p>
              <div className="flex flex-col items-center gap-2">
                <span className="text-xs font-black uppercase tracking-[0.5em] text-primary">Ahmed Al-Maktoum</span>
                <span className="text-[10px] uppercase tracking-[0.3em] text-stone-500">Founder of Rewaya</span>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

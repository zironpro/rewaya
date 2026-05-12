"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import BookCard from "@/components/BookCard";
import Footer from "@/components/Footer";
import HeroCarousel from "@/components/HeroCarousel";
import PolicyCards from "@/components/PolicyCards";
import ProductStrip from "@/components/ProductStrip";
import CategoryStrip from "@/components/CategoryStrip";
import BundleSection from "@/components/BundleSection";

const featuredBooks = [
  {
    id: 1,
    title: "The Sealed Nectar",
    author: "Safiur Rahman Mubarakpuri",
    price: 85.00,
    category: "Islamic",
    image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: 2,
    title: "Atomic Habits",
    author: "James Clear",
    price: 65.00,
    category: "Self-Help",
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: 3,
    title: "The Alchemist",
    author: "Paulo Coelho",
    price: 45.00,
    category: "Fiction",
    image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: 4,
    title: "Fortress of the Muslim",
    author: "Sa'id bin Ali al-Qahtani",
    price: 25.00,
    category: "Islamic",
    image: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=800&auto=format&fit=crop"
  }
];

const allBooks = [
  ...featuredBooks,
  { id: 5, title: "Reclaim Your Heart", author: "Yasmin Mogahed", price: 55, category: "Islamic", image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=800&auto=format&fit=crop" },
  { id: 6, title: "Deep Work", author: "Cal Newport", price: 70, category: "Self-Help", image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=800&auto=format&fit=crop" },
  { id: 7, title: "The 5 AM Club", author: "Robin Sharma", price: 60, category: "Self-Help", image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=800&auto=format&fit=crop" },
  { id: 8, title: "The Power of Now", author: "Eckhart Tolle", price: 50, category: "Spirituality", image: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=800&auto=format&fit=crop" },
];

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />

      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.5 }}
        className="pt-20 lg:pt-32"
      >
        <HeroCarousel />
        <CategoryStrip />

        {/* 1. RECOMMENDED FOR YOU */}
        <ProductStrip
          title="Recommended for You"
          subtitle="Based on your taste"
          books={[...allBooks, ...allBooks].map((book, i) => ({ ...book, id: `${book.id}-rec-${i}` }))}
        />

        {/* 2. TODAY'S DEALS */}
        <ProductStrip
          title="Today's Deals"
          subtitle="Limited Time"
          books={[...allBooks, ...allBooks].map((book, i) => ({ ...book, id: `${book.id}-deal-${i}` }))}
        />

        {/* INTERSTITIAL BANNER 1 */}
        <section className="h-[400px] relative overflow-hidden bg-stone-900 my-16">
          <img
            src="https://images.unsplash.com/photo-1476275466078-4007374efbbe?q=80&w=2000&auto=format&fit=crop"
            className="w-full h-full object-cover opacity-60"
            alt="Promotion"
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-6">
            <h3 className="text-3xl md:text-5xl font-serif italic mb-6 uppercase tracking-widest">Explore <span className="font-normal italic">Islamic</span> History</h3>
            <p className="text-[10px] tracking-[0.4em] font-bold uppercase mb-8 opacity-80">Curated collection for the modern seeker</p>
            <Button variant="outline" className="text-white border-white hover:bg-white hover:text-black h-12 px-10 rounded-none text-[10px] tracking-widest uppercase font-bold transition-all">
              Shop Now
            </Button>
          </div>
        </section>

        {/* 2. NEW SELLERS */}
        <ProductStrip
          title="New Sellers"
          subtitle="Latest Arrivals"
          books={[...allBooks, ...allBooks].map((book, i) => ({ ...book, id: `${book.id}-new-${i}` }))}
        />

        {/* BUNDLES SECTION */}
        <BundleSection />

        {/* 3. BEST SELLERS */}
        <ProductStrip
          title="Best Sellers"
          subtitle="Top Rated"
          books={[...allBooks, ...allBooks].map((book, i) => ({ ...book, id: `${book.id}-best-${i}` }))}
        />

        {/* INTERSTITIAL BANNER 2 */}
        <section className="py-16">
          <div className="container mx-auto px-6">
            <div className="relative h-[400px] overflow-hidden group rounded-2xl shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?q=80&w=2000&auto=format&fit=crop"
                className="w-full h-full object-cover transition-transform duration-[3s] group-hover:scale-110"
                alt="Children's Books"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-secondary/80 to-transparent flex flex-col items-start justify-center px-12 md:px-24">
                <span className="text-[10px] tracking-[0.4em] text-white uppercase font-bold mb-6 block">Special Release</span>
                <h3 className="text-4xl md:text-6xl font-serif text-white mb-10 max-w-xl leading-tight uppercase">Nurturing the <br /><span className="italic font-normal text-white/60">Next Generation</span> <br /> of Seekers.</h3>
                <Button className="h-14 px-12 text-[10px] tracking-widest uppercase font-bold rounded-none bg-primary hover:bg-primary-dark border-none transition-all">
                  Shop Children&apos;s
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* 4. CHILDREN'S COLLECTION */}
        <ProductStrip
          title="Children's Collection"
          subtitle="For Young Readers"
          books={[...allBooks, ...allBooks].map((book, i) => ({ ...book, id: `${book.id}-children-${i}` }))}
        />



        <PolicyCards />
      </motion.main>

      <Footer />
    </div>
  );
}

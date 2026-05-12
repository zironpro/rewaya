"use client";

import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import CategoryBento from "@/components/CategoryBento";
import BookCard from "@/components/BookCard";
import Footer from "@/components/Footer";

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

import { motion } from "framer-motion";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />

      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.5 }}
      >
        <Hero />

        <section id="shop" className="py-24 container mx-auto px-6">
          <div className="flex flex-col items-center mb-20">
            <span className="nav-link text-stone-400 mb-4 tracking-[0.3em]">Curated Collection</span>
            <h2 className="text-4xl md:text-5xl font-serif font-black text-center">
              MOST <span className="italic font-normal">WANTED</span> PIECES.
            </h2>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
            {featuredBooks.map((book) => (
              <BookCard key={book.id} {...book} />
            ))}
          </div>
        </section>

        <CategoryBento />

        <section id="new-arrivals" className="py-32 container mx-auto px-6 border-t border-stone-100">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
            <div className="relative aspect-[4/5] overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1491841573634-28140fc7ced7?q=80&w=1200&auto=format&fit=crop"
                alt="Reading lifestyle"
                className="w-full h-full object-cover grayscale"
              />
            </div>
            <div className="flex flex-col items-start text-left">
              <span className="nav-link text-stone-400 mb-6">Our Philosophy</span>
              <h2 className="text-5xl md:text-7xl font-serif font-black mb-10 leading-[0.95]">
                READ. <br /> REFLECT. <br /> <span className="italic font-normal text-stone-400">EVOLVE.</span>
              </h2>
              <p className="text-sm text-stone-500 mb-12 max-w-sm leading-relaxed uppercase tracking-wider">
                At Rewaya, we believe that books are the seeds of tomorrow's wisdom. Join our community of lifelong learners and seekers.
              </p>
              <div className="flex flex-col w-full gap-4 max-w-md">
                <input
                  type="email"
                  placeholder="EMAIL ADDRESS"
                  className="w-full px-0 py-4 border-b border-black focus:outline-none text-[10px] tracking-widest font-bold placeholder:text-stone-300"
                />
                <button className="w-full py-4 bg-primary text-white text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-primary-dark transition-colors">
                  Join the Circle
                </button>
              </div>
            </div>
          </div>
        </section>
      </motion.main>

      <Footer />
    </div>
  );
}

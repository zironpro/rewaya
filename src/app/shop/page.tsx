"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SlidersHorizontal, X } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BookCard from "@/components/BookCard";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

const allBooks = [
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
  },
  {
    id: 5,
    title: "Think and Grow Rich",
    author: "Napoleon Hill",
    price: 55.00,
    category: "Self-Help",
    image: "https://images.unsplash.com/photo-1491841573634-28140fc7ced7?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: 6,
    title: "Muhammad: His Life",
    author: "Martin Lings",
    price: 95.00,
    category: "Islamic",
    image: "https://images.unsplash.com/photo-1589998059171-988d887df646?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: 7,
    title: "Meditations",
    author: "Marcus Aurelius",
    price: 40.00,
    category: "Philosophy",
    image: "https://images.unsplash.com/photo-1516979187457-637abb4f9353?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: 8,
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    price: 35.00,
    category: "Fiction",
    image: "https://images.unsplash.com/photo-1543004218-2c433391740d?q=80&w=800&auto=format&fit=crop"
  }
];

const categories = ["ALL", "ISLAMIC", "SELF-HELP", "FICTION", "PHILOSOPHY"];

export default function ShopPage() {
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const FilterContent = () => (
    <div className="space-y-12">
      <div>
        <h3 className="text-[10px] tracking-[0.2em] font-bold uppercase mb-8 pb-4 border-b border-stone-100">Categories</h3>
        <div className="flex flex-col gap-2">
          {categories.map((cat) => (
            <Button 
              key={cat}
              variant="ghost"
              className="justify-between px-2 h-10 hover:bg-stone-50"
            >
              <span className="text-[10px] tracking-[0.1em]">{cat}</span>
              <span className="text-[8px] text-stone-300 group-hover:text-black">
                ({cat === "ALL" ? allBooks.length : allBooks.filter(b => b.category.toUpperCase() === cat).length})
              </span>
            </Button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-[10px] tracking-[0.2em] font-bold uppercase mb-8 pb-4 border-b border-stone-100">Price Range</h3>
        <div className="space-y-4">
          <div className="flex flex-col gap-2">
            <input type="range" className="w-full accent-primary" min="0" max="200" />
            <div className="flex justify-between text-[9px] font-bold text-stone-400 uppercase tracking-widest">
              <span>$0</span>
              <span>$200+</span>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-[10px] tracking-[0.2em] font-bold uppercase mb-8 pb-4 border-b border-stone-100">Availability</h3>
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <Checkbox id="in-stock" />
            <label htmlFor="in-stock" className="text-[10px] tracking-[0.1em] font-bold uppercase cursor-pointer">In Stock</label>
          </div>
          <div className="flex items-center space-x-3">
            <Checkbox id="pre-order" />
            <label htmlFor="pre-order" className="text-[10px] tracking-[0.1em] font-bold uppercase cursor-pointer">Pre-Order</label>
          </div>
        </div>
      </div>

      <div className="pt-8">
        <Button variant="outline" className="w-full h-12 text-[9px]" onClick={() => setIsMobileFilterOpen(false)}>
          Apply Filters
        </Button>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />
      
      <main className="flex-grow pt-32">
        {/* Header */}
        <section className="container mx-auto px-6 mb-12 text-center">
          <span className="text-[10px] tracking-[0.4em] text-stone-400 uppercase font-bold mb-6 block">Collection</span>
          <h1 className="text-5xl md:text-7xl font-serif font-black mb-8">
            THE <span className="italic font-normal">LIBRARY</span>.
          </h1>
        </section>

        {/* Mobile Filter Toggle */}
        <section className="lg:hidden container mx-auto px-6 mb-8 flex gap-4">
          <Button 
            variant="outline" 
            className="flex-1 h-12 text-[10px] tracking-widest font-bold uppercase border-stone-100"
            onClick={() => setIsMobileFilterOpen(true)}
          >
            <SlidersHorizontal size={14} className="mr-2" /> Filter & Sort
          </Button>
        </section>

        {/* Main Content Area */}
        <section className="container mx-auto px-6 mb-32">
          <div className="flex flex-col lg:flex-row gap-16">
            
            {/* Sidebar Filters (Desktop Only) */}
            <aside className="hidden lg:block w-64 flex-shrink-0 space-y-12 sticky top-32 h-fit max-h-[calc(100vh-160px)] overflow-y-auto pr-4 scrollbar-thin">
              <FilterContent />
            </aside>

            {/* Product Grid Area */}
            <div className="flex-grow">
              <div className="hidden lg:flex justify-between items-center mb-12 pb-4 border-b border-stone-100">
                <p className="text-[10px] tracking-[0.1em] text-stone-400 uppercase font-bold">Showing {allBooks.length} Results</p>
                <div className="flex items-center gap-6">
                  <span className="text-[10px] tracking-[0.1em] text-stone-400 uppercase font-bold">Sort By:</span>
                  <select className="text-[10px] tracking-[0.1em] font-bold uppercase bg-transparent outline-none cursor-pointer">
                    <option>Newest First</option>
                    <option>Price: Low to High</option>
                    <option>Price: High to Low</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-8 gap-y-16">
                {allBooks.map((book) => (
                  <BookCard key={book.id} {...book} />
                ))}
              </div>
            </div>

          </div>
        </section>
      </main>

      {/* Mobile Filter Drawer */}
      <AnimatePresence>
        {isMobileFilterOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileFilterOpen(false)}
              className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm lg:hidden"
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed bottom-0 left-0 right-0 z-[101] bg-white rounded-t-3xl p-8 lg:hidden max-h-[85vh] overflow-y-auto shadow-heavy"
            >
              <div className="flex justify-between items-center mb-10 pb-4 border-b border-stone-100">
                <h2 className="text-[10px] tracking-[0.3em] font-bold uppercase">Refine Selection</h2>
                <button onClick={() => setIsMobileFilterOpen(false)}>
                  <X size={20} className="text-stone-400" />
                </button>
              </div>
              <FilterContent />
              <div className="h-20" /> {/* Extra space for mobile nav */}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}

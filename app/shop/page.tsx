"use client";

import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BookCard from "@/components/BookCard";
import { ChevronDown, Filter, X } from "lucide-react";

// Expanded dummy data for the shop
const allBooks = [
  { id: 1, title: "The Sealed Nectar", author: "Safiur Rahman Mubarakpuri", price: 85.00, category: "Islamic", image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=800&auto=format&fit=crop" },
  { id: 2, title: "Atomic Habits", author: "James Clear", price: 65.00, category: "Self-Help", image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=800&auto=format&fit=crop" },
  { id: 3, title: "The Alchemist", author: "Paulo Coelho", price: 45.00, category: "Fiction", image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=800&auto=format&fit=crop" },
  { id: 4, title: "Fortress of the Muslim", author: "Sa'id bin Ali al-Qahtani", price: 25.00, category: "Islamic", image: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=800&auto=format&fit=crop" },
  { id: 5, title: "Deep Work", author: "Cal Newport", price: 55.00, category: "Self-Help", image: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?q=80&w=800&auto=format&fit=crop" },
  { id: 6, title: "Think and Grow Rich", author: "Napoleon Hill", price: 40.00, category: "Self-Help", image: "https://images.unsplash.com/photo-1541963463532-d68292c34b19?q=80&w=800&auto=format&fit=crop" },
  { id: 7, title: "Man's Search for Meaning", author: "Viktor Frankl", price: 35.00, category: "Philosophy", image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=800&auto=format&fit=crop" },
  { id: 8, title: "The 5 AM Club", author: "Robin Sharma", price: 50.00, category: "Self-Help", image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=800&auto=format&fit=crop" },
  { id: 9, title: "The Power of Now", author: "Eckhart Tolle", price: 48.00, category: "Spirituality", image: "https://images.unsplash.com/photo-1532012197367-2d4660ad2e8b?q=80&w=800&auto=format&fit=crop" },
  { id: 10, title: "Riyad us Saliheen", author: "Imam An-Nawawi", price: 120.00, category: "Islamic", image: "https://images.unsplash.com/photo-1584281723528-917173e970a2?q=80&w=800&auto=format&fit=crop" },
];

const categories = ["All", "Islamic", "Self-Help", "Fiction", "Philosophy", "Spirituality"];
const sortOptions = ["Newest", "Price: Low to High", "Price: High to Low", "Most Popular"];

export default function ShopPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <main className="pt-24 pb-20">
        <div className="container mx-auto px-6">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
            <div>
              <nav className="flex gap-2 text-[10px] uppercase tracking-widest text-stone-400 mb-4">
                <Link href="/" className="hover:text-primary transition-colors">Home</Link>
                <span>/</span>
                <span className="text-secondary font-bold">Shop</span>
              </nav>
              <h1 className="text-4xl md:text-5xl font-serif font-black text-secondary uppercase tracking-tight">
                Our <span className="italic font-normal text-primary">Library</span>.
              </h1>
            </div>
            
            <div className="flex items-center gap-4 w-full md:w-auto">
              <button 
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="md:hidden flex items-center gap-2 px-6 py-3 border border-stone-100 text-[10px] font-bold uppercase tracking-widest flex-1"
              >
                <Filter size={14} /> Filter
              </button>
              <div className="relative group flex-1 md:flex-initial">
                <button className="flex items-center justify-between gap-4 px-6 py-3 border border-stone-100 text-[10px] font-bold uppercase tracking-widest w-full">
                  Sort By <ChevronDown size={14} />
                </button>
              </div>
            </div>
          </div>

          <div className="flex gap-12 relative">
            {/* Sidebar Filter - Fixed/Sticky on Desktop */}
            <aside className={`
              fixed inset-0 z-50 bg-white p-6 transition-transform duration-300 md:relative md:inset-auto md:z-0 md:p-0 md:w-64 md:translate-x-0
              ${isFilterOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
            `}>
              <div className="flex justify-between items-center md:hidden mb-8">
                <span className="text-xs font-black uppercase tracking-widest">Filters</span>
                <button onClick={() => setIsFilterOpen(false)}><X size={20} /></button>
              </div>

              <div className="sticky top-32 space-y-10">
                {/* Categories */}
                <div>
                  <h3 className="text-xs font-black uppercase tracking-widest mb-6 pb-2 border-b border-stone-100 text-secondary">
                    Categories
                  </h3>
                  <div className="flex flex-col gap-4">
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`text-[10px] uppercase tracking-widest text-left transition-colors ${
                          selectedCategory === cat ? "text-primary font-bold" : "text-stone-500 hover:text-secondary"
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price Range */}
                <div>
                  <h3 className="text-xs font-black uppercase tracking-widest mb-6 pb-2 border-b border-stone-100 text-secondary">
                    Price Range
                  </h3>
                  <div className="space-y-4">
                    <input type="range" className="w-full accent-primary" />
                    <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-stone-400">
                      <span>AED 0</span>
                      <span>AED 500</span>
                    </div>
                  </div>
                </div>

                {/* Availability */}
                <div>
                  <h3 className="text-xs font-black uppercase tracking-widest mb-6 pb-2 border-b border-stone-100 text-secondary">
                    Availability
                  </h3>
                  <div className="flex flex-col gap-4">
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <div className="w-4 h-4 border border-stone-200 group-hover:border-primary transition-colors flex items-center justify-center">
                        <div className="w-2 h-2 bg-primary scale-0 group-hover:scale-100 transition-transform" />
                      </div>
                      <span className="text-[10px] uppercase tracking-widest text-stone-500 group-hover:text-secondary">In Stock</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <div className="w-4 h-4 border border-stone-200 group-hover:border-primary transition-colors flex items-center justify-center">
                        <div className="w-2 h-2 bg-primary scale-0 group-hover:scale-100 transition-transform" />
                      </div>
                      <span className="text-[10px] uppercase tracking-widest text-stone-500 group-hover:text-secondary">Out of Stock</span>
                    </label>
                  </div>
                </div>

                <button className="w-full py-4 bg-secondary text-white text-[10px] font-bold uppercase tracking-widest hover:bg-primary transition-colors">
                  Apply Filters
                </button>
              </div>
            </aside>

            {/* Product Grid */}
            <div className="flex-1">
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12">
                {allBooks
                  .filter(book => selectedCategory === "All" || book.category === selectedCategory)
                  .map((book) => (
                    <BookCard key={book.id} {...book} />
                  ))}
              </div>

              {/* Pagination Placeholder */}
              <div className="mt-20 flex justify-center items-center gap-4">
                <button className="w-10 h-10 border border-stone-100 flex items-center justify-center text-[10px] font-bold bg-primary text-white">1</button>
                <button className="w-10 h-10 border border-stone-100 flex items-center justify-center text-[10px] font-bold hover:bg-stone-50 transition-colors">2</button>
                <button className="w-10 h-10 border border-stone-100 flex items-center justify-center text-[10px] font-bold hover:bg-stone-50 transition-colors">3</button>
                <span className="text-stone-300">...</span>
                <button className="px-6 h-10 border border-stone-100 flex items-center justify-center text-[10px] font-bold uppercase tracking-widest hover:bg-stone-50 transition-colors">Next</button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

// Missing Link import fix
import Link from "next/link";

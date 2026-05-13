"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { SlidersHorizontal, X, Search, Filter } from "lucide-react";

import BundleCard from "@/components/BundleCard";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { bundles } from "@/lib/bundles-data";
import Breadcrumbs from "@/components/layout/Breadcrumbs";

const categories = ["ALL", "KIDS", "EDUCATIONAL", "SPIRITUAL", "HISTORY"];

export default function BundlesPage() {
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const FilterContent = () => (
    <div className="space-y-12">
      {/* Search */}
      <div>
        <h3 className="mb-8 border-stone-100 border-b pb-4 font-bold text-[10px] uppercase tracking-[0.2em]">
          Search Archive
        </h3>
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-300" size={16} />
          <input
            type="text"
            placeholder="Find a set..."
            className="h-12 w-full bg-stone-50 border border-stone-100 pl-12 pr-4 text-[10px] font-bold uppercase tracking-widest focus:outline-none focus:border-primary transition-all"
          />
        </div>
      </div>

      <div>
        <h3 className="mb-8 border-stone-100 border-b pb-4 font-bold text-[10px] uppercase tracking-[0.2em]">
          Curations
        </h3>
        <div className="flex flex-col gap-2">
          {categories.map((cat) => (
            <Button
              className="h-10 justify-between px-2 hover:bg-stone-50"
              key={cat}
              variant="ghost"
            >
              <span className="text-[10px] tracking-widest">{cat}</span>
              <span className="text-[8px] text-stone-300 group-hover:text-black">
                (
                {cat === "ALL"
                  ? bundles.length
                  : bundles.filter((b) => b.tag.includes(cat) || b.id.includes(cat.toLowerCase()))
                    .length}
                )
              </span>
            </Button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-8 border-stone-100 border-b pb-4 font-bold text-[10px] uppercase tracking-[0.2em]">
          Volume Count
        </h3>
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <Checkbox id="vol-5" />
            <label
              className="cursor-pointer font-bold text-[10px] uppercase tracking-widest"
              htmlFor="vol-5"
            >
              5+ Volumes
            </label>
          </div>
          <div className="flex items-center space-x-3">
            <Checkbox id="vol-10" />
            <label
              className="cursor-pointer font-bold text-[10px] uppercase tracking-widest"
              htmlFor="vol-10"
            >
              10+ Volumes
            </label>
          </div>
        </div>
      </div>

      <div className="pt-8">
        <Button
          className="h-12 w-full text-[9px] uppercase tracking-widest font-black bg-secondary text-white hover:bg-primary"
          onClick={() => setIsMobileFilterOpen(false)}
        >
          Apply Filters
        </Button>
      </div>
    </div>
  );

  return (
    <>
      <main className="grow pt-32 min-h-screen bg-white">
        {/* Header */}
        <section className="container mx-auto mb-12 px-6">
          <Breadcrumbs
            items={[{ label: "Bundles" }]}
            className="mb-8 mt-8"
          />
          <div className="text-center">
            <span className="mb-6 block font-bold text-[10px] text-stone-400 uppercase tracking-[0.4em]">
              Curated Collections
            </span>
            <h1 className="mb-8 font-black font-serif text-5xl md:text-7xl uppercase text-secondary">
              THE <span className="font-normal italic text-primary">ARCHIVE</span>.
            </h1>
          </div>
        </section>

        {/* Mobile Filter Toggle */}
        <section className="container mx-auto mb-8 flex gap-4 px-6 lg:hidden">
          <Button
            className="h-12 flex-1 border-stone-100 font-bold text-[10px] uppercase tracking-widest"
            onClick={() => setIsMobileFilterOpen(true)}
            variant="outline"
          >
            <SlidersHorizontal className="mr-2" size={14} /> Filter & Sort
          </Button>
        </section>

        {/* Main Content Area */}
        <section className="container mx-auto mb-32 px-6">
          <div className="flex flex-col gap-16 lg:flex-row">
            {/* Sidebar Filters (Desktop Only) */}
            <aside className="scrollbar-thin sticky top-32 hidden h-fit max-h-[calc(100vh-160px)] w-64 shrink-0 space-y-12 overflow-y-auto pr-4 lg:block">
              <FilterContent />
            </aside>

            {/* Product Grid Area */}
            <div className="grow">
              <div className="mb-12 hidden items-center justify-between border-stone-100 border-b pb-4 lg:flex">
                <p className="font-bold text-[10px] text-stone-400 uppercase tracking-widest">
                  Showing {bundles.length} Curations
                </p>
                <div className="flex items-center gap-6">
                  <span className="font-bold text-[10px] text-stone-400 uppercase tracking-widest">
                    Sort By:
                  </span>
                  <select className="cursor-pointer bg-transparent font-bold text-[10px] uppercase tracking-widest outline-none">
                    <option>Exclusive First</option>
                    <option>Price: Low to High</option>
                    <option>Price: High to Low</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-2 xl:grid-cols-3">
                {bundles.map((bundle) => (
                  <BundleCard key={bundle.id} {...bundle} />
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
              animate={{ opacity: 1 }}
              className="fixed inset-0 z-100 bg-black/40 backdrop-blur-sm lg:hidden"
              exit={{ opacity: 0 }}
              initial={{ opacity: 0 }}
              onClick={() => setIsMobileFilterOpen(false)}
            />
            <motion.div
              animate={{ y: 0 }}
              className="fixed right-0 bottom-0 left-0 z-101 max-h-[85vh] overflow-y-auto rounded-t-3xl bg-white p-8 shadow-heavy lg:hidden"
              exit={{ y: "100%" }}
              initial={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
            >
              <div className="mb-10 flex items-center justify-between border-stone-100 border-b pb-4">
                <h2 className="font-bold text-[10px] uppercase tracking-[0.3em]">
                  Refine Archive
                </h2>
                <button onClick={() => setIsMobileFilterOpen(false)}>
                  <X className="text-stone-400" size={20} />
                </button>
              </div>
              <FilterContent />
              <div className="h-20" />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

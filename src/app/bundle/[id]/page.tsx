"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  ChevronRight,
  Heart,
  Share2,
  Star,
  Package,
  ShoppingCart,
  Truck,
  MapPin,
  ChevronDown,
  ShieldCheck,
  Tag,
  User as UserIcon,
  Building,
  Globe,
  BookOpen,
  Info
} from "lucide-react";
import WheelGestures from "embla-carousel-wheel-gestures";

import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi
} from "@/components/ui/carousel";
import { bundles, Bundle } from "@/lib/bundles-data";
import { cn } from "@/lib/utils";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import BundleCard from "@/components/BundleCard";
import { Mail, ArrowRight } from "lucide-react";

export default function BundleDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);

  const bundle = bundles.find((b) => b.id === id) || bundles[0];
  const relatedBundles = bundles.filter((b) => b.id !== bundle.id);

  const carouselImages = [
    bundle.mainImage,
    ...bundle.books.map((book) => book.image)
  ];

  React.useEffect(() => {
    if (!api) return;
    setCurrent(api.selectedScrollSnap());
    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  return (
    <main className="min-h-screen bg-white pt-24 pb-12 font-sans text-secondary">
      <div className="container mx-auto px-4 md:px-8">
        <Breadcrumbs
          items={[
            { label: "Shop", href: "/shop" },
            { label: "Bundles", href: "/bundles" },
            { label: bundle.title }
          ]}
          className="mb-8 mt-12"
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start mb-16">

          {/* Column 1: Visuals (lg:col-span-4) */}
          <div className="lg:col-span-4">
            <div className="sticky top-28">
              <div className="flex gap-4">
                {/* Thumbnails */}
                <div className="hidden md:flex flex-col gap-2 shrink-0 no-scrollbar overflow-y-auto max-h-[500px]">
                  {carouselImages.map((src, i) => (
                    <button
                      key={i}
                      onMouseEnter={() => api?.scrollTo(i)}
                      className={cn(
                        "w-14 h-14 border-2 rounded-lg overflow-hidden transition-all",
                        current === i ? "border-primary scale-105" : "border-stone-100 hover:border-primary/40"
                      )}
                    >
                      <img src={src} className="h-full w-full object-cover" alt={`Thumb ${i}`} />
                    </button>
                  ))}
                </div>

                {/* Main Image */}
                <div className="flex-grow">
                  <Carousel
                    setApi={setApi}
                    opts={{ loop: false }}
                    plugins={[WheelGestures()]}
                    className="w-full"
                  >
                    <CarouselContent>
                      {carouselImages.map((src, index) => (
                        <CarouselItem key={index}>
                          <div className="relative aspect-square w-full flex items-center justify-center bg-stone-50 rounded-2xl overflow-hidden group border border-stone-100">
                            <img
                              src={src}
                              alt={bundle.title}
                              className="max-h-[90%] max-w-[90%] object-contain transition-transform duration-700 group-hover:scale-105"
                            />
                          </div>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                  </Carousel>
                </div>
              </div>
            </div>
          </div>

          {/* Column 2: Product Info (lg:col-span-5) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="space-y-4 border-b border-stone-100 pb-6">
              <div className="flex justify-between items-start gap-4">
                <h1 className="text-3xl md:text-4xl font-black text-secondary leading-tight uppercase tracking-tight">
                  {bundle.title}
                </h1>
                <button className="shrink-0 p-3 hover:bg-stone-50 rounded-full transition-colors border border-stone-100">
                  <Share2 size={20} className="text-stone-500" />
                </button>
              </div>

              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-0.5">
                  {[1, 2, 3, 4, 5].map(i => (
                    <Star key={i} size={16} className={cn("fill-primary text-primary")} />
                  ))}
                  <ChevronDown size={14} className="ml-1 text-stone-400" />
                </div>
                <Link href="#" className="text-primary font-bold hover:underline">1,171 Verified Ratings</Link>
                <div className="h-4 w-px bg-stone-200" />
                <span className="text-stone-400 font-medium">Curated Collection</span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-baseline gap-4">
                <div className="flex items-baseline">
                  <span className="text-lg font-black mr-1 text-primary">AED</span>
                  <span className="text-5xl font-black text-primary">{bundle.price}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-lg text-stone-300 line-through font-bold">AED {bundle.originalPrice}</span>
                  <span className="text-green-600 text-[12px] font-black uppercase tracking-widest">
                    You Save {Math.round((1 - bundle.price / bundle.originalPrice) * 100)}%
                  </span>
                </div>
              </div>
              <p className="text-stone-500 text-sm leading-relaxed max-w-lg">
                The ultimate sequence of literature designed for the profound
                intellectual and spiritual development of the modern seeker.
                Includes {bundle.count} hardcover volumes and exclusive rewards.
              </p>
            </div>

            {/* Product Specs Grid */}
            <div className="grid grid-cols-2 gap-4 pt-4">
              {[
                { icon: <UserIcon size={16} />, label: "Author", value: "Multiple Authors" },
                { icon: <Building size={16} />, label: "Publisher", value: "Al-Rewaya Press" },
                { icon: <Globe size={16} />, label: "Language", value: "English & Arabic" },
                { icon: <BookOpen size={16} />, label: "Format", value: "Hardcover Set" }
              ].map((spec, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-stone-50 border border-stone-100">
                  <div className="text-primary">{spec.icon}</div>
                  <div>
                    <p className="text-[9px] font-black text-stone-400 uppercase tracking-widest">{spec.label}</p>
                    <p className="text-[11px] font-bold text-secondary uppercase tracking-wider">{spec.value}</p>
                  </div>
                </div>
              ))}
            </div>

          </div>

          {/* Column 3: Buy Box (lg:col-span-3) */}
          <div className="lg:col-span-3">
            <div className="border-2 border-stone-100 rounded-[2rem] p-6 space-y-6 sticky top-28 bg-white">
              <div className="space-y-4">
                <div className="pb-4 border-b border-stone-50">
                  <span className="font-black text-[10px] uppercase tracking-widest text-stone-400">Bundle Contents</span>
                  <h3 className="font-black text-sm text-secondary uppercase mt-1">{bundle.count} Essential Volumes</h3>
                </div>

                <div className="relative group/scroll">
                  <div className="space-y-3 max-h-[280px] overflow-y-auto pr-2 custom-scrollbar no-scrollbar">
                    {bundle.books.map((book, i) => (
                      <div key={book.id} className="flex gap-3 items-start group/item cursor-pointer">
                        <span className="text-[10px] font-black text-primary mt-0.5">0{i + 1}</span>
                        <p className="text-[11px] font-bold text-stone-500 group-hover/item:text-primary transition-colors leading-tight uppercase">
                          {book.title}
                        </p>
                      </div>
                    ))}
                  </div>
                  {/* Subtle fade effect at the bottom */}
                  <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white to-transparent pointer-events-none group-hover/scroll:opacity-0 transition-opacity" />
                </div>
              </div>

              <div className="space-y-3 pt-6">
                <Button className="w-full h-14 rounded-2xl bg-secondary hover:bg-primary text-white font-black text-xs uppercase tracking-[0.2em] transition-all active:scale-[0.98]">
                  Add to Cart
                </Button>
              </div>


              <button className="w-full pt-6 group">
                <div className="flex items-center justify-between border-t border-stone-50 pt-6">
                  <span className="text-[11px] font-black uppercase tracking-widest group-hover:text-primary transition-colors">Add to Wish List</span>
                  <Heart size={16} className="text-stone-300 group-hover:text-primary group-hover:fill-primary transition-all" />
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Included Volumes Carousel Section */}
        <section className="mt-16 pt-16 border-t border-stone-100">
          <div className="mb-12 flex items-end justify-between">
            <div>
              <span className="text-primary font-black text-[10px] uppercase tracking-[0.4em] block mb-2">The Collection Archive</span>
              <h2 className="text-4xl md:text-5xl font-serif font-black text-secondary uppercase tracking-tight leading-none">
                Included <span className="font-normal italic text-primary">Volumes</span>
              </h2>
            </div>
          </div>

          <Carousel 
            opts={{ align: "start", loop: false }} 
            plugins={[WheelGestures()]}
            className="w-full"
          >
            <CarouselContent className="-ml-6">
              {bundle.books.map((book, i) => (
                <CarouselItem key={book.id} className="pl-6 md:basis-1/2 lg:basis-2/3 xl:basis-1/2">
                  <div className="group h-full flex flex-col md:flex-row bg-stone-50/50 rounded-[2rem] p-8 items-start gap-8 border border-stone-100 hover:border-primary/20 transition-all hover:bg-white relative">
                    {/* Book Image */}
                    <div className="w-full md:w-44 aspect-[3/4] shrink-0 rounded-2xl overflow-hidden shadow-sm transform group-hover:scale-105 transition-transform bg-white">
                      <img src={book.image} className="h-full w-full object-cover" alt={book.title} />
                    </div>

                    {/* Book Info */}
                    <div className="flex flex-col h-full grow">
                      <div className="mb-4">
                        <h4 className="font-black text-2xl text-secondary uppercase tracking-tight group-hover:text-primary transition-colors leading-tight mb-1">
                          {book.title}
                        </h4>
                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary">
                          <UserIcon size={12} />
                          <span>{book.author}</span>
                        </div>
                      </div>

                      <p className="text-[12px] text-stone-500 font-medium leading-relaxed mb-6 line-clamp-3">
                        {book.overview}
                      </p>

                      <div className="mt-auto grid grid-cols-2 gap-y-4 gap-x-8 border-t border-stone-100 pt-6">
                        <div className="flex flex-col">
                          <span className="text-[9px] font-black text-stone-300 uppercase tracking-widest mb-1">ISBN</span>
                          <span className="text-[11px] font-bold text-secondary uppercase">{book.isbn}</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[9px] font-black text-stone-300 uppercase tracking-widest mb-1">Publisher</span>
                          <span className="text-[11px] font-bold text-secondary uppercase">{book.publisher}</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[9px] font-black text-stone-300 uppercase tracking-widest mb-1">Language</span>
                          <span className="text-[11px] font-bold text-secondary uppercase">{book.language}</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[9px] font-black text-stone-300 uppercase tracking-widest mb-1">Genre</span>
                          <span className="text-[11px] font-bold text-secondary uppercase">{book.genre}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="flex justify-end gap-3 mt-8">
              <CarouselPrevious className="static translate-y-0 h-12 w-12 rounded-full border-stone-100 hover:bg-primary hover:text-white transition-all shadow-none" />
              <CarouselNext className="static translate-y-0 h-12 w-12 rounded-full border-stone-100 hover:bg-primary hover:text-white transition-all shadow-none" />
            </div>
          </Carousel>
        </section>

        {/* Related Bundles Section */}
        {relatedBundles.length > 0 && (
          <section className="mt-12 pt-12 border-t border-stone-100">
            <div className="mb-12 flex items-end justify-between">
              <div>
                <span className="text-primary font-black text-[10px] uppercase tracking-[0.4em] block mb-2">Continue Exploring</span>
                <h2 className="text-4xl md:text-5xl font-serif font-black text-secondary uppercase tracking-tight leading-none">
                  Related <span className="font-normal italic text-primary">Collections</span>
                </h2>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {relatedBundles.slice(0, 4).map((b) => (
                <BundleCard key={b.id} {...b} />
              ))}
            </div>
          </section>
        )}

        {/* Compact Newsletter CTA */}
        <section className="mt-16 mb-8 max-w-5xl mx-auto">
          <div className="bg-stone-50 border border-stone-100 rounded-[2.5rem] p-8 md:p-12 relative overflow-hidden">
            <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
              <div className="flex-1 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-px w-8 bg-primary/30" />
                  <span className="text-primary font-black text-[9px] uppercase tracking-[0.4em]">The Weekly Review</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-serif font-black text-secondary uppercase tracking-tight leading-none">
                  JOIN THE <span className="font-normal italic text-primary">INNER CIRCLE</span>
                </h2>
                <p className="text-stone-400 text-[12px] font-medium leading-relaxed max-w-sm">
                  Exclusive access to limited drops, curated sets, and scholarly insights.
                </p>
              </div>

              <div className="w-full md:w-auto">
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative">
                    <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-stone-300" size={16} />
                    <input 
                      type="email" 
                      placeholder="EMAIL ADDRESS" 
                      className="h-14 w-full sm:w-[260px] bg-white border border-stone-200 rounded-2xl pl-12 pr-6 text-secondary text-[10px] font-black uppercase tracking-widest focus:outline-none focus:border-primary transition-all"
                    />
                  </div>
                  <Button className="h-14 px-8 rounded-2xl bg-secondary hover:bg-primary text-white font-black text-[10px] uppercase tracking-[0.2em] transition-all group">
                    JOIN NOW <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={14} />
                  </Button>
                </div>
                <p className="mt-3 text-[9px] text-stone-300 uppercase tracking-widest text-center md:text-left">
                  Agreed to our <Link href="#" className="underline hover:text-secondary transition-colors">Privacy Policy</Link>
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

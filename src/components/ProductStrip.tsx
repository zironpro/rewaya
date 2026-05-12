"use client";

import React, { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Timer } from "lucide-react";
import BookCard from "./BookCard";

const CountdownTimer = () => {
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const endOfDay = new Date();
      endOfDay.setHours(23, 59, 59, 999);
      
      const difference = endOfDay.getTime() - now.getTime();
      
      if (difference > 0) {
        setTimeLeft({
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, []);

  const format = (n: number) => n.toString().padStart(2, "0");

  return (
    <div className="flex items-center gap-2 bg-stone-50 border border-stone-100 px-4 py-2 rounded-lg">
      <Timer size={14} className="text-primary animate-pulse" />
      <div className="flex items-center gap-1 font-mono text-xs font-black">
        <span className="text-secondary">{format(timeLeft.hours)}</span>
        <span className="text-stone-300">:</span>
        <span className="text-secondary">{format(timeLeft.minutes)}</span>
        <span className="text-stone-300">:</span>
        <span className="text-secondary">{format(timeLeft.seconds)}</span>
      </div>
    </div>
  );
};

interface ProductStripProps {
  title: string;
  subtitle?: string;
  books: any[];
}

export default function ProductStrip({ title, subtitle, books }: ProductStripProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === "left" 
        ? scrollLeft - clientWidth * 0.8 
        : scrollLeft + clientWidth * 0.8;
      
      scrollRef.current.scrollTo({ left: scrollTo, behavior: "smooth" });
    }
  };

  return (
    <section className="py-16 container mx-auto px-6 group/strip">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
        <div>
          {subtitle && (
            <span className="text-[10px] tracking-[0.4em] text-primary uppercase font-bold mb-3 block">
              {subtitle}
            </span>
          )}
          <div className="flex flex-wrap items-center gap-4 md:gap-6">
            <h2 className="text-2xl md:text-4xl font-serif font-black uppercase whitespace-nowrap">
              {title.split(' ').map((word, i) => (
                <span key={i} className={i % 2 !== 0 ? "italic font-normal" : ""}>
                  {word}{" "}
                </span>
              ))}
            </h2>
            {title === "Today's Deals" && <CountdownTimer />}
          </div>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => scroll("left")}
            className="p-3 border border-stone-100 rounded-full hover:bg-stone-50 hover:border-primary transition-all text-stone-400 hover:text-primary"
          >
            <ChevronLeft size={20} />
          </button>
          <button 
            onClick={() => scroll("right")}
            className="p-3 border border-stone-100 rounded-full hover:bg-stone-50 hover:border-primary transition-all text-stone-400 hover:text-primary"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <div 
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto no-scrollbar pb-8 snap-x snap-mandatory"
      >
        {books.map((book) => (
          <div key={book.id} className="min-w-[240px] md:min-w-[280px] snap-start">
            <BookCard {...book} />
          </div>
        ))}
        {/* View All Card */}
        <div className="min-w-[240px] md:min-w-[280px] flex items-center justify-center border-2 border-dashed border-stone-100 hover:border-primary/30 transition-colors cursor-pointer group">
          <div className="text-center">
            <span className="text-[10px] font-black tracking-widest uppercase text-stone-300 group-hover:text-primary transition-colors">
              View All <br /> Collection
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

"use client";

import React from "react";
import { motion } from "framer-motion";
import { Heart, Plus, Eye } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogTrigger 
} from "@/components/ui/dialog";

import { useSetAtom } from "jotai";
import { cartAtom, CartItem } from "@/lib/store";

export interface BookProps {
  id: number | string;
  title: string;
  author: string;
  price: number;
  image: string;
  category: string;
}

export default function BookCard({ id, title, author, price, image, category }: BookProps) {
  const setCart = useSetAtom(cartAtom);

  const addToBag = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setCart((prev: CartItem[]) => {
      const existing = prev.find((item) => item.id === id);
      if (existing) {
        return prev.map((item) =>
          item.id === id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { id, title, author, price, image, quantity: 1 }];
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      className="group"
    >
      <Dialog>
        {/* Image Container */}
        <div className="relative aspect-[3/4] overflow-hidden bg-stone-50 mb-4 book-shadow">
          <Link href={`/product/${id}`}>
            <img
              src={image}
              alt={title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
          </Link>
          
          {/* Icons Overlay */}
          <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button variant="ghost" size="icon" className="bg-white/80 backdrop-blur-sm rounded-full h-9 w-9">
              <Heart size={16} strokeWidth={1.5} />
            </Button>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon" className="bg-white/80 backdrop-blur-sm rounded-full h-9 w-9">
                <Eye size={16} strokeWidth={1.5} />
              </Button>
            </DialogTrigger>
          </div>

          {/* Quick Add (Bottom) */}
          <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-primary">
            <Button variant="ghost" className="w-full h-10 text-[9px] text-white hover:bg-white/10" onClick={addToBag}>
              <Plus size={14} className="mr-2" /> Add to Bag
            </Button>
          </div>

          {/* Sale Badge */}
          {price < 50 && (
            <div className="absolute top-4 left-0">
              <span className="sale-badge bg-primary">Sale</span>
            </div>
          )}
        </div>

        {/* Info Container */}
        <Link href={`/product/${id}`} className="flex flex-col gap-1 px-1 cursor-pointer">
          <div className="flex justify-between items-start gap-4">
            <h3 className="text-xs font-bold uppercase tracking-wider leading-tight flex-1 text-secondary group-hover:text-primary transition-colors">
              {title}
            </h3>
            <span className="text-xs font-bold text-primary whitespace-nowrap">AED {price.toFixed(2)}</span>
          </div>
          <p className="text-[10px] text-stone-400 uppercase tracking-widest">
            {author}
          </p>
        </Link>

        {/* Quick View Dialog Content */}
        <DialogContent className="max-w-3xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6">
            <div className="aspect-[3/4] overflow-hidden bg-stone-50">
              <img src={image} alt={title} className="w-full h-full object-cover" />
            </div>
            <div className="flex flex-col justify-between py-4">
              <DialogHeader>
                <DialogDescription>{category}</DialogDescription>
                <DialogTitle className="text-4xl mt-2">{title}</DialogTitle>
                <p className="text-stone-400 uppercase tracking-widest text-xs mt-2">{author}</p>
              </DialogHeader>
              
              <div className="space-y-6">
                <p className="text-3xl font-serif font-black text-primary">AED {price.toFixed(2)}</p>
                <p className="text-sm text-stone-500 leading-relaxed uppercase tracking-widest">
                  Experience the profound wisdom and timeless narrative of {title}. A curated masterpiece now available in the Rewaya collection.
                </p>
                <div className="flex gap-4">
                  <Button variant="premium" className="flex-1 h-14" onClick={() => addToBag()}>Add to Bag</Button>
                  <Button variant="outline" size="icon" className="h-14 w-14">
                    <Heart size={20} strokeWidth={1.5} />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}

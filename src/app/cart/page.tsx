"use client";

import React from "react";
import Link from "next/link";
import { useAtom } from "jotai";
import { Trash2, Minus, Plus, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cartAtom, cartTotalAtom, CartItem } from "@/lib/store";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function CartPage() {
  const [cart, setCart] = useAtom(cartAtom);
  const [total] = useAtom(cartTotalAtom);

  const updateQuantity = (id: number, delta: number) => {
    setCart((prev: CartItem[]) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      )
    );
  };

  const removeItem = (id: number) => {
    setCart((prev: CartItem[]) => prev.filter((item) => item.id !== id));
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />

      <main className="flex-grow pt-32 pb-32">
        <div className="container mx-auto px-6">
          <div className="mb-16">
            <span className="text-[10px] tracking-[0.4em] text-stone-400 uppercase font-bold mb-4 block">Your Selection</span>
            <h1 className="text-5xl md:text-7xl font-serif font-black">SHOPPING <span className="italic font-normal">BAG</span>.</h1>
          </div>

          {cart.length === 0 ? (
            <div className="text-center py-32 border-y border-stone-100">
              <p className="text-stone-400 uppercase tracking-widest text-sm mb-8">Your bag is currently empty.</p>
              <Link href="/shop">
                <Button variant="premium">Explore the Library</Button>
              </Link>
            </div>
          ) : (
            <div className="flex flex-col lg:flex-row gap-20">
              {/* Cart Items List */}
              <div className="flex-grow space-y-8">
                <div className="hidden md:grid grid-cols-4 pb-6 border-b border-stone-100 text-[10px] tracking-[0.2em] font-bold uppercase text-stone-400">
                  <div className="col-span-2">Product</div>
                  <div className="text-center">Quantity</div>
                  <div className="text-right">Total</div>
                </div>

                <AnimatePresence>
                  {cart.map((item) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="grid grid-cols-1 md:grid-cols-4 gap-8 py-8 border-b border-stone-50 items-center"
                    >
                      <div className="col-span-2 flex gap-6">
                        <div className="w-24 h-32 bg-stone-50 overflow-hidden flex-shrink-0">
                          <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex flex-col justify-center gap-1">
                          <h3 className="text-xs font-bold uppercase tracking-wider text-secondary">{item.title}</h3>
                          <p className="text-[10px] text-stone-400 uppercase tracking-widest mb-4">{item.author}</p>
                          <button 
                            onClick={() => removeItem(item.id)}
                            className="flex items-center gap-2 text-[9px] uppercase tracking-widest font-bold text-stone-300 hover:text-primary transition-colors w-fit"
                          >
                            <Trash2 size={12} /> Remove
                          </button>
                        </div>
                      </div>

                      <div className="flex justify-center items-center">
                        <div className="flex items-center border border-stone-100 rounded-sm">
                          <button onClick={() => updateQuantity(item.id, -1)} className="p-2 hover:bg-stone-50 transition-colors">
                            <Minus size={12} />
                          </button>
                          <span className="w-10 text-center text-[10px] font-bold">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, 1)} className="p-2 hover:bg-stone-50 transition-colors">
                            <Plus size={12} />
                          </button>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-sm font-bold text-primary">AED {(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {/* Order Summary Sidebar */}
              <aside className="w-full lg:w-96">
                <div className="bg-stone-50 p-8 sticky top-32">
                  <h3 className="text-[10px] tracking-[0.2em] font-bold uppercase mb-8 pb-4 border-b border-stone-200">Order Summary</h3>
                  <div className="space-y-4 mb-8">
                    <div className="flex justify-between text-[10px] tracking-widest uppercase font-bold text-stone-500">
                      <span>Subtotal</span>
                      <span>AED {total.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-[10px] tracking-widest uppercase font-bold text-stone-500">
                      <span>Shipping</span>
                      <span>FREE</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-end border-t border-stone-200 pt-6 mb-10">
                    <span className="text-[10px] tracking-[0.2em] font-bold uppercase">Total</span>
                    <span className="text-2xl font-serif font-black text-primary">AED {total.toFixed(2)}</span>
                  </div>
                  <Button variant="premium" className="w-full h-16 group">
                    Checkout <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                  <p className="mt-6 text-[9px] text-stone-400 text-center uppercase tracking-widest leading-relaxed">
                    Complimentary shipping on all orders. <br /> Returns accepted within 30 days.
                  </p>
                </div>
              </aside>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

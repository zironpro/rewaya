"use client";

import React from "react";
import { Truck, RotateCcw, CreditCard, ShieldCheck } from "lucide-react";

const policies = [
  {
    title: "FREE SHIPPING",
    desc: "On all orders above AED 200 within UAE",
    icon: Truck,
  },
  {
    title: "14-DAY RETURNS",
    desc: "Hassle-free return and exchange policy",
    icon: RotateCcw,
  },
  {
    title: "SECURE PAYMENT",
    desc: "100% secure payment processing",
    icon: CreditCard,
  },
  {
    title: "GENUINE BOOKS",
    desc: "Direct from authorized publishers",
    icon: ShieldCheck,
  },
];

export default function PolicyCards() {
  return (
    <section className="bg-stone-50 py-16 border-y border-stone-100">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
          {policies.map((policy) => {
            const Icon = policy.icon;
            return (
              <div key={policy.title} className="flex flex-col items-center text-center group">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-6 shadow-sm group-hover:bg-primary group-hover:text-white transition-all duration-500">
                  <Icon size={28} strokeWidth={1.2} />
                </div>
                <h3 className="text-[11px] font-black tracking-[0.2em] uppercase mb-2">
                  {policy.title}
                </h3>
                <p className="text-[10px] text-stone-400 uppercase tracking-widest leading-relaxed">
                  {policy.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

"use client";

import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Mail, Phone, MapPin, Globe } from "lucide-react";
import { motion } from "framer-motion";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-white text-secondary">
      <Navbar />

      <main className="pt-24 pb-32">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="text-center mb-24">
              <motion.span 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="nav-link text-primary mb-6 inline-block"
              >
                Get in Touch
              </motion.span>
              <h1 className="text-5xl md:text-7xl font-serif font-black uppercase tracking-tight leading-none">
                CONTACT <span className="italic font-normal text-primary">US</span>.
              </h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-20">
              {/* Form Side */}
              <div className="space-y-12">
                <div className="space-y-8">
                  <h3 className="text-xs font-black uppercase tracking-[0.3em] pb-4 border-b border-stone-100">Send a Message</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Full Name</label>
                      <input type="text" className="w-full py-4 border-b border-stone-200 focus:border-primary outline-none transition-colors placeholder:text-stone-200 text-sm" placeholder="ENTER NAME" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Email Address</label>
                      <input type="email" className="w-full py-4 border-b border-stone-200 focus:border-primary outline-none transition-colors placeholder:text-stone-200 text-sm" placeholder="ENTER EMAIL" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Subject</label>
                    <input type="text" className="w-full py-4 border-b border-stone-200 focus:border-primary outline-none transition-colors placeholder:text-stone-200 text-sm" placeholder="HOW CAN WE HELP?" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Message</label>
                    <textarea rows={4} className="w-full py-4 border-b border-stone-200 focus:border-primary outline-none transition-colors placeholder:text-stone-200 text-sm resize-none" placeholder="YOUR MESSAGE..."></textarea>
                  </div>
                  <button className="w-full py-6 bg-secondary text-white text-[10px] font-bold uppercase tracking-[0.4em] hover:bg-primary transition-all duration-500">
                    Send Message
                  </button>
                </div>
              </div>

              {/* Info Side */}
              <div className="space-y-16">
                <div>
                  <h3 className="text-xs font-black uppercase tracking-[0.3em] pb-4 border-b border-stone-100 mb-8">Store Locations</h3>
                  <div className="space-y-10">
                    <div className="flex gap-6">
                      <div className="w-12 h-12 bg-stone-50 flex items-center justify-center text-primary">
                        <MapPin size={20} />
                      </div>
                      <div>
                        <h4 className="text-[10px] font-black uppercase tracking-widest mb-2">Dubai Design District</h4>
                        <p className="text-xs text-stone-500 uppercase tracking-widest leading-relaxed">
                          Building 4, Office 302<br />
                          Dubai, United Arab Emirates
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-6">
                      <div className="w-12 h-12 bg-stone-50 flex items-center justify-center text-primary">
                        <MapPin size={20} />
                      </div>
                      <div>
                        <h4 className="text-[10px] font-black uppercase tracking-widest mb-2">Sharjah Publishing City</h4>
                        <p className="text-xs text-stone-500 uppercase tracking-widest leading-relaxed">
                          Zone C, Unit 42<br />
                          Sharjah, United Arab Emirates
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xs font-black uppercase tracking-[0.3em] pb-4 border-b border-stone-100 mb-8">Connect</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="flex items-center gap-4 group cursor-pointer">
                      <div className="w-10 h-10 border border-stone-100 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all">
                        <Phone size={16} />
                      </div>
                      <span className="text-[10px] font-bold tracking-widest">+971 4 123 4567</span>
                    </div>
                    <div className="flex items-center gap-4 group cursor-pointer">
                      <div className="w-10 h-10 border border-stone-100 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all">
                        <Mail size={16} />
                      </div>
                      <span className="text-[10px] font-bold tracking-widest uppercase">hello@rewaya.com</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

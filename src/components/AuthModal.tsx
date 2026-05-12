"use client";

import React, { useState } from "react";
import { useAtom } from "jotai";
import { authModalAtom } from "@/lib/store";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, Lock, User, Globe } from "lucide-react";

export default function AuthModal() {
  const [modalState, setModalState] = useAtom(authModalAtom);
  const [view, setView] = useState<"login" | "signup">(modalState.view);

  const closePortal = () => setModalState({ ...modalState, isOpen: false });

  return (
    <Dialog open={modalState.isOpen} onOpenChange={(open) => setModalState({ ...modalState, isOpen: open })}>
      <DialogContent className="sm:max-w-[450px] p-0 overflow-hidden border-none bg-white">
        <div className="relative p-8 md:p-12">
          {/* Close Button */}
          <button 
            onClick={closePortal}
            className="absolute right-6 top-6 text-stone-300 hover:text-black transition-colors"
          >
            <X size={20} />
          </button>

          {/* Header */}
          <div className="mb-10 text-center">
            <img
              src="/Al%20Rewaya%20Book%20World%20Approved%20Logo%201%20-%20Copy.png"
              alt="Rewaya"
              className="h-10 mx-auto mb-6"
            />
            <DialogTitle className="text-2xl font-serif font-black uppercase tracking-tight">
              {view === "login" ? "Welcome Back" : "Join the Seekers"}
            </DialogTitle>
            <DialogDescription className="text-[10px] tracking-[0.2em] text-stone-400 uppercase font-bold mt-2">
              {view === "login" ? "Sign in to your library" : "Create your rewaya account"}
            </DialogDescription>
          </div>

          {/* View Toggle */}
          <div className="flex bg-stone-50 p-1 rounded-lg mb-8">
            <button
              onClick={() => setView("login")}
              className={`flex-1 py-2 text-[10px] font-bold uppercase tracking-widest rounded-md transition-all ${
                view === "login" ? "bg-white shadow-sm text-black" : "text-stone-400 hover:text-stone-600"
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setView("signup")}
              className={`flex-1 py-2 text-[10px] font-bold uppercase tracking-widest rounded-md transition-all ${
                view === "signup" ? "bg-white shadow-sm text-black" : "text-stone-400 hover:text-stone-600"
              }`}
            >
              Sign Up
            </button>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={view}
              initial={{ opacity: 0, x: view === "login" ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: view === "login" ? 20 : -20 }}
              transition={{ duration: 0.2 }}
            >
              {view === "login" ? (
                <form className="space-y-4">
                  <div className="space-y-2">
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-300" size={16} />
                      <Input placeholder="EMAIL ADDRESS" className="pl-12 h-12 bg-stone-50 border-stone-100 rounded-lg text-[10px] tracking-widest font-bold" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-300" size={16} />
                      <Input type="password" placeholder="PASSWORD" className="pl-12 h-12 bg-stone-50 border-stone-100 rounded-lg text-[10px] tracking-widest font-bold" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <div className="flex items-center gap-2">
                      <Checkbox id="remember" />
                      <label htmlFor="remember" className="text-[9px] font-bold uppercase tracking-widest text-stone-400 cursor-pointer">Remember Me</label>
                    </div>
                    <button className="text-[9px] font-bold uppercase tracking-widest text-primary hover:underline">Forgot?</button>
                  </div>
                  <Button className="w-full h-12 bg-secondary hover:bg-black text-white rounded-lg text-[10px] font-bold uppercase tracking-[0.2em] transition-all">
                    Sign In
                  </Button>
                </form>
              ) : (
                <form className="space-y-4">
                  <div className="space-y-2">
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-300" size={16} />
                      <Input placeholder="FULL NAME" className="pl-12 h-12 bg-stone-50 border-stone-100 rounded-lg text-[10px] tracking-widest font-bold" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-300" size={16} />
                      <Input placeholder="EMAIL ADDRESS" className="pl-12 h-12 bg-stone-50 border-stone-100 rounded-lg text-[10px] tracking-widest font-bold" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-300" size={16} />
                      <Input type="password" placeholder="PASSWORD" className="pl-12 h-12 bg-stone-50 border-stone-100 rounded-lg text-[10px] tracking-widest font-bold" />
                    </div>
                  </div>
                  <p className="text-[8px] leading-relaxed text-stone-400 uppercase tracking-widest text-center px-4 py-2">
                    By joining, you agree to our <span className="text-black font-bold">Terms</span> and <span className="text-black font-bold">Privacy Policy</span>.
                  </p>
                  <Button className="w-full h-12 bg-primary hover:bg-primary/90 text-white rounded-lg text-[10px] font-bold uppercase tracking-[0.2em] transition-all">
                    Create Account
                  </Button>
                </form>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Social Auth */}
          <div className="mt-10">
            <div className="relative mb-8">
              <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-stone-100" /></div>
              <div className="relative flex justify-center text-[8px] uppercase tracking-[0.3em] font-bold"><span className="bg-white px-4 text-stone-300">Or continue with</span></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Button variant="outline" className="h-12 border-stone-100 hover:bg-stone-50 rounded-lg gap-3">
                <img src="https://www.google.com/favicon.ico" className="w-4 h-4 opacity-70" alt="Google" />
                <span className="text-[9px] font-bold uppercase tracking-widest">Google</span>
              </Button>
              <Button variant="outline" className="h-12 border-stone-100 hover:bg-stone-50 rounded-lg gap-3">
                <Globe size={16} className="text-stone-600" />
                <span className="text-[9px] font-bold uppercase tracking-widest">Other</span>
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

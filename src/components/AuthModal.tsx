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
  const [showEmailForm, setShowEmailForm] = useState(false);

  const closePortal = () => setModalState({ ...modalState, isOpen: false });

  return (
    <Dialog open={modalState.isOpen} onOpenChange={(open) => setModalState({ ...modalState, isOpen: open })}>
      <DialogContent className="sm:max-w-[480px] p-0 overflow-hidden border-none bg-white rounded-[2rem] shadow-2xl [&>button]:hidden">
        <div className="relative p-8 md:p-10 flex flex-col items-center">
          {/* Large Close Icon */}
          <button 
            onClick={closePortal}
            className="absolute top-6 right-6 text-stone-300 hover:text-primary transition-colors z-10"
          >
            <X size={28} strokeWidth={1.5} />
          </button>

          {/* Header */}
          <div className="mb-6 text-center flex flex-col items-center">
            <img
              src="/Al%20Rewaya%20Book%20World%20Approved%20Logo%201%20-%20Copy.png"
              alt="Rewaya"
              className="h-10 mb-6"
            />
            <DialogTitle className="text-3xl md:text-4xl font-serif font-black uppercase tracking-[0.1em] text-[#1E2147] mb-1">
              {view === "login" ? "Welcome Back" : "Join the Seekers"}
            </DialogTitle>
            <DialogDescription className="text-[10px] tracking-[0.3em] text-stone-400 uppercase font-black">
              {view === "login" ? "Sign in to your library" : "Create your rewaya account"}
            </DialogDescription>
          </div>

          {/* Toggle Switch */}
          <div className="flex bg-stone-50 p-1.5 rounded-2xl mb-8 w-full max-w-[320px]">
            <button
              onClick={() => {
                setView("login");
                setShowEmailForm(false);
              }}
              className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all duration-300 ${
                view === "login" ? "bg-white shadow-md text-[#1E2147]" : "text-stone-300 hover:text-stone-400"
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setView("signup")}
              className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all duration-300 ${
                view === "signup" ? "bg-white shadow-md text-[#1E2147]" : "text-stone-300 hover:text-stone-400"
              }`}
            >
              Sign Up
            </button>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={view + showEmailForm}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="w-full"
            >
              {view === "login" && !showEmailForm ? (
                <div className="space-y-4">
                  <Button variant="outline" className="w-full h-14 border-stone-100 hover:bg-stone-50 rounded-xl gap-4 text-[11px] font-black uppercase tracking-widest text-[#1E2147]">
                    <img src="https://www.google.com/favicon.ico" className="w-5 h-5" alt="Google" />
                    Log in with Google
                  </Button>
                  <Button className="w-full h-14 bg-[#1877F2] hover:bg-[#1877F2]/90 text-white rounded-xl gap-4 text-[11px] font-black uppercase tracking-widest border-none">
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                    Log in with Facebook
                  </Button>
                  <div className="relative py-6">
                    <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-stone-100" /></div>
                    <div className="relative flex justify-center text-[10px] font-black uppercase tracking-widest"><span className="bg-white px-4 text-stone-300">or</span></div>
                  </div>
                  <Button 
                    variant="outline" 
                    onClick={() => setShowEmailForm(true)}
                    className="w-full h-14 border-primary/20 text-primary hover:bg-primary/5 rounded-xl text-[11px] font-black uppercase tracking-widest"
                  >
                    Log in with Email
                  </Button>
                </div>
              ) : (
                <form className="space-y-4">
                  {(view === "signup" || (view === "login" && showEmailForm)) && (
                    <>
                      {view === "signup" && (
                        <div className="relative group">
                          <label className="block text-xs font-bold uppercase tracking-[0.2em] text-[#1E2147]/40 group-focus-within:text-[#1E2147] transition-colors mb-2">Name</label>
                          <input 
                            type="text" 
                            className="w-full bg-transparent border-b border-stone-200 py-2 outline-none focus:border-[#1E2147] transition-all text-sm font-medium text-[#1E2147]"
                          />
                        </div>
                      )}
                      <div className="relative group">
                        <label className="block text-xs font-bold uppercase tracking-[0.2em] text-[#1E2147]/40 group-focus-within:text-[#1E2147] transition-colors mb-2">Email</label>
                        <input 
                          type="email" 
                          className="w-full bg-transparent border-b border-stone-200 py-2 outline-none focus:border-[#1E2147] transition-all text-sm font-medium text-[#1E2147]"
                        />
                      </div>
                      <div className="relative group">
                        <label className="block text-xs font-bold uppercase tracking-[0.2em] text-[#1E2147]/40 group-focus-within:text-[#1E2147] transition-colors mb-2">Password</label>
                        <input 
                          type="password" 
                          className="w-full bg-transparent border-b border-stone-200 py-2 outline-none focus:border-[#1E2147] transition-all text-sm font-medium text-[#1E2147]"
                        />
                      </div>

                      <div className="flex justify-between items-center">
                        <button type="button" className="text-[10px] font-black uppercase tracking-widest text-stone-300 hover:text-[#1E2147] transition-colors underline decoration-stone-200 underline-offset-4">Forgot password?</button>
                      </div>

                      <Button className="w-full h-14 bg-[#94B0A9] hover:bg-[#7A918B] text-white rounded-none text-[11px] font-black uppercase tracking-[0.4em] transition-all shadow-xl">
                        {view === "login" ? "Log In" : "Get Started"}
                      </Button>

                      {view === "login" && showEmailForm && (
                        <button 
                          onClick={() => setShowEmailForm(false)}
                          className="w-full text-[10px] font-black uppercase tracking-widest text-stone-200 hover:text-primary transition-colors mt-2"
                        >
                          ← Back to Social Logins
                        </button>
                      )}
                    </>
                  )}
                </form>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Social Footer Icons (Only shown when email form is visible to keep consistency) */}
          {view === "login" && showEmailForm && (
            <div className="mt-6 w-full">
              <div className="relative flex items-center justify-center mb-4">
                <div className="absolute w-full h-[1px] bg-stone-100" />
                <span className="relative bg-white px-6 text-[10px] font-medium text-stone-300 lowercase italic tracking-wider">or log in with</span>
              </div>
              <div className="flex justify-center gap-6">
                <button className="p-3 border border-stone-100 rounded-full hover:bg-stone-50 transition-all group">
                  <img src="https://www.google.com/favicon.ico" className="w-5 h-5 grayscale group-hover:grayscale-0 transition-all" alt="Google" />
                </button>
                <button className="p-3 border border-stone-100 rounded-full hover:bg-stone-50 transition-all group">
                  <svg className="w-5 h-5 text-stone-300 group-hover:text-[#1877F2] fill-current transition-all" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

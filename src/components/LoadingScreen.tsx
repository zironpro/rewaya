"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function LoadingScreen() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate initial page load
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ 
            y: "-100%",
            transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1], delay: 0.2 }
          }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white"
        >
          <div className="relative flex flex-col items-center">
            {/* Logo Animation */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="flex flex-col items-center gap-4"
            >
              <img
                src="/Al%20Rewaya%20Book%20World%20Approved%20Logo%201%20-%20Copy.png"
                alt="Rewaya Logo"
                className="h-16 w-auto object-contain"
              />
              <div className="flex flex-col items-center leading-none">
                <span className="text-3xl font-bold tracking-tighter text-secondary">
                  alrewaya
                </span>
                <span className="text-[10px] font-black tracking-[0.4em] text-primary mt-1">
                  BOOK WORLD
                </span>
              </div>
            </motion.div>

            {/* Progress Bar */}
            <div className="absolute -bottom-16 w-48 h-[1px] bg-stone-100 overflow-hidden">
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: "100%" }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity, 
                  ease: "easeInOut" 
                }}
                className="w-full h-full bg-primary"
              />
            </div>
          </div>

          {/* Decorative Elements */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="absolute bottom-12 text-[10px] tracking-[0.3em] uppercase text-stone-300 font-bold"
          >
            Curating Knowledge Since 1998
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

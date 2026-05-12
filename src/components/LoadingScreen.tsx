"use client";

import { useEffect, useState } from "react";

import { AnimatePresence, motion } from "framer-motion";

export default function LoadingScreen() {
	const [isLoading, setIsLoading] = useState(true);
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
		// Simulate initial page load
		const timer = setTimeout(() => {
			setIsLoading(false);
		}, 1500);

		return () => clearTimeout(timer);
	}, []);

	useEffect(() => {
		if (!isLoading) {
			window.scrollTo(0, 0);
		}
	}, [isLoading]);

	if (!mounted) return null;

	return (
		<AnimatePresence>
			{isLoading && (
				<motion.div
					className="fixed inset-0 z-9999 flex flex-col items-center justify-center bg-white"
					exit={{
						y: "-100%",
						pointerEvents: "none",
						transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1], delay: 0.2 },
					}}
					initial={{ opacity: 1 }}
					key="loader"
				>
					<div className="relative flex flex-col items-center">
						{/* Logo Animation */}
						<motion.div
							animate={{ opacity: 1, y: 0 }}
							className="flex flex-col items-center gap-4"
							initial={{ opacity: 0, y: 20 }}
							transition={{ duration: 0.8, ease: "easeOut" }}
						>
							<img
								alt="Rewaya Logo"
								className="h-16 w-auto object-contain"
								src="/Al%20Rewaya%20Book%20World%20Approved%20Logo%201%20-%20Copy.png"
							/>
							<div className="flex flex-col items-center leading-none">
								<span className="font-bold text-3xl text-secondary tracking-tighter">
									alrewaya
								</span>
								<span className="mt-1 font-black text-[10px] text-primary tracking-[0.4em]">
									BOOK WORLD
								</span>
							</div>
						</motion.div>

						{/* Progress Bar */}
						<div className="absolute -bottom-16 h-px w-48 overflow-hidden bg-stone-100">
							<motion.div
								animate={{ x: "100%" }}
								className="h-full w-full bg-primary"
								initial={{ x: "-100%" }}
								transition={{
									duration: 2,
									repeat: Number.POSITIVE_INFINITY,
									ease: "easeInOut",
								}}
							/>
						</div>
					</div>

					{/* Decorative Elements */}
					<motion.div
						animate={{ opacity: 1 }}
						className="absolute bottom-12 font-bold text-[10px] text-stone-300 uppercase tracking-[0.3em]"
						initial={{ opacity: 0 }}
						transition={{ delay: 0.5 }}
					>
						Curating Knowledge Since 1998
					</motion.div>
				</motion.div>
			)}
		</AnimatePresence>
	);
}

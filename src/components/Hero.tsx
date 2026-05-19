"use client";

import Image from "next/image";

import { motion } from "framer-motion";

export default function Hero() {
	return (
		<div className="relative flex min-h-screen items-center overflow-hidden bg-white pt-16">
			<div className="container py-10">
				<div className="mb-10 flex flex-col items-center text-center">
					<motion.h1
						animate={{ opacity: 1, y: 0 }}
						className="mb-6 font-black font-serif text-5xl leading-[0.85] tracking-tight md:text-8xl"
						initial={{ opacity: 0, y: 20 }}
						transition={{ duration: 0.8 }}
					>
						THE NEW <br />
						<span className="font-normal italic">LITERARY</span> <br />
						STANDARD.
					</motion.h1>
					<motion.p
						animate={{ opacity: 1 }}
						className="nav-link mb-8 max-w-md text-stone-500"
						initial={{ opacity: 0 }}
						transition={{ delay: 0.4 }}
					>
						Curating the finest collection of Islamic and international
						literature for the modern seeker.
					</motion.p>
					<motion.div
						animate={{ opacity: 1 }}
						className="flex gap-4"
						initial={{ opacity: 0 }}
						transition={{ delay: 0.6 }}
					>
						<button className="bg-primary px-10 py-4 font-bold text-sm text-white transition-colors hover:bg-primary-dark">
							Shop Now
						</button>
						<button className="border border-primary px-10 py-4 font-bold text-primary text-sm transition-colors hover:bg-primary hover:text-white">
							Our Story
						</button>
					</motion.div>
				</div>

				<motion.div
					animate={{ opacity: 1, y: 0 }}
					className="relative aspect-[21/7] w-full overflow-hidden"
					initial={{ opacity: 0, y: 40 }}
					transition={{ duration: 1, delay: 0.8 }}
				>
					<Image
						alt="Library"
						className="object-cover brightness-75 grayscale"
						fill
						priority
						sizes="100vw"
						src="https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=2000&auto=format&fit=crop"
					/>
					<div className="absolute inset-0 flex items-center justify-center">
						<span className="border-white border-b-2 pb-2 font-bold text-sm text-white">
							Explore the Collection
						</span>
					</div>
				</motion.div>
			</div>
		</div>
	);
}

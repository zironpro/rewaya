"use client";

import Link from "next/link";

import { motion } from "framer-motion";

const categories = [
	{
		name: "Islamic",
		image:
			"https://images.unsplash.com/photo-1542810634-71277d95dcbb?q=80&w=300&auto=format&fit=crop",
		href: "/#islamic",
	},
	{
		name: "Children",
		image:
			"https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=300&auto=format&fit=crop",
		href: "/#children",
	},
	{
		name: "Academic",
		image:
			"https://images.unsplash.com/photo-1497633762265-9d179a990aa6?q=80&w=300&auto=format&fit=crop",
		href: "/#academic",
	},
	{
		name: "Fiction",
		image:
			"https://images.unsplash.com/photo-1474932430478-367dbb6832c1?q=80&w=300&auto=format&fit=crop",
		href: "/#fiction",
	},
	{
		name: "Self-Help",
		image:
			"https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=300&auto=format&fit=crop",
		href: "/#selfhelp",
	},
	{
		name: "History",
		image:
			"https://images.unsplash.com/photo-1461360228754-6e81c478b882?q=80&w=300&auto=format&fit=crop",
		href: "/#history",
	},
	{
		name: "Biographies",
		image:
			"https://images.unsplash.com/photo-1471107340929-a87cd0f5b5f3?q=80&w=300&auto=format&fit=crop",
		href: "/#biographies",
	},
];

export default function CategoryStrip() {
	return (
		<section className="border-stone-50 border-b bg-white py-16">
			<div className="container mx-auto px-6">
				<div className="no-scrollbar flex items-center justify-between gap-6 overflow-x-auto py-4 md:gap-10">
					{categories.map((cat, i) => (
						<Link
							className="group flex shrink-0 flex-col items-center gap-4"
							href={cat.href}
							key={cat.name}
						>
							<motion.div
								className="h-32 w-32 overflow-hidden rounded-[2.5rem] border-2 border-stone-100 bg-stone-50 shadow-sm transition-all group-hover:border-primary/30 group-hover:shadow-xl md:h-48 md:w-48 md:rounded-[3.5rem]"
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
							>
								<img
									alt={cat.name}
									className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
									src={cat.image}
								/>
							</motion.div>
							<span className="text-center font-black text-[11px] text-stone-500 uppercase tracking-[0.2em] transition-colors group-hover:text-primary md:text-xs">
								{cat.name}
							</span>
						</Link>
					))}
				</div>
			</div>
		</section>
	);
}

"use client";

import Image from "next/image";
import Link from "next/link";

import { motion } from "framer-motion";

const categories = [
	{
		name: "Islamic",
		image: "/categories/islamic.png",
		href: "/#islamic",
	},
	{
		name: "Children",
		image: "/categories/children.png",
		href: "/#children",
	},
	{
		name: "Academic",
		image: "/categories/academic.png",
		href: "/#academic",
	},
	{
		name: "Fiction",
		image: "/categories/fiction.png",
		href: "/#fiction",
	},
	{
		name: "Self-Help",
		image: "/categories/selfhelp.png",
		href: "/#selfhelp",
	},
	{
		name: "History",
		image: "/categories/history.png",
		href: "/#history",
	},
	{
		name: "Biographies",
		image: "/categories/biographies.png",
		href: "/#biographies",
	},
];

export default function CategoryStrip() {
	return (
		<section className="no-scrollbar container mx-auto flex items-center justify-between gap-6 overflow-x-auto border-stone-50 border-b px-6 py-16 md:gap-10">
			{categories.map((cat, i) => (
				<Link
					className="group flex shrink-0 flex-col items-center gap-4"
					href={cat.href}
					key={`${cat.name}-${Number(i)}`}
				>
					<motion.div
						className="relative size-32 overflow-hidden rounded-sm border-2 border-stone-100 bg-stone-50 shadow-sm transition-all group-hover:border-primary/30 group-hover:shadow-xl md:size-48"
						whileHover={{ scale: 1.05 }}
						whileTap={{ scale: 0.95 }}
					>
						<Image
							alt={cat.name}
							className="object-cover transition-transform duration-700 group-hover:scale-110"
							fill
							sizes="(max-width: 768px) 128px, 192px"
							src={cat.image}
						/>
					</motion.div>
					<span className="text-center font-semibold text-sm text-stone-600 transition-colors group-hover:text-primary">
						{cat.name}
					</span>
				</Link>
			))}
		</section>
	);
}

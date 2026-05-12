"use client";

import { useState } from "react";

import { useParams } from "next/navigation";

import {
	Heart,
	Minus,
	Plus,
	RefreshCcw,
	Share2,
	ShieldCheck,
	Truck,
} from "lucide-react";

// Mock data fetch for a single product
const getProduct = (id: string) => ({
	id: Number.parseInt(id),
	title:
		id === "1"
			? "The Sealed Nectar"
			: id === "2"
				? "Atomic Habits"
				: "Classic Literature",
	author: id === "1" ? "Safiur Rahman Mubarakpuri" : "Various Authors",
	price: 85.0,
	category: "Islamic",
	image:
		"https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=1200&auto=format&fit=crop",
	description:
		"A comprehensive and authoritative biography of the Prophet Muhammad (PBUH). This book is considered one of the most reliable sources on the life of the Prophet, winner of the worldwide competition on the biography of the Prophet Muhammad held by the Muslim World League.",
	details: [
		{ label: "Language", value: "English" },
		{ label: "Format", value: "Hardcover" },
		{ label: "Pages", value: "588" },
		{ label: "Publisher", value: "Darussalam Publishing" },
	],
});

export default function ProductDetailPage() {
	const { id } = useParams();
	const product = getProduct(id as string);
	const [quantity, setQuantity] = useState(1);

	return (
		<main className="pt-24 pb-32">
			<div className="container mx-auto px-6">
				{/* Breadcrumbs */}
				<nav className="mb-12 flex gap-2 text-[10px] text-stone-400 uppercase tracking-widest">
					<a className="hover:text-primary" href="/">
						Home
					</a>
					<span>/</span>
					<a className="hover:text-primary" href="/shop">
						Shop
					</a>
					<span>/</span>
					<span className="font-bold text-secondary">{product.title}</span>
				</nav>

				<div className="grid grid-cols-1 gap-20 md:grid-cols-2">
					{/* Image Gallery Side */}
					<div className="space-y-6">
						<div className="group relative aspect-4/5 overflow-hidden bg-stone-50">
							<img
								alt={product.title}
								className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-105"
								src={product.image}
							/>
							<button className="absolute top-6 right-6 rounded-full bg-white/80 p-3 backdrop-blur-md transition-colors hover:bg-primary hover:text-white">
								<Heart size={20} />
							</button>
						</div>
						<div className="grid grid-cols-4 gap-4">
							{[1, 2, 3, 4].map((i) => (
								<div
									className="aspect-square cursor-pointer bg-stone-50 opacity-50 transition-opacity hover:opacity-100"
									key={i}
								>
									<img
										alt="thumbnail"
										className="h-full w-full object-cover grayscale"
										src={product.image}
									/>
								</div>
							))}
						</div>
					</div>

					{/* Content Side */}
					<div className="flex flex-col">
						<span className="mb-4 font-black text-[10px] text-primary uppercase tracking-[0.4em]">
							{product.category}
						</span>
						<h1 className="mb-2 font-black font-serif text-4xl uppercase tracking-tight md:text-6xl">
							{product.title}
						</h1>
						<p className="mb-8 font-bold text-sm text-stone-400 uppercase tracking-[0.2em]">
							{product.author}
						</p>

						<div className="mb-10 font-bold text-2xl text-secondary">
							AED {product.price.toFixed(2)}
						</div>

						<p className="mb-12 max-w-lg text-[11px] text-sm text-stone-500 uppercase leading-relaxed tracking-wider">
							{product.description}
						</p>

						{/* Action Section */}
						<div className="mb-16 space-y-8">
							<div className="flex items-center gap-12">
								<div className="flex items-center border border-stone-100 px-4 py-2">
									<button
										className="p-2 transition-colors hover:text-primary"
										onClick={() => setQuantity(Math.max(1, quantity - 1))}
									>
										<Minus size={14} />
									</button>
									<span className="w-12 text-center font-bold text-xs">
										{quantity}
									</span>
									<button
										className="p-2 transition-colors hover:text-primary"
										onClick={() => setQuantity(quantity + 1)}
									>
										<Plus size={14} />
									</button>
								</div>
								<button className="flex items-center gap-2 font-bold text-[10px] uppercase tracking-widest transition-colors hover:text-primary">
									<Share2 size={14} /> Share
								</button>
							</div>

							<button className="w-full bg-primary py-6 font-bold text-[10px] text-white uppercase tracking-[0.4em] shadow-lg transition-all duration-500 hover:scale-[1.02] hover:bg-secondary hover:shadow-2xl active:scale-[0.98]">
								Add to Collection
							</button>
						</div>

						{/* Details & Shipping */}
						<div className="space-y-6 border-stone-100 border-t pt-12">
							<div className="grid grid-cols-2 gap-y-4">
								{product.details.map((detail, i) => (
									<div
										className="flex flex-col"
										key={`${Number(i)}-${detail.label}`}
									>
										<span className="mb-1 font-bold text-[9px] text-stone-400 uppercase tracking-widest">
											{detail.label}
										</span>
										<span className="font-black text-[11px] uppercase tracking-tight">
											{detail.value}
										</span>
									</div>
								))}
							</div>

							<div className="flex flex-col gap-4 pt-6">
								<div className="flex items-center gap-4 text-xs">
									<Truck className="text-primary" size={18} />
									<span className="text-[10px] uppercase tracking-widest">
										Express Shipping Available (2-3 Days)
									</span>
								</div>
								<div className="flex items-center gap-4 text-xs">
									<RefreshCcw className="text-primary" size={18} />
									<span className="text-[10px] uppercase tracking-widest">
										30-Day Spiritual Reflection Returns
									</span>
								</div>
								<div className="flex items-center gap-4 text-xs">
									<ShieldCheck className="text-primary" size={18} />
									<span className="text-[10px] uppercase tracking-widest">
										100% Authentic Edition Guarantee
									</span>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</main>
	);
}

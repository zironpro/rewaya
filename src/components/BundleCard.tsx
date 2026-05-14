"use client";

import Image from "next/image";
import Link from "next/link";

import { motion } from "framer-motion";
import { Eye, Heart, Package, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";

import { Bundle } from "@/lib/bundles-data";

export default function BundleCard({
	id,
	title,
	count,
	price,
	originalPrice,
	mainImage,
	tag,
}: Bundle) {
	return (
		<motion.div
			className="group flex h-full flex-col"
			initial={{ opacity: 0 }}
			viewport={{ once: true }}
			whileInView={{ opacity: 1 }}
		>
			<Dialog>
				{/* Image Container */}
				<div className="book-shadow relative mb-4 h-[340px] w-full overflow-hidden rounded-lg bg-stone-50">
					<div className="absolute inset-0">
						<Link
							className="relative block h-full w-full"
							href={`/bundle/${id}`}
						>
							<Image
								alt={title}
								className="object-cover transition-transform duration-700 group-hover:scale-105"
								fill
								sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
								src={mainImage}
							/>
						</Link>
					</div>

					{/* Icons Overlay */}
					<div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 transition-opacity group-hover:opacity-100">
						<Button
							className="h-9 w-9 rounded-full bg-white/80 backdrop-blur-sm"
							size="icon"
							variant="ghost"
						>
							<Heart size={16} strokeWidth={1.5} />
						</Button>
						<DialogTrigger asChild>
							<Button
								className="h-9 w-9 rounded-full bg-white/80 backdrop-blur-sm"
								size="icon"
								variant="ghost"
							>
								<Eye size={16} strokeWidth={1.5} />
							</Button>
						</DialogTrigger>
					</div>

					{/* Quick Add (Bottom) */}
					<div className="absolute right-0 bottom-0 left-0 translate-y-full bg-primary p-4 transition-transform duration-300 group-hover:translate-y-0">
						<Button
							className="h-10 w-full text-white text-xm hover:bg-white/10"
							variant="ghost"
						>
							<Plus className="mr-2" size={14} /> Add to Bag
						</Button>
					</div>

					{/* Status Badges */}
					<div className="absolute top-4 left-0 z-10 flex flex-col items-start gap-1">
						{tag && (
							<span className="bg-primary px-3 py-1.5 font-bold text-white text-xm shadow-lg">
								{tag}
							</span>
						)}
						<span className="bg-primary px-3 py-1.5 font-bold text-white text-xm shadow-lg">
							{count} Book Set
						</span>
					</div>
				</div>

				{/* Info Container */}
				<Link
					className="flex cursor-pointer flex-col gap-1 px-1"
					href={`/bundle/${id}`}
				>
					<div className="flex items-start justify-between gap-4">
						<h3 className="line-clamp-2 min-h-[2.5rem] flex-1 font-bold text-base text-primary leading-tight transition-colors">
							{title}
						</h3>
						<div className="flex flex-col items-end">
							<span className="whitespace-nowrap font-bold text-primary text-sm">
								AED {price.toFixed(2)}
							</span>
							<span className="text-stone-300 text-xm line-through">
								AED {originalPrice.toFixed(2)}
							</span>
						</div>
					</div>
					<p className="flex items-center gap-2 text-stone-500 text-xm">
						<Package size={11} /> {count} Volumes Collection
					</p>
				</Link>

				{/* Quick View Dialog Content */}
				<DialogContent className="max-w-3xl">
					<div className="grid grid-cols-1 gap-8 pt-6 md:grid-cols-2">
						<div className="relative h-[340px] w-full overflow-hidden bg-stone-50">
							<div className="absolute inset-0">
								<Image
									alt={title}
									className="object-cover"
									fill
									sizes="(max-width: 768px) 100vw, 400px"
									src={mainImage}
								/>
							</div>
						</div>
						<div className="flex flex-col justify-between py-4">
							<DialogHeader>
								<DialogDescription>Bundle Collection</DialogDescription>
								<DialogTitle className="mt-2 text-4xl">{title}</DialogTitle>
								<p className="mt-2 text-sm text-stone-400">
									Exclusive {count}-Book Anthology
								</p>
							</DialogHeader>

							<div className="space-y-6">
								<div className="flex items-baseline gap-4">
									<p className="font-black font-serif text-3xl text-primary">
										AED {price.toFixed(2)}
									</p>
									<p className="text-lg text-stone-300 line-through">
										AED {originalPrice.toFixed(2)}
									</p>
								</div>
								<p className="text-base text-stone-500 leading-relaxed">
									Experience the full spectrum of this curated theme. This
									bundle includes {count} essential volumes carefully selected
									to provide a comprehensive journey through {title}.
								</p>
								<div className="flex gap-4">
									<Button className="h-14 flex-1 bg-primary text-white hover:bg-primary-dark">
										Add to Bag
									</Button>
									<Button className="h-14 w-14" size="icon" variant="outline">
										<Heart size={20} strokeWidth={1.5} />
									</Button>
								</div>
							</div>
						</div>
					</div>
				</DialogContent>
			</Dialog>
		</motion.div>
	);
}

"use client";

import Image from "next/image";
import Link from "next/link";

import { AnimatePresence, motion } from "framer-motion";
import { useAtom } from "jotai";
import { ArrowRight, Minus, Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";

import { CartItem, cartAtom, cartTotalAtom } from "@/lib/store";

export const CartView = () => {
	const [cart, setCart] = useAtom(cartAtom);
	const [total] = useAtom(cartTotalAtom);

	const updateQuantity = (id: string | number, delta: number) => {
		setCart((prev: CartItem[]) =>
			prev.map((item) =>
				item.id === id
					? { ...item, quantity: Math.max(1, item.quantity + delta) }
					: item
			)
		);
	};

	const removeItem = (id: string | number) => {
		setCart((prev: CartItem[]) => prev.filter((item) => item.id !== id));
	};

	return (
		<main className="grow pt-32 pb-32">
			<div className="container mx-auto px-6">
				<div className="mb-16">
					<span className="mb-4 block font-bold text-stone-400 text-xm">
						Your Selection
					</span>
					<h1 className="font-black font-serif text-5xl md:text-7xl">
						Shopping <span className="font-normal italic">Bag</span>.
					</h1>
				</div>

				{cart.length === 0 ? (
					<div className="border-stone-100 border-y py-32 text-center">
						<p className="mb-8 text-stone-400 text-xm">
							Your bag is currently empty.
						</p>
						<Link href="/shop">
							<Button variant="premium">Explore the Library</Button>
						</Link>
					</div>
				) : (
					<div className="flex flex-col gap-20 lg:flex-row">
						{/* Cart Items List */}
						<div className="flex-grow space-y-8">
							<div className="hidden grid-cols-4 border-stone-100 border-b pb-6 font-bold text-stone-400 text-xm md:grid">
								<div className="col-span-2">Product</div>
								<div className="text-center">Quantity</div>
								<div className="text-right">Total</div>
							</div>

							<AnimatePresence>
								{cart.map((item) => (
									<motion.div
										animate={{ opacity: 1, y: 0 }}
										className="grid grid-cols-1 items-center gap-8 border-stone-50 border-b py-8 md:grid-cols-4"
										exit={{ opacity: 0, x: -20 }}
										initial={{ opacity: 0, y: 20 }}
										key={item.id}
									>
										<div className="col-span-2 flex gap-6">
											<div className="relative h-32 w-24 shrink-0 overflow-hidden bg-stone-50">
												<Image
													alt={item.title}
													className="h-full w-full object-cover"
													fill
													src={item.image}
												/>
											</div>
											<div className="flex flex-col justify-center gap-1">
												<h3 className="font-bold text-secondary text-xm">
													{item.title}
												</h3>
												<p className="mb-4 text-stone-400 text-xm">
													{item.author}
												</p>
												<button
													className="flex w-fit items-center gap-2 font-bold text-stone-300 text-xm transition-colors hover:text-primary"
													onClick={() => removeItem(item.id)}
												>
													<Trash2 size={12} /> Remove
												</button>
											</div>
										</div>

										<div className="flex items-center justify-center">
											<div className="flex items-center rounded-sm border border-stone-100">
												<button
													className="p-2 transition-colors hover:bg-stone-50"
													onClick={() => updateQuantity(item.id, -1)}
												>
													<Minus size={12} />
												</button>
												<span className="w-10 text-center font-bold text-xm">
													{item.quantity}
												</span>
												<button
													className="p-2 transition-colors hover:bg-stone-50"
													onClick={() => updateQuantity(item.id, 1)}
												>
													<Plus size={12} />
												</button>
											</div>
										</div>

										<div className="text-right">
											<span className="font-bold text-primary text-sm">
												AED {(item.price * item.quantity).toFixed(2)}
											</span>
										</div>
									</motion.div>
								))}
							</AnimatePresence>
						</div>

						{/* Order Summary Sidebar */}
						<aside className="w-full lg:w-96">
							<div className="sticky top-32 bg-stone-50 p-8">
								<h3 className="mb-8 border-stone-200 border-b pb-4 font-bold text-xm">
									Order Summary
								</h3>
								<div className="mb-8 space-y-4">
									<div className="flex justify-between font-bold text-stone-500 text-xm">
										<span>Subtotal</span>
										<span>AED {total.toFixed(2)}</span>
									</div>
									<div className="flex justify-between font-bold text-stone-500 text-xm">
										<span>Shipping</span>
										<span>Free</span>
									</div>
								</div>
								<div className="mb-10 flex items-end justify-between border-stone-200 border-t pt-6">
									<span className="font-bold text-xm">Total</span>
									<span className="font-black font-serif text-2xl text-primary">
										AED {total.toFixed(2)}
									</span>
								</div>
								<Button className="group h-16 w-full" variant="premium">
									Checkout{" "}
									<ArrowRight
										className="ml-2 transition-transform group-hover:translate-x-1"
										size={16}
									/>
								</Button>
								<p className="mt-6 text-center text-stone-400 text-xm leading-relaxed">
									Complimentary shipping on all orders. <br /> Returns accepted
									within 30 days.
								</p>
							</div>
						</aside>
					</div>
				)}
			</div>
		</main>
	);
};

"use client";

import { CreditCard, RotateCcw, ShieldCheck, Truck } from "lucide-react";

const policies = [
	{
		title: "FREE SHIPPING",
		desc: "On all orders above AED 200 within UAE",
		icon: Truck,
	},
	{
		title: "14-DAY RETURNS",
		desc: "Hassle-free return and exchange policy",
		icon: RotateCcw,
	},
	{
		title: "SECURE PAYMENT",
		desc: "100% secure payment processing",
		icon: CreditCard,
	},
	{
		title: "GENUINE BOOKS",
		desc: "Direct from authorized publishers",
		icon: ShieldCheck,
	},
];

export default function PolicyCards() {
	return (
		<section className="border-stone-100 border-y bg-stone-50 py-16">
			<div className="container mx-auto px-6">
				<div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4">
					{policies.map((policy) => {
						const Icon = policy.icon;
						return (
							<div
								className="group flex flex-col items-center text-center"
								key={policy.title}
							>
								<div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-sm transition-all duration-500 group-hover:bg-primary group-hover:text-white">
									<Icon size={28} strokeWidth={1.2} />
								</div>
								<h3 className="mb-2 font-black text-[11px] uppercase tracking-[0.2em]">
									{policy.title}
								</h3>
								<p className="text-[10px] text-stone-400 uppercase leading-relaxed tracking-widest">
									{policy.desc}
								</p>
							</div>
						);
					})}
				</div>
			</div>
		</section>
	);
}

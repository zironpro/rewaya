"use client";

import {
	CreditCard,
	MoreVertical,
	Plus,
	ShieldCheck,
	Trash2,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface PaymentMethod {
	id: string;
	type: string;
	provider: string;
	last4: string;
	expiry: string;
	isDefault: boolean;
}

interface PaymentTabProps {
	paymentMethods: PaymentMethod[];
}

export const PaymentTab = ({ paymentMethods }: PaymentTabProps) => {
	return (
		<div className="space-y-8">
			<div className="flex items-center justify-between">
				<div>
					<h2 className="font-serif text-3xl text-secondary">
						Payment Methods
					</h2>
					<p className="text-stone-400">
						Securely manage your saved cards and payment options
					</p>
				</div>
				<Button className="h-12 gap-2 rounded-2xl px-6" variant="premium">
					<Plus size={18} />
					Add New Card
				</Button>
			</div>

			<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
				{paymentMethods.map((method) => (
					<Card
						className={`group relative overflow-hidden rounded-[2rem] border-stone-100 shadow-soft transition-all duration-300 hover:shadow-heavy ${
							method.isDefault ? "ring-2 ring-primary ring-offset-2" : ""
						}`}
						key={method.id}
					>
						{/* Background Decorative Pattern */}
						<div className="absolute -top-10 -right-10 opacity-[0.03] transition-transform duration-700 group-hover:scale-110">
							<CreditCard size={200} />
						</div>

						<CardHeader className="flex flex-row items-start justify-between pb-4">
							<div className="flex items-center gap-4">
								<div className="flex size-12 items-center justify-center rounded-2xl border border-stone-100 bg-stone-50">
									{method.provider === "Visa" ? (
										<span className="font-black text-blue-800 text-xl italic">
											VISA
										</span>
									) : (
										<div className="flex -space-x-2">
											<div className="size-6 rounded-full bg-red-500/80" />
											<div className="size-6 rounded-full bg-orange-500/80" />
										</div>
									)}
								</div>
								<div>
									<div className="flex items-center gap-2">
										<CardTitle className="font-bold text-lg">
											{method.provider} •••• {method.last4}
										</CardTitle>
										{method.isDefault && (
											<Badge
												className="border-primary/20 bg-primary/5 font-bold text-[10px] text-primary uppercase tracking-wider"
												variant="outline"
											>
												Primary
											</Badge>
										)}
									</div>
									<p className="text-stone-400 text-xs">
										Expires {method.expiry}
									</p>
								</div>
							</div>
							<Button className="rounded-full" size="icon" variant="ghost">
								<MoreVertical className="text-stone-400" size={18} />
							</Button>
						</CardHeader>

						<CardContent className="flex items-center justify-between pt-4">
							<div className="flex items-center gap-2 text-emerald-600">
								<ShieldCheck size={16} />
								<span className="font-bold text-xs uppercase tracking-wide">
									Verified & Secure
								</span>
							</div>
							<Button
								className="h-9 gap-2 rounded-xl border-stone-200 text-red-500 hover:bg-red-50 hover:text-red-600"
								size="sm"
								variant="outline"
							>
								<Trash2 size={14} />
								<span className="font-bold text-xs">Remove</span>
							</Button>
						</CardContent>
					</Card>
				))}
			</div>

			{/* Security Notice */}
			<div className="flex items-start gap-4 rounded-3xl border border-stone-100 bg-stone-50 p-6">
				<div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-white shadow-soft">
					<ShieldCheck className="text-primary" size={20} />
				</div>
				<div>
					<h4 className="font-bold text-secondary text-sm">
						Your Security is Our Priority
					</h4>
					<p className="mt-1 text-stone-400 text-xs leading-relaxed">
						Rewaya uses industry-standard encryption to protect your payment
						information. We do not store your full card numbers on our servers.
					</p>
				</div>
			</div>
		</div>
	);
};

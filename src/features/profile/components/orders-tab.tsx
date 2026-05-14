"use client";

import { Package } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

interface Order {
	id: string;
	date: string;
	status: string;
	total: string;
	items: number;
}

interface OrdersTabProps {
	orders: Order[];
}

export const OrdersTab = ({ orders }: OrdersTabProps) => {
	return (
		<Card className="overflow-hidden rounded-[2rem] border-stone-100 shadow-soft">
			<CardHeader className="border-stone-100 border-b bg-stone-50/50 pb-6">
				<CardTitle className="font-serif text-2xl">Order History</CardTitle>
				<CardDescription>
					Manage and track your previous purchases
				</CardDescription>
			</CardHeader>
			<CardContent className="p-0">
				<div className="divide-y divide-stone-100">
					{orders.map((order) => (
						<div
							className="flex flex-col justify-between gap-4 p-6 transition-colors hover:bg-stone-50 md:flex-row md:items-center"
							key={order.id}
						>
							<div className="flex items-center gap-6">
								<div className="flex size-14 shrink-0 items-center justify-center rounded-2xl border border-stone-100 bg-white">
									<Package className="text-stone-400" size={24} />
								</div>
								<div>
									<p className="font-bold text-lg text-secondary">{order.id}</p>
									<p className="text-sm text-stone-400">
										{order.date} • {order.items} items
									</p>
								</div>
							</div>
							<div className="flex items-center justify-between gap-8 md:justify-end">
								<div className="text-right">
									<p className="font-bold text-lg text-secondary">
										{order.total}
									</p>
									<span
										className={`rounded-full px-2 py-1 font-bold text-[10px] uppercase tracking-wider ${
											order.status === "Delivered"
												? "bg-emerald-100 text-emerald-700"
												: order.status === "Shipped"
													? "bg-blue-100 text-blue-700"
													: order.status === "Cancelled"
														? "bg-red-100 text-red-700"
														: "bg-stone-100 text-stone-500"
										}`}
									>
										{order.status}
									</span>
								</div>
								<Button
									className="rounded-xl border-stone-200"
									size="sm"
									variant="outline"
								>
									View Details
								</Button>
							</div>
						</div>
					))}
				</div>
			</CardContent>
		</Card>
	);
};

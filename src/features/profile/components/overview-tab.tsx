"use client";

import { Bell, Edit2, Package } from "lucide-react";

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

interface OverviewTabProps {
	orders: Order[];
}

export const OverviewTab = ({ orders }: OverviewTabProps) => {
	return (
		<div className="space-y-8">
			<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
				<Card className="rounded-[2rem] border-stone-100 shadow-soft">
					<CardHeader className="flex flex-row items-center justify-between">
						<div>
							<CardTitle className="font-serif text-2xl">
								Personal Info
							</CardTitle>
							<CardDescription>Update your personal details</CardDescription>
						</div>
						<Button className="rounded-full" size="icon" variant="ghost">
							<Edit2 size={16} />
						</Button>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="grid grid-cols-2 gap-4">
							<div className="space-y-1">
								<p className="font-bold text-stone-400 text-xs uppercase">
									First Name
								</p>
								<p className="font-bold text-secondary">Ahmed</p>
							</div>
							<div className="space-y-1">
								<p className="font-bold text-stone-400 text-xs uppercase">
									Last Name
								</p>
								<p className="font-bold text-secondary">Hassan</p>
							</div>
						</div>
						<div className="space-y-1">
							<p className="font-bold text-stone-400 text-xs uppercase">
								Email
							</p>
							<p className="font-bold text-secondary">ahmed.h@example.com</p>
						</div>
						<div className="space-y-1">
							<p className="font-bold text-stone-400 text-xs uppercase">
								Phone
							</p>
							<p className="font-bold text-secondary">+20 123 456 7890</p>
						</div>
					</CardContent>
				</Card>

				<Card className="rounded-[2rem] border-stone-100 shadow-soft">
					<CardHeader>
						<CardTitle className="font-serif text-2xl">
							Recent Activity
						</CardTitle>
						<CardDescription>Your latest interactions</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="space-y-6">
							<div className="flex gap-4">
								<div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-stone-50">
									<Package className="text-primary" size={20} />
								</div>
								<div>
									<p className="font-bold text-secondary text-sm">
										Order #ORD-7429 Delivered
									</p>
									<p className="text-stone-400 text-xs">Yesterday at 4:30 PM</p>
								</div>
							</div>
							<div className="flex gap-4">
								<div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-stone-50">
									<Bell className="text-primary" size={20} />
								</div>
								<div>
									<p className="font-bold text-secondary text-sm">
										Sale Alert: Islamic Studies
									</p>
									<p className="text-stone-400 text-xs">2 days ago</p>
								</div>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>

			<Card className="overflow-hidden rounded-[2rem] border-stone-100 shadow-soft">
				<CardHeader className="border-stone-100 border-b bg-stone-50/50 pb-6">
					<CardTitle className="font-serif text-2xl">Active Orders</CardTitle>
				</CardHeader>
				<CardContent className="p-0">
					<div className="divide-y divide-stone-100">
						{orders.slice(0, 2).map((order) => (
							<div
								className="flex items-center justify-between p-6 transition-colors hover:bg-stone-50"
								key={order.id}
							>
								<div className="flex items-center gap-6">
									<div className="flex size-12 items-center justify-center rounded-2xl border border-stone-100 bg-white">
										<Package className="text-stone-400" size={20} />
									</div>
									<div>
										<p className="font-bold text-secondary">{order.id}</p>
										<p className="text-sm text-stone-400">
											{order.date} • {order.items} items
										</p>
									</div>
								</div>
								<div className="text-right">
									<p className="mb-1 font-bold text-secondary">{order.total}</p>
									<span
										className={`rounded-full px-2 py-0.5 font-bold text-[10px] uppercase tracking-wider ${
											order.status === "Delivered"
												? "bg-emerald-100 text-emerald-700"
												: order.status === "Shipped"
													? "bg-blue-100 text-blue-700"
													: "bg-stone-100 text-stone-500"
										}`}
									>
										{order.status}
									</span>
								</div>
							</div>
						))}
					</div>
				</CardContent>
			</Card>
		</div>
	);
};

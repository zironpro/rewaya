"use client";

import { Edit2, MapPin, MoreVertical, Plus, Trash2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Address {
	id: string;
	type: string;
	name: string;
	street: string;
	city: string;
	country: string;
	phone: string;
	isDefault: boolean;
}

interface AddressesTabProps {
	addresses: Address[];
}

export const AddressesTab = ({ addresses }: AddressesTabProps) => {
	return (
		<div className="space-y-8">
			<div className="flex items-center justify-between">
				<div>
					<h2 className="font-serif text-3xl text-secondary">My Addresses</h2>
					<p className="text-stone-400">
						Manage your shipping and billing addresses
					</p>
				</div>
				<Button className="h-12 gap-2 rounded-2xl px-6" variant="premium">
					<Plus size={18} />
					Add New Address
				</Button>
			</div>

			<div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
				{addresses.map((address) => (
					<Card
						className={`rounded-[2rem] border-stone-100 shadow-soft transition-all duration-300 hover:shadow-heavy ${
							address.isDefault ? "ring-2 ring-primary ring-offset-2" : ""
						}`}
						key={address.id}
					>
						<CardHeader className="flex flex-row items-start justify-between pb-2">
							<div className="flex items-center gap-3">
								<div className="flex size-10 items-center justify-center rounded-xl bg-stone-50">
									<MapPin className="text-primary" size={20} />
								</div>
								<div>
									<div className="flex items-center gap-2">
										<CardTitle className="font-bold text-lg">
											{address.type}
										</CardTitle>
										{address.isDefault && (
											<Badge
												className="border-primary/20 bg-primary/5 font-bold text-[10px] text-primary uppercase tracking-wider"
												variant="outline"
											>
												Default
											</Badge>
										)}
									</div>
								</div>
							</div>
							<Button className="rounded-full" size="icon" variant="ghost">
								<MoreVertical className="text-stone-400" size={18} />
							</Button>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="space-y-1">
								<p className="font-bold text-secondary">{address.name}</p>
								<p className="text-sm text-stone-500">{address.street}</p>
								<p className="text-sm text-stone-500">
									{address.city}, {address.country}
								</p>
								<p className="mt-2 text-sm text-stone-500">{address.phone}</p>
							</div>

							<div className="flex items-center gap-2 pt-4">
								<Button
									className="h-9 grow gap-2 rounded-xl border-stone-200"
									size="sm"
									variant="outline"
								>
									<Edit2 size={14} />
									Edit
								</Button>
								<Button
									className="h-9 gap-2 rounded-xl border-stone-200 text-red-500 hover:bg-red-50 hover:text-red-600"
									size="sm"
									variant="outline"
								>
									<Trash2 size={14} />
								</Button>
							</div>
						</CardContent>
					</Card>
				))}
			</div>
		</div>
	);
};

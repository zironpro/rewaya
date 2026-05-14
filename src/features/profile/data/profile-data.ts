import { CreditCard, MapPin, Package, Settings, User } from "lucide-react";

export const tabs = [
	{ id: "overview", label: "Overview", icon: User },
	{ id: "orders", label: "My Orders", icon: Package },
	{ id: "addresses", label: "Addresses", icon: MapPin },
	{ id: "payment", label: "Payment", icon: CreditCard },
	{ id: "settings", label: "Settings", icon: Settings },
];

export const mockOrders = [
	{
		id: "ORD-7429",
		date: "May 12, 2026",
		status: "Delivered",
		total: "$124.00",
		items: 3,
	},
	{
		id: "ORD-7315",
		date: "April 28, 2026",
		status: "Shipped",
		total: "$45.50",
		items: 1,
	},
	{
		id: "ORD-7201",
		date: "April 15, 2026",
		status: "Cancelled",
		total: "$89.00",
		items: 2,
	},
];

export const mockUser = {
	name: "Ahmed Hassan",
	email: "ahmed.h@example.com",
	avatar:
		"https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop",
};

export const mockAddresses = [
	{
		id: "1",
		type: "Home",
		name: "Ahmed Hassan",
		street: "123 Nile Street",
		city: "Cairo",
		country: "Egypt",
		phone: "+20 123 456 7890",
		isDefault: true,
	},
	{
		id: "2",
		type: "Office",
		name: "Ahmed Hassan",
		street: "456 Business Bay, Floor 12",
		city: "Dubai",
		country: "UAE",
		phone: "+971 50 123 4567",
		isDefault: false,
	},
];

export const mockPaymentMethods = [
	{
		id: "1",
		type: "Visa",
		provider: "Visa",
		last4: "4242",
		expiry: "12/28",
		isDefault: true,
	},
	{
		id: "2",
		type: "Mastercard",
		provider: "Mastercard",
		last4: "8888",
		expiry: "05/26",
		isDefault: false,
	},
];

import { OrdersPage } from "@/features/profile/pages/orders-page";

export const metadata = {
	title: "My Orders | Rewaya",
	description: "View and track your order history.",
};

export default function ProfileOrdersPage() {
	return <OrdersPage />;
}

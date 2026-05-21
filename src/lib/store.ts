import { atom } from "jotai";

export interface BookProps {
	id: number;
	/** Wix Stores product ID for headless cart */
	wixProductId?: string;
	/** URL slug from Wix catalog */
	slug?: string;
	title: string;
	author?: string;
	price: number;
	image: string;
	category: string;
	badge?: "new seller" | "new arrival" | "best seller";
}

export interface CartItem {
	id: number;
	title: string;
	author: string;
	price: number;
	image: string;
	quantity: number;
}

export const cartAtom = atom<CartItem[]>([]);

export const cartCountAtom = atom((get) => {
	const cart = get(cartAtom);
	return cart.reduce((acc, item) => acc + item.quantity, 0);
});

export const cartTotalAtom = atom((get) => {
	const cart = get(cartAtom);
	return cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
});

export const wishlistAtom = atom<BookProps[]>([]);

export const wishlistCountAtom = atom((get) => {
	const wishlist = get(wishlistAtom);
	return wishlist.length;
});

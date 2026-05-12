import { atom } from "jotai";

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

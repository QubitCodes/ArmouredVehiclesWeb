"use client";

import { create } from "zustand";


export type CartItemLocal = {
  id: string; // product id as string for consistency
  name: string;
  price: number;
  qty: number;
  image?: string;
  sku?: string;
  stock?: number;
  is_controlled?: boolean;
  vendorId?: string; // Add vendorId
};

interface CartState {
  items: CartItemLocal[];
  setItems: (items: CartItemLocal[]) => void;
  addItem: (item: Omit<CartItemLocal, "qty">, qty?: number) => void;
  updateQty: (id: string, qty: number) => void;
  removeItem: (id: string) => void;
  clear: () => void;
  subtotal: () => number;
  count: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  setItems: (items) => set({ items: items.map(i => ({ ...i, id: String(i.id) })) }),
  addItem: (item, qty = 1) => {
    const existing = get().items.find((i) => i.id === String(item.id));
    if (existing) {
      set({
        items: get().items.map((i) =>
          i.id === existing.id ? { ...i, qty: i.qty + qty } : i
        ),
      });
    } else {
      set({ items: [...get().items, { ...item, id: String(item.id), qty }] });
    }
  },
  updateQty: (id, qty) => {
    if (qty <= 0) {
      set({ items: get().items.filter((i) => i.id !== String(id)) });
      return;
    }
    set({
      items: get().items.map((i) =>
        i.id === String(id) ? { ...i, qty } : i
      ),
    });
  },
  removeItem: (id) => {
    set({ items: get().items.filter((i) => i.id !== String(id)) });
  },
  clear: () => set({ items: [] }),
  subtotal: () => get().items.reduce((sum, i) => sum + i.price * i.qty, 0),
  count: () => get().items.reduce((sum, i) => sum + i.qty, 0),
}));

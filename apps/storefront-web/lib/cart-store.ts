"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Product } from "@sweetshelf/shared-types";

export type CartItem = {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
  maxQuantity: number;
};

type CartStore = {
  items: CartItem[];
  addItem: (product: Product, quantity?: number) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  removeItem: (productId: string) => void;
  clear: () => void;
};

export const useCartStore = create<CartStore>()(
  persist(
    (set) => ({
      items: [],
      addItem: (product, quantity = 1) =>
        set((state) => {
          const existing = state.items.find((item) => item.productId === product.id);

          if (existing) {
            return {
              items: state.items.map((item) =>
                item.productId === product.id
                  ? {
                      ...item,
                      quantity: Math.min(item.quantity + quantity, item.maxQuantity),
                    }
                  : item,
              ),
            };
          }

          return {
            items: [
              ...state.items,
              {
                productId: product.id,
                name: product.name,
                price: product.price,
                quantity,
                imageUrl: product.imageUrls[0] ?? "",
                maxQuantity: product.stockQuantity,
              },
            ],
          };
        }),
      updateQuantity: (productId, quantity) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.productId === productId
              ? { ...item, quantity: Math.max(1, Math.min(quantity, item.maxQuantity)) }
              : item,
          ),
        })),
      removeItem: (productId) =>
        set((state) => ({
          items: state.items.filter((item) => item.productId !== productId),
        })),
      clear: () => set({ items: [] }),
    }),
    {
      name: "sweetshelf-cart",
    },
  ),
);

export function getCartTotals(items: CartItem[]) {
  return items.reduce(
    (acc, item) => {
      acc.total += item.price * item.quantity;
      acc.itemCount += item.quantity;
      return acc;
    },
    { total: 0, itemCount: 0 },
  );
}

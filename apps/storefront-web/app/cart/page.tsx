"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Separator,
} from "@sweetshelf/shared-ui";
import { formatCurrency } from "@sweetshelf/shared-types";
import { getCartTotals, useCartStore } from "@/lib/cart-store";

export default function CartPage() {
  const items = useCartStore((state) => state.items);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const clear = useCartStore((state) => state.clear);
  const totals = getCartTotals(items);

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-8 md:px-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-[var(--color-muted)]">
            Cart
          </p>
          <h1 className="mt-2 font-serif text-4xl text-[var(--color-brown-900)]">
            Review your order before checkout.
          </h1>
        </div>
        {items.length > 0 ? (
          <Button variant="ghost" onClick={() => clear()}>
            Clear cart
          </Button>
        ) : null}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          <div className="grid grid-cols-[80px_1fr_1fr_64px] overflow-hidden rounded-[18px] bg-[#0d9447] text-white shadow-[0_18px_45px_rgba(13,148,71,0.22)]">
            <div className="flex items-center justify-center border-r border-white/15 px-3 py-4">
              <ShoppingBag className="size-8" />
            </div>
            <div className="flex flex-col justify-center border-r border-white/15 px-4 py-4">
              <span className="text-xs uppercase tracking-[0.2em] text-white/68">
                Items
              </span>
              <span className="text-lg font-semibold">{totals.itemCount}</span>
            </div>
            <div className="flex flex-col justify-center border-r border-white/15 px-4 py-4">
              <span className="text-xs uppercase tracking-[0.2em] text-white/68">
                Cart Total
              </span>
              <span className="text-lg font-semibold">
                {formatCurrency(totals.total)}
              </span>
            </div>
            <button
              type="button"
              className="flex items-center justify-center transition hover:bg-white/10"
              aria-label="Clear cart from summary strip"
              onClick={() => clear()}
              disabled={items.length === 0}
            >
              <X className="size-6" />
            </button>
          </div>

          <Card>
            <CardContent className="p-6">
              {items.length === 0 ? (
                <div className="flex flex-col items-center gap-4 rounded-[28px] border border-dashed border-[var(--color-brown-100)] px-6 py-16 text-center">
                  <p className="text-lg font-semibold text-[var(--color-brown-900)]">
                    Your cart is empty.
                  </p>
                  <p className="max-w-md text-sm leading-6 text-[var(--color-muted)]">
                    Add pastries from the storefront, then come back here to
                    adjust quantities or remove anything before paying.
                  </p>
                  <Link href="/">
                    <Button>Browse products</Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-5">
                  {items.map((item) => (
                    <div
                      key={item.productId}
                      className="rounded-[24px] border border-[var(--color-brown-100)] bg-white p-4 shadow-[0_12px_32px_rgba(16,24,40,0.06)]"
                    >
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                        <div className="relative size-24 overflow-hidden rounded-[20px]">
                          <Image
                            src={item.imageUrl}
                            alt={item.name}
                            fill
                            sizes="96px"
                            className="object-cover"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-lg font-semibold text-[var(--color-brown-900)]">
                            {item.name}
                          </p>
                          <p className="mt-1 text-sm text-[var(--color-muted)]">
                            {formatCurrency(item.price)} each · max{" "}
                            {item.maxQuantity}
                          </p>
                          <div className="mt-4 flex flex-wrap items-center gap-3">
                            <div className="flex items-center gap-2 rounded-full bg-[var(--color-caramel-50)] p-1">
                              <Button
                                type="button"
                                className="flex size-9 items-center justify-center rounded-full bg-white"
                                onClick={() =>
                                  updateQuantity(
                                    item.productId,
                                    item.quantity - 1,
                                  )
                                }
                              >
                                <Minus className="size-4" />
                              </Button>
                              <span className="min-w-10 text-center text-sm font-semibold">
                                {item.quantity}
                              </span>
                              <Button
                                type="button"
                                className="flex size-9 items-center justify-center rounded-full bg-white"
                                onClick={() =>
                                  updateQuantity(
                                    item.productId,
                                    item.quantity + 1,
                                  )
                                }
                              >
                                <Plus className="size-4" />
                              </Button>
                            </div>
                            <button
                              type="button"
                              className="inline-flex items-center gap-2 rounded-full border border-[var(--color-brown-100)] px-4 py-2 text-sm text-[var(--color-brown-800)]"
                              onClick={() => removeItem(item.productId)}
                            >
                              <Trash2 className="size-4 text-[var(--color-rose-600)]" />
                              Remove
                            </button>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xs uppercase tracking-[0.24em] text-[var(--color-muted)]">
                            Line total
                          </p>
                          <p className="mt-1 text-lg font-semibold text-[var(--color-caramel-500)]">
                            {formatCurrency(item.price * item.quantity)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Card className="h-fit">
          <CardHeader>
            <CardDescription>Order summary</CardDescription>
            <CardTitle>{totals.itemCount} items</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-[var(--color-muted)]">Subtotal</span>
              <span className="font-semibold text-[var(--color-brown-900)]">
                {formatCurrency(totals.total)}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-[var(--color-muted)]">Delivery</span>
              <span className="font-semibold text-[var(--color-brown-900)]">
                Calculated at checkout
              </span>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Estimated total</span>
              <span className="text-xl font-semibold text-[var(--color-caramel-500)]">
                {formatCurrency(totals.total)}
              </span>
            </div>
            <Link href="/checkout">
              <Button fullWidth disabled={items.length === 0}>
                Continue to Checkout
              </Button>
            </Link>
            <Link href="/">
              <Button variant="outline" fullWidth>
                Keep Shopping
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

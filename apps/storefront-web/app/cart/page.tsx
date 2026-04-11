"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
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
  const router = useRouter();
  const items = useCartStore((state) => state.items);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const clear = useCartStore((state) => state.clear);
  const totals = getCartTotals(items);

  function handleBack() {
    if (window.history.length > 1) {
      router.back();
      return;
    }

    router.push("/browse-menu");
  }

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-4 sm:gap-5 sm:px-6 sm:py-5 lg:gap-6 lg:px-8 lg:py-6">
      <div className="flex flex-wrap items-end justify-between gap-4 sm:gap-5 lg:gap-6">
        <div>
          <Button
            type="button"
            variant="ghost"
            className="-ml-3 mb-3"
            onClick={handleBack}
          >
            <ArrowLeft className="size-4" />
            Back
          </Button>
          <p className="text-xs uppercase tracking-[0.3em] text-[var(--color-muted)]">
            Cart
          </p>
          <h1 className="mt-2 font-serif text-xl text-[var(--color-brown-900)] sm:text-2xl lg:text-3xl">
            Review your order before checkout.
          </h1>
        </div>
        {items.length > 0 ? (
          <Button variant="ghost" onClick={() => clear()}>
            Clear cart
          </Button>
        ) : null}
      </div>

      <div className="grid gap-4 sm:gap-5 lg:grid-cols-[1fr_360px] lg:gap-6">
        <div className="space-y-4 sm:space-y-5 lg:space-y-6">
          {items.length > 0 ? (
            <div className="grid grid-cols-[80px_1fr_1fr_64px] overflow-hidden rounded-[18px] bg-[#0d9447] text-white shadow-[0_18px_45px_rgba(13,148,71,0.22)]">
              <div className="flex items-center justify-center border-r border-white/15 px-3 py-4">
                <ShoppingBag className="size-8" />
              </div>
              <div className="flex flex-col justify-center border-r border-white/15 px-4 py-4">
                <span className="text-xs uppercase tracking-[0.2em] text-white/68">
                  Items
                </span>
                <span className="text-lg font-semibold">
                  {totals.itemCount}
                </span>
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
                className="flex min-h-10 items-center justify-center transition hover:bg-white/10"
                aria-label="Clear cart from summary strip"
                onClick={() => clear()}
              >
                <X className="size-6" />
              </button>
            </div>
          ) : null}

          <Card className="border-0">
            <CardContent className="p-3 sm:p-4 lg:p-5 border-[var(--color-brown-100)]">
              {items.length === 0 ? (
                <div className="flex flex-col items-center gap-4 rounded-[28px] border border-dashed border-[var(--color-brown-100)] px-6 py-16 text-center">
                  <p className="text-lg font-semibold text-[var(--color-brown-900)] sm:text-xl lg:text-2xl">
                    Your cart is empty.
                  </p>
                  <p className="max-w-md text-sm leading-6 text-[var(--color-muted)] sm:text-base">
                    Add pastries from the storefront, then come back here to
                    adjust quantities or remove anything before paying.
                  </p>
                  <Button type="button" onClick={handleBack}>
                    Keep Shopping
                  </Button>
                </div>
              ) : (
                <div className="space-y-4 sm:space-y-5 lg:space-y-6 ">
                  {items.map((item) => (
                    <div
                      key={item.productId}
                      className="rounded-[24px] border border-[var(--color-brown-100)] bg-white p-3 shadow-[0_12px_32px_rgba(16,24,40,0.06)] sm:p-4 lg:p-5"
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
                          <p className="truncate text-lg font-semibold text-[var(--color-brown-900)] sm:text-xl">
                            {item.name}
                          </p>
                          <p className="mt-1 text-sm text-[var(--color-muted)] sm:text-base">
                            {formatCurrency(item.price)} each · max{" "}
                            {item.maxQuantity}
                          </p>
                          <div className="mt-4 flex flex-wrap items-center gap-3">
                            <div className="flex items-center gap-2 rounded-full bg-[var(--color-caramel-50)] p-1">
                              {item.quantity > 1 ? (
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="icon"
                                  className="size-10 bg-white text-[var(--color-brown-900)]"
                                  aria-label={`Decrease ${item.name} quantity`}
                                  onClick={() =>
                                    updateQuantity(
                                      item.productId,
                                      item.quantity - 1,
                                    )
                                  }
                                >
                                  <Minus className="size-4" />
                                </Button>
                              ) : null}
                              <span className="min-w-10 text-center text-sm font-semibold sm:text-base">
                                {item.quantity}
                              </span>
                              <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                className="size-10 bg-white text-[var(--color-brown-900)]"
                                aria-label={`Increase ${item.name} quantity`}
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
                              className="inline-flex min-h-10 items-center gap-2 rounded-full border border-[var(--color-brown-100)] px-4 py-2 text-sm text-[var(--color-brown-800)] sm:text-base"
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
                          <p className="mt-1 text-lg font-semibold text-[var(--color-caramel-500)] sm:text-xl">
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

        {items.length > 0 ? (
          <Card className="h-fit border-[var(--color-brown-100)] bg-white">
            <CardHeader>
              <CardDescription>Order summary</CardDescription>
              <CardTitle>{totals.itemCount} items</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 sm:space-y-5 lg:space-y-6">
              <div className="flex items-center justify-between text-sm sm:text-base">
                <span className="text-[var(--color-muted)]">Subtotal</span>
                <span className="font-semibold text-[var(--color-brown-900)]">
                  {formatCurrency(totals.total)}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm sm:text-base">
                <span className="text-[var(--color-muted)]">Delivery</span>
                <span className="font-semibold text-[var(--color-brown-900)]">
                  Calculated at checkout
                </span>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium sm:text-base">
                  Estimated total
                </span>
                <span className="text-xl font-semibold text-[var(--color-caramel-500)]">
                  {formatCurrency(totals.total)}
                </span>
              </div>
              <Link href="/checkout" className="mb-5 mt-2 block">
                <Button fullWidth>Continue to Checkout</Button>
              </Link>
              <Button
                type="button"
                variant="outline"
                fullWidth
                onClick={handleBack}
              >
                Keep Shopping
              </Button>
            </CardContent>
          </Card>
        ) : null}
      </div>
    </main>
  );
}

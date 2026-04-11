"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  Separator,
} from "@sweetshelf/shared-ui";
import {
  checkoutRequestSchema,
  formatCurrency,
} from "@sweetshelf/shared-types";
import { createCheckoutSession } from "@/lib/api";
import { getCartTotals, useCartStore } from "@/lib/cart-store";

export default function CheckoutPage() {
  const router = useRouter();
  const items = useCartStore((state) => state.items);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const clearCart = useCartStore((state) => state.clear);
  const totals = useMemo(() => getCartTotals(items), [items]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [error, setError] = useState<string | null>(null);

  function handleBack() {
    if (window.history.length > 1) {
      router.back();
      return;
    }

    router.push("/cart");
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const payload = {
      customerName,
      customerEmail,
      customerPhone,
      deliveryType: "delivery" as const,
      deliveryAddress,
      notes: "",
      storeId: "store-demo",
      cartItems: items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
      })),
    };
    const parsed = checkoutRequestSchema.safeParse(payload);

    if (!parsed.success) {
      setError(
        parsed.error.issues[0]?.message ?? "Check your checkout details",
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await createCheckoutSession(parsed.data);
      clearCart();
      router.push(result.authorizationUrl);
    } catch {
      router.push("/order-failed?reason=checkout_failed");
    } finally {
      setIsSubmitting(false);
    }
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
            Checkout
          </p>
          <h1 className="mt-2 font-serif text-xl text-[var(--color-brown-900)] sm:text-2xl lg:text-3xl">
            Ready to make payment?
          </h1>
        </div>
      </div>

      {items.length > 0 ? (
        <div className="grid grid-cols-[80px_1fr_1fr] overflow-hidden rounded-[18px] bg-[#0d9447] text-white shadow-[0_18px_45px_rgba(13,148,71,0.22)]">
          <div className="flex items-center justify-center border-r border-white/15 px-3 py-4">
            <ShoppingBag className="size-8" />
          </div>
          <div className="flex flex-col justify-center border-r border-white/15 px-4 py-4">
            <span className="text-xs uppercase tracking-[0.2em] text-white/68">
              Items
            </span>
            <span className="text-lg font-semibold">{totals.itemCount}</span>
          </div>
          <div className="flex flex-col justify-center px-4 py-4">
            <span className="text-xs uppercase tracking-[0.2em] text-white/68">
              Cart Total
            </span>
            <span className="text-lg font-semibold">
              {formatCurrency(totals.total)}
            </span>
          </div>
        </div>
      ) : null}

      <div className="grid gap-4 sm:gap-5 lg:grid-cols-[1fr_380px] lg:gap-6">
        <Card className="border-0">
          <CardHeader>
            <CardDescription>Customer details</CardDescription>
            <CardTitle>Where should we send this order?</CardTitle>
          </CardHeader>
          <CardContent>
            {items.length === 0 ? (
              <div className="flex flex-col items-center gap-4 rounded-[28px] border border-dashed border-[var(--color-brown-100)] px-6 py-16 text-center">
                <p className="text-lg font-semibold text-[var(--color-brown-900)] sm:text-xl lg:text-2xl">
                  Your cart is still empty.
                </p>
                <p className="max-w-md text-sm leading-6 text-[var(--color-muted)] sm:text-base">
                  Add pastries first, then return here to enter delivery and
                  payment details.
                </p>
                <Button type="button" onClick={handleBack}>
                  Keep Shopping
                </Button>
              </div>
            ) : (
              <form
                className="space-y-4 sm:space-y-5 lg:space-y-6"
                onSubmit={handleSubmit}
              >
                <div className="space-y-2">
                  <label
                    htmlFor="customer-name"
                    className="text-sm font-medium text-[var(--color-brown-800)]"
                  >
                    Full name
                  </label>
                  <Input
                    id="customer-name"
                    value={customerName}
                    onChange={(event) => setCustomerName(event.target.value)}
                    autoComplete="name"
                    minLength={2}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="customer-email"
                    className="text-sm font-medium text-[var(--color-brown-800)]"
                  >
                    Email
                  </label>
                  <Input
                    id="customer-email"
                    type="email"
                    value={customerEmail}
                    onChange={(event) => setCustomerEmail(event.target.value)}
                    autoComplete="email"
                  />
                  <p className="text-xs text-[var(--color-muted)]">
                    We&apos;ll send your receipt here. No account needed.
                  </p>
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="customer-phone"
                    className="text-sm font-medium text-[var(--color-brown-800)]"
                  >
                    Phone number
                  </label>
                  <Input
                    id="customer-phone"
                    type="tel"
                    value={customerPhone}
                    onChange={(event) => setCustomerPhone(event.target.value)}
                    autoComplete="tel"
                    inputMode="tel"
                    pattern="^\+?[0-9][0-9\s().-]{7,18}$"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="delivery-address"
                    className="text-sm font-medium text-[var(--color-brown-800)]"
                  >
                    Delivery address
                  </label>
                  <Input
                    id="delivery-address"
                    value={deliveryAddress}
                    onChange={(event) => setDeliveryAddress(event.target.value)}
                    autoComplete="street-address"
                    minLength={10}
                    required
                  />
                  <p className="text-xs text-[var(--color-muted)]">
                    Include street, house number, estate, or area so dispatch
                    can find you.
                  </p>
                </div>
                {error ? (
                  <p className="rounded-[16px] bg-[#fff1f1] px-4 py-3 text-sm text-[var(--color-rose-600)]">
                    {error}
                  </p>
                ) : null}
                <Button type="submit" fullWidth disabled={isSubmitting}>
                  {isSubmitting
                    ? "Preparing checkout..."
                    : "Proceed to Payment"}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>

        {items.length > 0 ? (
          <Card className="h-fit border-[var(--color-brown-100)] bg-white py-4 shadow-[0_12px_32px_rgba(16,24,40,0.06)] sm:p-5 lg:py-6">
            <CardHeader>
              <CardDescription>Order summary</CardDescription>
              <CardTitle>{`${totals.itemCount} ${totals.itemCount === 1 ? "item" : "items"}`}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 sm:space-y-5 lg:space-y-6">
              <Separator />
              <div className="flex items-center justify-between text-sm sm:text-base">
                <span className="text-[var(--color-muted)]">Subtotal</span>
                <span className="font-semibold text-[var(--color-brown-900)]">
                  {formatCurrency(totals.total)}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm sm:text-base">
                <span className="text-[var(--color-muted)]">Delivery</span>
                <span className="font-semibold text-[var(--color-brown-900)]">
                  Calculated after confirmation
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
              <Link href="/cart" className="block">
                <Button variant="outline" fullWidth>
                  Edit Cart
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : null}
      </div>
    </main>
  );
}

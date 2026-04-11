"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ShoppingBag } from "lucide-react";
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
import { formatCurrency } from "@sweetshelf/shared-types";
import { createCheckoutSession } from "@/lib/api";
import { getCartTotals, useCartStore } from "@/lib/cart-store";

export default function CheckoutPage() {
  const router = useRouter();
  const items = useCartStore((state) => state.items);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
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
    setIsSubmitting(true);

    try {
      const result = await createCheckoutSession({
        customerName,
        customerEmail,
        customerPhone,
        deliveryType: deliveryAddress ? "delivery" : "pickup",
        deliveryAddress,
        notes: "",
        storeId: "store-demo",
        cartItems: items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
      });

      router.push(`/order-success?reference=${result.reference}`);
    } catch (submissionError) {
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : "Checkout failed",
      );
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

      <div className="grid gap-4 sm:gap-5 lg:grid-cols-[1fr_360px] lg:gap-6">
        <div className="space-y-4 sm:space-y-5 lg:space-y-6">
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
                      value={customerPhone}
                      onChange={(event) => setCustomerPhone(event.target.value)}
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
                      onChange={(event) =>
                        setDeliveryAddress(event.target.value)
                      }
                    />
                    <p className="text-xs text-[var(--color-muted)]">
                      Leave blank if this is a pickup order.
                    </p>
                  </div>
                  {error ? (
                    <p className="text-sm text-[var(--color-rose-600)]">
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
        </div>
      </div>
    </main>
  );
}

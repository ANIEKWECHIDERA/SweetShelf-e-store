"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Input, SectionCard } from "@sweetshelf/shared-ui";
import { formatCurrency } from "@sweetshelf/shared-types";
import { createCheckoutSession } from "@/lib/api";
import { getCartTotals, useCartStore } from "@/lib/cart-store";

export default function CheckoutPage() {
  const router = useRouter();
  const items = useCartStore((state) => state.items);
  const totals = useMemo(() => getCartTotals(items), [items]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [error, setError] = useState<string | null>(null);

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
        cartItems: items.map((item) => ({ productId: item.productId, quantity: item.quantity })),
      });

      router.push(`/order-success?reference=${result.reference}`);
    } catch (submissionError) {
      setError(submissionError instanceof Error ? submissionError.message : "Checkout failed");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-8 md:px-8">
      <div className="space-y-2">
        <p className="text-xs uppercase tracking-[0.3em] text-[var(--color-muted)]">Checkout</p>
        <h1 className="font-serif text-4xl text-[var(--color-brown-800)]">Ready to make it official?</h1>
      </div>
      <SectionCard>
        <div className="space-y-3">
          <h2 className="text-sm font-medium text-[var(--color-brown-800)]">Order Summary</h2>
          {items.length === 0 ? (
            <p className="text-sm text-[var(--color-muted)]">Your cart is still empty.</p>
          ) : (
            items.map((item) => (
              <div key={item.productId} className="flex items-center justify-between text-sm text-[var(--color-brown-800)]">
                <span>{item.name} × {item.quantity}</span>
                <span>{formatCurrency(item.price * item.quantity)}</span>
              </div>
            ))
          )}
          <div className="border-t border-[var(--color-brown-100)] pt-3 text-sm">
            <div className="flex items-center justify-between">
              <span>Subtotal</span>
              <span>{formatCurrency(totals.total)}</span>
            </div>
          </div>
        </div>
      </SectionCard>
      <SectionCard>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <Input label="Full name" value={customerName} onChange={(event) => setCustomerName(event.target.value)} required />
          <Input
            label="Email"
            type="email"
            helperText="We'll send your receipt here — no account needed."
            value={customerEmail}
            onChange={(event) => setCustomerEmail(event.target.value)}
          />
          <Input
            label="Phone number"
            value={customerPhone}
            onChange={(event) => setCustomerPhone(event.target.value)}
          />
          <Input
            label="Delivery address"
            helperText="Leave blank if this is a pickup order."
            value={deliveryAddress}
            onChange={(event) => setDeliveryAddress(event.target.value)}
          />
          {error ? <p className="text-sm text-[var(--color-rose-600)]">{error}</p> : null}
          <Button type="submit" fullWidth disabled={isSubmitting || items.length === 0}>
            {isSubmitting ? "Preparing checkout..." : "Proceed to Payment"}
          </Button>
        </form>
      </SectionCard>
    </main>
  );
}

"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Input, Separator } from "@sweetshelf/shared-ui";
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
      <Link href="/cart" className="inline-flex items-center gap-2 text-sm text-[var(--color-caramel-500)] hover:underline">
        <ArrowLeft className="size-4" />
        Back to cart
      </Link>
      <div className="space-y-2">
        <p className="text-xs uppercase tracking-[0.3em] text-[var(--color-muted)]">Checkout</p>
        <h1 className="font-serif text-4xl text-[var(--color-brown-800)]">Ready to make it official?</h1>
      </div>
      <Card>
        <CardHeader>
          <CardDescription>Order summary</CardDescription>
          <CardTitle>Review before payment</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {items.length === 0 ? (
            <p className="text-sm text-[var(--color-muted)]">Your cart is still empty.</p>
          ) : (
            items.map((item) => (
              <div key={item.productId} className="flex items-center justify-between text-sm text-[var(--color-brown-800)]">
                <span>{item.name} x {item.quantity}</span>
                <span>{formatCurrency(item.price * item.quantity)}</span>
              </div>
            ))
          )}
          <Separator />
          <div className="pt-1 text-sm">
            <div className="flex items-center justify-between">
              <span>Subtotal</span>
              <span>{formatCurrency(totals.total)}</span>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardDescription>Customer details</CardDescription>
          <CardTitle>Where should we send this order?</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <Input label="Full name" value={customerName} onChange={(event) => setCustomerName(event.target.value)} required />
            <Input
              label="Email"
              type="email"
              helperText="We'll send your receipt here - no account needed."
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
        </CardContent>
      </Card>
    </main>
  );
}

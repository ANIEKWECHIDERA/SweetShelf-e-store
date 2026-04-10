import Link from "next/link";
import { Card, CardContent } from "@sweetshelf/shared-ui";
import { formatCurrency } from "@sweetshelf/shared-types";
import { getOrderByReference } from "@/lib/api";

export default async function OrderSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ reference?: string }>;
}) {
  const params = await searchParams;
  const receipt = await getOrderByReference(params.reference ?? "pay_demo_001");

  return (
    <main className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-4 py-8 md:px-8">
      <div className="space-y-2">
        <p className="text-xs uppercase tracking-[0.3em] text-[var(--color-sage-600)]">Payment Confirmed</p>
        <h1 className="font-serif text-4xl text-[var(--color-brown-800)]">Your order is in the queue.</h1>
      </div>
      <Card>
        <CardContent className="space-y-4 p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm text-[var(--color-muted)]">Order ID</p>
              <p className="text-lg font-medium text-[var(--color-brown-800)]">#{receipt.order.id}</p>
            </div>
            <div>
              <p className="text-sm text-[var(--color-muted)]">Payment Reference</p>
              <p className="text-lg font-medium text-[var(--color-brown-800)]">{receipt.order.paymentReference}</p>
            </div>
          </div>
          <div className="space-y-3 border-t border-[var(--color-brown-100)] pt-4">
            {receipt.order.items.map((item) => (
              <div key={item.id} className="flex items-center justify-between text-sm">
                <span>{item.productName} × {item.quantity}</span>
                <span>{formatCurrency(item.subtotal)}</span>
              </div>
            ))}
            <div className="flex items-center justify-between border-t border-[var(--color-brown-100)] pt-3 text-base font-medium">
              <span>Total Paid</span>
              <span>{formatCurrency(receipt.order.total)}</span>
            </div>
          </div>
          <p className="text-sm text-[var(--color-muted)]">
            Check your email for a copy if you entered one at checkout. Need help? WhatsApp is still one tap away.
          </p>
        </CardContent>
      </Card>
      <Link href="/" className="text-sm text-[var(--color-caramel-500)] hover:underline">
        Continue shopping
      </Link>
    </main>
  );
}

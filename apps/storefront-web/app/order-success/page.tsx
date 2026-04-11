import Link from "next/link";
import { CheckCircle2, PackageCheck, ShoppingBag } from "lucide-react";
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
import { ClearCartOnMount } from "@/components/clear-cart-on-mount";
import { getOrderByReference } from "@/lib/api";

export default async function OrderSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ reference?: string }>;
}) {
  const params = await searchParams;
  const receipt = await getOrderByReference(params.reference ?? "pay_demo_001");

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-4 sm:gap-5 sm:px-6 sm:py-5 lg:gap-6 lg:px-8 lg:py-6">
      <ClearCartOnMount />

      <Card className="overflow-hidden border-0 bg-[radial-gradient(circle_at_top_left,rgba(13,148,71,0.28),transparent_34%),linear-gradient(135deg,#17110d_0%,#251813_48%,#36261e_100%)] text-white">
        <CardContent className="grid gap-6 p-6 sm:p-8 lg:grid-cols-[1fr_320px] lg:items-center">
          <div className="space-y-4">
            <div className="inline-flex size-14 items-center justify-center rounded-full bg-[#0d9447] shadow-[0_18px_45px_rgba(13,148,71,0.28)]">
              <CheckCircle2 className="size-7" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-[#b8f4cf]">
                Payment Confirmed
              </p>
              <h1 className="mt-2 font-serif text-xl leading-tight sm:text-2xl lg:text-3xl">
                Your order is in the queue.
              </h1>
            </div>
            <p className="max-w-2xl text-sm leading-7 text-[#f7e7d4] sm:text-base">
              We have received your payment and the SweetShelf kitchen can start
              preparing your treats. Keep this reference for tracking.
            </p>
          </div>

          <div className="grid grid-cols-[64px_1fr] overflow-hidden rounded-[18px] bg-[#0d9447] text-white shadow-[0_18px_45px_rgba(13,148,71,0.22)]">
            <div className="flex items-center justify-center border-r border-white/15 px-3 py-4">
              <ShoppingBag className="size-7" />
            </div>
            <div className="flex flex-col justify-center px-4 py-4">
              <span className="text-xs uppercase tracking-[0.2em] text-white/68">
                Total Paid
              </span>
              <span className="text-xl font-semibold">
                {formatCurrency(receipt.order.total)}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:gap-5 lg:grid-cols-[1fr_380px] lg:gap-6">
        <Card className="border-0 bg-white">
          <CardHeader>
            <CardDescription>Receipt details</CardDescription>
            <CardTitle>Order #{receipt.order.id}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 sm:space-y-5 lg:space-y-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="rounded-[18px] bg-[var(--color-caramel-50)] p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-[var(--color-muted)]">
                  Reference
                </p>
                <p className="mt-2 break-all text-sm font-semibold text-[var(--color-brown-900)]">
                  {receipt.order.paymentReference}
                </p>
              </div>
              <div className="rounded-[18px] bg-[var(--color-caramel-50)] p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-[var(--color-muted)]">
                  Status
                </p>
                <p className="mt-2 text-sm font-semibold capitalize text-[var(--color-brown-900)]">
                  {receipt.order.status}
                </p>
              </div>
            </div>
            <div className="space-y-3">
              {receipt.order.items.map((item) => (
                <div
                  key={item.id}
                  className="rounded-[24px] border border-[var(--color-brown-100)] bg-white p-4 shadow-[0_12px_32px_rgba(16,24,40,0.06)]"
                >
                  <div className="flex items-center justify-between gap-4 text-sm">
                    <div>
                      <p className="font-semibold text-[var(--color-brown-900)]">
                        {item.productName}
                      </p>
                      <p className="mt-1 text-[var(--color-muted)]">
                        {formatCurrency(item.productPrice)} x {item.quantity}
                      </p>
                    </div>
                    <p className="font-semibold text-[var(--color-caramel-500)]">
                      {formatCurrency(item.subtotal)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="h-fit border-[var(--color-brown-100)] bg-white py-4 shadow-[0_12px_32px_rgba(16,24,40,0.06)] sm:p-5 lg:py-6">
          <CardHeader>
            <CardDescription>Order summary</CardDescription>
            <CardTitle>{`${receipt.order.items.length} ${receipt.order.items.length === 1 ? "line item" : "line items"}`}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 sm:space-y-5 lg:space-y-6">
            <div className="flex items-center justify-between text-sm sm:text-base">
              <span className="text-[var(--color-muted)]">Subtotal</span>
              <span className="font-semibold text-[var(--color-brown-900)]">
                {formatCurrency(receipt.order.subtotal)}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm sm:text-base">
              <span className="text-[var(--color-muted)]">Delivery</span>
              <span className="font-semibold text-[var(--color-brown-900)]">
                {formatCurrency(receipt.order.deliveryFee)}
              </span>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium sm:text-base">
                Total Paid
              </span>
              <span className="text-xl font-semibold text-[var(--color-caramel-500)]">
                {formatCurrency(receipt.order.total)}
              </span>
            </div>
            <div className="rounded-[18px] bg-[var(--color-caramel-50)] p-4 text-sm leading-6 text-[var(--color-brown-800)]">
              <PackageCheck className="mb-2 size-5 text-[#0d9447]" />
              Check your email if you entered one at checkout. You can also
              track this order with the payment reference.
            </div>
            <Link href="/track-order" className="block">
              <Button fullWidth>Track Order</Button>
            </Link>
            <Link href="/browse-menu" className="block">
              <Button variant="outline" fullWidth>
                Continue Shopping
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

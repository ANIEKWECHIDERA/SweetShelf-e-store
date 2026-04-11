import Link from "next/link";
import { AlertTriangle, ArrowLeft, RefreshCw } from "lucide-react";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@sweetshelf/shared-ui";

export default function OrderFailedPage({
  searchParams,
}: {
  searchParams: { reason?: string };
}) {
  const reason =
    searchParams.reason === "checkout_failed"
      ? "We could not prepare your checkout session. Your cart is still safe, so you can try again."
      : "The payment was not completed. Your cart is still safe, so you can retry when you are ready.";

  return (
    <main className="mx-auto flex w-full max-w-4xl flex-col gap-4 px-4 py-4 sm:gap-5 sm:px-6 sm:py-5 lg:gap-6 lg:px-8 lg:py-6">
      <Card className="overflow-hidden border-0 bg-[radial-gradient(circle_at_top_left,rgba(220,38,38,0.18),transparent_34%),linear-gradient(135deg,#17110d_0%,#251813_48%,#36261e_100%)] text-white">
        <CardContent className="space-y-5 p-6 sm:p-8">
          <div className="inline-flex size-14 items-center justify-center rounded-full bg-[#fff1f1] text-[var(--color-rose-600)]">
            <AlertTriangle className="size-7" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-[#ffd0d0]">
              Order Failed
            </p>
            <h1 className="mt-2 font-serif text-xl leading-tight sm:text-2xl lg:text-3xl">
              We could not complete that order.
            </h1>
          </div>
          <p className="max-w-2xl text-sm leading-7 text-[#f7e7d4] sm:text-base">
            {reason}
          </p>
        </CardContent>
      </Card>

      <Card className="border-0 bg-white">
        <CardHeader>
          <CardDescription>What to do next</CardDescription>
          <CardTitle>Your cart has not been cleared.</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <Link href="/checkout">
            <Button>
              <RefreshCw className="size-4" />
              Retry Checkout
            </Button>
          </Link>
          <Link href="/cart">
            <Button variant="outline">
              <ArrowLeft className="size-4" />
              Back to Cart
            </Button>
          </Link>
        </CardContent>
      </Card>
    </main>
  );
}

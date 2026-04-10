"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Minus, Plus } from "lucide-react";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@sweetshelf/shared-ui";
import {
  formatCurrency,
  getWhatsAppHref,
  mockProducts,
} from "@sweetshelf/shared-types";
import { useCartStore } from "@/lib/cart-store";

function getProductBadge(isOutOfStock: boolean) {
  return isOutOfStock
    ? { label: "Sold Out", variant: "destructive" as const }
    : { label: "Fresh Batch", variant: "secondary" as const };
}

export function ProductDetailClient({
  product,
}: {
  product: (typeof mockProducts)[number];
}) {
  const addItem = useCartStore((state) => state.addItem);
  const [quantity, setQuantity] = useState(1);
  const badge = getProductBadge(product.status === "out_of_stock");

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-4 sm:gap-5 sm:px-6 sm:py-5 lg:gap-6 lg:px-8 lg:py-6">
      <Link
        href="/"
        className="text-sm text-[var(--color-caramel-500)] hover:underline"
      >
        ← All Products
      </Link>
      <div className="grid gap-4 sm:gap-5 lg:grid-cols-[1fr_0.9fr] lg:gap-6">
        <div className="relative min-h-[420px] overflow-hidden rounded-[28px]">
          <Image
            src={product.imageUrls[0]}
            alt={product.name}
            fill
            className="object-cover"
            sizes="50vw"
          />
        </div>
        <Card className="overflow-hidden bg-white/94">
          <CardHeader className="gap-3">
            <Badge variant={badge.variant}>{badge.label}</Badge>
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-[var(--color-muted)]">
                {product.categoryName}
              </p>
              <CardTitle className="mt-2 font-serif text-xl font-normal sm:text-2xl lg:text-3xl">
                {product.name}
              </CardTitle>
            </div>
            <CardDescription>{product.description}</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4 sm:gap-5 lg:gap-6">
            <p className="text-2xl font-semibold text-[var(--color-caramel-500)]">
              {formatCurrency(product.price)}
            </p>
            <div className="flex items-center gap-3">
              <Button
                className="flex size-11 items-center justify-center rounded-full border border-[var(--color-brown-100)] bg-white"
                onClick={() =>
                  setQuantity((current) => Math.max(1, current - 1))
                }
                type="button"
              >
                <Minus className="size-4" />
              </Button>
              <div className="flex h-11 min-w-16 items-center justify-center rounded-full bg-[var(--color-caramel-50)] px-4 text-sm font-semibold">
                {quantity}
              </div>
              <Button
                className="flex size-11 items-center justify-center rounded-full border border-[var(--color-brown-100)] bg-white"
                onClick={() =>
                  setQuantity((current) =>
                    Math.min(product.stockQuantity || 1, current + 1),
                  )
                }
                type="button"
              >
                <Plus className="size-4" />
              </Button>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:gap-6">
              <Button
                fullWidth
                disabled={product.status === "out_of_stock"}
                onClick={() => addItem(product, quantity)}
              >
                {product.status === "out_of_stock"
                  ? "Out of Stock"
                  : `Add ${quantity} to Cart`}
              </Button>
              <Link href="/cart">
                <Button fullWidth variant="outline">
                  Go to Cart
                </Button>
              </Link>
            </div>
            <div className="rounded-[24px] bg-[var(--color-caramel-50)] p-4">
              <p className="text-sm text-[var(--color-brown-800)]">
                Want a custom version, event-size cake, or message topper? We
                keep WhatsApp open for that final handoff.
              </p>
            </div>
            <a
              href={getWhatsAppHref("Hi, I'd like to make a custom order")}
              className="text-sm text-[var(--color-caramel-500)] hover:underline"
            >
              Want a custom version? Chat with us →
            </a>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

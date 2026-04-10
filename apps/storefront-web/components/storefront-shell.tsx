"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Heart, MessageCircle, ShoppingBag } from "lucide-react";
import { Badge, Button, SectionCard } from "@sweetshelf/shared-ui";
import { formatCurrency, type Category, type Product } from "@sweetshelf/shared-types";
import { getCartTotals, useCartStore } from "@/lib/cart-store";

export function StorefrontShell({
  categories,
  products,
}: {
  categories: Category[];
  products: Product[];
}) {
  const items = useCartStore((state) => state.items);
  const addItem = useCartStore((state) => state.addItem);
  const totals = getCartTotals(items);

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-4 py-6 md:px-8 md:py-10">
      <header className="grid gap-6 rounded-[32px] bg-[radial-gradient(circle_at_top_right,_rgba(196,129,58,0.22),_transparent_30%),linear-gradient(135deg,var(--color-brown-900),var(--color-brown-800))] p-8 text-white md:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-4">
          <p className="text-xs uppercase tracking-[0.35em] text-[var(--color-caramel-200)]">
            Warm modern pastry commerce
          </p>
          <h1 className="max-w-xl font-serif text-5xl italic leading-tight">
            SweetShelf makes your pastry store feel as rich online as it does in person.
          </h1>
          <p className="max-w-2xl text-sm leading-7 text-white/72">
            Browse fresh bakes, move through checkout without creating an account, and keep a WhatsApp line
            open for custom orders that need a human touch.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/checkout">
              <Button>Start Checkout</Button>
            </Link>
            <a
              className="inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm text-[var(--color-caramel-100)] transition hover:underline"
              href="https://wa.me/2348012345678?text=Hi%2C+I'd+like+to+enquire+about+a+custom+order"
              target="_blank"
              rel="noreferrer"
            >
              <MessageCircle className="size-4" />
              Ask about a custom order
            </a>
          </div>
        </div>
        <SectionCard className="bg-white/8 text-white backdrop-blur">
          <div className="space-y-4">
            <p className="text-xs uppercase tracking-[0.3em] text-white/55">Cart snapshot</p>
            <div className="flex items-center justify-between rounded-2xl border border-white/10 px-4 py-3">
              <span className="inline-flex items-center gap-2 text-sm">
                <ShoppingBag className="size-4" />
                {totals.itemCount} items
              </span>
              <span className="text-lg font-medium">{formatCurrency(totals.total)}</span>
            </div>
            <p className="text-sm leading-7 text-white/72">
              The cart is persisted locally, and prices are still re-verified server-side before payment.
            </p>
          </div>
        </SectionCard>
      </header>

      <div className="flex gap-3 overflow-x-auto pb-2">
        <Badge label="All" variant="new" />
        {categories.map((category) => (
          <Badge key={category.id} label={category.name} variant="on_sale" />
        ))}
      </div>

      <section className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {products.map((product, index) => (
          <motion.article
            key={product.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: index * 0.04 }}
          >
            <SectionCard className="flex h-full flex-col overflow-hidden p-0">
              <Link href={`/products/${product.slug}`} className="group">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={product.imageUrls[0] ?? ""}
                    alt={product.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 25vw"
                    className={`object-cover transition duration-300 ${product.status === "out_of_stock" ? "opacity-50" : "group-hover:scale-105"}`}
                  />
                  <div className="absolute left-3 top-3">
                    <Badge
                      label={product.status === "out_of_stock" ? "Out of stock" : product.tags[0] ?? "In stock"}
                      variant={product.status === "out_of_stock" ? "out_of_stock" : product.tags[0] ?? "in_stock"}
                    />
                  </div>
                  <button
                    type="button"
                    aria-label={`Save ${product.name}`}
                    className="absolute right-3 top-3 rounded-full bg-white/90 p-2 text-[var(--color-caramel-500)] shadow"
                  >
                    <Heart className="size-4" />
                  </button>
                </div>
              </Link>
              <div className="flex flex-1 flex-col gap-4 p-5">
                <div className="space-y-2">
                  <p className="text-xs uppercase tracking-[0.25em] text-[var(--color-muted)]">{product.categoryName}</p>
                  <h2 className="text-base font-medium text-[var(--color-brown-800)]">{product.name}</h2>
                  <p className="text-sm leading-6 text-[var(--color-muted)]">{product.description}</p>
                </div>
                <div className="mt-auto flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.25em] text-[var(--color-muted)]">Price</p>
                    <p className="text-lg font-medium text-[var(--color-caramel-500)]">{formatCurrency(product.price)}</p>
                  </div>
                  <Button
                    onClick={() => addItem(product)}
                    disabled={product.status === "out_of_stock"}
                    variant={product.status === "out_of_stock" ? "secondary" : "primary"}
                  >
                    {product.status === "out_of_stock" ? "Unavailable" : "Add to Cart"}
                  </Button>
                </div>
              </div>
            </SectionCard>
          </motion.article>
        ))}
      </section>
    </div>
  );
}

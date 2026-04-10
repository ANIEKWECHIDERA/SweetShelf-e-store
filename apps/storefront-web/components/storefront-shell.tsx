"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Heart, MessageCircle, Search, ShoppingBag, Star } from "lucide-react";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  Separator,
} from "@sweetshelf/shared-ui";
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
  const featuredProducts = products.slice(0, 3);

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#fefaf4_0%,#fff8ef_32%,#fffdf9_100%)]">
      <div className="bg-[var(--color-brown-900)] px-4 py-3 text-[13px] text-white md:px-8">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-2">
          <p>Freshly baked daily. Same-day pickup and Lagos delivery.</p>
          <p className="text-[var(--color-caramel-200)]">Use code SWEET5 for your first order.</p>
        </div>
      </div>

      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-6 md:px-8 md:py-10">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-[var(--color-muted)]">SweetShelf</p>
            <h1 className="mt-2 font-serif text-4xl text-[var(--color-brown-900)] md:text-5xl">Pastry storefront</h1>
          </div>
          <div className="flex items-center gap-3">
            <a
              className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm text-[var(--color-brown-800)] shadow-[0_12px_32px_rgba(16,24,40,0.06)]"
              href="https://wa.me/2348012345678?text=Hi%2C+I'd+like+to+enquire+about+a+custom+order"
              target="_blank"
              rel="noreferrer"
            >
              <MessageCircle className="size-4 text-[var(--color-caramel-500)]" />
              Custom order
            </a>
            <Link href="/cart">
              <Button variant="dark" className="shadow-[0_16px_36px_rgba(3,8,31,0.18)]">
                <ShoppingBag className="size-4" />
                Cart ({totals.itemCount})
              </Button>
            </Link>
          </div>
        </header>

        <section className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <Card className="overflow-hidden border-0 bg-[radial-gradient(circle_at_top_left,rgba(252,138,6,0.32),transparent_34%),linear-gradient(135deg,#16100d_0%,#1e1612_42%,#30231c_100%)] text-white">
            <CardContent className="grid gap-8 p-6 md:p-8 lg:grid-cols-[1fr_0.72fr] lg:items-end">
              <div className="space-y-5">
                <Badge label="Baked today" variant="on_sale" />
                <div className="space-y-3">
                  <p className="text-sm text-white/72">Layered cakes, soft cookies, dessert boxes, and coffee pairings.</p>
                  <h2 className="max-w-xl font-serif text-4xl leading-tight md:text-6xl">
                    Feast your senses,
                    <span className="text-[var(--color-caramel-200)]"> fast and fresh.</span>
                  </h2>
                  <p className="max-w-xl text-sm leading-7 text-white/72">
                    Inspired by the bright, app-like rhythm of the Figma reference, but tuned for a premium pastry
                    brand with richer surfaces and gentler typography.
                  </p>
                </div>
                <div className="max-w-md rounded-[28px] bg-white/12 p-3 backdrop-blur-sm">
                  <div className="flex flex-col gap-3 sm:flex-row">
                    <div className="min-w-0 flex-1">
                      <Input
                        label="Find a pastry or dessert"
                        placeholder="Search by cake, box, cookies..."
                        className="border-white/20 bg-white/90"
                      />
                    </div>
                    <Button className="sm:self-end">
                      <Search className="size-4" />
                      Search
                    </Button>
                  </div>
                </div>
              </div>
              <div className="relative min-h-[320px] overflow-hidden rounded-[32px] bg-[linear-gradient(180deg,rgba(252,138,6,0.14),rgba(255,255,255,0.02))]">
                <Image
                  src={products[0]?.imageUrls[0] ?? ""}
                  alt={products[0]?.name ?? "Featured pastry"}
                  fill
                  sizes="(max-width: 1024px) 100vw, 30vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(3,8,31,0)_0%,rgba(3,8,31,0.78)_100%)]" />
                <div className="absolute inset-x-4 bottom-4 grid gap-3">
                  {featuredProducts.map((product, index) => (
                    <div
                      key={product.id}
                      className={`rounded-[22px] border border-white/10 bg-white/92 p-4 text-[var(--color-brown-900)] shadow-[0_16px_40px_rgba(16,24,40,0.12)] ${index === 2 ? "hidden sm:block" : ""}`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-xs uppercase tracking-[0.24em] text-[var(--color-muted)]">{product.categoryName}</p>
                          <p className="mt-1 text-sm font-semibold">{product.name}</p>
                        </div>
                        <span className="rounded-full bg-[var(--color-caramel-50)] px-3 py-1 text-xs font-semibold text-[var(--color-caramel-600)]">
                          {formatCurrency(product.price)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-5">
            <Card className="bg-[linear-gradient(135deg,#fff_0%,#fff8eb_100%)]">
              <CardHeader className="pb-4">
                <CardDescription>Cart snapshot</CardDescription>
                <CardTitle className="flex items-center justify-between">
                  <span>{totals.itemCount} items ready</span>
                  <span className="text-[var(--color-caramel-500)]">{formatCurrency(totals.total)}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between rounded-[22px] bg-[var(--color-brown-900)] px-4 py-3 text-white">
                  <span className="inline-flex items-center gap-2 text-sm">
                    <ShoppingBag className="size-4" />
                    Stored locally
                  </span>
                  <span className="text-sm font-semibold">Server-verified at checkout</span>
                </div>
                <Link href="/cart">
                  <Button variant="secondary" fullWidth>
                    Manage Cart
                    <ArrowRight className="size-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="bg-[linear-gradient(135deg,#fff5e4_0%,#fff 100%)]">
              <CardHeader className="pb-4">
                <CardDescription>What to expect</CardDescription>
                <CardTitle>Same-day fulfilment, softer flow.</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-3">
                {[
                  "Browse featured desserts and seasonal collections.",
                  "Adjust your cart before checkout on a dedicated page.",
                  "Keep WhatsApp open for custom cake requests.",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3 rounded-[20px] bg-white px-4 py-3">
                    <div className="flex size-9 items-center justify-center rounded-full bg-[var(--color-caramel-50)]">
                      <Star className="size-4 text-[var(--color-caramel-500)]" />
                    </div>
                    <p className="text-sm text-[var(--color-brown-800)]">{item}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </section>

        <div className="flex gap-3 overflow-x-auto pb-2">
          <Badge label="All treats" variant="new" />
          {categories.map((category) => (
            <Badge key={category.id} label={category.name} variant="on_sale" />
          ))}
        </div>

        <section className="grid gap-4 md:grid-cols-3">
          {featuredProducts.map((product) => (
            <Card key={product.id} className="overflow-hidden bg-[linear-gradient(135deg,#fff_0%,#fff6ea_100%)]">
              <CardContent className="flex items-center gap-4 p-4">
                <div className="relative size-24 overflow-hidden rounded-[24px]">
                  <Image src={product.imageUrls[0]} alt={product.name} fill sizes="96px" className="object-cover" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs uppercase tracking-[0.2em] text-[var(--color-muted)]">{product.categoryName}</p>
                  <p className="mt-1 truncate text-base font-semibold text-[var(--color-brown-900)]">{product.name}</p>
                  <p className="mt-2 text-sm font-semibold text-[var(--color-caramel-500)]">{formatCurrency(product.price)}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </section>

        <section className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {products.map((product, index) => (
            <motion.article
              key={product.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: index * 0.04 }}
            >
              <Card className="group flex h-full flex-col overflow-hidden border-white bg-white/94">
                <Link href={`/products/${product.slug}`} className="group">
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image
                      src={product.imageUrls[0] ?? ""}
                      alt={product.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 25vw"
                      className={`object-cover transition duration-500 ${product.status === "out_of_stock" ? "opacity-50" : "group-hover:scale-110"}`}
                    />
                    <div className="absolute left-4 top-4">
                      <Badge
                        label={product.status === "out_of_stock" ? "Out of stock" : product.tags[0] ?? "In stock"}
                        variant={product.status === "out_of_stock" ? "out_of_stock" : product.tags[0] ?? "in_stock"}
                      />
                    </div>
                    <button
                      type="button"
                      aria-label={`Save ${product.name}`}
                      className="absolute right-4 top-4 flex size-11 items-center justify-center rounded-full bg-white/95 text-[var(--color-caramel-500)] shadow-[0_14px_30px_rgba(16,24,40,0.12)]"
                    >
                      <Heart className="size-4" />
                    </button>
                  </div>
                </Link>
                <CardContent className="flex flex-1 flex-col gap-4 p-5">
                  <div className="space-y-2 pt-5">
                    <p className="text-xs uppercase tracking-[0.25em] text-[var(--color-muted)]">{product.categoryName}</p>
                    <h2 className="text-lg font-semibold text-[var(--color-brown-900)]">{product.name}</h2>
                    <p className="text-sm leading-6 text-[var(--color-muted)]">{product.description}</p>
                  </div>
                  <Separator />
                  <div className="mt-auto flex items-center justify-between gap-4">
                    <div>
                      <p className="text-xs uppercase tracking-[0.25em] text-[var(--color-muted)]">Price</p>
                      <p className="text-lg font-medium text-[var(--color-caramel-500)]">{formatCurrency(product.price)}</p>
                    </div>
                    <Button
                      onClick={() => addItem(product)}
                      disabled={product.status === "out_of_stock"}
                      variant={product.status === "out_of_stock" ? "secondary" : "primary"}
                      size="sm"
                    >
                      {product.status === "out_of_stock" ? "Unavailable" : "Add to Cart"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.article>
          ))}
        </section>
      </div>
    </div>
  );
}

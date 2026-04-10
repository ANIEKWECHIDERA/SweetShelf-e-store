"use client";

import { useSyncExternalStore } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowDown, ArrowRight, Search, ShoppingBag, Sparkles, UserRound } from "lucide-react";
import { Badge, Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Input, Separator } from "@sweetshelf/shared-ui";
import { formatCurrency, mockCustomerProfile, type Category, type Product, type Profile } from "@sweetshelf/shared-types";
import { getCartTotals, useCartStore } from "@/lib/cart-store";

const emptySubscribe = () => () => {};

function getProductBadge(product: Product) {
  if (product.status === "out_of_stock") {
    return { label: "Sold Out", variant: "destructive" as const };
  }

  if (product.tags.includes("on_sale")) {
    return { label: "On Sale", variant: "warning" as const };
  }

  if (product.tags.includes("new")) {
    return { label: "New", variant: "secondary" as const };
  }

  return { label: "In Stock", variant: "success" as const };
}

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
  const featuredProducts = products.slice(0, 4);
  const specialOffers = products.filter((product) => product.tags.includes("on_sale")).slice(0, 3);
  const customerProfile = useSyncExternalStore<Profile | null>(
    emptySubscribe,
    () => (window.localStorage.getItem("sweetshelf-demo-session") === "signed-in" ? mockCustomerProfile : null),
    () => null,
  );

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#fffaf4_0%,#fff7ee_44%,#ffffff_100%)]">
      <div className="bg-[var(--color-brown-900)] px-4 py-3 text-[13px] text-white md:px-8">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-2">
          <p>Fresh pastries, custom cakes, and same-day dessert drop-offs across Lagos.</p>
          <p className="text-[var(--color-caramel-200)]">Special offer: free drink pairing on boxes above NGN 18,000.</p>
        </div>
      </div>

      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-6 md:px-8 md:py-10">
        <header className="rounded-[32px] border border-black/10 bg-white px-5 py-4 shadow-[0_20px_60px_rgba(16,24,40,0.08)] md:px-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <Link href="/" className="font-serif text-3xl italic text-[var(--color-brown-900)]">
              SweetShelf
            </Link>

            <nav className="flex flex-wrap items-center justify-center gap-2 text-sm font-medium text-[var(--color-brown-800)]">
              <Link href="/" className="rounded-full px-4 py-2 transition hover:bg-[var(--color-caramel-50)]">
                Home
              </Link>
              <Link href="#browse-menu" className="rounded-full px-4 py-2 transition hover:bg-[var(--color-caramel-50)]">
                Browse Menu
              </Link>
              <Link href="#special-offers" className="rounded-full px-4 py-2 transition hover:bg-[var(--color-caramel-50)]">
                Special Offers
              </Link>
              <Link href="/account/favourites" className="rounded-full px-4 py-2 transition hover:bg-[var(--color-caramel-50)]">
                Saved
              </Link>
            </nav>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                aria-label="Search menu"
                className="inline-flex size-10 items-center justify-center rounded-full border border-[var(--color-brown-100)] bg-white text-[var(--color-brown-900)] transition hover:bg-[var(--color-caramel-50)]"
              >
                <Search className="size-4" />
              </button>
              <Link href="/cart" className="relative">
                <Button variant="outline" size="icon" aria-label="Open cart">
                  <ShoppingBag className="size-4" />
                </Button>
                <span className="absolute -right-1 -top-1 inline-flex min-w-5 items-center justify-center rounded-full bg-[var(--color-caramel-400)] px-1.5 py-0.5 text-[10px] font-semibold text-white">
                  {totals.itemCount}
                </span>
              </Link>
              {customerProfile ? (
                <Link href="/account/orders">
                  <div className="flex items-center gap-3 rounded-full border border-[var(--color-brown-100)] bg-[var(--color-caramel-50)] px-3 py-2 text-sm text-[var(--color-brown-900)]">
                    <div className="flex size-9 items-center justify-center rounded-full bg-white">
                      <UserRound className="size-4" />
                    </div>
                    <div className="hidden text-left sm:block">
                      <p className="text-xs text-[var(--color-muted)]">Profile</p>
                      <p className="font-medium">{customerProfile.fullName}</p>
                    </div>
                  </div>
                </Link>
              ) : (
                <Link href="/account/favourites">
                  <Button className="px-6">Create Account</Button>
                </Link>
              )}
            </div>
          </div>
        </header>

        <section className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <Card className="overflow-hidden border-0 bg-[radial-gradient(circle_at_top_left,rgba(252,138,6,0.32),transparent_34%),linear-gradient(135deg,#17110d_0%,#251813_48%,#36261e_100%)] text-white">
            <CardContent className="grid gap-8 p-6 md:p-8">
              <div className="space-y-5">
                <Badge variant="warning">Today&apos;s Fresh Picks</Badge>
                <div className="space-y-3">
                  <h1 className="max-w-2xl font-serif text-4xl leading-tight md:text-6xl">
                    Dessert ordering that feels
                    <span className="text-[var(--color-caramel-200)]"> elegant, fast, and gift-worthy.</span>
                  </h1>
                  <p className="max-w-2xl text-sm leading-7 text-white/72 md:text-base">
                    SweetShelf blends custom cakes, curated pastry boxes, and soft-baked favourites into one premium
                    storefront built for quick browsing on every screen.
                  </p>
                </div>
                <div className="grid gap-3 rounded-[28px] bg-white/12 p-4 backdrop-blur-sm md:grid-cols-[1fr_auto]">
                  <div className="space-y-2">
                    <label htmlFor="menu-search" className="text-sm font-medium text-white">
                      Search the menu
                    </label>
                    <Input
                      id="menu-search"
                      placeholder="Try red velvet, latte, tart, pastry box..."
                      className="border-white/20 bg-white/92"
                    />
                  </div>
                  <Button className="self-end">
                    <Search className="size-4" />
                    Explore
                  </Button>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                {featuredProducts.slice(0, 3).map((product) => (
                  <div key={product.id} className="rounded-[24px] border border-white/10 bg-white/10 p-4">
                    <p className="text-xs uppercase tracking-[0.24em] text-white/58">{product.categoryName}</p>
                    <p className="mt-2 text-lg font-semibold">{product.name}</p>
                    <p className="mt-3 text-sm text-white/70">{formatCurrency(product.price)}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-5">
            <Card className="overflow-hidden">
              <div className="relative min-h-[360px]">
                <Image
                  src={products[0]?.imageUrls[0] ?? ""}
                  alt={products[0]?.name ?? "Featured pastry"}
                  fill
                  sizes="(max-width: 1024px) 100vw, 36vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.04)_0%,rgba(28,18,13,0.74)_100%)]" />
                <div className="absolute inset-x-5 bottom-5 rounded-[28px] bg-white/92 p-5 shadow-[0_18px_50px_rgba(16,24,40,0.14)] backdrop-blur-sm">
                  <Badge variant="secondary">Chef&apos;s Favourite</Badge>
                  <h2 className="mt-3 font-serif text-3xl text-[var(--color-brown-900)]">{products[0]?.name}</h2>
                  <p className="mt-2 text-sm leading-6 text-[var(--color-muted)]">{products[0]?.description}</p>
                  <div className="mt-4 flex items-center justify-between gap-4">
                    <p className="text-lg font-semibold text-[var(--color-caramel-500)]">
                      {formatCurrency(products[0]?.price ?? 0)}
                    </p>
                    <Link href={`/products/${products[0]?.slug ?? ""}`}>
                      <Button variant="outline">
                        View Product
                        <ArrowRight className="size-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </Card>

            <div className="grid grid-cols-[80px_1fr_1fr_64px] overflow-hidden rounded-[18px] bg-[#0d9447] text-white shadow-[0_18px_45px_rgba(13,148,71,0.22)]">
              <div className="flex items-center justify-center border-r border-white/15 px-3 py-4">
                <ShoppingBag className="size-8" />
              </div>
              <div className="flex flex-col justify-center border-r border-white/15 px-4 py-4">
                <span className="text-xs uppercase tracking-[0.2em] text-white/68">Items</span>
                <span className="text-lg font-semibold">{totals.itemCount}</span>
              </div>
              <div className="flex flex-col justify-center border-r border-white/15 px-4 py-4">
                <span className="text-xs uppercase tracking-[0.2em] text-white/68">Cart Total</span>
                <span className="text-lg font-semibold">{formatCurrency(totals.total)}</span>
              </div>
              <Link href="/cart" className="flex items-center justify-center transition hover:bg-white/10" aria-label="Manage cart">
                <ArrowDown className="size-6" />
              </Link>
            </div>
          </div>
        </section>

        <section id="special-offers" className="grid gap-4 md:grid-cols-3">
          {specialOffers.map((product) => (
            <Card key={product.id} className="overflow-hidden bg-[linear-gradient(135deg,#fff_0%,#fff4e2_100%)]">
              <CardContent className="flex items-center gap-4 p-4">
                <div className="relative size-24 overflow-hidden rounded-[22px]">
                  <Image src={product.imageUrls[0]} alt={product.name} fill sizes="96px" className="object-cover" />
                </div>
                <div className="min-w-0 flex-1">
                  <Badge variant="warning">On Sale</Badge>
                  <p className="mt-3 truncate text-base font-semibold text-[var(--color-brown-900)]">{product.name}</p>
                  <p className="mt-2 text-sm font-semibold text-[var(--color-caramel-500)]">{formatCurrency(product.price)}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </section>

        <section className="space-y-5" id="browse-menu">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.32em] text-[var(--color-muted)]">Browse Menu</p>
              <h2 className="mt-2 font-serif text-4xl text-[var(--color-brown-900)]">Curated for gifting, cravings, and celebrations.</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline">All Treats</Badge>
              {categories.map((category) => (
                <Badge key={category.id} variant="outline">
                  {category.name}
                </Badge>
              ))}
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {products.map((product, index) => {
              const badge = getProductBadge(product);

              return (
                <motion.article
                  key={product.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25, delay: index * 0.04 }}
                >
                  <Card className="group flex h-full flex-col overflow-hidden border-white bg-white/96">
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
                          <Badge variant={badge.variant}>{badge.label}</Badge>
                        </div>
                      </div>
                    </Link>
                    <CardContent className="flex flex-1 flex-col gap-4 p-5">
                      <div className="space-y-2 pt-3">
                        <p className="text-xs uppercase tracking-[0.25em] text-[var(--color-muted)]">{product.categoryName}</p>
                        <h3 className="text-lg font-semibold text-[var(--color-brown-900)]">{product.name}</h3>
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
                          variant={product.status === "out_of_stock" ? "secondary" : "default"}
                          size="sm"
                        >
                          {product.status === "out_of_stock" ? "Unavailable" : "Add to Cart"}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.article>
              );
            })}
          </div>
        </section>

        <Card className="border-0 bg-[linear-gradient(135deg,#fff6e8_0%,#fff 100%)]">
          <CardHeader>
            <CardDescription>Need a custom cake or event order?</CardDescription>
            <CardTitle className="font-serif text-3xl font-normal">Keep WhatsApp open for the final handoff.</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-sm text-[var(--color-brown-800)]">
              <Sparkles className="size-4 text-[var(--color-caramel-500)]" />
              We handle message toppers, event trays, and bigger pre-orders there.
            </div>
            <a
              className="inline-flex items-center gap-2 rounded-full bg-[var(--color-brown-900)] px-5 py-3 text-sm font-medium text-white"
              href="https://wa.me/2348012345678?text=Hi%2C+I'd+like+to+enquire+about+a+custom+order"
              target="_blank"
              rel="noreferrer"
            >
              Chat on WhatsApp
              <ArrowRight className="size-4" />
            </a>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

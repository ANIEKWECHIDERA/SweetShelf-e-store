"use client";

import { useSyncExternalStore, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, ShoppingBag, UserRound, X } from "lucide-react";
import { Button } from "@sweetshelf/shared-ui";
import { formatCurrency, mockCustomerProfile, type Profile } from "@sweetshelf/shared-types";
import { getCartTotals, useCartStore } from "@/lib/cart-store";

function subscribeToCustomerProfile(onStoreChange: () => void) {
  const handleStorage = () => onStoreChange();

  window.addEventListener("storage", handleStorage);
  window.addEventListener("focus", handleStorage);

  return () => {
    window.removeEventListener("storage", handleStorage);
    window.removeEventListener("focus", handleStorage);
  };
}

function getSnapshotProfile() {
  return window.localStorage.getItem("sweetshelf-demo-session") === "signed-in" ? mockCustomerProfile : null;
}

function matchesPath(pathname: string, href: string) {
  if (href === "/") {
    return pathname === "/";
  }

  return pathname.startsWith(href);
}

export function StorefrontNav() {
  const pathname = usePathname();
  const items = useCartStore((state) => state.items);
  const totals = getCartTotals(items);
  const customerProfile = useSyncExternalStore<Profile | null>(subscribeToCustomerProfile, getSnapshotProfile, () => null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/browse-menu", label: "Browse Menu" },
    { href: "/special-offers", label: "Special Offers" },
    { href: "/track-order", label: "Track Order" },
  ];

  return (
    <>
      <div className="bg-[var(--color-brown-900)] px-4 py-3 text-[13px] text-white md:px-8">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-2">
          <p>Fresh pastries, custom cakes, and same-day dessert drop-offs across Lagos.</p>
          <p className="text-[var(--color-caramel-200)]">Special offer: free drink pairing on boxes above NGN 18,000.</p>
        </div>
      </div>

      <div className="mx-auto w-full max-w-7xl px-4 pt-6 md:px-8 md:pt-8">
        <header className="sticky top-4 z-30 rounded-[18px] border border-black/10 bg-white/95 px-4 py-4 shadow-[0_20px_60px_rgba(16,24,40,0.08)] backdrop-blur md:px-6">
          <div className="flex items-center justify-between gap-4">
            <Link href="/" className="font-serif text-3xl italic text-[var(--color-brown-900)]">
              SweetShelf
            </Link>

            <nav className="hidden items-center justify-center gap-2 text-sm font-medium text-[var(--color-brown-800)] lg:flex">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`rounded-[14px] px-4 py-2 transition ${
                    matchesPath(pathname, item.href)
                      ? "bg-[var(--color-brown-900)] text-white"
                      : "hover:bg-[var(--color-caramel-50)]"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
              {customerProfile ? (
                <Link
                  href="/account/favourites"
                  className={`rounded-[14px] px-4 py-2 transition ${
                    matchesPath(pathname, "/account/favourites")
                      ? "bg-[var(--color-brown-900)] text-white"
                      : "hover:bg-[var(--color-caramel-50)]"
                  }`}
                >
                  Saved Items
                </Link>
              ) : null}
            </nav>

            <div className="hidden items-center gap-3 md:flex">
              <motion.div layout transition={{ type: "spring", stiffness: 240, damping: 22 }}>
                <AnimatePresence mode="wait" initial={false}>
                  {totals.itemCount > 0 ? (
                    <motion.div
                      key="cart-expanded"
                      initial={{ opacity: 0, width: 72 }}
                      animate={{ opacity: 1, width: "auto" }}
                      exit={{ opacity: 0, width: 72 }}
                    >
                      <Link
                        href="/cart"
                        className="grid grid-cols-[48px_1fr_1fr] overflow-hidden rounded-[14px] bg-[#0d9447] text-white shadow-[0_18px_45px_rgba(13,148,71,0.18)]"
                        aria-label="Open cart"
                      >
                        <div className="flex items-center justify-center border-r border-white/15 px-3 py-3">
                          <ShoppingBag className="size-5" />
                        </div>
                        <div className="flex min-w-[84px] flex-col justify-center border-r border-white/15 px-3 py-2">
                          <span className="text-[10px] uppercase tracking-[0.16em] text-white/70">Items</span>
                          <span className="text-sm font-semibold">{totals.itemCount}</span>
                        </div>
                        <div className="flex min-w-[100px] flex-col justify-center px-3 py-2">
                          <span className="text-[10px] uppercase tracking-[0.16em] text-white/70">Total</span>
                          <span className="text-sm font-semibold">{formatCurrency(totals.total)}</span>
                        </div>
                      </Link>
                    </motion.div>
                  ) : (
                    <motion.div key="cart-icon" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                      <Link href="/cart">
                        <Button variant="outline" size="icon" aria-label="Open cart">
                          <ShoppingBag className="size-4" />
                        </Button>
                      </Link>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>

              {customerProfile ? (
                <Link href="/account/orders">
                  <div className="flex items-center gap-3 rounded-[14px] border border-[var(--color-brown-100)] bg-[var(--color-caramel-50)] px-3 py-2 text-sm text-[var(--color-brown-900)]">
                    <div className="flex size-9 items-center justify-center rounded-[12px] bg-white">
                      <UserRound className="size-4" />
                    </div>
                    <div className="hidden text-left xl:block">
                      <p className="text-xs text-[var(--color-muted)]">Profile</p>
                      <p className="font-medium">{customerProfile.fullName}</p>
                    </div>
                  </div>
                </Link>
              ) : (
                <Link href="/account/favourites">
                  <Button className="rounded-[14px] px-5">Create Account</Button>
                </Link>
              )}
            </div>

            <button
              type="button"
              aria-label={isMobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
              className="inline-flex size-11 items-center justify-center rounded-[14px] border border-[var(--color-brown-100)] bg-white text-[var(--color-brown-900)] lg:hidden"
              onClick={() => setIsMobileMenuOpen((current) => !current)}
            >
              {isMobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>

          <AnimatePresence>
            {isMobileMenuOpen ? (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden lg:hidden"
              >
                <div className="mt-4 grid gap-3 border-t border-[var(--color-brown-100)] pt-4">
                  <div className="grid gap-2">
                    {navItems.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`rounded-[14px] px-4 py-3 text-sm font-medium transition ${
                          matchesPath(pathname, item.href)
                            ? "bg-[var(--color-brown-900)] text-white"
                            : "bg-[var(--color-cream)] text-[var(--color-brown-800)]"
                        }`}
                      >
                        {item.label}
                      </Link>
                    ))}
                    {customerProfile ? (
                      <Link
                        href="/account/favourites"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`rounded-[14px] px-4 py-3 text-sm font-medium transition ${
                          matchesPath(pathname, "/account/favourites")
                            ? "bg-[var(--color-brown-900)] text-white"
                            : "bg-[var(--color-cream)] text-[var(--color-brown-800)]"
                        }`}
                      >
                        Saved Items
                      </Link>
                    ) : null}
                  </div>
                  <div className="flex items-center gap-3">
                    <Link href="/cart" className="flex-1" onClick={() => setIsMobileMenuOpen(false)}>
                      <Button variant={totals.itemCount > 0 ? "secondary" : "outline"} fullWidth className="rounded-[14px]">
                        <ShoppingBag className="size-4" />
                        {totals.itemCount > 0 ? `${totals.itemCount} items · ${formatCurrency(totals.total)}` : "Cart"}
                      </Button>
                    </Link>
                    {customerProfile ? (
                      <Link href="/account/orders" onClick={() => setIsMobileMenuOpen(false)}>
                        <Button variant="outline" size="icon" className="rounded-[14px]">
                          <UserRound className="size-4" />
                        </Button>
                      </Link>
                    ) : (
                      <Link href="/account/favourites" onClick={() => setIsMobileMenuOpen(false)} className="flex-1">
                        <Button fullWidth className="rounded-[14px]">Create Account</Button>
                      </Link>
                    )}
                  </div>
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </header>
      </div>
    </>
  );
}

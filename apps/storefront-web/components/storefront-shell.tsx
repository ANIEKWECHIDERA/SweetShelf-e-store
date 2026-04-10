"use client";

import {
  startTransition,
  useDeferredValue,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Menu,
  Minus,
  PackageSearch,
  Plus,
  Search,
  ShoppingBag,
  Sparkles,
  Star,
  UserRound,
  X,
} from "lucide-react";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
} from "@sweetshelf/shared-ui";
import {
  formatCurrency,
  mockCustomerProfile,
  mockOrders,
  type Category,
  type Product,
  type Profile,
} from "@sweetshelf/shared-types";
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
  return window.localStorage.getItem("sweetshelf-demo-session") === "signed-in"
    ? mockCustomerProfile
    : null;
}

function getProductBadge(product: Product) {
  if (product.status === "out_of_stock") {
    return {
      label: "Sold Out",
      variant: "destructive" as const,
      className: "bg-[#fff1f1] text-[#c2410c] before:bg-[#c2410c]",
    };
  }

  if (product.tags.includes("on_sale")) {
    return {
      label: "On Sale",
      variant: "warning" as const,
      className: "bg-[#fff3dc] text-[#c67d1c] before:bg-[#c67d1c]",
    };
  }

  if (product.tags.includes("new")) {
    return {
      label: "New",
      variant: "secondary" as const,
      className: "bg-[#ffe7f1] text-[#c0267d] before:bg-[#c0267d]",
    };
  }

  return {
    label: "In Stock",
    variant: "success" as const,
    className: "bg-[#e9f7ef] text-[#157347] before:bg-[#157347]",
  };
}

function matchesPath(pathname: string, href: string) {
  if (href === "/") {
    return pathname === "/";
  }

  return pathname.startsWith(href);
}

function ProductImage({
  src,
  alt,
  sizes,
  className,
}: {
  src: string;
  alt: string;
  sizes: string;
  className?: string;
}) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  return (
    <>
      {!isLoaded ? (
        <div className="absolute inset-0 animate-pulse bg-[linear-gradient(135deg,#f6ede2_0%,#fff8ef_52%,#eadbc9_100%)]" />
      ) : null}
      {hasError ? (
        <div className="absolute inset-0 bg-[linear-gradient(135deg,#f8efe4_0%,#fff9f1_100%)]">
          <Image
            src="/dessert-placeholder.svg"
            alt="Dessert illustration placeholder"
            fill
            sizes={sizes}
            className="object-contain p-6 opacity-90"
          />
        </div>
      ) : (
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          loading="lazy"
          onLoad={() => setIsLoaded(true)}
          onError={() => {
            setIsLoaded(true);
            setHasError(true);
          }}
          className={className}
        />
      )}
    </>
  );
}

export function StorefrontShell({
  categories,
  products,
  mode = "home",
  initialQuery = "",
  initialTrackReference = "",
  initialCategory = "",
}: {
  categories: Category[];
  products: Product[];
  mode?: "home" | "browse" | "offers" | "track";
  initialQuery?: string;
  initialTrackReference?: string;
  initialCategory?: string;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const items = useCartStore((state) => state.items);
  const addItem = useCartStore((state) => state.addItem);
  const cartTotals = getCartTotals(items);
  const customerProfile = useSyncExternalStore<Profile | null>(
    subscribeToCustomerProfile,
    getSnapshotProfile,
    () => null,
  );
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const specialOffers = products.filter((product) =>
    product.tags.includes("on_sale"),
  );
  const [query, setQuery] = useState(initialQuery);
  const [trackReference, setTrackReference] = useState(initialTrackReference);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedQuantities, setSelectedQuantities] = useState<
    Record<string, number>
  >({});
  const [cartNotice, setCartNotice] = useState<{
    productName: string;
    quantity: number;
  } | null>(null);
  const cartNoticeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const browseListRef = useRef<HTMLElement | null>(null);
  const offersListRef = useRef<HTMLElement | null>(null);
  const deferredQuery = useDeferredValue(query);
  const pageSize = 9;
  const searchableProducts = mode === "offers" ? specialOffers : products;
  const navItems = useMemo(
    () => [
      { href: "/", label: "Home" },
      { href: "/browse-menu", label: "Browse Menu" },
      { href: "/special-offers", label: "Special Offers" },
      { href: "/track-order", label: "Track Order" },
    ],
    [],
  );

  const searchSuggestions = useMemo(() => {
    const normalized = deferredQuery.trim().toLowerCase();

    if (!normalized) {
      return [];
    }

    return searchableProducts
      .filter((product) => {
        const haystack =
          `${product.name} ${product.categoryName} ${product.description}`.toLowerCase();
        return haystack.includes(normalized);
      })
      .slice(0, 5);
  }, [deferredQuery, searchableProducts]);

  const filteredProducts = useMemo(() => {
    const normalized = deferredQuery.trim().toLowerCase();

    return products.filter((product) => {
      const haystack =
        `${product.name} ${product.categoryName} ${product.description}`.toLowerCase();
      const matchesQuery = normalized ? haystack.includes(normalized) : true;
      const matchesCategory = selectedCategory
        ? product.categoryId === selectedCategory
        : true;
      return matchesQuery && matchesCategory;
    });
  }, [deferredQuery, products, selectedCategory]);

  const trackedOrder = useMemo(() => {
    const normalized = trackReference.trim().toLowerCase();

    if (!normalized) {
      return null;
    }

    return mockOrders.find(
      (order) =>
        order.paymentReference.toLowerCase() === normalized ||
        order.id.toLowerCase() === normalized,
    );
  }, [trackReference]);

  const bestSellerProducts = useMemo(
    () =>
      products.filter((product) => product.status === "in_stock").slice(0, 3),
    [products],
  );

  const filteredSpecialOffers = useMemo(() => {
    const normalized = deferredQuery.trim().toLowerCase();

    return specialOffers.filter((product) => {
      const haystack =
        `${product.name} ${product.categoryName} ${product.description}`.toLowerCase();
      return normalized ? haystack.includes(normalized) : true;
    });
  }, [deferredQuery, specialOffers]);

  const browsePageCount = Math.max(
    1,
    Math.ceil(filteredProducts.length / pageSize),
  );
  const safeBrowsePage = Math.min(currentPage, browsePageCount);
  const paginatedBrowseProducts = filteredProducts.slice(
    (safeBrowsePage - 1) * pageSize,
    safeBrowsePage * pageSize,
  );

  const offersPageCount = Math.max(
    1,
    Math.ceil(filteredSpecialOffers.length / pageSize),
  );
  const safeOffersPage = Math.min(currentPage, offersPageCount);
  const paginatedOffers = filteredSpecialOffers.slice(
    (safeOffersPage - 1) * pageSize,
    safeOffersPage * pageSize,
  );

  function pushBrowseParams(nextQuery: string, nextCategory: string) {
    const nextParams = new URLSearchParams();
    if (nextQuery.trim()) {
      nextParams.set("query", nextQuery.trim());
    }
    if (nextCategory) {
      nextParams.set("category", nextCategory);
    }
    const nextHref =
      nextParams.size > 0
        ? `/browse-menu?${nextParams.toString()}`
        : "/browse-menu";
    startTransition(() => router.push(nextHref));
  }

  function handleExplore() {
    setCurrentPage(1);
    pushBrowseParams(query, selectedCategory);
  }

  function handleCategorySelect(categoryId: string) {
    const nextCategory = selectedCategory === categoryId ? "" : categoryId;
    setSelectedCategory(nextCategory);
    setCurrentPage(1);

    if (mode === "browse") {
      pushBrowseParams(query, nextCategory);
    }
  }

  function getSelectedQuantity(product: Product) {
    return selectedQuantities[product.id] ?? 1;
  }

  function updateSelectedQuantity(product: Product, nextQuantity: number) {
    const maxQuantity = Math.max(1, product.stockQuantity || 1);
    const safeQuantity = Math.min(maxQuantity, Math.max(1, nextQuantity));
    setSelectedQuantities((current) => ({
      ...current,
      [product.id]: safeQuantity,
    }));
  }

  function triggerCartNotice(productName: string, quantity: number) {
    if (cartNoticeTimer.current) {
      clearTimeout(cartNoticeTimer.current);
    }

    setCartNotice({ productName, quantity });
    cartNoticeTimer.current = setTimeout(() => {
      setCartNotice(null);
      cartNoticeTimer.current = null;
    }, 2200);
  }

  function handleQuickAdd(
    product: Product,
    quantity: number,
    event?: React.MouseEvent<HTMLButtonElement>,
  ) {
    event?.preventDefault();
    event?.stopPropagation();
    addItem(product, quantity);
    triggerCartNotice(product.name, quantity);
  }

  function handleQueryChange(nextQuery: string) {
    setQuery(nextQuery);
    setCurrentPage(1);
  }

  function renderPagination(page: number, pageCount: number) {
    function handlePageChange(nextPage: number) {
      setCurrentPage(nextPage);

      const targetRef = mode === "offers" ? offersListRef : browseListRef;
      requestAnimationFrame(() => {
        targetRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      });
    }

    if (pageCount <= 1) {
      return null;
    }

    return (
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-[22px] border border-[var(--color-brown-100)] bg-white px-4 py-4 sm:gap-5 sm:px-6 sm:py-5 lg:gap-6 lg:px-8 lg:py-6">
        <p className="text-sm text-[var(--color-muted)] sm:text-base">
          Page{" "}
          <span className="font-semibold text-[var(--color-brown-900)]">
            {page}
          </span>{" "}
          of{" "}
          <span className="font-semibold text-[var(--color-brown-900)]">
            {pageCount}
          </span>
        </p>
        <div className="flex items-center gap-2">
          {page > 1 ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(Math.max(1, page - 1))}
            >
              <ChevronLeft className="size-4" />
              Previous
            </Button>
          ) : null}
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(Math.min(pageCount, page + 1))}
            disabled={page === pageCount}
          >
            Next
            <ChevronRight className="size-4" />
          </Button>
        </div>
      </div>
    );
  }

  function renderSearchBlock() {
    return (
      <div className="relative rounded-[24px] bg-white/12 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
        <div className="grid gap-3 md:grid-cols-[1fr_auto]">
          <div className="space-y-2">
            <Input
              id="menu-search"
              value={query}
              onChange={(event) => handleQueryChange(event.target.value)}
              placeholder="Try red velvet, latte, tart, pastry box..."
              className="rounded-[24px] border-white/15 bg-[#fff4e6] text-[var(--color-brown-900)] placeholder:text-[var(--color-brown-800)]"
            />
          </div>
          <Button className="self-end rounded-full" onClick={handleExplore}>
            <Search className="size-4" />
            Explore Menu
          </Button>
        </div>

        <AnimatePresence>
          {deferredQuery.trim() ? (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className="absolute inset-x-4 top-[calc(100%-8px)] z-20 rounded-[18px] border border-white/15 bg-[#fff7ee] p-2 text-[var(--color-brown-900)] shadow-[0_22px_55px_rgba(16,24,40,0.18)]"
            >
              {searchSuggestions.length > 0 ? (
                searchSuggestions.map((product) => (
                  <Link
                    key={product.id}
                    href={`/products/${product.slug}`}
                    className="flex items-center justify-between rounded-[14px] px-3 py-3 transition hover:bg-white"
                  >
                    <div>
                      <p className="text-sm font-semibold">{product.name}</p>
                      <p className="text-xs text-[var(--color-muted)]">
                        {product.categoryName}
                      </p>
                    </div>
                    <span className="text-sm font-medium text-[var(--color-caramel-500)]">
                      {formatCurrency(product.price)}
                    </span>
                  </Link>
                ))
              ) : (
                <div className="rounded-[14px] px-3 py-4 text-sm text-[var(--color-muted)]">
                  No pastries match that search yet. Try another dessert,
                  category, or shorter keyword.
                </div>
              )}
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    );
  }

  function renderQuantityPicker(product: Product) {
    const quantity = getSelectedQuantity(product);
    const isOutOfStock = product.status === "out_of_stock";

    return (
      <div className="flex items-center gap-2">
        {quantity > 1 ? (
          <button
            type="button"
            aria-label={`Decrease ${product.name} quantity`}
            className="flex size-10 items-center justify-center rounded-full border border-[var(--color-brown-100)] bg-white text-[var(--color-brown-900)] shadow-[0_4px_10px_rgba(16,24,40,0.05)]"
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              updateSelectedQuantity(product, quantity - 1);
            }}
            disabled={isOutOfStock}
          >
            <Minus className="size-4" />
          </button>
        ) : (
          <div className="size-10" aria-hidden="true" />
        )}
        <div className="flex h-10 min-w-12 items-center justify-center rounded-full bg-[var(--color-caramel-50)] px-3 text-sm font-semibold text-[var(--color-brown-900)]">
          {quantity}
        </div>
        <button
          type="button"
          aria-label={`Increase ${product.name} quantity`}
          className="flex size-10 items-center justify-center rounded-full border border-[var(--color-brown-100)] bg-white text-[var(--color-brown-900)] shadow-[0_4px_10px_rgba(16,24,40,0.05)]"
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            updateSelectedQuantity(product, quantity + 1);
          }}
          disabled={
            isOutOfStock || quantity >= Math.max(1, product.stockQuantity || 1)
          }
        >
          <Plus className="size-4" />
        </button>
      </div>
    );
  }

  function renderProductGrid(list: Product[]) {
    if (list.length === 0) {
      return (
        <Card className="border-dashed border-[var(--color-brown-100)] bg-[linear-gradient(135deg,#fffaf4_0%,#ffffff_100%)]">
          <CardContent className="flex flex-col items-center gap-3 px-6 py-14 text-center">
            <PackageSearch className="size-10 text-[var(--color-caramel-500)]" />
            <h3 className="font-serif text-3xl text-[var(--color-brown-900)]">
              Nothing matches this selection yet.
            </h3>
            <p className="max-w-xl text-sm leading-7 text-[var(--color-muted)]">
              Try a different search phrase, switch categories, or clear the
              filter to see the full SweetShelf menu.
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setQuery("");
                setSelectedCategory("");
                if (mode === "browse") {
                  pushBrowseParams("", "");
                }
              }}
            >
              Reset filters
            </Button>
          </CardContent>
        </Card>
      );
    }

    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 lg:gap-6">
        {list.map((product, index) => {
          const badge = getProductBadge(product);
          const isOutOfStock = product.status === "out_of_stock";

          return (
            <motion.article
              key={product.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: index * 0.04 }}
            >
              <Card className="group flex h-full flex-col overflow-hidden border-[#ebe2d8] bg-white shadow-[0_14px_34px_rgba(16,24,40,0.06)]">
                <Link href={`/products/${product.slug}`} className="group">
                  <div className="relative aspect-[4/3] overflow-hidden border-b border-[#f1e8de] bg-[#fffaf4]">
                    <ProductImage
                      src={product.imageUrls[0] ?? ""}
                      alt={product.name}
                      sizes="(max-width: 768px) 100vw, 25vw"
                      className={`object-cover transition duration-500 ${product.status === "out_of_stock" ? "opacity-55" : "group-hover:scale-105"}`}
                    />
                    <div className="absolute left-4 top-4">
                      <Badge
                        variant={badge.variant}
                        className={`shadow-[0_8px_18px_rgba(16,24,40,0.08)] ${badge.className}`}
                      >
                        {badge.label}
                      </Badge>
                    </div>
                  </div>
                </Link>
                <CardContent className="flex flex-1 flex-col gap-4 p-5">
                  <div className="space-y-2">
                    <p className="text-xs uppercase tracking-[0.22em] text-[var(--color-muted)]">
                      {product.categoryName}
                    </p>
                    <h3 className="line-clamp-2 min-h-[3.5rem] text-base font-semibold leading-7 text-[var(--color-brown-900)]">
                      {product.name}
                    </h3>
                    <p className="line-clamp-2 text-sm leading-6 text-[var(--color-muted)]">
                      {product.description}
                    </p>
                  </div>
                  <div className="mt-auto space-y-4">
                    <div className="flex items-end justify-between gap-4">
                      <div>
                        <p className="text-xl font-semibold text-[var(--color-caramel-500)]">
                          {formatCurrency(product.price)}
                        </p>
                        <p className="text-xs text-[var(--color-sage-600)]">
                          {isOutOfStock
                            ? "Currently unavailable"
                            : "Available today"}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 rounded-full bg-[var(--color-caramel-50)] px-2 py-1 text-[11px] text-[var(--color-brown-800)]">
                        <Star className="size-3 fill-[var(--color-caramel-400)] text-[var(--color-caramel-400)]" />
                        4.9
                      </div>
                    </div>
                    {!isOutOfStock ? (
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        {renderQuantityPicker(product)}
                        <Button
                          type="button"
                          onClick={(event) =>
                            handleQuickAdd(
                              product,
                              getSelectedQuantity(product),
                              event,
                            )
                          }
                          size="sm"
                          className="justify-center rounded-full p-2 w-1/2"
                        >
                          {`Add ${getSelectedQuantity(product)}`}
                        </Button>
                      </div>
                    ) : null}
                  </div>
                </CardContent>
              </Card>
            </motion.article>
          );
        })}
      </div>
    );
  }

  function renderPageContent() {
    if (mode === "browse") {
      return (
        <section ref={browseListRef} className="space-y-4 sm:space-y-5 lg:space-y-6">
          <div className="space-y-3">
            <Badge variant="secondary">Browse Menu</Badge>
            <h1 className="font-serif text-xl text-[var(--color-brown-900)] sm:text-2xl lg:text-3xl">
              Everything currently on the SweetShelf menu.
            </h1>
            <p className="max-w-2xl text-sm leading-7 text-[var(--color-muted)] sm:text-base">
              Browse by craving, celebration, or gifting mood. Search
              suggestions stay live while you type.
            </p>
          </div>
          {renderSearchBlock()}
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => handleCategorySelect("")}
              className={`rounded-full border px-3 py-2 text-xs font-medium shadow-sm transition ${
                !selectedCategory
                  ? "border-[var(--color-brown-900)] bg-[var(--color-brown-900)] text-white"
                  : "border-[var(--color-brown-100)] bg-white text-[var(--color-brown-800)] hover:bg-[var(--color-caramel-50)]"
              }`}
            >
              All Treats
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                type="button"
                onClick={() => handleCategorySelect(category.id)}
                className={`rounded-full border px-3 py-2 text-xs font-medium shadow-sm transition ${
                  selectedCategory === category.id
                    ? "border-[var(--color-brown-900)] bg-[var(--color-brown-900)] text-white"
                    : "border-[var(--color-brown-100)] bg-white text-[var(--color-brown-800)] hover:bg-[var(--color-caramel-50)]"
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
          {renderProductGrid(paginatedBrowseProducts)}
          {renderPagination(safeBrowsePage, browsePageCount)}
        </section>
      );
    }

    if (mode === "offers") {
      return (
        <section ref={offersListRef} className="space-y-4 sm:space-y-5 lg:space-y-6">
          <div className="space-y-3">
            <Badge variant="warning">Special Offers</Badge>
            <h1 className="font-serif text-xl text-[var(--color-brown-900)] sm:text-2xl lg:text-3xl">
              Current offers, bundles, and sweeter-value picks.
            </h1>
            <p className="max-w-2xl text-sm leading-7 text-[var(--color-muted)] sm:text-base">
              These are the products with promo pricing or spotlight positioning
              right now.
            </p>
          </div>
          {renderSearchBlock()}
          {renderProductGrid(paginatedOffers)}
          {renderPagination(safeOffersPage, offersPageCount)}
        </section>
      );
    }

    if (mode === "track") {
      return (
        <section className="space-y-4 sm:space-y-5 lg:space-y-6">
          <Card className="relative overflow-hidden border-0 bg-[radial-gradient(circle_at_top_left,rgba(252,138,6,0.28),transparent_34%),linear-gradient(135deg,#17110d_0%,#251813_48%,#36261e_100%)] text-white">
            <Image
              src="/dessert-outline.svg"
              alt=""
              width={280}
              height={280}
              aria-hidden="true"
              className="pointer-events-none absolute -right-8 top-8 opacity-25"
            />
            <CardContent className="relative grid gap-8 p-6 md:p-8">
              <div className="space-y-4">
                <Badge
                  variant="warning"
                  className="border-[rgba(255,255,255,0.1)] bg-[#ffe2b9] text-[#3c2513] before:bg-[#7e4d14]"
                >
                  Track Order
                </Badge>
                <div className="space-y-3">
                  <h1 className="max-w-2xl font-serif text-xl leading-tight sm:text-2xl lg:text-3xl">
                    Follow your order with the same calm, premium flow.
                  </h1>
                  <p className="max-w-2xl text-sm leading-7 text-[#f7e7d4] sm:text-base">
                    Enter your payment reference or order ID to see the latest
                    SweetShelf status, payment state, and item breakdown.
                  </p>
                </div>
              </div>

              <div className="rounded-[24px] bg-white/12 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
                <div className="grid gap-3 md:grid-cols-[1fr_auto]">
                  <Input
                    id="track-reference"
                    value={trackReference}
                    onChange={(event) => setTrackReference(event.target.value)}
                    placeholder="Try pay_demo_001 or order-demo-001"
                    className="rounded-[24px] border-white/15 bg-[#fff4e6] text-[var(--color-brown-900)] placeholder:text-[var(--color-brown-800)]"
                  />
                  <Button>
                    <PackageSearch className="size-4" />
                    Track Order
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          {trackReference.trim() ? (
            trackedOrder ? (
              <Card className="overflow-hidden border-0 bg-[linear-gradient(135deg,#fff7ee_0%,#fff_100%)]">
                <CardHeader>
                  <CardDescription>Order located</CardDescription>
                  <CardTitle className="font-serif text-3xl font-normal">
                    #{trackedOrder.id}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 lg:gap-6">
                    <div className="rounded-[14px] bg-[var(--color-brown-50)] p-4">
                      <p className="text-xs uppercase tracking-[0.2em] text-[var(--color-muted)]">
                        Status
                      </p>
                      <p className="mt-2 text-base font-semibold capitalize text-[var(--color-brown-900)]">
                        {trackedOrder.status}
                      </p>
                    </div>
                    <div className="rounded-[14px] bg-[var(--color-brown-50)] p-4">
                      <p className="text-xs uppercase tracking-[0.2em] text-[var(--color-muted)]">
                        Payment
                      </p>
                      <p className="mt-2 text-base font-semibold capitalize text-[var(--color-brown-900)]">
                        {trackedOrder.paymentStatus}
                      </p>
                    </div>
                    <div className="rounded-[14px] bg-[var(--color-brown-50)] p-4">
                      <p className="text-xs uppercase tracking-[0.2em] text-[var(--color-muted)]">
                        Total
                      </p>
                      <p className="mt-2 text-base font-semibold text-[var(--color-brown-900)]">
                        {formatCurrency(trackedOrder.total)}
                      </p>
                    </div>
                  </div>
                    <div className="space-y-4 sm:space-y-5 lg:space-y-6">
                    {trackedOrder.items.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between text-sm"
                      >
                        <span>
                          {item.productName} x {item.quantity}
                        </span>
                        <span>{formatCurrency(item.subtotal)}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="overflow-hidden border-0 bg-[linear-gradient(135deg,#fff7ee_0%,#fff_100%)]">
                <CardContent className="p-6 text-sm text-[var(--color-muted)]">
                  No order matched that reference yet. Try the seeded demo value
                  `pay_demo_001`.
                </CardContent>
              </Card>
            )
          ) : null}
        </section>
      );
    }

    const heroImageProduct =
      products.find((product) => product.categoryId === "cat-cakes") ??
      products[0];

    return (
      <>
        <section>
          <Card className="relative overflow-hidden border-0 bg-[radial-gradient(circle_at_top_left,rgba(252,138,6,0.32),transparent_34%),linear-gradient(135deg,#17110d_0%,#251813_48%,#36261e_100%)] text-white">
            <Image
              src="/dessert-outline.svg"
              alt=""
              width={320}
              height={320}
              aria-hidden="true"
              className="pointer-events-none absolute -right-10 bottom-6 opacity-20"
            />
            <CardContent className="grid gap-8 p-6 md:p-8">
              <div className="grid gap-4 sm:gap-5 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-6">
                <div className="space-y-5">
                  <Badge
                    variant="warning"
                    className="border-[rgba(255,255,255,0.1)] bg-[#ffe2b9] text-[#3c2513] before:bg-[#7e4d14]"
                  >
                    Today&apos;s Fresh Picks
                  </Badge>
                  <div className="space-y-3">
                    <h1 className="max-w-2xl font-serif text-xl leading-tight sm:text-2xl lg:text-3xl">
                      Dessert ordering that feels
                      <span className="text-[#ffd7a7]">
                        {" "}
                        elegant, fast, and gift-worthy.
                      </span>
                    </h1>
                    <p className="max-w-2xl text-sm leading-7 text-[#f7e7d4] sm:text-base">
                      SweetShelf blends custom cakes, curated pastry boxes, and
                      soft-baked favourites into one premium storefront built
                      for quick browsing on every screen.
                    </p>
                  </div>
                </div>

                <div className="relative min-h-[340px] overflow-hidden rounded-[28px] border border-white/10 shadow-[0_24px_60px_rgba(16,24,40,0.18)]">
                  <ProductImage
                    src={heroImageProduct.imageUrls[0] ?? ""}
                    alt={heroImageProduct.name}
                    sizes="(max-width: 1024px) 100vw, 42vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(12,8,6,0.06)_0%,rgba(12,8,6,0.44)_100%)]" />
                </div>
              </div>

              {renderSearchBlock()}

              <div className="space-y-4 sm:space-y-5 lg:space-y-6">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs uppercase tracking-[0.28em] text-[#f1d9bc]">
                      Best Sellers
                    </p>
                    <p className="mt-2 text-lg font-semibold text-white">
                      Customer favourites worth grabbing first.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 lg:gap-6">
                  {bestSellerProducts.map((product) => (
                    <div
                      key={product.id}
                      className="grid grid-cols-[88px_1fr] gap-4 rounded-[24px] border border-white/10 bg-white/10 p-4 backdrop-blur-sm"
                    >
                      <div className="relative min-h-[104px] overflow-hidden rounded-[18px]">
                        <ProductImage
                          src={product.imageUrls[0] ?? ""}
                          alt={product.name}
                          sizes="88px"
                          className="object-cover"
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs uppercase tracking-[0.24em] text-[#f1d9bc]">
                          {product.categoryName}
                        </p>
                        <p className="mt-2 truncate text-lg font-semibold">
                          {product.name}
                        </p>
                        <p className="mt-2 text-sm text-[#f7e7d4]">
                          {formatCurrency(product.price)}
                        </p>
                        {product.status !== "out_of_stock" ? (
                          <Button
                            type="button"
                            size="sm"
                            fullWidth
                            className="mt-4 justify-center text-center align-middle rounded-full py-2"
                            onClick={(event) =>
                              handleQuickAdd(product, 1, event)
                            }
                          >
                            Add to Cart
                          </Button>
                        ) : null}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="space-y-4 sm:space-y-5 lg:space-y-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.32em] text-[var(--color-muted)]">
                Browse Menu
              </p>
              <h2 className="mt-2 font-serif text-lg text-[var(--color-brown-900)] sm:text-xl lg:text-2xl">
                Curated for gifting, cravings, and celebrations.
              </h2>
            </div>
            <Link href="/browse-menu">
              <Button variant="outline">Open Full Menu</Button>
            </Link>
          </div>

          {renderProductGrid(products.slice(0, 3))}
        </section>

        <section className="space-y-4 sm:space-y-5 lg:space-y-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.32em] text-[var(--color-muted)]">
                Special Offers
              </p>
              <h2 className="mt-2 font-serif text-lg text-[var(--color-brown-900)] sm:text-xl lg:text-2xl">
                Quick-value picks worth grabbing now.
              </h2>
            </div>
            <Link href="/special-offers">
              <Button variant="outline">See Offers</Button>
            </Link>
          </div>
          {renderProductGrid(specialOffers.slice(0, 3))}
        </section>
      </>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-4 py-4 sm:gap-5 sm:px-6 sm:py-5 lg:gap-6 lg:px-8 lg:py-6">
      <AnimatePresence>
        {cartNotice ? (
          <motion.div
            initial={{ opacity: 0, y: -16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            className="fixed right-4 top-4 z-50 max-w-sm rounded-[20px] border border-[rgba(21,115,71,0.18)] bg-white px-4 py-4 shadow-[0_18px_45px_rgba(16,24,40,0.16)]"
          >
            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex size-9 items-center justify-center rounded-full bg-[#e9f7ef] text-[#157347]">
                <Check className="size-4" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-[var(--color-brown-900)]">
                  Added to cart
                </p>
                <p className="mt-1 text-sm text-[var(--color-muted)]">
                  {cartNotice.quantity} x {cartNotice.productName}
                </p>
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <div className="bg-[var(--color-brown-900)] -mx-4 px-4 py-3 text-[13px] text-white md:-mx-8 md:px-8">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-2">
          <p>
            Fresh pastries, custom cakes, and same-day dessert drop-offs across
            Lagos.
          </p>
          <p className="text-[var(--color-caramel-200)]">
            Special offer: free drink pairing on boxes above NGN 18,000.
          </p>
        </div>
      </div>

      <header className="sticky top-0 z-30 rounded-[18px] border border-black/10 bg-white/95 px-4 py-4 shadow-[0_20px_60px_rgba(16,24,40,0.08)] backdrop-blur sm:px-6 sm:py-5 lg:px-8 lg:py-6">
        <div className="flex items-center justify-between gap-4">
          <Link
            href="/"
            className="font-serif text-3xl italic text-[var(--color-brown-900)]"
          >
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
            <motion.div
              layout
              transition={{ type: "spring", stiffness: 240, damping: 22 }}
            >
              <AnimatePresence mode="wait" initial={false}>
                {items.length > 0 ? (
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
                        <span className="text-[10px] uppercase tracking-[0.16em] text-white/70">
                          Items
                        </span>
                        <span className="text-sm font-semibold">
                          {items.length}
                        </span>
                      </div>
                      <div className="flex min-w-[100px] flex-col justify-center px-3 py-2">
                        <span className="text-[10px] uppercase tracking-[0.16em] text-white/70">
                          Total
                        </span>
                        <span className="text-sm font-semibold">
                          {formatCurrency(cartTotals.total)}
                        </span>
                      </div>
                    </Link>
                  </motion.div>
                ) : (
                  <motion.div
                    key="cart-icon"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <Link href="/cart">
                      <Button
                        variant="outline"
                        size="icon"
                        aria-label="Open cart"
                      >
                        <ShoppingBag className="size-4" />
                      </Button>
                    </Link>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {customerProfile ? (
              <Link href="/account/orders">
            <div className="flex min-h-10 items-center gap-3 rounded-[14px] border border-[var(--color-brown-100)] bg-[var(--color-caramel-50)] px-3 py-2 text-sm text-[var(--color-brown-900)] sm:text-base">
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
            aria-label={
              isMobileMenuOpen
                ? "Close navigation menu"
                : "Open navigation menu"
            }
            className="inline-flex size-11 items-center justify-center rounded-[14px] border border-[var(--color-brown-100)] bg-white text-[var(--color-brown-900)] lg:hidden"
            onClick={() => setIsMobileMenuOpen((current) => !current)}
          >
            {isMobileMenuOpen ? (
              <X className="size-5" />
            ) : (
              <Menu className="size-5" />
            )}
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
                </div>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </header>

      {renderPageContent()}

      <Card className="border-0 bg-[linear-gradient(135deg,#fff6e8_0%,#fff 100%)]">
        <CardHeader>
          <CardDescription>Need a custom cake or event order?</CardDescription>
          <CardTitle className="font-serif text-3xl font-normal">
            You can reach out to us on WhatsApp.
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-sm text-[var(--color-brown-800)]">
            <Sparkles className="size-4 text-[var(--color-caramel-500)]" />
            We handle message toppers, event trays, and bigger pre-orders there.
          </div>
          <a
            className="inline-flex items-center gap-2 rounded-[14px] bg-[var(--color-brown-900)] px-5 py-3 text-sm font-medium text-white"
            href="https://wa.me/2348106258080?text=Hi%2C+I'd+like+to+make+a+custom+order"
            target="_blank"
            rel="noopener noreferrer"
          >
            Chat on WhatsApp
            <Sparkles className="size-4" />
          </a>
        </CardContent>
      </Card>
    </div>
  );
}

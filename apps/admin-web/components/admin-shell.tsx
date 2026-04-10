import Link from "next/link";
import { Bell, CreditCard, LayoutDashboard, Package2, Settings, ShoppingBag } from "lucide-react";
import { Card, CardContent } from "@sweetshelf/shared-ui";
import { formatCurrency, mockAdminProfile, mockOrders, mockProducts } from "@sweetshelf/shared-types";

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/orders", label: "Orders", icon: ShoppingBag },
  { href: "/products", label: "Products", icon: Package2 },
  { href: "/payments", label: "Payments", icon: CreditCard },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function AdminShell() {
  const paidOrders = mockOrders.filter((order) => order.paymentStatus === "paid");
  const revenue = paidOrders.reduce((sum, order) => sum + order.total, 0);

  return (
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-[260px_1fr]">
      <aside className="border-r border-[var(--color-brown-100)] bg-white px-6 py-8">
        <div className="space-y-8">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-[var(--color-muted)]">SweetShelf</p>
            <h1 className="mt-2 font-serif text-3xl text-[var(--color-brown-800)]">Admin</h1>
          </div>
          <nav className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm text-[var(--color-brown-800)] hover:bg-[var(--color-caramel-50)]"
                >
                  <Icon className="size-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <Card className="bg-[var(--color-brown-900)] text-white">
            <CardContent className="p-6">
              <p className="text-xs uppercase tracking-[0.3em] text-white/55">Signed in</p>
              <p className="mt-2 text-lg font-medium">{mockAdminProfile.fullName}</p>
              <p className="text-sm text-white/72">{mockAdminProfile.email}</p>
            </CardContent>
          </Card>
        </div>
      </aside>
      <main className="bg-[var(--color-cream)] px-4 py-8 md:px-8">
        <div className="mx-auto flex max-w-6xl flex-col gap-6">
          <header className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-[var(--color-muted)]">Realtime snapshot</p>
              <h2 className="mt-2 font-serif text-4xl text-[var(--color-brown-800)]">Orders, stock, and payments.</h2>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm shadow-sm">
              <Bell className="size-4 text-[var(--color-caramel-500)]" />
              1 new order
            </div>
          </header>

          <section className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardContent className="p-6">
                <p className="text-xs uppercase tracking-[0.25em] text-[var(--color-muted)]">Paid Revenue</p>
                <p className="mt-3 font-serif text-4xl text-[var(--color-brown-800)]">{formatCurrency(revenue)}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <p className="text-xs uppercase tracking-[0.25em] text-[var(--color-muted)]">Products</p>
                <p className="mt-3 font-serif text-4xl text-[var(--color-brown-800)]">{mockProducts.length}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <p className="text-xs uppercase tracking-[0.25em] text-[var(--color-muted)]">Pending Fulfilment</p>
                <p className="mt-3 font-serif text-4xl text-[var(--color-brown-800)]">
                  {mockOrders.filter((order) => order.status !== "delivered").length}
                </p>
              </CardContent>
            </Card>
          </section>
        </div>
      </main>
    </div>
  );
}

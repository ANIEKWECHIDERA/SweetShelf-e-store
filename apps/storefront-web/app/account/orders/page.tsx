import { SectionCard } from "@sweetshelf/shared-ui";
import { formatCurrency, mockOrders } from "@sweetshelf/shared-types";

export default function AccountOrdersPage() {
  return (
    <main className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-8 md:px-8">
      <h1 className="font-serif text-4xl text-[var(--color-brown-800)]">Purchase history</h1>
      <div className="grid gap-4">
        {mockOrders.map((order) => (
          <SectionCard key={order.id} className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[var(--color-muted)]">{order.createdAt}</p>
                <p className="text-lg font-medium text-[var(--color-brown-800)]">#{order.id}</p>
              </div>
              <p className="text-lg font-medium text-[var(--color-caramel-500)]">{formatCurrency(order.total)}</p>
            </div>
            <p className="text-sm text-[var(--color-muted)]">{order.items.map((item) => item.productName).join(", ")}</p>
          </SectionCard>
        ))}
      </div>
    </main>
  );
}

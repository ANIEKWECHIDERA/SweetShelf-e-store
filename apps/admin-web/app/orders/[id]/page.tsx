import { notFound } from "next/navigation";
import { SectionCard } from "@sweetshelf/shared-ui";
import { formatCurrency, mockOrders } from "@sweetshelf/shared-types";

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = mockOrders.find((entry) => entry.id === id);

  if (!order) {
    notFound();
  }

  return (
    <main className="mx-auto flex max-w-5xl flex-col gap-6 px-4 py-8 md:px-8">
      <h1 className="font-serif text-4xl text-[var(--color-brown-800)]">Order detail</h1>
      <SectionCard className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-[var(--color-muted)]">{order.paymentReference}</p>
            <p className="text-lg font-medium">{order.customerName}</p>
          </div>
          <p className="text-lg font-medium text-[var(--color-caramel-500)]">{formatCurrency(order.total)}</p>
        </div>
      </SectionCard>
    </main>
  );
}

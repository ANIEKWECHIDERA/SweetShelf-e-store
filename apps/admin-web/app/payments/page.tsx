import { SectionCard } from "@sweetshelf/shared-ui";
import { formatCurrency, mockOrders } from "@sweetshelf/shared-types";

export default function PaymentsPage() {
  return (
    <main className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-8 md:px-8">
      <h1 className="font-serif text-4xl text-[var(--color-brown-800)]">Payments</h1>
      <SectionCard className="overflow-hidden p-0">
        <table className="w-full text-left text-sm">
          <thead className="bg-[var(--color-brown-900)] text-white">
            <tr>
              <th className="px-4 py-3">Reference</th>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Amount</th>
              <th className="px-4 py-3">Channel</th>
            </tr>
          </thead>
          <tbody>
            {mockOrders.map((order) => (
              <tr key={order.id} className="border-t border-[var(--color-brown-100)]">
                <td className="px-4 py-3">{order.paymentReference}</td>
                <td className="px-4 py-3">{order.customerName}</td>
                <td className="px-4 py-3">{formatCurrency(order.total)}</td>
                <td className="px-4 py-3 capitalize">{order.paymentChannel}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </SectionCard>
    </main>
  );
}

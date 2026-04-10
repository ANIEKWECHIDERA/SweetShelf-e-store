import Link from "next/link";
import { Card, CardContent } from "@sweetshelf/shared-ui";
import { formatCurrency, mockOrders } from "@sweetshelf/shared-types";

export default function OrdersPage() {
  return (
    <main className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-8 md:px-8">
      <h1 className="font-serif text-4xl text-[var(--color-brown-800)]">Orders</h1>
      <Card className="overflow-hidden p-0">
        <CardContent className="p-0">
          <table className="w-full text-left text-sm">
            <thead className="bg-[var(--color-brown-900)] text-white">
              <tr>
                <th className="px-4 py-3">Order</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Total</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {mockOrders.map((order) => (
                <tr key={order.id} className="border-t border-[var(--color-brown-100)]">
                  <td className="px-4 py-3">
                    <Link href={`/orders/${order.id}`} className="text-[var(--color-caramel-500)] hover:underline">
                      {order.paymentReference}
                    </Link>
                  </td>
                  <td className="px-4 py-3">{order.customerName}</td>
                  <td className="px-4 py-3">{formatCurrency(order.total)}</td>
                  <td className="px-4 py-3 capitalize">{order.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </main>
  );
}

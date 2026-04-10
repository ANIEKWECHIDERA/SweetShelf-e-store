import { SectionCard } from "@sweetshelf/shared-ui";
import { formatCurrency, mockProducts } from "@sweetshelf/shared-types";

export default function ProductsPage() {
  return (
    <main className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-8 md:px-8">
      <h1 className="font-serif text-4xl text-[var(--color-brown-800)]">Products</h1>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {mockProducts.map((product) => (
          <SectionCard key={product.id} className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="font-medium">{product.name}</p>
              <span className="rounded-full bg-[var(--color-caramel-50)] px-3 py-1 text-xs">
                {product.stockQuantity} left
              </span>
            </div>
            <p className="text-sm text-[var(--color-muted)]">{product.description}</p>
            <p className="text-lg font-medium text-[var(--color-caramel-500)]">{formatCurrency(product.price)}</p>
          </SectionCard>
        ))}
      </div>
    </main>
  );
}

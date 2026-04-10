import Link from "next/link";
import { SectionCard } from "@sweetshelf/shared-ui";
import { mockProducts } from "@sweetshelf/shared-types";

export default function FavouritesPage() {
  return (
    <main className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-8 md:px-8">
      <h1 className="font-serif text-4xl text-[var(--color-brown-800)]">Saved favourites</h1>
      <SectionCard className="grid gap-4 sm:grid-cols-2">
        {mockProducts.slice(0, 2).map((product) => (
          <Link
            key={product.id}
            href={`/products/${product.slug}`}
            className="rounded-2xl border border-[var(--color-brown-100)] p-4 text-sm text-[var(--color-brown-800)] transition hover:border-[var(--color-caramel-200)]"
          >
            <p className="font-medium">{product.name}</p>
            <p className="mt-1 text-[var(--color-muted)]">{product.description}</p>
          </Link>
        ))}
      </SectionCard>
    </main>
  );
}

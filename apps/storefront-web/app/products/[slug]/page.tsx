import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Button, SectionCard } from "@sweetshelf/shared-ui";
import { formatCurrency, mockProducts } from "@sweetshelf/shared-types";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = mockProducts.find((entry) => entry.slug === slug);

  if (!product) {
    notFound();
  }

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-8 md:px-8">
      <Link href="/" className="text-sm text-[var(--color-caramel-500)] hover:underline">
        ← All Products
      </Link>
      <div className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
        <div className="relative min-h-[420px] overflow-hidden rounded-[28px]">
          <Image src={product.imageUrls[0]} alt={product.name} fill className="object-cover" sizes="50vw" />
        </div>
        <SectionCard className="flex flex-col gap-5">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-[var(--color-muted)]">{product.categoryName}</p>
            <h1 className="mt-2 font-serif text-4xl text-[var(--color-brown-800)]">{product.name}</h1>
          </div>
          <p className="text-lg font-medium text-[var(--color-caramel-500)]">{formatCurrency(product.price)}</p>
          <p className="text-sm leading-7 text-[var(--color-muted)]">{product.description}</p>
          <div className="grid grid-cols-3 gap-3">
            <button className="rounded-xl border border-[var(--color-brown-100)] py-3">−</button>
            <div className="flex items-center justify-center rounded-xl bg-[var(--color-cream)] py-3 text-sm font-medium">1</div>
            <button className="rounded-xl border border-[var(--color-brown-100)] py-3">+</button>
          </div>
          <Button fullWidth disabled={product.status === "out_of_stock"}>
            {product.status === "out_of_stock" ? "Out of Stock" : "Add to Cart"}
          </Button>
          <a
            href="https://wa.me/2348012345678?text=Hi%2C+I'd+like+a+custom+version+of+this+item"
            className="text-sm text-[var(--color-caramel-500)] hover:underline"
          >
            Want a custom version? Chat with us →
          </a>
        </SectionCard>
      </div>
    </main>
  );
}

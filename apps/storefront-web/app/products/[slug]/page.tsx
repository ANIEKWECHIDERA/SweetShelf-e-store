import { notFound } from "next/navigation";
import { mockProducts } from "@sweetshelf/shared-types";
import { ProductDetailClient } from "@/components/product-detail-client";

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

  return <ProductDetailClient product={product} />;
}

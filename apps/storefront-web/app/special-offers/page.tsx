import { StorefrontShell } from "@/components/storefront-shell";
import { getCatalog } from "@/lib/api";

export const revalidate = 60;

export default async function SpecialOffersPage() {
  const { categories, products } = await getCatalog();

  return <StorefrontShell categories={categories} products={products} mode="offers" />;
}

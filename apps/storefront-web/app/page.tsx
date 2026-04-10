import { getCatalog } from "@/lib/api";
import { StorefrontShell } from "@/components/storefront-shell";

export const revalidate = 60;

export default async function Home() {
  const { categories, products } = await getCatalog();

  return <StorefrontShell categories={categories} products={products} />;
}

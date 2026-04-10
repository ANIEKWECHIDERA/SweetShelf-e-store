import { StorefrontShell } from "@/components/storefront-shell";
import { getCatalog } from "@/lib/api";

export const revalidate = 60;

export default async function BrowseMenuPage({
  searchParams,
}: {
  searchParams: Promise<{ query?: string; category?: string }>;
}) {
  const { categories, products } = await getCatalog();
  const params = await searchParams;

  return (
    <StorefrontShell
      categories={categories}
      products={products}
      mode="browse"
      initialQuery={params.query ?? ""}
      initialCategory={params.category ?? ""}
    />
  );
}

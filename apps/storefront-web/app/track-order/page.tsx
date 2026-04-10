import { StorefrontShell } from "@/components/storefront-shell";
import { getCatalog } from "@/lib/api";

export const revalidate = 60;

export default async function TrackOrderPage({
  searchParams,
}: {
  searchParams: Promise<{ reference?: string }>;
}) {
  const { categories, products } = await getCatalog();
  const params = await searchParams;

  return (
    <StorefrontShell
      categories={categories}
      products={products}
      mode="track"
      initialTrackReference={params.reference ?? ""}
    />
  );
}

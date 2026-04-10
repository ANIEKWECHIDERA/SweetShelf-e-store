"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import { Button, Card, CardContent } from "@sweetshelf/shared-ui";
import { mockCustomerProfile, mockProducts, type Profile } from "@sweetshelf/shared-types";

function subscribeToCustomerProfile(onStoreChange: () => void) {
  const handleStorage = () => onStoreChange();

  window.addEventListener("storage", handleStorage);
  window.addEventListener("focus", handleStorage);

  return () => {
    window.removeEventListener("storage", handleStorage);
    window.removeEventListener("focus", handleStorage);
  };
}

function getSnapshotProfile() {
  return window.localStorage.getItem("sweetshelf-demo-session") === "signed-in" ? mockCustomerProfile : null;
}

export default function FavouritesPage() {
  const profile = useSyncExternalStore<Profile | null>(subscribeToCustomerProfile, getSnapshotProfile, () => null);

  if (!profile) {
    return (
      <main className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-4 py-10 md:px-8">
        <h1 className="font-serif text-4xl text-[var(--color-brown-800)]">Saved items</h1>
        <Card>
          <CardContent className="space-y-4 p-6">
            <p className="text-sm leading-7 text-[var(--color-muted)]">
              Saved items are only available for signed-in customers. Use the demo signed-in state or wire real auth next.
            </p>
            <Link href="/">
              <Button>Back to Storefront</Button>
            </Link>
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-8 md:px-8">
      <h1 className="font-serif text-4xl text-[var(--color-brown-800)]">Saved favourites</h1>
      <Card>
        <CardContent className="grid gap-4 p-6 sm:grid-cols-2">
          {mockProducts.slice(0, 2).map((product) => (
            <Link
              key={product.id}
              href={`/products/${product.slug}`}
              className="rounded-[14px] border border-[var(--color-brown-100)] p-4 text-sm text-[var(--color-brown-800)] transition hover:border-[var(--color-caramel-200)]"
            >
              <p className="font-medium">{product.name}</p>
              <p className="mt-1 text-[var(--color-muted)]">{product.description}</p>
            </Link>
          ))}
        </CardContent>
      </Card>
    </main>
  );
}

"use client";

import { useEffect } from "react";
import { rehydrateCartStore } from "@/lib/cart-store";

export function CartStoreSync() {
  useEffect(() => {
    function syncCartFromStorage() {
      rehydrateCartStore();
    }

    // Back/forward cache can restore old React memory; resync persisted cart on return.
    window.addEventListener("pageshow", syncCartFromStorage);
    window.addEventListener("focus", syncCartFromStorage);
    document.addEventListener("visibilitychange", syncCartFromStorage);
    window.addEventListener("storage", syncCartFromStorage);

    return () => {
      window.removeEventListener("pageshow", syncCartFromStorage);
      window.removeEventListener("focus", syncCartFromStorage);
      document.removeEventListener("visibilitychange", syncCartFromStorage);
      window.removeEventListener("storage", syncCartFromStorage);
    };
  }, []);

  return null;
}

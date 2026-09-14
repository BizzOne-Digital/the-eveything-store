"use client";

import { useEffect, useState } from "react";
import ProductGrid from "./ProductGrid";
import type { PlainProduct } from "@/lib/website/data";

export default function RecentlyViewed({ excludeSlug }: { excludeSlug: string }) {
  const [products, setProducts] = useState<PlainProduct[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("tes_recently_viewed");
      const slugs: string[] = raw ? JSON.parse(raw) : [];
      const filtered = slugs.filter((s) => s !== excludeSlug);
      if (filtered.length === 0) return;
      fetch(`/api/products/by-slugs?slugs=${filtered.join(",")}`)
        .then((res) => res.json())
        .then((data) => setProducts(data.products ?? []))
        .catch(() => setProducts([]));
    } catch {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- resetting state after a synchronous parse failure
      setProducts([]);
    }
  }, [excludeSlug]);

  if (products.length === 0) return null;

  return (
    <section className="mt-16">
      <h2 className="font-display text-xl sm:text-2xl font-bold text-tes-black mb-6">Recently Viewed</h2>
      <ProductGrid products={products} />
    </section>
  );
}

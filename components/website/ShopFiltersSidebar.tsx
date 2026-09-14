"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useState } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import type { PlainCategory } from "@/lib/website/data";

export default function ShopFiltersSidebar({ categories }: { categories: PlainCategory[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const activeCategory = searchParams.get("category") || "";
  const minPrice = searchParams.get("minPrice") || "";
  const maxPrice = searchParams.get("maxPrice") || "";
  const sale = searchParams.get("sale") === "1";
  const inStock = searchParams.get("inStock") === "1";
  const sort = searchParams.get("sort") || "newest";
  const q = searchParams.get("q") || "";

  function updateParams(updates: Record<string, string | null>) {
    const params = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(updates)) {
      if (value === null || value === "") params.delete(key);
      else params.set(key, value);
    }
    params.delete("page");
    router.push(`${pathname}?${params.toString()}`);
  }

  const content = (
    <div className="flex flex-col gap-6">
      <div>
        <h3 className="text-sm font-bold uppercase tracking-wide text-tes-black mb-3">Categories</h3>
        <div className="flex flex-col gap-2">
          <label className="flex items-center gap-2 text-sm text-tes-muted cursor-pointer">
            <input
              type="radio"
              name="category"
              checked={activeCategory === ""}
              onChange={() => updateParams({ category: null })}
              className="accent-[#c99a2e]"
            />
            All Categories
          </label>
          {categories.map((c) => (
            <label key={c._id} className="flex items-center gap-2 text-sm text-tes-muted cursor-pointer">
              <input
                type="radio"
                name="category"
                checked={activeCategory === c.slug}
                onChange={() => updateParams({ category: c.slug })}
                className="accent-[#c99a2e]"
              />
              {c.name}
            </label>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-bold uppercase tracking-wide text-tes-black mb-3">Price Range</h3>
        <div className="flex items-center gap-2">
          <input
            type="number"
            min={0}
            placeholder="Min"
            defaultValue={minPrice}
            onBlur={(e) => updateParams({ minPrice: e.target.value || null })}
            className="w-full rounded-lg border border-tes-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-tes-gold/60"
          />
          <span className="text-tes-muted">-</span>
          <input
            type="number"
            min={0}
            placeholder="Max"
            defaultValue={maxPrice}
            onBlur={(e) => updateParams({ maxPrice: e.target.value || null })}
            className="w-full rounded-lg border border-tes-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-tes-gold/60"
          />
        </div>
      </div>

      <div>
        <h3 className="text-sm font-bold uppercase tracking-wide text-tes-black mb-3">Availability</h3>
        <label className="flex items-center gap-2 text-sm text-tes-muted cursor-pointer">
          <input
            type="checkbox"
            checked={inStock}
            onChange={(e) => updateParams({ inStock: e.target.checked ? "1" : null })}
            className="accent-[#c99a2e]"
          />
          In Stock Only
        </label>
        <label className="flex items-center gap-2 text-sm text-tes-muted cursor-pointer mt-2">
          <input
            type="checkbox"
            checked={sale}
            onChange={(e) => updateParams({ sale: e.target.checked ? "1" : null })}
            className="accent-[#c99a2e]"
          />
          On Sale
        </label>
      </div>

      {(activeCategory || minPrice || maxPrice || sale || inStock || q) && (
        <button
          type="button"
          onClick={() => router.push(pathname)}
          className="text-sm font-semibold text-tes-gold-dark hover:underline text-left"
        >
          Clear all filters
        </button>
      )}
    </div>
  );

  return (
    <>
      <div className="lg:hidden mb-4 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => setDrawerOpen(true)}
          className="inline-flex items-center gap-2 rounded-full border border-tes-border px-4 py-2 text-sm font-semibold text-tes-black"
        >
          <SlidersHorizontal className="h-4 w-4" /> Filters
        </button>
        <select
          value={sort}
          onChange={(e) => updateParams({ sort: e.target.value })}
          className="rounded-full border border-tes-border px-3 py-2 text-sm"
          aria-label="Sort products"
        >
          <option value="newest">Newest</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="name-asc">Name: A-Z</option>
        </select>
      </div>

      <aside className="hidden lg:block w-64 shrink-0">
        <div className="mb-6">
          <label htmlFor="sort-desktop" className="text-sm font-bold uppercase tracking-wide text-tes-black mb-3 block">
            Sort By
          </label>
          <select
            id="sort-desktop"
            value={sort}
            onChange={(e) => updateParams({ sort: e.target.value })}
            className="w-full rounded-lg border border-tes-border px-3 py-2 text-sm"
          >
            <option value="newest">Newest</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="name-asc">Name: A-Z</option>
          </select>
        </div>
        {content}
      </aside>

      {drawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setDrawerOpen(false)} />
          <div className="absolute left-0 top-0 h-full w-[85%] max-w-sm overflow-y-auto bg-white p-5">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-display text-lg font-bold text-tes-black">Filters</h2>
              <button type="button" onClick={() => setDrawerOpen(false)} aria-label="Close filters">
                <X className="h-5 w-5" />
              </button>
            </div>
            {content}
            <button
              type="button"
              onClick={() => setDrawerOpen(false)}
              className="mt-6 w-full rounded-full bg-tes-black py-3 text-sm font-bold text-white"
            >
              Show Results
            </button>
          </div>
        </div>
      )}
    </>
  );
}

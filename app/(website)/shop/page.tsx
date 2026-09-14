import type { Metadata } from "next";
import Link from "next/link";
import { getActiveCategories, getShopProducts } from "@/lib/website/data";
import ShopFiltersSidebar from "@/components/website/ShopFiltersSidebar";
import ProductGrid from "@/components/website/ProductGrid";
import Breadcrumbs from "@/components/website/Breadcrumbs";
import { ChevronLeft, ChevronRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Shop",
  description: "Browse everyday essentials, household goods, and more at The Everything Shop & Services.",
};

interface ShopPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

function getParam(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const sp = await searchParams;
  const q = getParam(sp.q);
  const category = getParam(sp.category);
  const minPrice = getParam(sp.minPrice);
  const maxPrice = getParam(sp.maxPrice);
  const sale = getParam(sp.sale) === "1";
  const inStock = getParam(sp.inStock) === "1";
  const sort = getParam(sp.sort);
  const page = Number(getParam(sp.page)) || 1;

  const [categories, result] = await Promise.all([
    getActiveCategories(),
    getShopProducts({
      q,
      category,
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
      sale,
      inStock,
      sort,
      page,
    }),
  ]);

  const categoryNames = Object.fromEntries(categories.map((c) => [c._id, c.name]));

  function buildPageHref(p: number) {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (category) params.set("category", category);
    if (minPrice) params.set("minPrice", minPrice);
    if (maxPrice) params.set("maxPrice", maxPrice);
    if (sale) params.set("sale", "1");
    if (inStock) params.set("inStock", "1");
    if (sort) params.set("sort", sort);
    if (p > 1) params.set("page", String(p));
    const qs = params.toString();
    return qs ? `/shop?${qs}` : "/shop";
  }

  return (
    <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-10 py-8 sm:py-10">
      <Breadcrumbs items={[{ label: "Shop" }]} />
      <h1 className="mt-4 font-display text-3xl sm:text-4xl font-bold text-tes-black">Shop</h1>
      <p className="mt-2 text-sm text-tes-muted">
        {result.total} {result.total === 1 ? "product" : "products"} found
        {q ? ` for "${q}"` : ""}
      </p>

      <div className="mt-8 flex flex-col lg:flex-row gap-8">
        <ShopFiltersSidebar categories={categories} />

        <div className="flex-1 min-w-0">
          <ProductGrid products={result.products} categoryNames={categoryNames} />

          {result.totalPages > 1 && (
            <nav aria-label="Pagination" className="mt-10 flex items-center justify-center gap-2">
              <Link
                href={buildPageHref(Math.max(1, page - 1))}
                aria-disabled={page <= 1}
                className={`flex h-9 w-9 items-center justify-center rounded-full border border-tes-border ${
                  page <= 1 ? "pointer-events-none opacity-40" : "hover:border-tes-gold"
                }`}
              >
                <ChevronLeft className="h-4 w-4" />
              </Link>
              {Array.from({ length: result.totalPages }).map((_, i) => (
                <Link
                  key={i}
                  href={buildPageHref(i + 1)}
                  className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold border ${
                    page === i + 1
                      ? "bg-tes-black text-white border-tes-black"
                      : "border-tes-border text-tes-black hover:border-tes-gold"
                  }`}
                >
                  {i + 1}
                </Link>
              ))}
              <Link
                href={buildPageHref(Math.min(result.totalPages, page + 1))}
                aria-disabled={page >= result.totalPages}
                className={`flex h-9 w-9 items-center justify-center rounded-full border border-tes-border ${
                  page >= result.totalPages ? "pointer-events-none opacity-40" : "hover:border-tes-gold"
                }`}
              >
                <ChevronRight className="h-4 w-4" />
              </Link>
            </nav>
          )}
        </div>
      </div>
    </div>
  );
}

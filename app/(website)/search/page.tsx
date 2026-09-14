import type { Metadata } from "next";
import { searchAll } from "@/lib/website/data";
import Breadcrumbs from "@/components/website/Breadcrumbs";
import ProductGrid from "@/components/website/ProductGrid";
import CategoryGrid from "@/components/website/CategoryGrid";
import ServiceCard from "@/components/website/ServiceCard";
import EmptyState from "@/components/website/EmptyState";

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>;
}

export async function generateMetadata({ searchParams }: SearchPageProps): Promise<Metadata> {
  const { q } = await searchParams;
  return { title: q ? `Search results for "${q}"` : "Search" };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q } = await searchParams;
  const query = q?.trim() || "";
  const results = query ? await searchAll(query) : { products: [], categories: [], services: [] };
  const totalResults = results.products.length + results.categories.length + results.services.length;

  return (
    <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-10 py-8 sm:py-10">
      <Breadcrumbs items={[{ label: "Search" }]} />
      <h1 className="mt-4 font-display text-3xl sm:text-4xl font-bold text-tes-black">
        {query ? `Search Results for "${query}"` : "Search"}
      </h1>

      {!query || totalResults === 0 ? (
        <EmptyState
          title="No results matching your search."
          description={query ? "Try a different keyword or browse our shop and services." : "Enter a search term to get started."}
          actionHref="/shop"
          actionLabel="Browse Shop"
        />
      ) : (
        <div className="mt-8 flex flex-col gap-14">
          {results.products.length > 0 && (
            <section>
              <h2 className="font-display text-xl font-bold text-tes-black mb-5">
                Products ({results.products.length})
              </h2>
              <ProductGrid products={results.products} />
            </section>
          )}
          {results.categories.length > 0 && (
            <section>
              <h2 className="font-display text-xl font-bold text-tes-black mb-5">
                Categories ({results.categories.length})
              </h2>
              <CategoryGrid categories={results.categories} />
            </section>
          )}
          {results.services.length > 0 && (
            <section>
              <h2 className="font-display text-xl font-bold text-tes-black mb-5">
                Services ({results.services.length})
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {results.services.map((service) => (
                  <ServiceCard key={service._id} service={service} />
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}

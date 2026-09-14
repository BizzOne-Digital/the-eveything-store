import type { PlainProduct } from "@/lib/website/data";
import ProductCard from "./ProductCard";
import EmptyState from "./EmptyState";

export default function ProductGrid({
  products,
  categoryNames,
}: {
  products: PlainProduct[];
  categoryNames?: Record<string, string>;
}) {
  if (products.length === 0) {
    return <EmptyState title="No products found." description="Try adjusting your filters or search terms." />;
  }
  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
      {products.map((product) => (
        <ProductCard key={product._id} product={product} categoryName={categoryNames?.[product.category]} />
      ))}
    </div>
  );
}

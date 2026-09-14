import type { PlainCategory } from "@/lib/website/data";
import CategoryCard from "./CategoryCard";

export default function CategoryGrid({ categories }: { categories: PlainCategory[] }) {
  if (categories.length === 0) return null;
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
      {categories.map((category) => (
        <CategoryCard key={category._id} category={category} />
      ))}
    </div>
  );
}

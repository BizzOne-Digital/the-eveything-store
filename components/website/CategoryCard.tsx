import Link from "next/link";
import Image from "next/image";
import { resolveImage } from "@/lib/utils";
import type { PlainCategory } from "@/lib/website/data";

export default function CategoryCard({ category }: { category: PlainCategory }) {
  return (
    <Link
      href={`/shop?category=${category.slug}`}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-tes-border bg-white transition-shadow hover:shadow-lg"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-tes-cream">
        <Image
          src={resolveImage(category.image)}
          alt={category.name}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
        <span className="absolute bottom-3 left-3 right-3 font-display text-base sm:text-lg font-bold text-white drop-shadow">
          {category.name}
        </span>
      </div>
    </Link>
  );
}

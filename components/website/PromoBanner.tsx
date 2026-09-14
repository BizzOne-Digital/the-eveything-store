import Link from "next/link";
import Image from "next/image";
import { resolveImage } from "@/lib/utils";
import type { PlainPromotion } from "@/lib/website/data";

export default function PromoBanner({ promotion }: { promotion: PlainPromotion }) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-tes-black">
      <div className="relative aspect-[16/9] sm:aspect-[21/9] w-full">
        <Image
          src={resolveImage(promotion.image)}
          alt={promotion.title}
          fill
          sizes="(min-width: 1024px) 45vw, 100vw"
          className="object-cover opacity-70"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
        <div className="absolute inset-0 flex flex-col justify-end p-5 sm:p-7">
          {promotion.discountText && (
            <span className="mb-2 inline-block w-fit rounded-full bg-tes-gold px-3 py-1 text-xs font-bold text-tes-black">
              {promotion.discountText}
            </span>
          )}
          <h3 className="font-display text-xl sm:text-2xl font-bold text-white">{promotion.title}</h3>
          {promotion.subtitle && <p className="mt-1 text-sm text-white/80">{promotion.subtitle}</p>}
          <Link
            href={promotion.ctaLink || "/shop"}
            className="mt-4 inline-flex w-fit items-center rounded-full bg-tes-gold px-5 py-2 text-sm font-bold text-tes-black hover:bg-tes-gold-light transition-colors"
          >
            {promotion.ctaText || "Shop Deals"}
          </Link>
        </div>
      </div>
    </div>
  );
}

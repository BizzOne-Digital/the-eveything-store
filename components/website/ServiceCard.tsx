import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { resolveImage } from "@/lib/utils";
import { getIcon } from "@/lib/website/icon-map";
import type { PlainService } from "@/lib/website/data";

export default function ServiceCard({ service, dark = false }: { service: PlainService; dark?: boolean }) {
  const Icon = getIcon(service.icon);

  return (
    <div
      id={service.slug}
      className={`group flex flex-col overflow-hidden rounded-2xl border transition-shadow hover:shadow-lg ${
        dark ? "border-white/10 bg-white/5" : "border-tes-border bg-white"
      }`}
    >
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-tes-cream">
        <Image
          src={resolveImage(service.image)}
          alt={service.name}
          fill
          sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute left-3 top-3 flex h-10 w-10 items-center justify-center rounded-full bg-tes-gold text-tes-black">
          {/* eslint-disable-next-line react-hooks/static-components -- resolving an existing icon component from a static lookup map, not creating a new component type */}
          <Icon className="h-5 w-5" />
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-2 p-5">
        <h3 className={`font-display text-lg font-bold ${dark ? "text-white" : "text-tes-black"}`}>
          {service.name}
        </h3>
        <p className={`text-sm leading-relaxed ${dark ? "text-white/70" : "text-tes-muted"}`}>
          {service.shortDescription}
        </p>
        <div className="mt-auto flex items-center justify-between gap-3 pt-3">
          <span className={`text-sm font-semibold ${dark ? "text-tes-gold-light" : "text-tes-gold-dark"}`}>
            {service.pricingText}
          </span>
          <Link
            href={`/contact?inquiryType=${encodeURIComponent("Service Question")}&subject=${encodeURIComponent(service.name)}`}
            className={`inline-flex items-center gap-1 text-sm font-semibold transition-colors ${
              dark ? "text-white hover:text-tes-gold-light" : "text-tes-black hover:text-tes-gold-dark"
            }`}
          >
            {service.ctaText || "Request Service"}
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}

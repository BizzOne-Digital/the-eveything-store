"use client";

import { useState } from "react";
import Image from "next/image";
import { resolveImage } from "@/lib/utils";

export default function ProductGallery({ images, name }: { images: string[]; name: string }) {
  const gallery = images.length > 0 ? images : [""];
  const [active, setActive] = useState(0);

  return (
    <div>
      <div className="relative aspect-square w-full overflow-hidden rounded-2xl border border-tes-border bg-tes-cream">
        <Image
          src={resolveImage(gallery[active])}
          alt={name}
          fill
          priority
          sizes="(min-width: 1024px) 45vw, 90vw"
          className="object-cover"
        />
      </div>
      {gallery.length > 1 && (
        <div className="mt-3 flex gap-2.5 overflow-x-auto pb-1">
          {gallery.map((img, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`View image ${i + 1}`}
              className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border-2 transition-colors ${
                active === i ? "border-tes-gold" : "border-tes-border"
              }`}
            >
              <Image src={resolveImage(img)} alt="" fill sizes="64px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

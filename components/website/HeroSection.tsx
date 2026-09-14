"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Truck, ShieldCheck, Tags, Sparkles } from "lucide-react";
import type { PlainSiteSettings } from "@/lib/website/data";

const TRUST_POINTS = [
  { icon: Truck, label: "Fast & Local Delivery" },
  { icon: ShieldCheck, label: "Trusted & Reliable" },
  { icon: Tags, label: "Great Deals & Discounts" },
  { icon: Sparkles, label: "Everything You Need" },
];

export default function HeroSection({ settings }: { settings: PlainSiteSettings }) {
  const headingLines = settings.heroHeading.split("\n");

  return (
    <section className="relative overflow-hidden bg-tes-black min-h-[560px] flex items-center">
      <Image
        src="/hero.png"
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-tes-black via-tes-black/85 to-tes-black/40" />
      <div className="pointer-events-none absolute -right-40 top-1/2 h-[520px] w-[520px] -translate-y-1/2 rounded-full bg-tes-gold/20 blur-[120px]" />
      <div className="relative mx-auto w-full max-w-[1400px] px-4 sm:px-6 lg:px-10 py-20 lg:py-32">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="max-w-2xl"
        >
          <p className="text-xs sm:text-sm font-bold uppercase tracking-[0.3em] text-tes-gold-light">
            {settings.heroSubheading}
          </p>
          <h1 className="mt-4 font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight text-white">
            {headingLines.map((line, i) => (
              <span key={i} className="block">
                {line.split(/(Shop & Services)/i).map((part, j) =>
                  /Shop & Services/i.test(part) ? (
                    <span key={j} className="gold-text-gradient">
                      {part}
                    </span>
                  ) : (
                    <span key={j}>{part}</span>
                  )
                )}
              </span>
            ))}
          </h1>
          <p className="mt-5 max-w-lg text-base leading-relaxed text-white/75">
            {settings.heroDescription}
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href={settings.heroCtaPrimaryLink}
              className="rounded-full bg-tes-gold px-7 py-3 text-sm font-bold text-tes-black hover:bg-tes-gold-light transition-colors"
            >
              {settings.heroCtaPrimaryText}
            </Link>
            <Link
              href={settings.heroCtaSecondaryLink}
              className="rounded-full border border-white/30 px-7 py-3 text-sm font-bold text-white hover:border-tes-gold hover:text-tes-gold-light transition-colors"
            >
              {settings.heroCtaSecondaryText}
            </Link>
          </div>

          <p className="mt-8 font-display text-sm italic text-white/60">
            More Than a Store. A Complete Solution.
          </p>

          <div className="mt-8 grid grid-cols-2 gap-x-6 gap-y-4 max-w-md">
            {TRUST_POINTS.map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-2.5">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/10 text-tes-gold-light">
                  <Icon className="h-4 w-4" />
                </span>
                <span className="text-xs sm:text-sm font-medium text-white/85">{label}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

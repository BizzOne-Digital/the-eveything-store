import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Heart, Target, Eye, Users, ShoppingBag, Wrench } from "lucide-react";
import { getPageContent, getSiteSettings } from "@/lib/website/data";
import Breadcrumbs from "@/components/website/Breadcrumbs";
import FadeIn from "@/components/website/FadeIn";

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn about The Everything Shop & Services — our mission to make everyday needs and local services easy to find in one place.",
};

interface AboutSections {
  storyHeading?: string;
  storyBody?: string;
}

export default async function AboutPage() {
  const [settings, sections] = await Promise.all([
    getSiteSettings(),
    getPageContent("about") as Promise<AboutSections>,
  ]);

  return (
    <div>
      <section className="bg-tes-black">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-10 py-14">
          <Breadcrumbs items={[{ label: "About Us" }]} />
          <h1 className="mt-4 font-display text-3xl sm:text-4xl font-bold text-white">About {settings.businessName}</h1>
          <p className="mt-3 max-w-xl text-sm sm:text-base text-white/70">{settings.tagline}</p>
        </div>
      </section>

      <section className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-10 py-14 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        <FadeIn>
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-tes-gold-dark">Our Story</p>
          <h2 className="mt-1.5 font-display text-2xl sm:text-3xl font-bold text-tes-black">
            {sections?.storyHeading || "Everything You Need, All in One Place"}
          </h2>
          <p className="mt-4 text-sm sm:text-base leading-relaxed text-tes-muted">
            {sections?.storyBody ||
              "The Everything Shop & Services was built around a simple idea: customers shouldn't have to go to five different places to get what they need. We aim to satisfy our customers, supply them with everyday needs and wants, and provide useful local services — all under one trusted name."}
          </p>
        </FadeIn>
        <FadeIn delay={0.1} className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl">
          <Image
            src="https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=1000&q=80"
            alt="Local shop shelves stocked with everyday products"
            fill
            sizes="(min-width: 1024px) 45vw, 90vw"
            className="object-cover"
          />
        </FadeIn>
      </section>

      <section className="bg-tes-cream">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-10 py-14 grid grid-cols-1 sm:grid-cols-3 gap-6">
          <FadeIn className="rounded-2xl bg-white border border-tes-border p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-tes-black text-tes-gold mb-4">
              <Target className="h-6 w-6" />
            </div>
            <h3 className="font-display text-lg font-bold text-tes-black">Our Mission</h3>
            <p className="mt-2 text-sm text-tes-muted leading-relaxed">
              To satisfy our customers by supplying everyday needs and wants alongside dependable local services.
            </p>
          </FadeIn>
          <FadeIn delay={0.05} className="rounded-2xl bg-white border border-tes-border p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-tes-black text-tes-gold mb-4">
              <Eye className="h-6 w-6" />
            </div>
            <h3 className="font-display text-lg font-bold text-tes-black">Our Vision</h3>
            <p className="mt-2 text-sm text-tes-muted leading-relaxed">
              To be the one place local households and small businesses turn to for both products and services.
            </p>
          </FadeIn>
          <FadeIn delay={0.1} className="rounded-2xl bg-white border border-tes-border p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-tes-black text-tes-gold mb-4">
              <Heart className="h-6 w-6" />
            </div>
            <h3 className="font-display text-lg font-bold text-tes-black">Our Values</h3>
            <p className="mt-2 text-sm text-tes-muted leading-relaxed">
              Trust, reliability, and genuine care for the communities we serve, big or small.
            </p>
          </FadeIn>
        </div>
      </section>

      <section className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-10 py-14 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <FadeIn className="rounded-2xl border border-tes-border p-7">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-tes-cream text-tes-gold-dark mb-4">
            <ShoppingBag className="h-6 w-6" />
          </div>
          <h3 className="font-display text-lg font-bold text-tes-black">Products for Everyday Life</h3>
          <p className="mt-2 text-sm text-tes-muted leading-relaxed">
            From household essentials to clothing and electronics, we carry a broad range of everyday products so you can find what you need without the runaround.
          </p>
        </FadeIn>
        <FadeIn delay={0.1} className="rounded-2xl border border-tes-border p-7">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-tes-cream text-tes-gold-dark mb-4">
            <Wrench className="h-6 w-6" />
          </div>
          <h3 className="font-display text-lg font-bold text-tes-black">Services That Get It Done</h3>
          <p className="mt-2 text-sm text-tes-muted leading-relaxed">
            Alongside our shop, we connect you with trusted local services — practical support for the jobs that come up around your home or business.
          </p>
        </FadeIn>
      </section>

      <section className="bg-tes-cream">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-10 py-14 text-center">
          <FadeIn>
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-tes-black text-tes-gold mb-4">
              <Users className="h-6 w-6" />
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-tes-black">Community Focused</h2>
            <p className="mt-2 max-w-xl mx-auto text-sm text-tes-muted leading-relaxed">
              We&apos;re proud to serve local communities — big or small, we&apos;ve got you covered.
            </p>
            <Link
              href="/contact"
              className="mt-6 inline-flex items-center rounded-full bg-tes-black px-7 py-3 text-sm font-bold text-white hover:bg-tes-gold hover:text-tes-black transition-colors"
            >
              Get in Touch
            </Link>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}

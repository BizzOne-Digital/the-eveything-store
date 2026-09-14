import type { Metadata } from "next";
import Link from "next/link";
import {
  getSiteSettings,
  getFeaturedCategories,
  getFeaturedProducts,
  getFeaturedServices,
  getActivePromotions,
  getPageContent,
} from "@/lib/website/data";
import HeroSection from "@/components/website/HeroSection";
import CategoryGrid from "@/components/website/CategoryGrid";
import ProductGrid from "@/components/website/ProductGrid";
import ServiceCard from "@/components/website/ServiceCard";
import PromoBanner from "@/components/website/PromoBanner";
import NewsletterSection from "@/components/website/NewsletterSection";
import FadeIn from "@/components/website/FadeIn";
import { ArrowRight } from "lucide-react";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  return {
    title: settings.seoTitle,
    description: settings.seoDescription,
  };
}

interface HomeSections {
  everythingHeading?: string;
  everythingBody?: string;
}

export default async function HomePage() {
  const [settings, categories, products, services, promotions, sections] = await Promise.all([
    getSiteSettings(),
    getFeaturedCategories(8),
    getFeaturedProducts(8),
    getFeaturedServices(6),
    getActivePromotions(3),
    getPageContent("home") as Promise<HomeSections>,
  ]);

  return (
    <>
      <HeroSection settings={settings} />

      <section className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-10 py-16">
        <FadeIn className="flex items-end justify-between gap-4 mb-8">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-tes-gold-dark">Browse</p>
            <h2 className="mt-1.5 font-display text-2xl sm:text-3xl font-bold text-tes-black">
              Shop by Category
            </h2>
          </div>
          <Link
            href="/shop"
            className="hidden sm:inline-flex items-center gap-1 text-sm font-semibold text-tes-black hover:text-tes-gold-dark transition-colors"
          >
            View All Categories <ArrowRight className="h-4 w-4" />
          </Link>
        </FadeIn>
        <FadeIn delay={0.1}>
          <CategoryGrid categories={categories} />
        </FadeIn>
        <div className="mt-6 text-center sm:hidden">
          <Link href="/shop" className="inline-flex items-center gap-1 text-sm font-semibold text-tes-black">
            View All Categories <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <section className="bg-tes-cream">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-10 py-16">
          <FadeIn className="flex items-end justify-between gap-4 mb-8">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-tes-gold-dark">Featured</p>
              <h2 className="mt-1.5 font-display text-2xl sm:text-3xl font-bold text-tes-black">
                Featured Products
              </h2>
            </div>
            <Link
              href="/shop"
              className="hidden sm:inline-flex items-center gap-1 text-sm font-semibold text-tes-black hover:text-tes-gold-dark transition-colors"
            >
              Shop All <ArrowRight className="h-4 w-4" />
            </Link>
          </FadeIn>
          <FadeIn delay={0.1}>
            <ProductGrid products={products} />
          </FadeIn>
        </div>
      </section>

      {services.length > 0 && (
        <section className="bg-tes-black">
          <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-10 py-16">
            <FadeIn className="flex items-end justify-between gap-4 mb-8">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.25em] text-tes-gold-light">
                  Local &amp; Reliable
                </p>
                <h2 className="mt-1.5 font-display text-2xl sm:text-3xl font-bold text-white">
                  Our Local Services
                </h2>
              </div>
              <Link
                href="/services"
                className="hidden sm:inline-flex items-center gap-1 text-sm font-semibold text-white hover:text-tes-gold-light transition-colors"
              >
                View All Services <ArrowRight className="h-4 w-4" />
              </Link>
            </FadeIn>
            <FadeIn delay={0.1}>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {services.map((service) => (
                  <ServiceCard key={service._id} service={service} dark />
                ))}
              </div>
            </FadeIn>
            <div className="mt-8 text-center sm:hidden">
              <Link href="/services" className="inline-flex items-center gap-1 text-sm font-semibold text-white">
                View All Services <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {promotions.length > 0 && (
        <section className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-10 py-16">
          <FadeIn className="mb-8">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-tes-gold-dark">Limited Time</p>
            <h2 className="mt-1.5 font-display text-2xl sm:text-3xl font-bold text-tes-black">Special Offers</h2>
          </FadeIn>
          <FadeIn delay={0.1}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              {promotions.map((promo) => (
                <PromoBanner key={promo._id} promotion={promo} />
              ))}
            </div>
          </FadeIn>
        </section>
      )}

      <section className="bg-tes-cream">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-10 py-16 grid grid-cols-1 lg:grid-cols-2 gap-10">
          <FadeIn>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-tes-black">
              {sections?.everythingHeading || "Everything for Everyone"}
            </h2>
            <p className="mt-4 text-sm sm:text-base leading-relaxed text-tes-muted">
              {sections?.everythingBody ||
                "We aim to satisfy our customers, supply them with everyday needs and wants, and provide useful local services. Whether you're a household looking for everyday essentials or a small business needing reliable support, The Everything Shop & Services brings products and services together in one convenient, trusted place."}
            </p>
          </FadeIn>
          <FadeIn delay={0.1} className="grid grid-cols-2 gap-4">
            <div className="rounded-2xl bg-white p-5 border border-tes-border">
              <h3 className="font-display text-sm font-bold text-tes-black">Products &amp; Services Together</h3>
              <p className="mt-2 text-xs text-tes-muted leading-relaxed">
                Shop everyday goods and book local services in a single trusted place.
              </p>
            </div>
            <div className="rounded-2xl bg-white p-5 border border-tes-border">
              <h3 className="font-display text-sm font-bold text-tes-black">Community Focused</h3>
              <p className="mt-2 text-xs text-tes-muted leading-relaxed">
                Proudly serving local households and small businesses, big or small.
              </p>
            </div>
            <div className="rounded-2xl bg-white p-5 border border-tes-border">
              <h3 className="font-display text-sm font-bold text-tes-black">Reliable Delivery</h3>
              <p className="mt-2 text-xs text-tes-muted leading-relaxed">
                Fast, local delivery and pickup options for every order.
              </p>
            </div>
            <div className="rounded-2xl bg-white p-5 border border-tes-border">
              <h3 className="font-display text-sm font-bold text-tes-black">Honest Value</h3>
              <p className="mt-2 text-xs text-tes-muted leading-relaxed">
                Great deals and clear pricing, with no surprises at checkout.
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      <NewsletterSection />
    </>
  );
}

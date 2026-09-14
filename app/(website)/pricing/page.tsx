import type { Metadata } from "next";
import Link from "next/link";
import { ShoppingBag, Wrench, Truck, MessageCircleQuestion } from "lucide-react";
import Breadcrumbs from "@/components/website/Breadcrumbs";
import FadeIn from "@/components/website/FadeIn";

export const metadata: Metadata = {
  title: "Pricing",
  description: "Pricing depends on the product or service required. Contact The Everything Shop & Services for a tailored quote.",
};

const PRICING_CARDS = [
  {
    icon: ShoppingBag,
    title: "Product Pricing",
    body: "Every product in our shop is listed with its own price, so you always know the cost before you buy. Sale prices are shown clearly where applicable.",
    cta: "Browse Products",
    href: "/shop",
  },
  {
    icon: Wrench,
    title: "Service Quotes",
    body: "Local service pricing varies based on scope, materials, and timing. Reach out with details and we'll provide a clear, honest quote.",
    cta: "View Services",
    href: "/services",
  },
  {
    icon: Truck,
    title: "Delivery & Pickup",
    body: "Delivery availability and any related costs depend on your location and order. Contact us to confirm options for your area.",
    cta: "Ask About Delivery",
    href: "/contact?inquiryType=Pricing",
  },
  {
    icon: MessageCircleQuestion,
    title: "Special Requests",
    body: "Looking for something specific, in bulk, or outside our usual catalog? Send us the details and we'll do our best to help.",
    cta: "Request Pricing",
    href: "/contact?inquiryType=Pricing",
  },
];

export default function PricingPage() {
  return (
    <div>
      <section className="bg-tes-black">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-10 py-14">
          <Breadcrumbs items={[{ label: "Pricing" }]} />
          <h1 className="mt-4 font-display text-3xl sm:text-4xl font-bold text-white">Pricing</h1>
          <p className="mt-3 max-w-xl text-sm sm:text-base text-white/70">
            Pricing depends on the product or service required. Here&apos;s how it works.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-10 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {PRICING_CARDS.map(({ icon: Icon, title, body, cta, href }) => (
            <FadeIn key={title} className="rounded-2xl border border-tes-border p-7 flex flex-col">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-tes-black text-tes-gold mb-4">
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="font-display text-lg font-bold text-tes-black">{title}</h3>
              <p className="mt-2 text-sm text-tes-muted leading-relaxed flex-1">{body}</p>
              <Link
                href={href}
                className="mt-5 inline-flex w-fit items-center rounded-full border border-tes-black px-5 py-2 text-sm font-semibold text-tes-black hover:bg-tes-black hover:text-white transition-colors"
              >
                {cta}
              </Link>
            </FadeIn>
          ))}
        </div>
      </section>

      <section className="bg-tes-cream">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-10 py-14 text-center">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-tes-black">Still Have Questions?</h2>
          <p className="mt-2 text-sm text-tes-muted max-w-md mx-auto">
            We&apos;re happy to walk through pricing for whatever you need, big or small.
          </p>
          <Link
            href="/contact"
            className="mt-6 inline-flex items-center rounded-full bg-tes-black px-7 py-3 text-sm font-bold text-white hover:bg-tes-gold hover:text-tes-black transition-colors"
          >
            Contact Us
          </Link>
        </div>
      </section>
    </div>
  );
}

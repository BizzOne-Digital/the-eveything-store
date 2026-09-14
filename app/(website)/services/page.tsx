import type { Metadata } from "next";
import Link from "next/link";
import { ClipboardList, PhoneCall, CheckCircle2, ShieldCheck, Clock, Users } from "lucide-react";
import { getAllServices, getSiteSettings } from "@/lib/website/data";
import Breadcrumbs from "@/components/website/Breadcrumbs";
import ServiceCard from "@/components/website/ServiceCard";
import EmptyState from "@/components/website/EmptyState";
import FadeIn from "@/components/website/FadeIn";

export const metadata: Metadata = {
  title: "Services",
  description: "Reliable local services from The Everything Shop & Services — contact us for pricing tailored to your needs.",
};

const WHY_CHOOSE_US = [
  { icon: ShieldCheck, title: "Trusted & Reliable", body: "Local service providers you can count on, every time." },
  { icon: Clock, title: "Fast Response", body: "Quick turnaround so your needs are met without the wait." },
  { icon: Users, title: "Community Focused", body: "Proudly serving local households and small businesses." },
];

const HOW_IT_WORKS = [
  { step: "1", title: "Tell Us What You Need", body: "Reach out with a brief description of the service you're looking for." },
  { step: "2", title: "We Confirm Details", body: "Our team follows up to confirm scope, timing, and pricing." },
  { step: "3", title: "We Get It Done", body: "A local specialist completes the job to your satisfaction." },
  { step: "4", title: "You're All Set", body: "Enjoy the result, with support just a call or message away." },
];

const FAQS = [
  {
    q: "How much do your services cost?",
    a: "Pricing depends on the specific service and scope of work. Contact us with details and we'll provide a clear quote.",
  },
  {
    q: "Do you serve my area?",
    a: "We serve local communities in and around our service area. Reach out and we'll confirm availability for your location.",
  },
  {
    q: "How quickly can a service be scheduled?",
    a: "Turnaround depends on the service requested and current availability. We aim to respond and schedule as quickly as possible.",
  },
  {
    q: "Can I request a service that isn't listed?",
    a: "Yes. Contact us and describe what you need — we'll let you know if we can help or connect you with the right solution.",
  },
];

export default async function ServicesPage() {
  const [services, settings] = await Promise.all([getAllServices(), getSiteSettings()]);

  return (
    <div>
      <section className="bg-tes-black">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-10 py-14">
          <Breadcrumbs items={[{ label: "Services" }]} />
          <h1 className="mt-4 font-display text-3xl sm:text-4xl font-bold text-white">Our Local Services</h1>
          <p className="mt-3 max-w-xl text-sm sm:text-base text-white/70">
            Reliable, local services designed to make life easier for households and small businesses alike.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-10 py-14">
        {services.length === 0 ? (
          <EmptyState title="No services available right now." description="Please check back soon or contact us directly." actionHref="/contact" actionLabel="Contact Us" />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {services.map((service) => (
              <ServiceCard key={service._id} service={service} />
            ))}
          </div>
        )}
      </section>

      <section className="bg-tes-cream">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-10 py-14">
          <FadeIn className="text-center mb-10">
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-tes-black">Why Choose Us</h2>
          </FadeIn>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {WHY_CHOOSE_US.map(({ icon: Icon, title, body }) => (
              <FadeIn key={title} className="rounded-2xl bg-white border border-tes-border p-6 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-tes-black text-tes-gold mb-4">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="font-display text-base font-bold text-tes-black">{title}</h3>
                <p className="mt-2 text-sm text-tes-muted">{body}</p>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-10 py-14">
        <FadeIn className="text-center mb-10">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-tes-black">How It Works</h2>
        </FadeIn>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {HOW_IT_WORKS.map(({ step, title, body }) => (
            <FadeIn key={step} className="relative rounded-2xl border border-tes-border p-6">
              <span className="font-display text-3xl font-extrabold text-tes-gold/40">{step}</span>
              <h3 className="mt-2 font-display text-base font-bold text-tes-black">{title}</h3>
              <p className="mt-2 text-sm text-tes-muted">{body}</p>
            </FadeIn>
          ))}
        </div>
      </section>

      <section className="bg-tes-cream">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-10 py-14 max-w-3xl">
          <FadeIn className="text-center mb-10">
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-tes-black">Frequently Asked Questions</h2>
          </FadeIn>
          <div className="space-y-4">
            {FAQS.map((faq) => (
              <FadeIn key={faq.q} className="rounded-xl bg-white border border-tes-border p-5">
                <div className="flex items-start gap-3">
                  <ClipboardList className="h-5 w-5 mt-0.5 text-tes-gold-dark shrink-0" />
                  <div>
                    <h3 className="font-semibold text-tes-black">{faq.q}</h3>
                    <p className="mt-1.5 text-sm text-tes-muted">{faq.a}</p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-10 py-16 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-tes-black text-tes-gold mb-4">
          <PhoneCall className="h-6 w-6" />
        </div>
        <h2 className="font-display text-2xl sm:text-3xl font-bold text-tes-black">Need a Service Today?</h2>
        <p className="mt-2 text-sm text-tes-muted max-w-md mx-auto">
          Reach out to {settings.businessName} and we&apos;ll get back to you with pricing and availability.
        </p>
        <Link
          href={`/contact?inquiryType=${encodeURIComponent("Service Question")}`}
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-tes-black px-7 py-3 text-sm font-bold text-white hover:bg-tes-gold hover:text-tes-black transition-colors"
        >
          <CheckCircle2 className="h-4 w-4" /> Contact Us
        </Link>
      </section>
    </div>
  );
}

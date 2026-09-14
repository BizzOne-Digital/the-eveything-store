import type { Metadata } from "next";
import { Suspense } from "react";
import { Phone, Mail, Globe, MapPin } from "lucide-react";
import { getSiteSettings } from "@/lib/website/data";
import Breadcrumbs from "@/components/website/Breadcrumbs";
import ContactForm from "@/components/website/ContactForm";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with The Everything Shop & Services for product questions, service requests, or pricing.",
};

const FAQ_PREVIEW = [
  { q: "How fast will I hear back?", a: "We aim to respond to all inquiries within one to two business days." },
  { q: "Can I ask about pricing?", a: "Yes — select \"Pricing\" as your inquiry type and share the details." },
];

export default async function ContactPage() {
  const settings = await getSiteSettings();

  return (
    <div>
      <section className="bg-tes-black">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-10 py-14">
          <Breadcrumbs items={[{ label: "Contact" }]} />
          <h1 className="mt-4 font-display text-3xl sm:text-4xl font-bold text-white">Contact Us</h1>
          <p className="mt-3 max-w-xl text-sm sm:text-base text-white/70">
            Questions about a product, a service, or an order? We&apos;re here to help.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-10 py-14 grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="rounded-2xl border border-tes-border p-6 flex items-start gap-3">
          <Phone className="h-5 w-5 text-tes-gold-dark mt-0.5 shrink-0" />
          <div>
            <h3 className="font-semibold text-tes-black">Phone</h3>
            <a href={`tel:${settings.phone.replace(/[^\d+]/g, "")}`} className="text-sm text-tes-muted hover:text-tes-gold-dark transition-colors">
              {settings.phone}
            </a>
          </div>
        </div>
        <div className="rounded-2xl border border-tes-border p-6 flex items-start gap-3">
          <Mail className="h-5 w-5 text-tes-gold-dark mt-0.5 shrink-0" />
          <div>
            <h3 className="font-semibold text-tes-black">Email</h3>
            <a href={`mailto:${settings.email}`} className="text-sm text-tes-muted hover:text-tes-gold-dark transition-colors break-all">
              {settings.email}
            </a>
          </div>
        </div>
        <div className="rounded-2xl border border-tes-border p-6 flex items-start gap-3">
          <Globe className="h-5 w-5 text-tes-gold-dark mt-0.5 shrink-0" />
          <div>
            <h3 className="font-semibold text-tes-black">Website</h3>
            <p className="text-sm text-tes-muted break-all">{settings.website}</p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-10 pb-16 grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 rounded-2xl border border-tes-border p-6 sm:p-8">
          <h2 className="font-display text-xl font-bold text-tes-black mb-5">Send Us a Message</h2>
          <Suspense>
            <ContactForm />
          </Suspense>
        </div>

        <div>
          {settings.address && (
            <div className="rounded-2xl bg-tes-cream p-6 mb-5 flex items-start gap-3">
              <MapPin className="h-5 w-5 text-tes-gold-dark mt-0.5 shrink-0" />
              <div>
                <h3 className="font-semibold text-tes-black">Location</h3>
                <p className="text-sm text-tes-muted">{settings.address}</p>
              </div>
            </div>
          )}
          <h3 className="font-display text-lg font-bold text-tes-black mb-3">Quick Answers</h3>
          <div className="space-y-3">
            {FAQ_PREVIEW.map((faq) => (
              <div key={faq.q} className="rounded-xl border border-tes-border p-4">
                <p className="text-sm font-semibold text-tes-black">{faq.q}</p>
                <p className="mt-1 text-xs text-tes-muted">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

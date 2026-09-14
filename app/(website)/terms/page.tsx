import type { Metadata } from "next";
import { getSiteSettings } from "@/lib/website/data";
import Breadcrumbs from "@/components/website/Breadcrumbs";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Read the terms of service for The Everything Shop & Services.",
};

export default async function TermsPage() {
  const settings = await getSiteSettings();

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-10 sm:py-14">
      <Breadcrumbs items={[{ label: "Terms of Service" }]} />
      <h1 className="mt-4 font-display text-3xl sm:text-4xl font-bold text-tes-black">Terms of Service</h1>
      <p className="mt-2 text-sm text-tes-muted">Last updated: {new Date().toLocaleDateString("en-CA", { year: "numeric", month: "long", day: "numeric" })}</p>

      <div className="mt-8 space-y-8 text-sm leading-relaxed text-tes-muted">
        <section>
          <h2 className="font-display text-lg font-bold text-tes-black mb-2">Agreement to Terms</h2>
          <p>
            By accessing or using the {settings.businessName} website, you agree to be bound by these Terms of
            Service. If you do not agree with any part of these terms, please do not use our website.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-bold text-tes-black mb-2">Products &amp; Services</h2>
          <p>
            Product prices are listed on our shop pages and are subject to change without notice. Service pricing
            depends on the scope of work and is confirmed directly with our team before any commitment is made.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-bold text-tes-black mb-2">Orders &amp; Payment</h2>
          <p>
            Orders placed through our website are confirmed via email or phone. Payment is currently collected on
            delivery or pickup, as indicated at checkout. We reserve the right to cancel or refuse any order.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-bold text-tes-black mb-2">Accuracy of Information</h2>
          <p>
            We aim to keep product and service information accurate and up to date, but we do not warrant that all
            content on this website is complete, current, or error-free.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-bold text-tes-black mb-2">Limitation of Liability</h2>
          <p>
            {settings.businessName} shall not be liable for any indirect, incidental, or consequential damages
            arising from the use of our website, products, or services.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-bold text-tes-black mb-2">Changes to These Terms</h2>
          <p>
            We may update these Terms of Service from time to time. Continued use of our website after changes are
            posted constitutes acceptance of the updated terms.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-bold text-tes-black mb-2">Contact Us</h2>
          <p>
            Questions about these Terms of Service can be sent to{" "}
            <a href={`mailto:${settings.email}`} className="text-tes-gold-dark hover:underline">{settings.email}</a>{" "}
            or {settings.phone}.
          </p>
        </section>
      </div>
    </div>
  );
}

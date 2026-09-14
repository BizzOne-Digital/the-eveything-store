import type { Metadata } from "next";
import { getSiteSettings } from "@/lib/website/data";
import Breadcrumbs from "@/components/website/Breadcrumbs";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Read the privacy policy for The Everything Shop & Services.",
};

export default async function PrivacyPage() {
  const settings = await getSiteSettings();

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-10 sm:py-14">
      <Breadcrumbs items={[{ label: "Privacy Policy" }]} />
      <h1 className="mt-4 font-display text-3xl sm:text-4xl font-bold text-tes-black">Privacy Policy</h1>
      <p className="mt-2 text-sm text-tes-muted">Last updated: {new Date().toLocaleDateString("en-CA", { year: "numeric", month: "long", day: "numeric" })}</p>

      <div className="mt-8 space-y-8 text-sm leading-relaxed text-tes-muted">
        <section>
          <h2 className="font-display text-lg font-bold text-tes-black mb-2">Introduction</h2>
          <p>
            {settings.businessName} (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) respects your privacy and is
            committed to protecting the personal information you share with us. This Privacy Policy explains how we
            collect, use, and safeguard your information when you visit our website or place an order.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-bold text-tes-black mb-2">Information We Collect</h2>
          <p>
            When you place an order, submit a contact form, or sign up for our newsletter, we may collect information
            such as your name, email address, phone number, delivery address, and any details you provide about your
            order or inquiry.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-bold text-tes-black mb-2">How We Use Your Information</h2>
          <p>
            We use the information we collect to process and fulfill orders, respond to inquiries, provide customer
            support, and improve our products and services. We do not sell your personal information to third parties.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-bold text-tes-black mb-2">Cookies &amp; Local Storage</h2>
          <p>
            Our website may use browser storage (such as local storage) to remember items in your cart or wishlist.
            This information stays on your device and is not shared with third parties.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-bold text-tes-black mb-2">Data Security</h2>
          <p>
            We take reasonable measures to protect your personal information from unauthorized access, alteration, or
            disclosure. However, no method of transmission over the internet is completely secure.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-bold text-tes-black mb-2">Your Rights</h2>
          <p>
            You may request access to, correction of, or deletion of your personal information by contacting us using
            the details below.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-bold text-tes-black mb-2">Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact us at{" "}
            <a href={`mailto:${settings.email}`} className="text-tes-gold-dark hover:underline">{settings.email}</a>{" "}
            or {settings.phone}.
          </p>
        </section>
      </div>
    </div>
  );
}

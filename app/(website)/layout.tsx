import Header from "@/components/website/Header";
import Footer from "@/components/website/Footer";
import { getSiteSettings } from "@/lib/website/data";

// Public pages read admin-managed content (categories, services, settings,
// promotions) from MongoDB. Without this, Next.js statically bakes that data
// in at build time and admin edits never show up on production without a
// redeploy. ISR revalidates every 60s so admin changes appear promptly.
export const revalidate = 60;

export default async function WebsiteLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSiteSettings();

  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: settings.businessName,
    description: settings.seoDescription,
    telephone: settings.phone,
    email: settings.email,
    url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
    ...(settings.address ? { address: settings.address } : {}),
  };

  return (
    <div className="flex min-h-full flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
      />
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

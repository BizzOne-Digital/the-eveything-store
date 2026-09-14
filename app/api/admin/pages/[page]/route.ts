/**
 * PageContent `sections` shape (per `page` value). This is the contract the public-site
 * engineer should use for fallback defaults when a PageContent document does not exist yet
 * or a field is missing. All fields are optional at the DB level (Schema.Types.Mixed) but the
 * admin panel always writes objects matching this shape.
 *
 * page = "home":
 * {
 *   hero: { heading, subheading, description, image, ctaPrimaryText, ctaPrimaryLink, ctaSecondaryText, ctaSecondaryLink },
 *   mission: { heading, description, image },
 *   whyChooseUs: { heading, items: [{ icon, title, description }] },
 *   featuredCategoriesHeading: string,
 *   featuredProductsHeading: string,
 *   servicesTeaser: { heading, description, ctaText, ctaLink },
 *   visibility: { hero, mission, whyChooseUs, featuredCategories, featuredProducts, servicesTeaser, promotions } // booleans
 * }
 *
 * page = "about":
 * {
 *   hero: { heading, subheading, image },
 *   story: { heading, description, image },
 *   mission: { heading, description },
 *   values: { heading, items: [{ icon, title, description }] },
 *   team: { heading, description, members: [{ name, role, image }] },
 *   visibility: { hero, story, mission, values, team }
 * }
 *
 * page = "services":
 * {
 *   hero: { heading, subheading, description, image },
 *   intro: { heading, description },
 *   ctaBanner: { heading, description, ctaText, ctaLink },
 *   visibility: { hero, intro, ctaBanner }
 * }
 *
 * page = "pricing":
 * {
 *   hero: { heading, subheading, description },
 *   plans: { heading, description, items: [{ name, price, period, features: string[], ctaText, ctaLink, highlighted }] },
 *   faq: { heading, items: [{ question, answer }] },
 *   visibility: { hero, plans, faq }
 * }
 *
 * page = "contact":
 * {
 *   hero: { heading, subheading, description },
 *   info: { heading, address, phone, email, hours },
 *   formSection: { heading, description },
 *   mapEmbedUrl: string,
 *   visibility: { hero, info, formSection, map }
 * }
 */

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/mongodb";
import { PageContent } from "@/models/PageContent";
import { getAdminSession } from "@/lib/auth";

const PAGE_VALUES = ["home", "about", "services", "pricing", "contact"] as const;

const putSchema = z.object({
  sections: z.record(z.string(), z.unknown()),
});

export async function GET(_request: NextRequest, { params }: { params: Promise<{ page: string }> }) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { page } = await params;
  if (!PAGE_VALUES.includes(page as (typeof PAGE_VALUES)[number])) {
    return NextResponse.json({ error: "Unknown page" }, { status: 400 });
  }

  await connectDB();
  const doc = await PageContent.findOne({ page }).lean();
  return NextResponse.json({ item: doc || { page, sections: {} } });
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ page: string }> }) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { page } = await params;
  if (!PAGE_VALUES.includes(page as (typeof PAGE_VALUES)[number])) {
    return NextResponse.json({ error: "Unknown page" }, { status: 400 });
  }

  const body = await request.json();
  const parsed = putSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message || "Invalid data" }, { status: 400 });
  }

  await connectDB();
  const doc = await PageContent.findOneAndUpdate(
    { page },
    { page, sections: parsed.data.sections },
    { new: true, upsert: true }
  );

  return NextResponse.json({ item: doc });
}

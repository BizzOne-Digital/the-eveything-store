import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/mongodb";
import { SiteSettings } from "@/models/SiteSettings";
import { getAdminSession } from "@/lib/auth";
import { deleteStoredUploadByUrl } from "@/lib/deleteStoredUpload";

const settingsSchema = z.object({
  businessName: z.string().min(1),
  tagline: z.string().optional(),
  logo: z.string().optional(),
  footerLogo: z.string().optional(),
  favicon: z.string().optional(),
  phone: z.string().min(1),
  email: z.string().email(),
  website: z.string().optional(),
  address: z.string().optional(),
  socialLinks: z
    .object({
      facebook: z.string().optional(),
      instagram: z.string().optional(),
      tiktok: z.string().optional(),
    })
    .optional()
    .default({}),
  announcementBar: z.string().optional(),
  heroHeading: z.string().optional(),
  heroSubheading: z.string().optional(),
  heroDescription: z.string().optional(),
  heroImage: z.string().optional(),
  heroCtaPrimaryText: z.string().optional(),
  heroCtaPrimaryLink: z.string().optional(),
  heroCtaSecondaryText: z.string().optional(),
  heroCtaSecondaryLink: z.string().optional(),
  footerDescription: z.string().optional(),
  footerMission: z.string().optional(),
  copyrightText: z.string().optional(),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  paymentMethodLabel: z.string().optional(),
});

export async function GET() {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();
  let settings = await SiteSettings.findOne();
  if (!settings) {
    settings = await SiteSettings.create({});
  }
  return NextResponse.json({ item: settings });
}

export async function PUT(request: NextRequest) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const parsed = settingsSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message || "Invalid data" }, { status: 400 });
  }

  await connectDB();
  const existing = await SiteSettings.findOne();

  if (existing) {
    if (existing.logo && parsed.data.logo !== existing.logo) {
      await deleteStoredUploadByUrl(existing.logo);
    }
    Object.assign(existing, parsed.data);
    await existing.save();
    return NextResponse.json({ item: existing });
  }

  const created = await SiteSettings.create(parsed.data);
  return NextResponse.json({ item: created });
}

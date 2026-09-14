import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import slugify from "slugify";
import { connectDB } from "@/lib/mongodb";
import { Service } from "@/models/Service";
import { getAdminSession } from "@/lib/auth";
import { deleteStoredUploadByUrl } from "@/lib/deleteStoredUpload";
import { SERVICE_ICONS } from "@/lib/service-icons";

const serviceSchema = z.object({
  name: z.string().min(1),
  slug: z.string().optional(),
  shortDescription: z.string().optional(),
  description: z.string().optional(),
  image: z.string().optional(),
  icon: z.enum(SERVICE_ICONS).optional(),
  pricingText: z.string().optional().default("Contact for Pricing"),
  featured: z.boolean().optional().default(false),
  active: z.boolean().optional().default(true),
  sortOrder: z.number().optional().default(0),
  ctaText: z.string().optional().default("Request Service"),
});

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  await connectDB();
  const item = await Service.findById(id).lean();
  if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ item });
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await request.json();
  const parsed = serviceSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message || "Invalid data" }, { status: 400 });
  }

  await connectDB();
  const existing = await Service.findById(id);
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const slug = slugify(parsed.data.slug || parsed.data.name, { lower: true, strict: true });
  if (!/^[a-z0-9-]+$/.test(slug)) {
    return NextResponse.json({ error: "Invalid slug" }, { status: 400 });
  }

  const dupe = await Service.findOne({ slug, _id: { $ne: id } });
  if (dupe) {
    return NextResponse.json({ error: "A service with this slug already exists" }, { status: 409 });
  }

  if (existing.image && parsed.data.image !== existing.image) {
    await deleteStoredUploadByUrl(existing.image);
  }

  Object.assign(existing, parsed.data, { slug });
  await existing.save();

  return NextResponse.json({ item: existing });
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  await connectDB();
  const existing = await Service.findById(id);
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  if (existing.image) await deleteStoredUploadByUrl(existing.image);
  await existing.deleteOne();

  return NextResponse.json({ success: true });
}

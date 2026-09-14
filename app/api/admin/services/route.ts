import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import slugify from "slugify";
import { connectDB } from "@/lib/mongodb";
import { Service } from "@/models/Service";
import { getAdminSession } from "@/lib/auth";
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

export async function GET(request: NextRequest) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();
  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search") || "";
  const page = Math.max(1, Number(searchParams.get("page") || 1));
  const limit = Math.min(100, Number(searchParams.get("limit") || 50));

  const query: Record<string, unknown> = {};
  if (search) query.name = { $regex: search, $options: "i" };

  const [items, total] = await Promise.all([
    Service.find(query)
      .sort({ sortOrder: 1, name: 1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    Service.countDocuments(query),
  ]);

  return NextResponse.json({ items, total, page, totalPages: Math.max(1, Math.ceil(total / limit)) });
}

export async function POST(request: NextRequest) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const parsed = serviceSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message || "Invalid data" }, { status: 400 });
  }

  await connectDB();
  const slug = slugify(parsed.data.slug || parsed.data.name, { lower: true, strict: true });
  if (!/^[a-z0-9-]+$/.test(slug)) {
    return NextResponse.json({ error: "Invalid slug" }, { status: 400 });
  }

  const existing = await Service.findOne({ slug });
  if (existing) {
    return NextResponse.json({ error: "A service with this slug already exists" }, { status: 409 });
  }

  const service = await Service.create({ ...parsed.data, slug });
  return NextResponse.json({ item: service }, { status: 201 });
}

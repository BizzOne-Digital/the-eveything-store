import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import slugify from "slugify";
import { connectDB } from "@/lib/mongodb";
import { Category } from "@/models/Category";
import { getAdminSession } from "@/lib/auth";

const categorySchema = z.object({
  name: z.string().min(1),
  slug: z.string().optional(),
  description: z.string().optional(),
  image: z.string().optional(),
  icon: z.string().optional(),
  featured: z.boolean().optional().default(false),
  active: z.boolean().optional().default(true),
  sortOrder: z.number().optional().default(0),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
});

function makeSlug(input: string) {
  const slug = slugify(input, { lower: true, strict: true });
  return slug;
}

export async function GET(request: NextRequest) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();
  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search") || "";
  const page = Math.max(1, Number(searchParams.get("page") || 1));
  const limit = Math.min(100, Number(searchParams.get("limit") || 50));

  const query: Record<string, unknown> = {};
  if (search) {
    query.name = { $regex: search, $options: "i" };
  }

  const [items, total] = await Promise.all([
    Category.find(query)
      .sort({ sortOrder: 1, name: 1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    Category.countDocuments(query),
  ]);

  return NextResponse.json({ items, total, page, totalPages: Math.max(1, Math.ceil(total / limit)) });
}

export async function POST(request: NextRequest) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const parsed = categorySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message || "Invalid data" }, { status: 400 });
  }

  await connectDB();
  const slug = makeSlug(parsed.data.slug || parsed.data.name);
  if (!/^[a-z0-9-]+$/.test(slug)) {
    return NextResponse.json({ error: "Invalid slug" }, { status: 400 });
  }

  const existing = await Category.findOne({ slug });
  if (existing) {
    return NextResponse.json({ error: "A category with this slug already exists" }, { status: 409 });
  }

  const category = await Category.create({ ...parsed.data, slug });
  return NextResponse.json({ item: category }, { status: 201 });
}

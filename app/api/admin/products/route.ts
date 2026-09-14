import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import slugify from "slugify";
import { connectDB } from "@/lib/mongodb";
import { Product } from "@/models/Product";
import { getAdminSession } from "@/lib/auth";

const productSchema = z.object({
  name: z.string().min(1),
  slug: z.string().optional(),
  shortDescription: z.string().optional(),
  description: z.string().optional(),
  category: z.string().min(1, "Category is required"),
  subCategory: z.string().optional(),
  brand: z.string().optional(),
  sku: z.string().optional(),
  price: z.number().min(0),
  salePrice: z.number().min(0).optional().nullable(),
  stock: z.number().min(0).default(0),
  lowStockThreshold: z.number().min(0).default(5),
  featured: z.boolean().optional().default(false),
  status: z.enum(["active", "draft", "archived"]).default("active"),
  images: z.array(z.string()).optional().default([]),
  mainImage: z.string().optional().default(""),
  tags: z.array(z.string()).optional().default([]),
  specifications: z.array(z.object({ key: z.string(), value: z.string() })).optional().default([]),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
});

export async function GET(request: NextRequest) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();
  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search") || "";
  const category = searchParams.get("category") || "";
  const status = searchParams.get("status") || "";
  const page = Math.max(1, Number(searchParams.get("page") || 1));
  const limit = Math.min(100, Number(searchParams.get("limit") || 20));

  const query: Record<string, unknown> = {};
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: "i" } },
      { sku: { $regex: search, $options: "i" } },
    ];
  }
  if (category) query.category = category;
  if (status) query.status = status;

  const [items, total] = await Promise.all([
    Product.find(query)
      .populate("category", "name slug")
      .sort({ updatedAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    Product.countDocuments(query),
  ]);

  return NextResponse.json({ items, total, page, totalPages: Math.max(1, Math.ceil(total / limit)) });
}

export async function POST(request: NextRequest) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const parsed = productSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message || "Invalid data" }, { status: 400 });
  }

  await connectDB();
  const slug = slugify(parsed.data.slug || parsed.data.name, { lower: true, strict: true });
  if (!/^[a-z0-9-]+$/.test(slug)) {
    return NextResponse.json({ error: "Invalid slug" }, { status: 400 });
  }

  const existing = await Product.findOne({ slug });
  if (existing) {
    return NextResponse.json({ error: "A product with this slug already exists" }, { status: 409 });
  }

  const mainImage = parsed.data.mainImage || parsed.data.images[0] || "";

  const product = await Product.create({ ...parsed.data, slug, mainImage });
  return NextResponse.json({ item: product }, { status: 201 });
}

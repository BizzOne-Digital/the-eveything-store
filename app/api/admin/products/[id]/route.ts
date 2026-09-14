import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import slugify from "slugify";
import { connectDB } from "@/lib/mongodb";
import { Product } from "@/models/Product";
import { getAdminSession } from "@/lib/auth";
import { deleteStoredUploadByUrl } from "@/lib/deleteStoredUpload";

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

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  await connectDB();
  const item = await Product.findById(id).populate("category", "name slug").lean();
  if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ item });
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await request.json();
  const parsed = productSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message || "Invalid data" }, { status: 400 });
  }

  await connectDB();
  const existing = await Product.findById(id);
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const slug = slugify(parsed.data.slug || parsed.data.name, { lower: true, strict: true });
  if (!/^[a-z0-9-]+$/.test(slug)) {
    return NextResponse.json({ error: "Invalid slug" }, { status: 400 });
  }

  const dupe = await Product.findOne({ slug, _id: { $ne: id } });
  if (dupe) {
    return NextResponse.json({ error: "A product with this slug already exists" }, { status: 409 });
  }

  // Clean up any images removed from the array
  const previousImages: string[] = existing.images || [];
  const nextImages = parsed.data.images;
  const removedImages = previousImages.filter((img) => !nextImages.includes(img));
  await Promise.all(removedImages.map((img) => deleteStoredUploadByUrl(img)));

  const mainImage = parsed.data.mainImage || nextImages[0] || "";

  Object.assign(existing, parsed.data, { slug, mainImage });
  await existing.save();

  return NextResponse.json({ item: existing });
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  await connectDB();
  const existing = await Product.findById(id);
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const images: string[] = existing.images || [];
  await Promise.all(images.map((img) => deleteStoredUploadByUrl(img)));
  await existing.deleteOne();

  return NextResponse.json({ success: true });
}

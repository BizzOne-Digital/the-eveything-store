import { NextRequest, NextResponse } from "next/server";
import slugify from "slugify";
import { connectDB } from "@/lib/mongodb";
import { Product } from "@/models/Product";
import { getAdminSession } from "@/lib/auth";

export async function POST(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  await connectDB();
  const source = await Product.findById(id).lean();
  if (!source) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const baseSlug = slugify(`${source.name}-copy`, { lower: true, strict: true });
  let slug = baseSlug;
  let counter = 1;
  while (await Product.findOne({ slug })) {
    counter += 1;
    slug = `${baseSlug}-${counter}`;
  }

  const sourceRecord = source as Record<string, unknown>;
  const { _id, createdAt, updatedAt, ...rest } = sourceRecord;
  void _id;
  void createdAt;
  void updatedAt;

  const duplicate = await Product.create({
    ...rest,
    name: `${source.name} (Copy)`,
    slug,
    status: "draft",
    sku: source.sku ? `${source.sku}-COPY` : undefined,
  });

  return NextResponse.json({ item: duplicate }, { status: 201 });
}

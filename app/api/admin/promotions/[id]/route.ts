import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/mongodb";
import { Promotion } from "@/models/Promotion";
import { getAdminSession } from "@/lib/auth";
import { deleteStoredUploadByUrl } from "@/lib/deleteStoredUpload";

const promotionSchema = z.object({
  title: z.string().min(1),
  subtitle: z.string().optional(),
  description: z.string().optional(),
  image: z.string().optional(),
  ctaText: z.string().optional().default("Shop Deals"),
  ctaLink: z.string().optional().default("/shop"),
  discountText: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  active: z.boolean().optional().default(true),
  featured: z.boolean().optional().default(false),
});

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  await connectDB();
  const item = await Promotion.findById(id).lean();
  if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ item });
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await request.json();
  const parsed = promotionSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message || "Invalid data" }, { status: 400 });
  }

  await connectDB();
  const existing = await Promotion.findById(id);
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  if (existing.image && parsed.data.image !== existing.image) {
    await deleteStoredUploadByUrl(existing.image);
  }

  Object.assign(existing, parsed.data, {
    startDate: parsed.data.startDate ? new Date(parsed.data.startDate) : undefined,
    endDate: parsed.data.endDate ? new Date(parsed.data.endDate) : undefined,
  });
  await existing.save();

  return NextResponse.json({ item: existing });
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  await connectDB();
  const existing = await Promotion.findById(id);
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  if (existing.image) await deleteStoredUploadByUrl(existing.image);
  await existing.deleteOne();

  return NextResponse.json({ success: true });
}

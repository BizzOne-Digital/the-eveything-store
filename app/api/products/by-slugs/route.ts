import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Product } from "@/models/Product";

export async function GET(req: NextRequest) {
  const slugsParam = req.nextUrl.searchParams.get("slugs");
  if (!slugsParam) return NextResponse.json({ products: [] });
  const slugs = slugsParam.split(",").filter(Boolean).slice(0, 12);

  try {
    await connectDB();
    const docs = await Product.find({ slug: { $in: slugs }, status: "active" }).lean();
    const products = JSON.parse(JSON.stringify(docs));
    return NextResponse.json({ products });
  } catch {
    return NextResponse.json({ products: [] });
  }
}

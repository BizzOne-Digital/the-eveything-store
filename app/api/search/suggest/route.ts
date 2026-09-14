import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Product } from "@/models/Product";
import { Category } from "@/models/Category";
import { Service } from "@/models/Service";

export interface SuggestItem {
  type: "product" | "category" | "service";
  id: string;
  title: string;
  image?: string;
  price?: number;
  salePrice?: number;
  href: string;
}

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q")?.trim();
  if (!q) return NextResponse.json({ results: [] });

  try {
    await connectDB();
    const regex = { $regex: q, $options: "i" };

    const [products, categories, services] = await Promise.all([
      Product.find({ status: "active", name: regex }).limit(5).lean(),
      Category.find({ active: true, name: regex }).limit(3).lean(),
      Service.find({ active: true, name: regex }).limit(3).lean(),
    ]);

    const results: SuggestItem[] = [
      ...products.map((p) => ({
        type: "product" as const,
        id: String(p._id),
        title: p.name,
        image: p.mainImage,
        price: p.price,
        salePrice: p.salePrice,
        href: `/shop/${p.slug}`,
      })),
      ...categories.map((c) => ({
        type: "category" as const,
        id: String(c._id),
        title: c.name,
        image: c.image,
        href: `/shop?category=${c.slug}`,
      })),
      ...services.map((s) => ({
        type: "service" as const,
        id: String(s._id),
        title: s.name,
        image: s.image,
        href: `/services#${s.slug}`,
      })),
    ];

    return NextResponse.json({ results });
  } catch {
    return NextResponse.json({ results: [] });
  }
}

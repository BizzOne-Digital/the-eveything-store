import type { MetadataRoute } from "next";
import { connectDB } from "@/lib/mongodb";
import { Product } from "@/models/Product";
import { Category } from "@/models/Category";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

const STATIC_ROUTES = [
  "",
  "/shop",
  "/services",
  "/about",
  "/pricing",
  "/contact",
  "/privacy",
  "/terms",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((path) => ({
    url: `${BASE_URL}${path}`,
    lastModified: new Date(),
    changeFrequency: path === "" ? "daily" : "weekly",
    priority: path === "" ? 1 : 0.7,
  }));

  try {
    await connectDB();
    const [products, categories] = await Promise.all([
      Product.find({ status: "active" }).select("slug updatedAt").lean(),
      Category.find({ active: true }).select("slug updatedAt").lean(),
    ]);

    const productEntries: MetadataRoute.Sitemap = products.map((p) => ({
      url: `${BASE_URL}/shop/${p.slug}`,
      lastModified: p.updatedAt,
      changeFrequency: "weekly",
      priority: 0.6,
    }));

    const categoryEntries: MetadataRoute.Sitemap = categories.map((c) => ({
      url: `${BASE_URL}/shop?category=${c.slug}`,
      lastModified: c.updatedAt,
      changeFrequency: "weekly",
      priority: 0.5,
    }));

    return [...staticEntries, ...productEntries, ...categoryEntries];
  } catch {
    return staticEntries;
  }
}

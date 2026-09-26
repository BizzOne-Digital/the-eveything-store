import { connectDB } from "@/lib/mongodb";
import { SiteSettings, type ISiteSettings } from "@/models/SiteSettings";
import { Category, type ICategory } from "@/models/Category";
import { Product, type IProduct } from "@/models/Product";
import { Service, type IService } from "@/models/Service";
import { Promotion, type IPromotion } from "@/models/Promotion";
import { PageContent } from "@/models/PageContent";

export type PlainCategory = Omit<ICategory, "_id"> & { _id: string };
export type PlainProduct = Omit<IProduct, "_id" | "category"> & {
  _id: string;
  category: string;
};
export type PlainService = Omit<IService, "_id"> & { _id: string };
export type PlainPromotion = Omit<IPromotion, "_id"> & { _id: string };
export type PlainSiteSettings = Omit<ISiteSettings, "_id"> & { _id: string };

function toPlain<T>(doc: unknown): T {
  return JSON.parse(JSON.stringify(doc)) as T;
}

const DEFAULT_SETTINGS: PlainSiteSettings = {
  _id: "default",
  businessName: "The Everything Shop & Services",
  tagline: "Everything You Need. All in One Place.",
  logo: "",
  footerLogo: "",
  favicon: "",
  phone: "647-470-1901",
  email: "tessshoporiginal@gmail.com",
  website: "www.TheEverythingShopandServices.ca",
  address: "",
  socialLinks: {},
  announcementBar: "Serving Local Communities | Big or Small, We've Got You!",
  heroHeading: "The Everything\nShop & Services",
  heroSubheading: "WELCOME TO",
  heroDescription:
    "Everything for business, big or small — from household products and clothing to everyday essentials and convenient local services.",
  heroImage: "",
  heroCtaPrimaryText: "Shop Now",
  heroCtaPrimaryLink: "/shop",
  heroCtaSecondaryText: "Explore Services",
  heroCtaSecondaryLink: "/services",
  footerDescription: "Everything you need. All in one place.",
  footerMission:
    "We aim to satisfy our customers, supply them with everyday needs and wants, and provide useful local services — offering just about everything a household or small business could need, all backed by reliable, local delivery and support.",
  copyrightText: "The Everything Shop & Services. All rights reserved.",
  seoTitle: "The Everything Shop & Services",
  seoDescription:
    "Everything for business, big or small. Household products, clothing, electronics, services, you name it — we've got it.",
  paymentMethodLabel: "Pay on Delivery / Pickup",
  createdAt: new Date(),
  updatedAt: new Date(),
};

export async function getSiteSettings(): Promise<PlainSiteSettings> {
  try {
    await connectDB();
    const doc = await SiteSettings.findOne().lean();
    if (!doc) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...toPlain<PlainSiteSettings>(doc) };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export async function getActiveCategories(): Promise<PlainCategory[]> {
  try {
    await connectDB();
    const docs = await Category.find({ active: true }).sort({ sortOrder: 1, name: 1 }).lean();
    return toPlain<PlainCategory[]>(docs);
  } catch {
    return [];
  }
}

export async function getFeaturedCategories(limit = 8): Promise<PlainCategory[]> {
  try {
    await connectDB();
    const docs = await Category.find({ active: true })
      .sort({ featured: -1, sortOrder: 1, name: 1 })
      .limit(limit)
      .lean();
    return toPlain<PlainCategory[]>(docs);
  } catch {
    return [];
  }
}

export async function getCategoryBySlug(slug: string): Promise<PlainCategory | null> {
  try {
    await connectDB();
    const doc = await Category.findOne({ slug, active: true }).lean();
    return doc ? toPlain<PlainCategory>(doc) : null;
  } catch {
    return null;
  }
}

export async function getFeaturedProducts(limit = 8): Promise<PlainProduct[]> {
  try {
    await connectDB();
    const docs = await Product.find({ featured: true, status: "active" })
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();
    return toPlain<PlainProduct[]>(docs);
  } catch {
    return [];
  }
}

export async function getProductBySlug(slug: string): Promise<PlainProduct | null> {
  try {
    await connectDB();
    const doc = await Product.findOne({ slug, status: "active" }).lean();
    return doc ? toPlain<PlainProduct>(doc) : null;
  } catch {
    return null;
  }
}

export async function getRelatedProducts(categoryId: string, excludeId: string, limit = 4): Promise<PlainProduct[]> {
  try {
    await connectDB();
    const docs = await Product.find({
      category: categoryId,
      status: "active",
      _id: { $ne: excludeId },
    })
      .limit(limit)
      .lean();
    return toPlain<PlainProduct[]>(docs);
  } catch {
    return [];
  }
}

export interface ShopFilters {
  q?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  sale?: boolean;
  inStock?: boolean;
  sort?: string;
  page?: number;
  perPage?: number;
}

export async function getShopProducts(filters: ShopFilters) {
  try {
    await connectDB();
    const query: Record<string, unknown> = { status: "active" };

    if (filters.q) {
      query.$or = [
        { name: { $regex: filters.q, $options: "i" } },
        { description: { $regex: filters.q, $options: "i" } },
        { tags: { $regex: filters.q, $options: "i" } },
      ];
    }
    if (filters.category) {
      const cat = await Category.findOne({ slug: filters.category }).lean<{ _id: string }>();
      if (cat) query.category = cat._id;
      else query.category = "___none___";
    }
    if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
      const priceQuery: Record<string, number> = {};
      if (filters.minPrice !== undefined) priceQuery.$gte = filters.minPrice;
      if (filters.maxPrice !== undefined) priceQuery.$lte = filters.maxPrice;
      query.price = priceQuery;
    }
    if (filters.sale) {
      query.salePrice = { $exists: true, $ne: null, $gt: 0 };
    }
    if (filters.inStock) {
      query.stock = { $gt: 0 };
    }

    let sort: Record<string, 1 | -1> = { createdAt: -1 };
    switch (filters.sort) {
      case "price-asc":
        sort = { price: 1 };
        break;
      case "price-desc":
        sort = { price: -1 };
        break;
      case "name-asc":
        sort = { name: 1 };
        break;
      case "oldest":
        sort = { createdAt: 1 };
        break;
      default:
        sort = { createdAt: -1 };
    }

    const page = filters.page && filters.page > 0 ? filters.page : 1;
    const perPage = filters.perPage ?? 12;

    const [docs, total] = await Promise.all([
      Product.find(query)
        .sort(sort)
        .skip((page - 1) * perPage)
        .limit(perPage)
        .lean(),
      Product.countDocuments(query),
    ]);

    return {
      products: toPlain<PlainProduct[]>(docs),
      total,
      page,
      perPage,
      totalPages: Math.max(1, Math.ceil(total / perPage)),
    };
  } catch {
    return { products: [] as PlainProduct[], total: 0, page: 1, perPage: 12, totalPages: 1 };
  }
}

export async function getFeaturedServices(limit = 6): Promise<PlainService[]> {
  try {
    await connectDB();
    const docs = await Service.find({ active: true })
      .sort({ featured: -1, sortOrder: 1 })
      .limit(limit)
      .lean();
    return toPlain<PlainService[]>(docs);
  } catch {
    return [];
  }
}

export async function getAllServices(): Promise<PlainService[]> {
  try {
    await connectDB();
    const docs = await Service.find({ active: true }).sort({ sortOrder: 1, name: 1 }).lean();
    return toPlain<PlainService[]>(docs);
  } catch {
    return [];
  }
}

export async function getActivePromotions(limit = 4): Promise<PlainPromotion[]> {
  try {
    await connectDB();
    const now = new Date();
    const docs = await Promotion.find({
      active: true,
      $or: [{ endDate: { $exists: false } }, { endDate: null }, { endDate: { $gte: now } }],
    })
      .sort({ featured: -1, createdAt: -1 })
      .limit(limit)
      .lean();
    return toPlain<PlainPromotion[]>(docs);
  } catch {
    return [];
  }
}

export async function getPageContent(page: "home" | "about" | "services" | "pricing" | "contact") {
  try {
    await connectDB();
    const doc = await PageContent.findOne({ page }).lean();
    if (!doc) return {} as Record<string, unknown>;
    return toPlain<{ sections: Record<string, unknown> }>(doc).sections ?? {};
  } catch {
    return {} as Record<string, unknown>;
  }
}

export interface SearchResults {
  products: PlainProduct[];
  categories: PlainCategory[];
  services: PlainService[];
}

export async function searchAll(q: string): Promise<SearchResults> {
  if (!q || !q.trim()) return { products: [], categories: [], services: [] };
  try {
    await connectDB();
    const regex = { $regex: q, $options: "i" };
    const [products, categories, services] = await Promise.all([
      Product.find({
        status: "active",
        $or: [{ name: regex }, { description: regex }, { tags: regex }],
      })
        .limit(24)
        .lean(),
      Category.find({ active: true, name: regex }).limit(12).lean(),
      Service.find({ active: true, $or: [{ name: regex }, { shortDescription: regex }] })
        .limit(12)
        .lean(),
    ]);
    return {
      products: toPlain<PlainProduct[]>(products),
      categories: toPlain<PlainCategory[]>(categories),
      services: toPlain<PlainService[]>(services),
    };
  } catch {
    return { products: [], categories: [], services: [] };
  }
}

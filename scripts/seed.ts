/* eslint-disable @typescript-eslint/no-explicit-any */
import "dotenv/config";
import bcrypt from "bcryptjs";
import { connectDB } from "../lib/mongodb";
import { Admin } from "../models/Admin";
import { Category } from "../models/Category";
import { Service } from "../models/Service";
import { SiteSettings } from "../models/SiteSettings";

const CATEGORIES = [
  {
    name: "Electronics",
    slug: "electronics",
    image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=800",
    sortOrder: 1,
    featured: true,
  },
  {
    name: "Clothing & Fashion",
    slug: "clothing-fashion",
    image: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=800",
    sortOrder: 2,
    featured: true,
  },
  {
    name: "Home & Kitchen",
    slug: "home-kitchen",
    image: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800",
    sortOrder: 3,
    featured: true,
  },
  {
    name: "Health & Beauty",
    slug: "health-beauty",
    image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800",
    sortOrder: 4,
    featured: true,
  },
  {
    name: "Toys & Kids",
    slug: "toys-kids",
    image: "https://images.unsplash.com/photo-1558877385-81a1c7e67d72?w=800",
    sortOrder: 5,
    featured: false,
  },
  {
    name: "Office & Business",
    slug: "office-business",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800",
    sortOrder: 6,
    featured: false,
  },
  {
    name: "Sports & Outdoors",
    slug: "sports-outdoors",
    image: "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=800",
    sortOrder: 7,
    featured: false,
  },
  {
    name: "Everyday Essentials",
    slug: "everyday-essentials",
    image: "https://images.unsplash.com/photo-1601599963565-b7f49deb02fd?w=800",
    sortOrder: 8,
    featured: false,
  },
];

const SERVICES = [
  {
    name: "Local Handyman",
    slug: "local-handyman",
    shortDescription: "Small jobs, big help.",
    icon: "wrench",
    image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800",
    sortOrder: 1,
    featured: true,
  },
  {
    name: "Drivers",
    slug: "drivers",
    shortDescription: "Reliable & professional.",
    icon: "car",
    image: "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=800",
    sortOrder: 2,
    featured: true,
  },
  {
    name: "Delivery Service",
    slug: "delivery-service",
    shortDescription: "Fast & safe delivery.",
    icon: "truck",
    image: "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=800",
    sortOrder: 3,
    featured: true,
  },
  {
    name: "More Services",
    slug: "more-services",
    shortDescription: "Ask us about additional services.",
    icon: "settings",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800",
    sortOrder: 4,
    featured: false,
  },
];

async function seed() {
  await connectDB();

  const adminEmail = process.env.SEED_ADMIN_EMAIL || "admin@bizzone.digital";
  const adminPassword = process.env.SEED_ADMIN_PASSWORD || "ChangeMe123!";

  const existingAdmin = await Admin.findOne({ email: adminEmail });
  if (!existingAdmin) {
    const passwordHash = await bcrypt.hash(adminPassword, 12);
    await Admin.create({
      name: "Site Administrator",
      email: adminEmail,
      passwordHash,
      role: "admin",
      active: true,
    });
    console.log(`Created admin user: ${adminEmail} / ${adminPassword}`);
  } else {
    console.log("Admin already exists, skipping.");
  }

  for (const cat of CATEGORIES) {
    await Category.updateOne({ slug: cat.slug }, { $setOnInsert: cat }, { upsert: true });
  }
  console.log("Categories seeded.");

  for (const svc of SERVICES) {
    await Service.updateOne({ slug: svc.slug }, { $setOnInsert: svc }, { upsert: true });
  }
  console.log("Services seeded.");

  const existingSettings = await SiteSettings.findOne();
  if (!existingSettings) {
    await SiteSettings.create({});
    console.log("Default site settings created.");
  }

  console.log("Seed complete.");
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});

/* eslint-disable @typescript-eslint/no-explicit-any */
import { config } from "dotenv";
config({ path: ".env.local" });
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
    image: "/pro1.png",
    sortOrder: 1,
    featured: true,
  },
  {
    name: "Clothing & Fashion",
    slug: "clothing-fashion",
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800",
    sortOrder: 2,
    featured: true,
  },
  {
    name: "Home & Kitchen",
    slug: "home-kitchen",
    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800",
    sortOrder: 3,
    featured: true,
  },
  {
    name: "Health & Beauty",
    slug: "health-beauty",
    image: "https://images.unsplash.com/photo-1560750588-73207b1ef5b8?w=800",
    sortOrder: 4,
    featured: true,
  },
  {
    name: "Toys & Kids",
    slug: "toys-kids",
    image: "https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=800",
    sortOrder: 5,
    featured: false,
  },
  {
    name: "Office & Business",
    slug: "office-business",
    image: "/pro6.png",
    sortOrder: 6,
    featured: false,
  },
  {
    name: "Sports & Outdoors",
    slug: "sports-outdoors",
    image: "/pro7.png",
    sortOrder: 7,
    featured: false,
  },
  {
    name: "Everyday Essentials",
    slug: "everyday-essentials",
    image: "/pro8.png",
    sortOrder: 8,
    featured: false,
  },
  {
    name: "Cars for Sale & Rental",
    slug: "used-cars",
    description: "Quality vehicles for sale and rental.",
    image: "https://images.unsplash.com/photo-1494905998402-395d579af36f?w=800",
    sortOrder: 9,
    featured: false,
  },
];

const SERVICES = [
  {
    name: "Local Handyman",
    slug: "local-handyman",
    shortDescription: "Small jobs, big help.",
    icon: "wrench",
    image: "/ser1.png",
    sortOrder: 1,
    featured: true,
  },
  {
    name: "Drivers",
    slug: "drivers",
    shortDescription: "Reliable & professional.",
    icon: "car",
    image: "/ser2.png",
    sortOrder: 2,
    featured: true,
  },
  {
    name: "Delivery Service",
    slug: "delivery-service",
    shortDescription: "Fast & safe delivery.",
    icon: "truck",
    image: "/ser3.png",
    sortOrder: 3,
    featured: true,
  },
  {
    name: "More Services",
    slug: "more-services",
    shortDescription: "Ask us about additional services.",
    icon: "settings",
    image: "/ser4.png",
    sortOrder: 4,
    featured: false,
  },
];

async function seed() {
  await connectDB();

  const adminEmail = process.env.SEED_ADMIN_EMAIL || "tessshoporiginal@gmail.com";
  const adminPassword = process.env.SEED_ADMIN_PASSWORD || "Admin@123";

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

import { Schema, models, model } from "mongoose";

export interface ISiteSettings {
  _id: string;
  businessName: string;
  tagline: string;
  logo?: string;
  footerLogo?: string;
  favicon?: string;
  phone: string;
  email: string;
  website?: string;
  address?: string;
  socialLinks: {
    facebook?: string;
    instagram?: string;
    tiktok?: string;
  };
  announcementBar?: string;
  heroHeading: string;
  heroSubheading: string;
  heroDescription: string;
  heroImage?: string;
  heroCtaPrimaryText: string;
  heroCtaPrimaryLink: string;
  heroCtaSecondaryText: string;
  heroCtaSecondaryLink: string;
  footerDescription?: string;
  footerMission?: string;
  copyrightText?: string;
  seoTitle?: string;
  seoDescription?: string;
  paymentMethodLabel: string;
  createdAt: Date;
  updatedAt: Date;
}

const SiteSettingsSchema = new Schema<ISiteSettings>(
  {
    businessName: { type: String, default: "The Everything Shop & Services" },
    tagline: { type: String, default: "Everything You Need. All in One Place." },
    logo: { type: String },
    footerLogo: { type: String },
    favicon: { type: String },
    phone: { type: String, default: "647-470-1901" },
    email: { type: String, default: "T.E.S.S@Gmail.com" },
    website: { type: String, default: "www.TheEverythingShopandServices.ca" },
    address: { type: String },
    socialLinks: {
      facebook: { type: String },
      instagram: { type: String },
      tiktok: { type: String },
    },
    announcementBar: {
      type: String,
      default: "Serving Local Communities | Big or Small, We've Got You!",
    },
    heroHeading: { type: String, default: "The Everything\nShop & Services" },
    heroSubheading: { type: String, default: "WELCOME TO" },
    heroDescription: {
      type: String,
      default:
        "Everything for business, big or small — from household products and clothing to everyday essentials and convenient local services.",
    },
    heroImage: { type: String },
    heroCtaPrimaryText: { type: String, default: "Shop Now" },
    heroCtaPrimaryLink: { type: String, default: "/shop" },
    heroCtaSecondaryText: { type: String, default: "Explore Services" },
    heroCtaSecondaryLink: { type: String, default: "/services" },
    footerDescription: {
      type: String,
      default: "Everything you need. All in one place.",
    },
    footerMission: {
      type: String,
      default:
        "We aim to satisfy our customers, supply them with everyday needs and wants, and offer just about everything through reliable local services.",
    },
    copyrightText: {
      type: String,
      default: "The Everything Shop & Services. All rights reserved.",
    },
    seoTitle: { type: String, default: "The Everything Shop & Services" },
    seoDescription: {
      type: String,
      default:
        "Everything for business, big or small. Household products, clothing, electronics, services, you name it — we've got it.",
    },
    paymentMethodLabel: { type: String, default: "Pay on Delivery / Pickup" },
  },
  { timestamps: true }
);

export const SiteSettings =
  models.SiteSettings || model<ISiteSettings>("SiteSettings", SiteSettingsSchema);

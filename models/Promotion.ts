import { Schema, models, model } from "mongoose";

export interface IPromotion {
  _id: string;
  title: string;
  subtitle?: string;
  description?: string;
  image?: string;
  ctaText?: string;
  ctaLink?: string;
  discountText?: string;
  startDate?: Date;
  endDate?: Date;
  active: boolean;
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const PromotionSchema = new Schema<IPromotion>(
  {
    title: { type: String, required: true },
    subtitle: { type: String },
    description: { type: String },
    image: { type: String },
    ctaText: { type: String, default: "Shop Deals" },
    ctaLink: { type: String, default: "/shop" },
    discountText: { type: String },
    startDate: { type: Date },
    endDate: { type: Date },
    active: { type: Boolean, default: true },
    featured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Promotion = models.Promotion || model<IPromotion>("Promotion", PromotionSchema);

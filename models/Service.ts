import { Schema, models, model } from "mongoose";

export interface IService {
  _id: string;
  name: string;
  slug: string;
  shortDescription?: string;
  description?: string;
  image?: string;
  icon?: string;
  pricingText: string;
  featured: boolean;
  active: boolean;
  sortOrder: number;
  ctaText?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ServiceSchema = new Schema<IService>(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    shortDescription: { type: String },
    description: { type: String },
    image: { type: String },
    icon: { type: String },
    pricingText: { type: String, default: "Contact for Pricing" },
    featured: { type: Boolean, default: false },
    active: { type: Boolean, default: true },
    sortOrder: { type: Number, default: 0 },
    ctaText: { type: String, default: "Request Service" },
  },
  { timestamps: true }
);

export const Service = models.Service || model<IService>("Service", ServiceSchema);

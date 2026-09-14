import { Schema, models, model } from "mongoose";

export interface ISpecification {
  key: string;
  value: string;
}

export interface IProduct {
  _id: string;
  name: string;
  slug: string;
  shortDescription?: string;
  description?: string;
  category: Schema.Types.ObjectId;
  subCategory?: string;
  brand?: string;
  sku?: string;
  price: number;
  salePrice?: number;
  stock: number;
  lowStockThreshold: number;
  featured: boolean;
  status: "active" | "draft" | "archived";
  images: string[];
  mainImage: string;
  tags: string[];
  specifications: ISpecification[];
  seoTitle?: string;
  seoDescription?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    shortDescription: { type: String },
    description: { type: String },
    category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
    subCategory: { type: String },
    brand: { type: String },
    sku: { type: String },
    price: { type: Number, required: true },
    salePrice: { type: Number },
    stock: { type: Number, default: 0 },
    lowStockThreshold: { type: Number, default: 5 },
    featured: { type: Boolean, default: false },
    status: { type: String, enum: ["active", "draft", "archived"], default: "active" },
    images: { type: [String], default: [] },
    mainImage: { type: String, default: "" },
    tags: { type: [String], default: [] },
    specifications: {
      type: [{ key: String, value: String }],
      default: [],
    },
    seoTitle: { type: String },
    seoDescription: { type: String },
  },
  { timestamps: true }
);

ProductSchema.index({ name: "text", description: "text", tags: "text" });

export const Product = models.Product || model<IProduct>("Product", ProductSchema);

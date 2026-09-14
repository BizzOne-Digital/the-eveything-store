import { Schema, models, model } from "mongoose";

export interface IPageContent {
  _id: string;
  page: "home" | "about" | "services" | "pricing" | "contact";
  sections: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

const PageContentSchema = new Schema<IPageContent>(
  {
    page: {
      type: String,
      enum: ["home", "about", "services", "pricing", "contact"],
      required: true,
      unique: true,
    },
    sections: { type: Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

export const PageContent =
  models.PageContent || model<IPageContent>("PageContent", PageContentSchema);

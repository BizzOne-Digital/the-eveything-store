import { Schema, models, model } from "mongoose";

export type InquiryType =
  | "Product Question"
  | "Service Question"
  | "Order Question"
  | "Pricing"
  | "Other";

export interface IInquiry {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  inquiryType: InquiryType;
  message: string;
  status: "unread" | "read" | "resolved";
  createdAt: Date;
  updatedAt: Date;
}

const InquirySchema = new Schema<IInquiry>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    subject: { type: String, required: true },
    inquiryType: {
      type: String,
      enum: ["Product Question", "Service Question", "Order Question", "Pricing", "Other"],
      default: "Other",
    },
    message: { type: String, required: true },
    status: { type: String, enum: ["unread", "read", "resolved"], default: "unread" },
  },
  { timestamps: true }
);

export const Inquiry = models.Inquiry || model<IInquiry>("Inquiry", InquirySchema);

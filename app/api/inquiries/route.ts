import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/mongodb";
import { Inquiry } from "@/models/Inquiry";

const schema = z.object({
  name: z.string().trim().min(1, "Name is required").max(200),
  email: z.string().trim().email("Enter a valid email address"),
  phone: z.string().trim().max(50).optional().or(z.literal("")),
  subject: z.string().trim().min(1, "Subject is required").max(200),
  inquiryType: z.enum(["Product Question", "Service Question", "Order Question", "Pricing", "Other"]),
  message: z.string().trim().min(1, "Message is required").max(5000),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Invalid submission." },
        { status: 400 }
      );
    }

    await connectDB();
    const inquiry = await Inquiry.create({
      ...parsed.data,
      phone: parsed.data.phone || undefined,
    });

    return NextResponse.json({ success: true, id: String(inquiry._id) });
  } catch {
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}

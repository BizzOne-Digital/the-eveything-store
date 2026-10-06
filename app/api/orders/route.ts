import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { persistOrder } from "@/lib/create-order";

const itemSchema = z.object({
  productId: z.string().optional(),
  name: z.string().min(1),
  image: z.string().optional().default(""),
  price: z.number().min(0),
  quantity: z.number().int().min(1),
});

const orderSchema = z.object({
  firstName: z.string().trim().min(1, "First name is required"),
  lastName: z.string().trim().min(1, "Last name is required"),
  email: z.string().trim().email("Enter a valid email address"),
  phone: z.string().trim().min(1, "Phone number is required"),
  address: z.string().trim().min(1, "Address is required"),
  city: z.string().trim().min(1, "City is required"),
  province: z.string().trim().min(1, "Province is required"),
  postalCode: z.string().trim().min(1, "Postal code is required"),
  deliveryNotes: z.string().trim().optional(),
  items: z.array(itemSchema).min(1, "Your cart is empty"),
  paymentMethod: z.string().optional().default("Pay on Delivery / Pickup"),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = orderSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Invalid order details." },
        { status: 400 }
      );
    }

    const data = parsed.data;
    const order = await persistOrder(data, data.items, data.paymentMethod, "pending");

    return NextResponse.json({ success: true, orderNumber: order.orderNumber });
  } catch {
    return NextResponse.json({ error: "Something went wrong placing your order. Please try again." }, { status: 500 });
  }
}

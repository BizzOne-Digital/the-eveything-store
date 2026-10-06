import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { capturePayPalOrder } from "@/lib/paypal";
import { persistOrder } from "@/lib/create-order";

export const runtime = "nodejs";

const itemSchema = z.object({
  productId: z.string().optional(),
  name: z.string().min(1),
  image: z.string().optional().default(""),
  price: z.number().min(0),
  quantity: z.number().int().min(1),
});

const schema = z.object({
  paypalOrderId: z.string().min(1),
  firstName: z.string().trim().min(1),
  lastName: z.string().trim().min(1),
  email: z.string().trim().email(),
  phone: z.string().trim().min(1),
  address: z.string().trim().min(1),
  city: z.string().trim().min(1),
  province: z.string().trim().min(1),
  postalCode: z.string().trim().min(1),
  deliveryNotes: z.string().trim().optional(),
  items: z.array(itemSchema).min(1),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Invalid order details." },
        { status: 400 }
      );
    }

    const data = parsed.data;
    const capture = await capturePayPalOrder(data.paypalOrderId);

    if (capture.status !== "COMPLETED") {
      return NextResponse.json({ error: "Payment was not completed." }, { status: 402 });
    }

    const order = await persistOrder(data, data.items, "PayPal", "paid");

    return NextResponse.json({ success: true, orderNumber: order.orderNumber });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to confirm PayPal payment." },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createPayPalOrder } from "@/lib/paypal";

export const runtime = "nodejs";

const itemSchema = z.object({
  price: z.number().min(0),
  quantity: z.number().int().min(1),
});

const schema = z.object({
  items: z.array(itemSchema).min(1),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid order details." }, { status: 400 });
    }

    // Total is always computed server-side — never trust a client-supplied amount.
    const total = parsed.data.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    if (total <= 0) {
      return NextResponse.json({ error: "Your cart is empty." }, { status: 400 });
    }

    const paypalOrderId = await createPayPalOrder(total);
    return NextResponse.json({ id: paypalOrderId });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to start PayPal checkout." },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/mongodb";
import { Order } from "@/models/Order";
import { Customer } from "@/models/Customer";
import { generateOrderNumber } from "@/lib/utils";

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

/**
 * Placeholder for a future real payment processor (e.g. Stripe/Square).
 * Intentionally a no-op today — checkout is "Pay on Delivery / Pickup" only.
 */
async function processPayment(): Promise<{ status: "pending" }> {
  return { status: "pending" };
}

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
    const subtotal = data.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const total = subtotal;

    await connectDB();

    const payment = await processPayment();

    let orderNumber = generateOrderNumber();
    for (let attempt = 0; attempt < 3; attempt++) {
      const exists = await Order.findOne({ orderNumber }).lean();
      if (!exists) break;
      orderNumber = generateOrderNumber();
    }

    const order = await Order.create({
      orderNumber,
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
      address: data.address,
      city: data.city,
      province: data.province,
      postalCode: data.postalCode,
      deliveryNotes: data.deliveryNotes || undefined,
      items: data.items.map((item) => ({
        product: item.productId || undefined,
        name: item.name,
        image: item.image,
        price: item.price,
        quantity: item.quantity,
      })),
      subtotal,
      total,
      paymentMethod: data.paymentMethod,
      paymentStatus: payment.status,
      status: "New",
    });

    const existingCustomer = await Customer.findOne({ email: data.email });
    if (existingCustomer) {
      existingCustomer.ordersCount += 1;
      existingCustomer.totalSpent += total;
      existingCustomer.firstName = data.firstName;
      existingCustomer.lastName = data.lastName;
      existingCustomer.phone = data.phone;
      existingCustomer.address = data.address;
      existingCustomer.city = data.city;
      existingCustomer.province = data.province;
      existingCustomer.postalCode = data.postalCode;
      await existingCustomer.save();
    } else {
      await Customer.create({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        address: data.address,
        city: data.city,
        province: data.province,
        postalCode: data.postalCode,
        ordersCount: 1,
        totalSpent: total,
      });
    }

    return NextResponse.json({ success: true, orderNumber: order.orderNumber });
  } catch {
    return NextResponse.json({ error: "Something went wrong placing your order. Please try again." }, { status: 500 });
  }
}

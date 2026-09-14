import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Customer } from "@/models/Customer";
import { Order } from "@/models/Order";
import { getAdminSession } from "@/lib/auth";

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  await connectDB();
  const customer = await Customer.findById(id).lean();
  if (!customer) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const orders = await Order.find({ email: customer.email }).sort({ createdAt: -1 }).lean();

  return NextResponse.json({ item: customer, orders });
}

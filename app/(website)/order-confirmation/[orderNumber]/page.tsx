import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, Package, Truck, Home } from "lucide-react";
import { connectDB } from "@/lib/mongodb";
import { Order, type IOrder } from "@/models/Order";
import { formatPrice } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Order Confirmation",
  robots: { index: false, follow: false },
};

interface OrderConfirmationProps {
  params: Promise<{ orderNumber: string }>;
}

async function getOrder(orderNumber: string): Promise<IOrder | null> {
  try {
    await connectDB();
    const doc = await Order.findOne({ orderNumber }).lean<IOrder>();
    return doc ? JSON.parse(JSON.stringify(doc)) : null;
  } catch {
    return null;
  }
}

export default async function OrderConfirmationPage({ params }: OrderConfirmationProps) {
  const { orderNumber } = await params;
  const order = await getOrder(orderNumber);

  if (!order) {
    return (
      <div className="mx-auto max-w-2xl px-4 sm:px-6 py-20 text-center">
        <h1 className="font-display text-2xl font-bold text-tes-black">Order Not Found</h1>
        <p className="mt-2 text-sm text-tes-muted">
          We couldn&apos;t find an order with number &quot;{orderNumber}&quot;. Please check the link and try again.
        </p>
        <Link href="/" className="mt-6 inline-flex items-center rounded-full bg-tes-black px-6 py-2.5 text-sm font-bold text-white">
          Return Home
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-14">
      <div className="flex flex-col items-center text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 mb-4">
          <CheckCircle2 className="h-8 w-8" />
        </div>
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-tes-black">Thank You, {order.firstName}!</h1>
        <p className="mt-2 text-sm text-tes-muted">Your order has been received and is being processed.</p>
        <p className="mt-3 rounded-full bg-tes-cream px-5 py-2 text-sm font-bold text-tes-black">
          Order #{order.orderNumber}
        </p>
      </div>

      <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-tes-border p-6">
          <h2 className="font-display text-base font-bold text-tes-black mb-3">Customer Details</h2>
          <dl className="text-sm text-tes-muted space-y-1.5">
            <div className="flex justify-between"><dt>Name</dt><dd className="text-tes-black font-medium">{order.firstName} {order.lastName}</dd></div>
            <div className="flex justify-between"><dt>Email</dt><dd className="text-tes-black font-medium">{order.email}</dd></div>
            <div className="flex justify-between"><dt>Phone</dt><dd className="text-tes-black font-medium">{order.phone}</dd></div>
          </dl>
        </div>
        <div className="rounded-2xl border border-tes-border p-6">
          <h2 className="font-display text-base font-bold text-tes-black mb-3">Delivery Address</h2>
          <p className="text-sm text-tes-muted leading-relaxed">
            {order.address}<br />
            {order.city}, {order.province} {order.postalCode}
          </p>
          {order.deliveryNotes && <p className="mt-2 text-xs text-tes-muted italic">Note: {order.deliveryNotes}</p>}
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-tes-border p-6">
        <h2 className="font-display text-base font-bold text-tes-black mb-4">Order Items</h2>
        <div className="divide-y divide-tes-border">
          {order.items.map((item, i) => (
            <div key={i} className="flex items-center justify-between py-3 text-sm">
              <div>
                <p className="font-medium text-tes-black">{item.name}</p>
                <p className="text-tes-muted">Qty {item.quantity} &times; {formatPrice(item.price)}</p>
              </div>
              <p className="font-semibold text-tes-black">{formatPrice(item.price * item.quantity)}</p>
            </div>
          ))}
        </div>
        <div className="mt-4 pt-4 border-t border-tes-border space-y-1.5">
          <div className="flex justify-between text-sm"><span className="text-tes-muted">Subtotal</span><span className="text-tes-black font-medium">{formatPrice(order.subtotal)}</span></div>
          <div className="flex justify-between text-base font-bold"><span className="text-tes-black">Total</span><span className="text-tes-black">{formatPrice(order.total)}</span></div>
        </div>
        <div className="mt-4 rounded-xl bg-tes-cream p-3.5 flex items-center justify-between text-sm">
          <span className="text-tes-muted">Payment Method</span>
          <span className="font-semibold text-tes-black">{order.paymentMethod}</span>
        </div>
        <div className="mt-3 flex items-center justify-between text-sm">
          <span className="text-tes-muted">Order Status</span>
          <span className="font-semibold text-tes-gold-dark">{order.status}</span>
        </div>
      </div>

      <div className="mt-8 rounded-2xl bg-tes-black p-6 text-white">
        <h2 className="font-display text-base font-bold mb-4">What Happens Next</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
          <div className="flex items-start gap-2.5">
            <Package className="h-4 w-4 text-tes-gold shrink-0 mt-0.5" />
            <span className="text-white/80">We confirm and prepare your order.</span>
          </div>
          <div className="flex items-start gap-2.5">
            <Truck className="h-4 w-4 text-tes-gold shrink-0 mt-0.5" />
            <span className="text-white/80">Your order is delivered or ready for pickup.</span>
          </div>
          <div className="flex items-start gap-2.5">
            <Home className="h-4 w-4 text-tes-gold shrink-0 mt-0.5" />
            <span className="text-white/80">You pay on delivery or pickup — no online payment needed.</span>
          </div>
        </div>
      </div>

      <div className="mt-8 flex justify-center">
        <Link href="/shop" className="inline-flex items-center rounded-full bg-tes-black px-7 py-3 text-sm font-bold text-white hover:bg-tes-gold hover:text-tes-black transition-colors">
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}

"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { ArrowLeft, Loader2 } from "lucide-react";
import { formatPrice } from "@/lib/utils";

const ORDER_STATUSES = [
  "New",
  "Confirmed",
  "Processing",
  "Ready",
  "Out for Delivery",
  "Completed",
  "Cancelled",
];

interface OrderItem {
  product?: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
}

interface OrderDetail {
  _id: string;
  orderNumber: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  province: string;
  postalCode: string;
  deliveryNotes?: string;
  items: OrderItem[];
  subtotal: number;
  total: number;
  paymentMethod: string;
  paymentStatus: string;
  status: string;
  createdAt: string;
}

export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch(`/api/admin/orders/${id}`)
      .then((res) => res.json())
      .then((data) => setOrder(data.item))
      .catch(() => toast.error("Failed to load order"))
      .finally(() => setLoading(false));
  }, [id]);

  async function updateOrder(patch: Partial<Pick<OrderDetail, "status" | "paymentStatus">>) {
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/orders/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update order");
      setOrder(data.item);
      toast.success("Order updated");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update order");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <p className="text-sm text-slate-400">Loading order...</p>;
  }

  if (!order) {
    return <p className="text-sm text-red-500">Order not found.</p>;
  }

  return (
    <div className="max-w-4xl space-y-6">
      <Link href="/admin/orders" className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-800">
        <ArrowLeft size={15} /> Back to orders
      </Link>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-lg font-semibold text-slate-900">{order.orderNumber}</h1>
          <p className="text-sm text-slate-500">{new Date(order.createdAt).toLocaleString()}</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-500">Order status</label>
            <select
              value={order.status}
              disabled={saving}
              onChange={(e) => updateOrder({ status: e.target.value })}
              className="rounded-md border border-slate-300 px-3 py-1.5 text-sm focus:border-tes-gold focus:outline-none focus:ring-1 focus:ring-tes-gold"
            >
              {ORDER_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-500">Payment status</label>
            <select
              value={order.paymentStatus}
              disabled={saving}
              onChange={(e) => updateOrder({ paymentStatus: e.target.value })}
              className="rounded-md border border-slate-300 px-3 py-1.5 text-sm focus:border-tes-gold focus:outline-none focus:ring-1 focus:ring-tes-gold"
            >
              <option value="pending">Pending</option>
              <option value="paid">Paid</option>
              <option value="failed">Failed</option>
            </select>
          </div>
          {saving && <Loader2 size={18} className="mt-6 animate-spin text-tes-gold" />}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm lg:col-span-2">
          <h2 className="mb-3 text-sm font-semibold text-slate-900">Items</h2>
          <div className="divide-y divide-slate-100">
            {order.items.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between py-3 text-sm">
                <div>
                  <p className="font-medium text-slate-800">{item.name}</p>
                  <p className="text-xs text-slate-400">Qty {item.quantity}</p>
                </div>
                <p className="font-medium text-slate-800">{formatPrice(item.price * item.quantity)}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 space-y-1 border-t border-slate-100 pt-3 text-sm">
            <div className="flex justify-between text-slate-500">
              <span>Subtotal</span>
              <span>{formatPrice(order.subtotal)}</span>
            </div>
            <div className="flex justify-between text-base font-semibold text-slate-900">
              <span>Total</span>
              <span>{formatPrice(order.total)}</span>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="mb-3 text-sm font-semibold text-slate-900">Customer</h2>
            <p className="text-sm text-slate-700">
              {order.firstName} {order.lastName}
            </p>
            <p className="text-sm text-slate-500">{order.email}</p>
            <p className="text-sm text-slate-500">{order.phone}</p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="mb-3 text-sm font-semibold text-slate-900">Delivery Address</h2>
            <p className="text-sm text-slate-700">{order.address}</p>
            <p className="text-sm text-slate-700">
              {order.city}, {order.province} {order.postalCode}
            </p>
            {order.deliveryNotes && (
              <p className="mt-2 text-sm text-slate-500">Notes: {order.deliveryNotes}</p>
            )}
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="mb-3 text-sm font-semibold text-slate-900">Payment</h2>
            <p className="text-sm text-slate-700">{order.paymentMethod}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

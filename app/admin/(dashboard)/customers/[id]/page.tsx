import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { connectDB } from "@/lib/mongodb";
import { Customer } from "@/models/Customer";
import { Order } from "@/models/Order";
import { formatPrice } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function CustomerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await connectDB();
  const customer = await Customer.findById(id).lean();
  if (!customer) notFound();

  const orders = await Order.find({ email: customer.email }).sort({ createdAt: -1 }).lean();

  return (
    <div className="max-w-4xl space-y-6">
      <Link href="/admin/customers" className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-800">
        <ArrowLeft size={15} /> Back to customers
      </Link>

      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h1 className="text-lg font-semibold text-slate-900">
          {customer.firstName} {customer.lastName}
        </h1>
        <div className="mt-2 grid grid-cols-1 gap-2 text-sm text-slate-600 sm:grid-cols-2">
          <p>Email: {customer.email}</p>
          <p>Phone: {customer.phone || "—"}</p>
          <p>Orders: {customer.ordersCount}</p>
          <p>Total Spent: {formatPrice(customer.totalSpent)}</p>
          {customer.address && (
            <p className="sm:col-span-2">
              Address: {customer.address}, {customer.city}, {customer.province} {customer.postalCode}
            </p>
          )}
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="mb-3 text-sm font-semibold text-slate-900">Order History</h2>
        {orders.length === 0 ? (
          <p className="text-sm text-slate-400">No orders yet.</p>
        ) : (
          <div className="divide-y divide-slate-100">
            {orders.map((order) => (
              <div key={String(order._id)} className="flex items-center justify-between py-3 text-sm">
                <div>
                  <Link href={`/admin/orders/${order._id}`} className="font-medium text-slate-800 hover:text-tes-gold">
                    {order.orderNumber}
                  </Link>
                  <p className="text-xs text-slate-400">{new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-slate-800">{formatPrice(order.total)}</p>
                  <p className="text-xs text-slate-400">{order.status}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

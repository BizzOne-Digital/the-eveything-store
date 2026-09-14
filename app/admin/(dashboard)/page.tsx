import Link from "next/link";
import { connectDB } from "@/lib/mongodb";
import { Product } from "@/models/Product";
import { Category } from "@/models/Category";
import { Order } from "@/models/Order";
import { Service } from "@/models/Service";
import { Inquiry } from "@/models/Inquiry";
import { Promotion } from "@/models/Promotion";
import DashboardCard from "@/components/admin/DashboardCard";
import { formatPrice } from "@/lib/utils";
import {
  Package,
  FolderTree,
  ShoppingCart,
  Clock,
  CheckCircle2,
  Wrench,
  MessageSquare,
  BadgePercent,
} from "lucide-react";

export const dynamic = "force-dynamic";

interface LeanOrder {
  _id: string;
  orderNumber: string;
  firstName: string;
  lastName: string;
  total: number;
  status: string;
  createdAt: Date;
}

interface LeanProduct {
  _id: string;
  name: string;
  stock: number;
  lowStockThreshold: number;
  mainImage?: string;
  updatedAt: Date;
}

interface LeanInquiry {
  _id: string;
  name: string;
  subject: string;
  status: string;
  createdAt: Date;
}

export default async function AdminDashboardPage() {
  await connectDB();

  const [
    totalProducts,
    totalCategories,
    totalOrders,
    pendingOrders,
    completedOrders,
    totalServices,
    unreadInquiries,
    activePromotions,
    latestOrders,
    lowStockProducts,
    recentInquiries,
    recentlyUpdatedProducts,
  ] = await Promise.all([
    Product.countDocuments(),
    Category.countDocuments(),
    Order.countDocuments(),
    Order.countDocuments({ status: "New" }),
    Order.countDocuments({ status: "Completed" }),
    Service.countDocuments(),
    Inquiry.countDocuments({ status: "unread" }),
    Promotion.countDocuments({ active: true }),
    Order.find().sort({ createdAt: -1 }).limit(5).lean<LeanOrder[]>(),
    Product.find({ $expr: { $lte: ["$stock", "$lowStockThreshold"] } })
      .sort({ stock: 1 })
      .limit(8)
      .lean<LeanProduct[]>(),
    Inquiry.find().sort({ status: 1, createdAt: -1 }).limit(5).lean<LeanInquiry[]>(),
    Product.find().sort({ updatedAt: -1 }).limit(5).lean<LeanProduct[]>(),
  ]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        <DashboardCard icon={Package} label="Total Products" value={totalProducts} />
        <DashboardCard icon={FolderTree} label="Total Categories" value={totalCategories} />
        <DashboardCard icon={ShoppingCart} label="Total Orders" value={totalOrders} />
        <DashboardCard icon={Clock} label="Pending Orders" value={pendingOrders} tone="warning" />
        <DashboardCard icon={CheckCircle2} label="Completed Orders" value={completedOrders} tone="success" />
        <DashboardCard icon={Wrench} label="Total Services" value={totalServices} />
        <DashboardCard icon={MessageSquare} label="Unread Inquiries" value={unreadInquiries} tone="warning" />
        <DashboardCard icon={BadgePercent} label="Active Promotions" value={activePromotions} tone="success" />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-900">Latest Orders</h2>
            <Link href="/admin/orders" className="text-xs font-medium text-tes-gold hover:underline">
              View all
            </Link>
          </div>
          {latestOrders.length === 0 ? (
            <p className="py-6 text-center text-sm text-slate-400">No orders yet.</p>
          ) : (
            <ul className="divide-y divide-slate-100">
              {latestOrders.map((order) => (
                <li key={order._id} className="flex items-center justify-between py-2.5 text-sm">
                  <div>
                    <Link href={`/admin/orders/${order._id}`} className="font-medium text-slate-800 hover:text-tes-gold">
                      {order.orderNumber}
                    </Link>
                    <p className="text-xs text-slate-400">
                      {order.firstName} {order.lastName}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-slate-800">{formatPrice(order.total)}</p>
                    <p className="text-xs text-slate-400">{order.status}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-900">Low Stock Products</h2>
            <Link href="/admin/products" className="text-xs font-medium text-tes-gold hover:underline">
              View all
            </Link>
          </div>
          {lowStockProducts.length === 0 ? (
            <p className="py-6 text-center text-sm text-slate-400">No low-stock items.</p>
          ) : (
            <ul className="divide-y divide-slate-100">
              {lowStockProducts.map((p) => (
                <li key={p._id} className="flex items-center justify-between py-2.5 text-sm">
                  <Link href={`/admin/products/${p._id}`} className="font-medium text-slate-800 hover:text-tes-gold">
                    {p.name}
                  </Link>
                  <span className="rounded-full bg-red-50 px-2 py-0.5 text-xs font-medium text-red-600">
                    {p.stock} in stock
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-900">Recent Inquiries</h2>
            <Link href="/admin/inquiries" className="text-xs font-medium text-tes-gold hover:underline">
              View all
            </Link>
          </div>
          {recentInquiries.length === 0 ? (
            <p className="py-6 text-center text-sm text-slate-400">No inquiries yet.</p>
          ) : (
            <ul className="divide-y divide-slate-100">
              {recentInquiries.map((inq) => (
                <li key={inq._id} className="flex items-center justify-between py-2.5 text-sm">
                  <div>
                    <p className="font-medium text-slate-800">{inq.name}</p>
                    <p className="text-xs text-slate-400">{inq.subject}</p>
                  </div>
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      inq.status === "unread"
                        ? "bg-amber-50 text-amber-600"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {inq.status}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-900">Recently Updated Products</h2>
            <Link href="/admin/products" className="text-xs font-medium text-tes-gold hover:underline">
              View all
            </Link>
          </div>
          {recentlyUpdatedProducts.length === 0 ? (
            <p className="py-6 text-center text-sm text-slate-400">No products yet.</p>
          ) : (
            <ul className="divide-y divide-slate-100">
              {recentlyUpdatedProducts.map((p) => (
                <li key={p._id} className="flex items-center justify-between py-2.5 text-sm">
                  <Link href={`/admin/products/${p._id}`} className="font-medium text-slate-800 hover:text-tes-gold">
                    {p.name}
                  </Link>
                  <span className="text-xs text-slate-400">
                    {new Date(p.updatedAt).toLocaleDateString()}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

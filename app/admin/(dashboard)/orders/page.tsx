"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import {
  TableSearchInput,
  TableSelect,
  TablePagination,
  EmptyState,
  TableSkeleton,
} from "@/components/admin/AdminTable";
import { formatPrice } from "@/lib/utils";

interface OrderRow {
  _id: string;
  orderNumber: string;
  firstName: string;
  lastName: string;
  total: number;
  paymentStatus: string;
  status: string;
  createdAt: string;
}

const STATUS_OPTIONS = [
  { label: "All statuses", value: "" },
  { label: "New", value: "New" },
  { label: "Confirmed", value: "Confirmed" },
  { label: "Processing", value: "Processing" },
  { label: "Ready", value: "Ready" },
  { label: "Out for Delivery", value: "Out for Delivery" },
  { label: "Completed", value: "Completed" },
  { label: "Cancelled", value: "Cancelled" },
];

const STATUS_TONE: Record<string, string> = {
  New: "bg-blue-50 text-blue-600",
  Confirmed: "bg-indigo-50 text-indigo-600",
  Processing: "bg-amber-50 text-amber-600",
  Ready: "bg-purple-50 text-purple-600",
  "Out for Delivery": "bg-cyan-50 text-cyan-600",
  Completed: "bg-emerald-50 text-emerald-600",
  Cancelled: "bg-red-50 text-red-600",
};

export default function OrdersPage() {
  const [items, setItems] = useState<OrderRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (status) params.set("status", status);
      params.set("page", String(page));
      const res = await fetch(`/api/admin/orders?${params.toString()}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load orders");
      setItems(data.items);
      setTotalPages(data.totalPages);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to load orders");
    } finally {
      setLoading(false);
    }
  }, [search, status, page]);

  useEffect(() => {
    const t = setTimeout(load, 250);
    return () => clearTimeout(t);
  }, [load]);

  function handleSearchChange(value: string) {
    setSearch(value);
    setPage(1);
  }

  function handleStatusChange(value: string) {
    setStatus(value);
    setPage(1);
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <TableSearchInput value={search} onChange={handleSearchChange} placeholder="Search order # or customer..." />
        <TableSelect value={status} onChange={handleStatusChange} options={STATUS_OPTIONS} />
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
        {loading ? (
          <TableSkeleton cols={6} />
        ) : items.length === 0 ? (
          <EmptyState message="No orders found." />
        ) : (
          <>
            <table className="min-w-full divide-y divide-slate-100 text-sm">
              <thead className="bg-slate-50 text-left text-xs font-semibold uppercase text-slate-500">
                <tr>
                  <th className="px-4 py-3">Order #</th>
                  <th className="px-4 py-3">Customer</th>
                  <th className="px-4 py-3">Total</th>
                  <th className="px-4 py-3">Payment</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {items.map((order) => (
                  <tr key={order._id} className="cursor-pointer hover:bg-slate-50">
                    <td className="px-4 py-3">
                      <Link href={`/admin/orders/${order._id}`} className="font-medium text-slate-800 hover:text-tes-gold">
                        {order.orderNumber}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-slate-700">
                      {order.firstName} {order.lastName}
                    </td>
                    <td className="px-4 py-3 text-slate-800">{formatPrice(order.total)}</td>
                    <td className="px-4 py-3 capitalize text-slate-600">{order.paymentStatus}</td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_TONE[order.status] || "bg-slate-100 text-slate-500"}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-500">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <TablePagination page={page} totalPages={totalPages} onChange={setPage} />
          </>
        )}
      </div>
    </div>
  );
}

"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { X, Trash2 } from "lucide-react";
import { TableSearchInput, TableSelect, TablePagination, EmptyState, TableSkeleton } from "@/components/admin/AdminTable";
import ConfirmDialog from "@/components/admin/ConfirmDialog";

interface InquiryRow {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  inquiryType: string;
  message: string;
  status: "unread" | "read" | "resolved";
  createdAt: string;
}

const STATUS_OPTIONS = [
  { label: "All statuses", value: "" },
  { label: "Unread", value: "unread" },
  { label: "Read", value: "read" },
  { label: "Resolved", value: "resolved" },
];

const TYPE_OPTIONS = [
  { label: "All types", value: "" },
  { label: "Product Question", value: "Product Question" },
  { label: "Service Question", value: "Service Question" },
  { label: "Order Question", value: "Order Question" },
  { label: "Pricing", value: "Pricing" },
  { label: "Other", value: "Other" },
];

export default function InquiriesPage() {
  const [items, setItems] = useState<InquiryRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [inquiryType, setInquiryType] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selected, setSelected] = useState<InquiryRow | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<InquiryRow | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (status) params.set("status", status);
      if (inquiryType) params.set("inquiryType", inquiryType);
      params.set("page", String(page));
      const res = await fetch(`/api/admin/inquiries?${params.toString()}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load inquiries");
      setItems(data.items);
      setTotalPages(data.totalPages);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to load inquiries");
    } finally {
      setLoading(false);
    }
  }, [search, status, inquiryType, page]);

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

  function handleTypeChange(value: string) {
    setInquiryType(value);
    setPage(1);
  }

  async function updateStatus(item: InquiryRow, newStatus: InquiryRow["status"]) {
    try {
      const res = await fetch(`/api/admin/inquiries/${item._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update inquiry");
      toast.success("Inquiry updated");
      setSelected(data.item);
      load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update inquiry");
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    try {
      const res = await fetch(`/api/admin/inquiries/${deleteTarget._id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to delete inquiry");
      toast.success("Inquiry deleted");
      setDeleteTarget(null);
      setSelected(null);
      load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete inquiry");
    }
  }

  function openInquiry(item: InquiryRow) {
    setSelected(item);
    if (item.status === "unread") updateStatus(item, "read");
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <TableSearchInput value={search} onChange={handleSearchChange} placeholder="Search name or subject..." />
        <TableSelect value={status} onChange={handleStatusChange} options={STATUS_OPTIONS} />
        <TableSelect value={inquiryType} onChange={handleTypeChange} options={TYPE_OPTIONS} />
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
        {loading ? (
          <TableSkeleton cols={5} />
        ) : items.length === 0 ? (
          <EmptyState message="No inquiries found." />
        ) : (
          <>
            <table className="min-w-full divide-y divide-slate-100 text-sm">
              <thead className="bg-slate-50 text-left text-xs font-semibold uppercase text-slate-500">
                <tr>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Subject</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {items.map((item) => (
                  <tr
                    key={item._id}
                    onClick={() => openInquiry(item)}
                    className="cursor-pointer hover:bg-slate-50"
                  >
                    <td className="px-4 py-3 font-medium text-slate-800">{item.name}</td>
                    <td className="px-4 py-3 text-slate-600">{item.subject}</td>
                    <td className="px-4 py-3 text-slate-600">{item.inquiryType}</td>
                    <td className="px-4 py-3 text-slate-500">{new Date(item.createdAt).toLocaleDateString()}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-medium capitalize ${
                          item.status === "unread"
                            ? "bg-amber-50 text-amber-600"
                            : item.status === "resolved"
                            ? "bg-emerald-50 text-emerald-600"
                            : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <TablePagination page={page} totalPages={totalPages} onChange={setPage} />
          </>
        )}
      </div>

      {selected && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/40">
          <div className="flex h-full w-full max-w-md flex-col bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
              <h2 className="text-base font-semibold text-slate-900">{selected.subject}</h2>
              <button onClick={() => setSelected(null)} className="text-slate-400 hover:text-slate-700">
                <X size={20} />
              </button>
            </div>
            <div className="flex-1 space-y-4 overflow-y-auto px-5 py-4 text-sm">
              <div>
                <p className="text-xs font-medium uppercase text-slate-400">From</p>
                <p className="text-slate-800">{selected.name}</p>
                <p className="text-slate-500">{selected.email}</p>
                {selected.phone && <p className="text-slate-500">{selected.phone}</p>}
              </div>
              <div>
                <p className="text-xs font-medium uppercase text-slate-400">Type</p>
                <p className="text-slate-800">{selected.inquiryType}</p>
              </div>
              <div>
                <p className="text-xs font-medium uppercase text-slate-400">Message</p>
                <p className="whitespace-pre-wrap text-slate-700">{selected.message}</p>
              </div>
              <div>
                <p className="text-xs font-medium uppercase text-slate-400">Received</p>
                <p className="text-slate-700">{new Date(selected.createdAt).toLocaleString()}</p>
              </div>
            </div>
            <div className="flex flex-wrap justify-between gap-2 border-t border-slate-200 px-5 py-4">
              <button
                onClick={() => setDeleteTarget(selected)}
                className="flex items-center gap-1 rounded-md border border-red-200 px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50"
              >
                <Trash2 size={14} /> Delete
              </button>
              <div className="flex gap-2">
                {selected.status !== "read" && (
                  <button
                    onClick={() => updateStatus(selected, "read")}
                    className="rounded-md border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-50"
                  >
                    Mark Read
                  </button>
                )}
                {selected.status !== "resolved" && (
                  <button
                    onClick={() => updateStatus(selected, "resolved")}
                    className="rounded-md bg-tes-gold px-3 py-1.5 text-sm font-semibold text-slate-900 hover:opacity-90"
                  >
                    Mark Resolved
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete inquiry?"
        description={`This will permanently remove the inquiry from "${deleteTarget?.name}".`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}

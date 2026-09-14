"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Star } from "lucide-react";
import { TableSearchInput, EmptyState, TableSkeleton } from "@/components/admin/AdminTable";
import ServiceForm, { ServiceFormValues } from "@/components/admin/ServiceForm";
import ConfirmDialog from "@/components/admin/ConfirmDialog";

interface ServiceRow {
  _id: string;
  name: string;
  slug: string;
  image?: string;
  icon?: string;
  pricingText: string;
  featured: boolean;
  active: boolean;
  sortOrder: number;
}

export default function ServicesPage() {
  const [items, setItems] = useState<ServiceRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<ServiceRow | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<ServiceRow | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      const res = await fetch(`/api/admin/services?${params.toString()}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load services");
      setItems(data.items);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to load services");
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    const t = setTimeout(load, 250);
    return () => clearTimeout(t);
  }, [load]);

  async function handleSubmit(values: ServiceFormValues) {
    setSubmitting(true);
    try {
      const url = editing ? `/api/admin/services/${editing._id}` : "/api/admin/services";
      const method = editing ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save service");
      toast.success(editing ? "Service updated" : "Service created");
      setFormOpen(false);
      setEditing(null);
      load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save service");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    try {
      const res = await fetch(`/api/admin/services/${deleteTarget._id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to delete service");
      toast.success("Service deleted");
      setDeleteTarget(null);
      load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete service");
    }
  }

  async function toggleField(svc: ServiceRow, field: "featured" | "active") {
    try {
      const res = await fetch(`/api/admin/services/${svc._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...svc, [field]: !svc[field] }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update service");
      load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update service");
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <TableSearchInput value={search} onChange={setSearch} placeholder="Search services..." />
        <button
          type="button"
          onClick={() => {
            setEditing(null);
            setFormOpen(true);
          }}
          className="flex items-center justify-center gap-2 rounded-md bg-tes-gold px-4 py-2 text-sm font-semibold text-slate-900 hover:opacity-90"
        >
          <Plus size={16} /> New Service
        </button>
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
        {loading ? (
          <TableSkeleton cols={6} />
        ) : items.length === 0 ? (
          <EmptyState message="No services found." />
        ) : (
          <table className="min-w-full divide-y divide-slate-100 text-sm">
            <thead className="bg-slate-50 text-left text-xs font-semibold uppercase text-slate-500">
              <tr>
                <th className="px-4 py-3">Image</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Pricing</th>
                <th className="px-4 py-3">Featured</th>
                <th className="px-4 py-3">Active</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {items.map((svc) => (
                <tr key={svc._id}>
                  <td className="px-4 py-3">
                    <div className="relative h-10 w-10 overflow-hidden rounded-md bg-slate-100">
                      {svc.image && (
                        <Image src={svc.image} alt={svc.name} fill sizes="40px" className="object-cover" />
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-medium text-slate-800">{svc.name}</div>
                    <div className="text-xs text-slate-400">{svc.slug}</div>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{svc.pricingText}</td>
                  <td className="px-4 py-3">
                    <button onClick={() => toggleField(svc, "featured")}>
                      <Star
                        size={16}
                        className={svc.featured ? "fill-tes-gold text-tes-gold" : "text-slate-300"}
                      />
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => toggleField(svc, "active")}
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                        svc.active ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {svc.active ? "Active" : "Inactive"}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => {
                          setEditing(svc);
                          setFormOpen(true);
                        }}
                        className="rounded-md p-1.5 text-slate-500 hover:bg-slate-100"
                      >
                        <Pencil size={15} />
                      </button>
                      <button
                        onClick={() => setDeleteTarget(svc)}
                        className="rounded-md p-1.5 text-red-500 hover:bg-red-50"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <ServiceForm
        open={formOpen}
        initialValues={editing || undefined}
        submitting={submitting}
        onSubmit={handleSubmit}
        onClose={() => {
          setFormOpen(false);
          setEditing(null);
        }}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete service?"
        description={`This will permanently remove "${deleteTarget?.name}".`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}

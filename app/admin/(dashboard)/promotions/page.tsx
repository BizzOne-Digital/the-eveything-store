"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { EmptyState, TableSkeleton } from "@/components/admin/AdminTable";
import PromotionForm, { PromotionFormValues } from "@/components/admin/PromotionForm";
import ConfirmDialog from "@/components/admin/ConfirmDialog";

interface PromotionRow {
  _id: string;
  title: string;
  subtitle?: string;
  image?: string;
  discountText?: string;
  startDate?: string;
  endDate?: string;
  active: boolean;
  featured: boolean;
}

export default function PromotionsPage() {
  const [items, setItems] = useState<PromotionRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<PromotionRow | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<PromotionRow | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/promotions");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load promotions");
      setItems(data.items);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to load promotions");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- initial data fetch on mount
    load();
  }, [load]);

  async function handleSubmit(values: PromotionFormValues) {
    setSubmitting(true);
    try {
      const url = editing ? `/api/admin/promotions/${editing._id}` : "/api/admin/promotions";
      const method = editing ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save promotion");
      toast.success(editing ? "Promotion updated" : "Promotion created");
      setFormOpen(false);
      setEditing(null);
      load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save promotion");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    try {
      const res = await fetch(`/api/admin/promotions/${deleteTarget._id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to delete promotion");
      toast.success("Promotion deleted");
      setDeleteTarget(null);
      load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete promotion");
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => {
            setEditing(null);
            setFormOpen(true);
          }}
          className="flex items-center gap-2 rounded-md bg-tes-gold px-4 py-2 text-sm font-semibold text-slate-900 hover:opacity-90"
        >
          <Plus size={16} /> New Promotion
        </button>
      </div>

      {loading ? (
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
          <TableSkeleton cols={4} />
        </div>
      ) : items.length === 0 ? (
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
          <EmptyState message="No promotions found." />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((promo) => (
            <div key={promo._id} className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
              <div className="relative h-32 w-full bg-slate-100">
                {promo.image && <Image src={promo.image} alt={promo.title} fill className="object-cover" />}
                <span
                  className={`absolute right-2 top-2 rounded-full px-2 py-0.5 text-xs font-medium ${
                    promo.active ? "bg-emerald-500 text-white" : "bg-slate-500 text-white"
                  }`}
                >
                  {promo.active ? "Active" : "Inactive"}
                </span>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-slate-900">{promo.title}</h3>
                {promo.subtitle && <p className="text-sm text-slate-500">{promo.subtitle}</p>}
                {promo.discountText && (
                  <p className="mt-1 text-sm font-medium text-tes-gold">{promo.discountText}</p>
                )}
                <div className="mt-3 flex justify-end gap-2">
                  <button
                    onClick={() => {
                      setEditing(promo);
                      setFormOpen(true);
                    }}
                    className="rounded-md p-1.5 text-slate-500 hover:bg-slate-100"
                  >
                    <Pencil size={15} />
                  </button>
                  <button
                    onClick={() => setDeleteTarget(promo)}
                    className="rounded-md p-1.5 text-red-500 hover:bg-red-50"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <PromotionForm
        open={formOpen}
        initialValues={
          editing
            ? {
                ...editing,
                startDate: editing.startDate ? editing.startDate.slice(0, 10) : "",
                endDate: editing.endDate ? editing.endDate.slice(0, 10) : "",
              }
            : undefined
        }
        submitting={submitting}
        onSubmit={handleSubmit}
        onClose={() => {
          setFormOpen(false);
          setEditing(null);
        }}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete promotion?"
        description={`This will permanently remove "${deleteTarget?.title}".`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}

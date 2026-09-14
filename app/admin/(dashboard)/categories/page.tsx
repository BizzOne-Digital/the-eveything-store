"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, ArrowUp, ArrowDown, Star } from "lucide-react";
import { TableSearchInput, EmptyState, TableSkeleton } from "@/components/admin/AdminTable";
import CategoryForm, { CategoryFormValues } from "@/components/admin/CategoryForm";
import ConfirmDialog from "@/components/admin/ConfirmDialog";

interface CategoryRow {
  _id: string;
  name: string;
  slug: string;
  image?: string;
  featured: boolean;
  active: boolean;
  sortOrder: number;
}

export default function CategoriesPage() {
  const [items, setItems] = useState<CategoryRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<CategoryRow | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<CategoryRow | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      const res = await fetch(`/api/admin/categories?${params.toString()}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load categories");
      setItems(data.items);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to load categories");
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    const t = setTimeout(load, 250);
    return () => clearTimeout(t);
  }, [load]);

  async function handleSubmit(values: CategoryFormValues) {
    setSubmitting(true);
    try {
      const url = editing ? `/api/admin/categories/${editing._id}` : "/api/admin/categories";
      const method = editing ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save category");
      toast.success(editing ? "Category updated" : "Category created");
      setFormOpen(false);
      setEditing(null);
      load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save category");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    try {
      const res = await fetch(`/api/admin/categories/${deleteTarget._id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to delete category");
      toast.success("Category deleted");
      setDeleteTarget(null);
      load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete category");
    }
  }

  async function toggleField(cat: CategoryRow, field: "featured" | "active") {
    try {
      const res = await fetch(`/api/admin/categories/${cat._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...cat, [field]: !cat[field] }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update category");
      load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update category");
    }
  }

  async function moveSortOrder(cat: CategoryRow, direction: -1 | 1) {
    try {
      const res = await fetch(`/api/admin/categories/${cat._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...cat, sortOrder: cat.sortOrder + direction }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to reorder");
      load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to reorder");
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <TableSearchInput value={search} onChange={setSearch} placeholder="Search categories..." />
        <button
          type="button"
          onClick={() => {
            setEditing(null);
            setFormOpen(true);
          }}
          className="flex items-center justify-center gap-2 rounded-md bg-tes-gold px-4 py-2 text-sm font-semibold text-slate-900 hover:opacity-90"
        >
          <Plus size={16} /> New Category
        </button>
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
        {loading ? (
          <TableSkeleton cols={6} />
        ) : items.length === 0 ? (
          <EmptyState message="No categories found." />
        ) : (
          <table className="min-w-full divide-y divide-slate-100 text-sm">
            <thead className="bg-slate-50 text-left text-xs font-semibold uppercase text-slate-500">
              <tr>
                <th className="px-4 py-3">Image</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Sort</th>
                <th className="px-4 py-3">Featured</th>
                <th className="px-4 py-3">Active</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {items.map((cat) => (
                <tr key={cat._id}>
                  <td className="px-4 py-3">
                    <div className="relative h-10 w-10 overflow-hidden rounded-md bg-slate-100">
                      {cat.image && (
                        <Image src={cat.image} alt={cat.name} fill sizes="40px" className="object-cover" />
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-medium text-slate-800">{cat.name}</div>
                    <div className="text-xs text-slate-400">{cat.slug}</div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button onClick={() => moveSortOrder(cat, -1)} className="text-slate-400 hover:text-slate-700">
                        <ArrowUp size={14} />
                      </button>
                      <span className="w-5 text-center">{cat.sortOrder}</span>
                      <button onClick={() => moveSortOrder(cat, 1)} className="text-slate-400 hover:text-slate-700">
                        <ArrowDown size={14} />
                      </button>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <button onClick={() => toggleField(cat, "featured")}>
                      <Star
                        size={16}
                        className={cat.featured ? "fill-tes-gold text-tes-gold" : "text-slate-300"}
                      />
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => toggleField(cat, "active")}
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                        cat.active ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {cat.active ? "Active" : "Inactive"}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => {
                          setEditing(cat);
                          setFormOpen(true);
                        }}
                        className="rounded-md p-1.5 text-slate-500 hover:bg-slate-100"
                      >
                        <Pencil size={15} />
                      </button>
                      <button
                        onClick={() => setDeleteTarget(cat)}
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

      <CategoryForm
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
        title="Delete category?"
        description={`This will permanently remove "${deleteTarget?.name}".`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}

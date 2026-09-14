"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Copy, Star } from "lucide-react";
import {
  TableSearchInput,
  TableSelect,
  TablePagination,
  EmptyState,
  TableSkeleton,
} from "@/components/admin/AdminTable";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import { formatPrice } from "@/lib/utils";

interface CategoryOption {
  _id: string;
  name: string;
}

interface ProductRow {
  _id: string;
  name: string;
  sku?: string;
  mainImage?: string;
  category?: { _id: string; name: string } | null;
  price: number;
  salePrice?: number;
  stock: number;
  status: "active" | "draft" | "archived";
  featured: boolean;
}

const STATUS_OPTIONS = [
  { label: "All statuses", value: "" },
  { label: "Active", value: "active" },
  { label: "Draft", value: "draft" },
  { label: "Archived", value: "archived" },
];

export default function ProductsPage() {
  const [items, setItems] = useState<ProductRow[]>([]);
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState<ProductRow | null>(null);

  useEffect(() => {
    fetch("/api/admin/categories?limit=100")
      .then((res) => res.json())
      .then((data) => setCategories(data.items || []))
      .catch(() => {});
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (category) params.set("category", category);
      if (status) params.set("status", status);
      params.set("page", String(page));
      const res = await fetch(`/api/admin/products?${params.toString()}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load products");
      setItems(data.items);
      setTotalPages(data.totalPages);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to load products");
    } finally {
      setLoading(false);
    }
  }, [search, category, status, page]);

  useEffect(() => {
    const t = setTimeout(load, 250);
    return () => clearTimeout(t);
  }, [load]);

  function handleSearchChange(value: string) {
    setSearch(value);
    setPage(1);
  }

  function handleCategoryChange(value: string) {
    setCategory(value);
    setPage(1);
  }

  function handleStatusChange(value: string) {
    setStatus(value);
    setPage(1);
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    try {
      const res = await fetch(`/api/admin/products/${deleteTarget._id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to delete product");
      toast.success("Product deleted");
      setDeleteTarget(null);
      load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete product");
    }
  }

  async function handleDuplicate(id: string) {
    try {
      const res = await fetch(`/api/admin/products/${id}/duplicate`, { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to duplicate product");
      toast.success("Product duplicated");
      load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to duplicate product");
    }
  }

  async function toggleStatus(p: ProductRow) {
    const nextStatus = p.status === "active" ? "draft" : "active";
    try {
      const res = await fetch(`/api/admin/products/${p._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...p,
          category: p.category?._id,
          status: nextStatus,
          images: [],
          specifications: [],
          tags: [],
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update status");
      toast.success(`Marked as ${nextStatus}`);
      load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update status");
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <TableSearchInput value={search} onChange={handleSearchChange} placeholder="Search name or SKU..." />
          <TableSelect
            value={category}
            onChange={handleCategoryChange}
            options={[{ label: "All categories", value: "" }, ...categories.map((c) => ({ label: c.name, value: c._id }))]}
          />
          <TableSelect value={status} onChange={handleStatusChange} options={STATUS_OPTIONS} />
        </div>
        <Link
          href="/admin/products/new"
          className="flex items-center justify-center gap-2 rounded-md bg-tes-gold px-4 py-2 text-sm font-semibold text-slate-900 hover:opacity-90"
        >
          <Plus size={16} /> New Product
        </Link>
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
        {loading ? (
          <TableSkeleton cols={7} />
        ) : items.length === 0 ? (
          <EmptyState message="No products found." />
        ) : (
          <>
            <table className="min-w-full divide-y divide-slate-100 text-sm">
              <thead className="bg-slate-50 text-left text-xs font-semibold uppercase text-slate-500">
                <tr>
                  <th className="px-4 py-3">Image</th>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Price</th>
                  <th className="px-4 py-3">Stock</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Featured</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {items.map((p) => (
                  <tr key={p._id}>
                    <td className="px-4 py-3">
                      <div className="relative h-10 w-10 overflow-hidden rounded-md bg-slate-100">
                        {p.mainImage && (
                          <Image src={p.mainImage} alt={p.name} fill sizes="40px" className="object-cover" />
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <Link href={`/admin/products/${p._id}`} className="font-medium text-slate-800 hover:text-tes-gold">
                        {p.name}
                      </Link>
                      {p.sku && <div className="text-xs text-slate-400">{p.sku}</div>}
                    </td>
                    <td className="px-4 py-3 text-slate-600">{p.category?.name || "—"}</td>
                    <td className="px-4 py-3">
                      {p.salePrice ? (
                        <div>
                          <span className="font-medium text-slate-800">{formatPrice(p.salePrice)}</span>{" "}
                          <span className="text-xs text-slate-400 line-through">{formatPrice(p.price)}</span>
                        </div>
                      ) : (
                        <span className="text-slate-800">{formatPrice(p.price)}</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className={p.stock <= 0 ? "text-red-600" : "text-slate-700"}>{p.stock}</span>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => toggleStatus(p)}
                        className={`rounded-full px-2 py-0.5 text-xs font-medium capitalize ${
                          p.status === "active"
                            ? "bg-emerald-50 text-emerald-600"
                            : p.status === "draft"
                            ? "bg-amber-50 text-amber-600"
                            : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        {p.status}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      {p.featured ? (
                        <Star size={16} className="fill-tes-gold text-tes-gold" />
                      ) : (
                        <Star size={16} className="text-slate-300" />
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        <Link
                          href={`/admin/products/${p._id}`}
                          className="rounded-md p-1.5 text-slate-500 hover:bg-slate-100"
                        >
                          <Pencil size={15} />
                        </Link>
                        <button
                          onClick={() => handleDuplicate(p._id)}
                          className="rounded-md p-1.5 text-slate-500 hover:bg-slate-100"
                          title="Duplicate"
                        >
                          <Copy size={15} />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(p)}
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
            <TablePagination page={page} totalPages={totalPages} onChange={setPage} />
          </>
        )}
      </div>

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete product?"
        description={`This will permanently remove "${deleteTarget?.name}" and its images.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}

"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import { TableSearchInput, TableSelect, TablePagination, EmptyState, TableSkeleton } from "@/components/admin/AdminTable";
import ConfirmDialog from "@/components/admin/ConfirmDialog";

interface MediaRow {
  _id: string;
  folder: string;
  filename: string;
  mimeType: string;
  size: number;
  createdAt: string;
}

const FOLDER_OPTIONS = [
  { label: "All folders", value: "" },
  { label: "Products", value: "products" },
  { label: "Gallery", value: "gallery" },
  { label: "Pages", value: "pages" },
  { label: "Misc", value: "misc" },
];

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function MediaPage() {
  const [items, setItems] = useState<MediaRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [folder, setFolder] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState<MediaRow | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (folder) params.set("folder", folder);
      params.set("page", String(page));
      const res = await fetch(`/api/admin/media?${params.toString()}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load media");
      setItems(data.items);
      setTotalPages(data.totalPages);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to load media");
    } finally {
      setLoading(false);
    }
  }, [search, folder, page]);

  useEffect(() => {
    const t = setTimeout(load, 250);
    return () => clearTimeout(t);
  }, [load]);

  function handleSearchChange(value: string) {
    setSearch(value);
    setPage(1);
  }

  function handleFolderChange(value: string) {
    setFolder(value);
    setPage(1);
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    try {
      const res = await fetch(`/api/admin/media/${deleteTarget._id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to delete file");
      toast.success("File deleted");
      setDeleteTarget(null);
      load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete file");
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <TableSearchInput value={search} onChange={handleSearchChange} placeholder="Search filename..." />
        <TableSelect value={folder} onChange={handleFolderChange} options={FOLDER_OPTIONS} />
      </div>

      {loading ? (
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
          <TableSkeleton cols={4} />
        </div>
      ) : items.length === 0 ? (
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
          <EmptyState message="No uploaded files found." />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {items.map((file) => (
              <div key={file._id} className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                <div className="relative aspect-square bg-slate-100">
                  <Image
                    src={`/api/uploads/${file.folder}/${file.filename}`}
                    alt={file.filename}
                    fill
                    sizes="200px"
                    className="object-cover"
                  />
                </div>
                <div className="p-2">
                  <p className="truncate text-xs font-medium text-slate-700" title={file.filename}>
                    {file.filename}
                  </p>
                  <p className="text-xs text-slate-400">
                    {file.folder} · {formatSize(file.size)}
                  </p>
                  <button
                    onClick={() => setDeleteTarget(file)}
                    className="mt-1 flex items-center gap-1 text-xs font-medium text-red-500 hover:text-red-700"
                  >
                    <Trash2 size={12} /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
            <TablePagination page={page} totalPages={totalPages} onChange={setPage} />
          </div>
        </>
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete file?"
        description="This file may still be referenced elsewhere. Deleting it will break any page still using it."
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}

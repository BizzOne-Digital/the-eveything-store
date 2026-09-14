"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { ImagePlus, Loader2, X } from "lucide-react";

type UploadFolder = "products" | "gallery" | "pages" | "misc";

interface LocalImageFieldProps {
  value?: string;
  onChange: (url: string | undefined) => void;
  folder: UploadFolder;
  label?: string;
  required?: boolean;
  disabled?: boolean;
}

const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_SIZE = 8 * 1024 * 1024;

export default function LocalImageField({
  value,
  onChange,
  folder,
  label,
  required,
  disabled,
}: LocalImageFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const inputId = useRef(`img-field-${Math.random().toString(36).slice(2)}`).current;

  async function handleFile(file: File) {
    if (!ACCEPTED_TYPES.includes(file.type)) {
      toast.error("Only JPEG, PNG, WEBP or GIF images are allowed");
      return;
    }
    if (file.size > MAX_SIZE) {
      toast.error("Image must be 8MB or smaller");
      return;
    }

    const previousValue = value;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", folder);
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Upload failed");
      }
      onChange(data.url as string);
      toast.success("Image uploaded");
      if (previousValue) {
        void releasePrevious(previousValue);
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  async function releasePrevious(url: string) {
    try {
      await fetch("/api/admin/media/release", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
    } catch {
      // best-effort cleanup only
    }
  }

  async function handleRemove() {
    if (!value) return;
    const previousValue = value;
    onChange(undefined);
    await releasePrevious(previousValue);
  }

  return (
    <div>
      {label && (
        <label htmlFor={inputId} className="mb-1.5 block text-sm font-medium text-slate-700">
          {label}
          {required && <span className="text-red-500"> *</span>}
        </label>
      )}

      <div className="flex items-center gap-3">
        <div className="relative flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-dashed border-slate-300 bg-slate-50">
          {value ? (
            <Image
              src={value}
              alt={label || "Uploaded image"}
              fill
              sizes="96px"
              className="object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          ) : (
            <ImagePlus size={22} className="text-slate-400" />
          )}
          {uploading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/70">
              <Loader2 size={20} className="animate-spin text-tes-gold" />
            </div>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <input
            ref={inputRef}
            id={inputId}
            type="file"
            accept={ACCEPTED_TYPES.join(",")}
            disabled={disabled || uploading}
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) void handleFile(file);
            }}
          />
          <button
            type="button"
            disabled={disabled || uploading}
            onClick={() => inputRef.current?.click()}
            className="rounded-md border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
          >
            {value ? "Replace image" : "Upload image"}
          </button>
          {value && (
            <button
              type="button"
              disabled={disabled || uploading}
              onClick={handleRemove}
              className="inline-flex items-center gap-1 rounded-md border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
            >
              <X size={12} /> Remove
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

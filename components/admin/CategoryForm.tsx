"use client";

import { useEffect } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import slugify from "slugify";
import { X, Loader2 } from "lucide-react";
import LocalImageField from "./LocalImageField";

const categoryFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required"),
  description: z.string().optional(),
  image: z.string().optional(),
  icon: z.string().optional(),
  featured: z.boolean(),
  active: z.boolean(),
  sortOrder: z.coerce.number().default(0),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
});

export type CategoryFormValues = z.infer<typeof categoryFormSchema>;

interface CategoryFormProps {
  open: boolean;
  initialValues?: Partial<CategoryFormValues>;
  submitting?: boolean;
  onSubmit: (values: CategoryFormValues) => void;
  onClose: () => void;
}

export default function CategoryForm({
  open,
  initialValues,
  submitting,
  onSubmit,
  onClose,
}: CategoryFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<CategoryFormValues>({
    resolver: zodResolver(categoryFormSchema) as unknown as Resolver<CategoryFormValues>,
    defaultValues: {
      name: "",
      slug: "",
      description: "",
      image: "",
      icon: "",
      featured: false,
      active: true,
      sortOrder: 0,
      seoTitle: "",
      seoDescription: "",
    },
  });

  useEffect(() => {
    if (open) {
      reset({
        name: "",
        slug: "",
        description: "",
        image: "",
        icon: "",
        featured: false,
        active: true,
        sortOrder: 0,
        seoTitle: "",
        seoDescription: "",
        ...initialValues,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, initialValues]);

  const name = watch("name");
  const slug = watch("slug");
  const image = watch("image");

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40">
      <div className="flex h-full w-full max-w-md flex-col bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <h2 className="text-base font-semibold text-slate-900">
            {initialValues?.name ? "Edit Category" : "New Category"}
          </h2>
          <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-700">
            <X size={20} />
          </button>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex-1 space-y-4 overflow-y-auto px-5 py-4"
          noValidate
        >
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Name *</label>
            <input
              {...register("name")}
              onChange={(e) => {
                setValue("name", e.target.value);
                if (!initialValues?.slug || slug === slugify(name || "", { lower: true, strict: true })) {
                  setValue("slug", slugify(e.target.value, { lower: true, strict: true }));
                }
              }}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-tes-gold focus:outline-none focus:ring-1 focus:ring-tes-gold"
            />
            {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Slug *</label>
            <input
              {...register("slug")}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm font-mono focus:border-tes-gold focus:outline-none focus:ring-1 focus:ring-tes-gold"
            />
            {errors.slug && <p className="mt-1 text-xs text-red-500">{errors.slug.message}</p>}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Description</label>
            <textarea
              {...register("description")}
              rows={3}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-tes-gold focus:outline-none focus:ring-1 focus:ring-tes-gold"
            />
          </div>

          <LocalImageField
            label="Category image"
            folder="gallery"
            value={image}
            onChange={(url) => setValue("image", url || "")}
          />

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Icon (lucide name)</label>
            <input
              {...register("icon")}
              placeholder="e.g. shirt"
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-tes-gold focus:outline-none focus:ring-1 focus:ring-tes-gold"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Sort order</label>
            <input
              type="number"
              {...register("sortOrder")}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-tes-gold focus:outline-none focus:ring-1 focus:ring-tes-gold"
            />
          </div>

          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 text-sm text-slate-700">
              <input type="checkbox" {...register("featured")} className="h-4 w-4 rounded border-slate-300" />
              Featured
            </label>
            <label className="flex items-center gap-2 text-sm text-slate-700">
              <input type="checkbox" {...register("active")} className="h-4 w-4 rounded border-slate-300" />
              Active
            </label>
          </div>

          <div className="border-t border-slate-100 pt-4">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">SEO</p>
            <div className="space-y-3">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">SEO Title</label>
                <input
                  {...register("seoTitle")}
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-tes-gold focus:outline-none focus:ring-1 focus:ring-tes-gold"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">SEO Description</label>
                <textarea
                  {...register("seoDescription")}
                  rows={2}
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-tes-gold focus:outline-none focus:ring-1 focus:ring-tes-gold"
                />
              </div>
            </div>
          </div>
        </form>

        <div className="flex justify-end gap-2 border-t border-slate-200 px-5 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={submitting}
            onClick={handleSubmit(onSubmit)}
            className="flex items-center gap-2 rounded-md bg-tes-gold px-4 py-2 text-sm font-semibold text-slate-900 hover:opacity-90 disabled:opacity-60"
          >
            {submitting && <Loader2 size={15} className="animate-spin" />}
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

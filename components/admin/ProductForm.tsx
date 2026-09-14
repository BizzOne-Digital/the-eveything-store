"use client";

import { useEffect, useState } from "react";
import { useForm, useFieldArray, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import slugify from "slugify";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Image from "next/image";
import { Loader2, Plus, Trash2, X, Star } from "lucide-react";
import LocalImageField from "./LocalImageField";

const productFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required"),
  shortDescription: z.string().optional(),
  description: z.string().optional(),
  category: z.string().min(1, "Category is required"),
  subCategory: z.string().optional(),
  brand: z.string().optional(),
  sku: z.string().optional(),
  price: z.coerce.number().min(0, "Price must be 0 or more"),
  salePrice: z.union([z.coerce.number().min(0), z.literal("")]).optional(),
  stock: z.coerce.number().min(0).default(0),
  lowStockThreshold: z.coerce.number().min(0).default(5),
  featured: z.boolean(),
  status: z.enum(["active", "draft", "archived"]),
  images: z.array(z.string()).default([]),
  mainImage: z.string().optional().default(""),
  tags: z.array(z.string()).default([]),
  specifications: z.array(z.object({ key: z.string(), value: z.string() })).default([]),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
});

export type ProductFormValues = z.infer<typeof productFormSchema>;

interface CategoryOption {
  _id: string;
  name: string;
}

interface ProductFormProps {
  mode: "create" | "edit";
  productId?: string;
  initialValues?: Partial<ProductFormValues>;
}

export default function ProductForm({ mode, productId, initialValues }: ProductFormProps) {
  const router = useRouter();
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [tagInput, setTagInput] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    formState: { errors },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema) as unknown as Resolver<ProductFormValues>,
    defaultValues: {
      name: "",
      slug: "",
      shortDescription: "",
      description: "",
      category: "",
      subCategory: "",
      brand: "",
      sku: "",
      price: 0,
      salePrice: "",
      stock: 0,
      lowStockThreshold: 5,
      featured: false,
      status: "active",
      images: [],
      mainImage: "",
      tags: [],
      specifications: [],
      seoTitle: "",
      seoDescription: "",
      ...initialValues,
    },
  });

  const { fields: specFields, append: appendSpec, remove: removeSpec } = useFieldArray({
    control,
    name: "specifications",
  });

  useEffect(() => {
    fetch("/api/admin/categories?limit=100")
      .then((res) => res.json())
      .then((data) => setCategories(data.items || []))
      .catch(() => toast.error("Failed to load categories"));
  }, []);

  const images = watch("images");
  const mainImage = watch("mainImage");
  const tags = watch("tags");
  const status = watch("status");

  function addTag() {
    const value = tagInput.trim();
    if (!value) return;
    if (!tags.includes(value)) {
      setValue("tags", [...tags, value]);
    }
    setTagInput("");
  }

  function removeTag(tag: string) {
    setValue(
      "tags",
      tags.filter((t) => t !== tag)
    );
  }

  function addImage(url: string | undefined) {
    if (!url) return;
    const next = [...images, url];
    setValue("images", next);
    if (!mainImage) setValue("mainImage", url);
  }

  function removeImage(url: string) {
    const next = images.filter((i) => i !== url);
    setValue("images", next);
    if (mainImage === url) setValue("mainImage", next[0] || "");
  }

  async function onSubmit(values: ProductFormValues) {
    setSubmitting(true);
    try {
      const payload = {
        ...values,
        salePrice: values.salePrice === "" ? undefined : Number(values.salePrice),
      };
      const url = mode === "edit" ? `/api/admin/products/${productId}` : "/api/admin/products";
      const method = mode === "edit" ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save product");
      toast.success(mode === "edit" ? "Product updated" : "Product created");
      router.push("/admin/products");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save product");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="mb-4 text-sm font-semibold text-slate-900">General Information</h2>
            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Name *</label>
                <input
                  {...register("name")}
                  onChange={(e) => {
                    setValue("name", e.target.value);
                    setValue("slug", slugify(e.target.value, { lower: true, strict: true }));
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
                <label className="mb-1 block text-sm font-medium text-slate-700">Short description</label>
                <input
                  {...register("shortDescription")}
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-tes-gold focus:outline-none focus:ring-1 focus:ring-tes-gold"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Description</label>
                <textarea
                  {...register("description")}
                  rows={5}
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-tes-gold focus:outline-none focus:ring-1 focus:ring-tes-gold"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Brand</label>
                  <input
                    {...register("brand")}
                    className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-tes-gold focus:outline-none focus:ring-1 focus:ring-tes-gold"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">SKU</label>
                  <input
                    {...register("sku")}
                    className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-tes-gold focus:outline-none focus:ring-1 focus:ring-tes-gold"
                  />
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="mb-4 text-sm font-semibold text-slate-900">Images</h2>
            <div className="mb-4 grid grid-cols-3 gap-3 sm:grid-cols-4">
              {images.map((img) => (
                <div key={img} className="relative aspect-square overflow-hidden rounded-md border border-slate-200">
                  <Image src={img} alt="Product" fill sizes="120px" className="object-cover" />
                  <button
                    type="button"
                    onClick={() => setValue("mainImage", img)}
                    className={`absolute left-1 top-1 rounded-full p-1 ${
                      mainImage === img ? "bg-tes-gold text-slate-900" : "bg-white/80 text-slate-400"
                    }`}
                    title="Set as main image"
                  >
                    <Star size={12} className={mainImage === img ? "fill-slate-900" : ""} />
                  </button>
                  <button
                    type="button"
                    onClick={() => removeImage(img)}
                    className="absolute right-1 top-1 rounded-full bg-white/80 p-1 text-red-500"
                    title="Remove image"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>
            <LocalImageField folder="products" label="Add image" onChange={addImage} value={undefined} />
          </section>

          <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-slate-900">Specifications</h2>
              <button
                type="button"
                onClick={() => appendSpec({ key: "", value: "" })}
                className="flex items-center gap-1 text-xs font-medium text-tes-gold hover:underline"
              >
                <Plus size={14} /> Add row
              </button>
            </div>
            {specFields.length === 0 ? (
              <p className="text-sm text-slate-400">No specifications added.</p>
            ) : (
              <div className="space-y-2">
                {specFields.map((field, index) => (
                  <div key={field.id} className="flex gap-2">
                    <input
                      {...register(`specifications.${index}.key` as const)}
                      placeholder="Key"
                      className="w-1/3 rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-tes-gold focus:outline-none focus:ring-1 focus:ring-tes-gold"
                    />
                    <input
                      {...register(`specifications.${index}.value` as const)}
                      placeholder="Value"
                      className="flex-1 rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-tes-gold focus:outline-none focus:ring-1 focus:ring-tes-gold"
                    />
                    <button
                      type="button"
                      onClick={() => removeSpec(index)}
                      className="rounded-md p-2 text-red-500 hover:bg-red-50"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="mb-4 text-sm font-semibold text-slate-900">SEO</h2>
            <div className="space-y-4">
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
          </section>
        </div>

        <div className="space-y-6">
          <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="mb-4 text-sm font-semibold text-slate-900">Organization</h2>
            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Category *</label>
                <select
                  {...register("category")}
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-tes-gold focus:outline-none focus:ring-1 focus:ring-tes-gold"
                >
                  <option value="">Select category</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
                {errors.category && <p className="mt-1 text-xs text-red-500">{errors.category.message}</p>}
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Sub-category</label>
                <input
                  {...register("subCategory")}
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-tes-gold focus:outline-none focus:ring-1 focus:ring-tes-gold"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Status</label>
                <select
                  {...register("status")}
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-tes-gold focus:outline-none focus:ring-1 focus:ring-tes-gold"
                >
                  <option value="active">Active</option>
                  <option value="draft">Draft</option>
                  <option value="archived">Archived</option>
                </select>
                {status === "draft" && (
                  <p className="mt-1 text-xs text-amber-600">Draft products are hidden from the storefront.</p>
                )}
              </div>

              <label className="flex items-center gap-2 text-sm text-slate-700">
                <input type="checkbox" {...register("featured")} className="h-4 w-4 rounded border-slate-300" />
                Featured product
              </label>
            </div>
          </section>

          <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="mb-4 text-sm font-semibold text-slate-900">Pricing & Stock</h2>
            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Price *</label>
                <input
                  type="number"
                  step="0.01"
                  {...register("price")}
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-tes-gold focus:outline-none focus:ring-1 focus:ring-tes-gold"
                />
                {errors.price && <p className="mt-1 text-xs text-red-500">{errors.price.message}</p>}
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Sale price</label>
                <input
                  type="number"
                  step="0.01"
                  {...register("salePrice")}
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-tes-gold focus:outline-none focus:ring-1 focus:ring-tes-gold"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Stock</label>
                <input
                  type="number"
                  {...register("stock")}
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-tes-gold focus:outline-none focus:ring-1 focus:ring-tes-gold"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Low stock threshold</label>
                <input
                  type="number"
                  {...register("lowStockThreshold")}
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-tes-gold focus:outline-none focus:ring-1 focus:ring-tes-gold"
                />
              </div>
            </div>
          </section>

          <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="mb-3 text-sm font-semibold text-slate-900">Tags</h2>
            <div className="mb-3 flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-700"
                >
                  {tag}
                  <button type="button" onClick={() => removeTag(tag)} className="text-slate-400 hover:text-red-500">
                    <X size={11} />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === ",") {
                    e.preventDefault();
                    addTag();
                  }
                }}
                placeholder="Add tag and press Enter"
                className="flex-1 rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-tes-gold focus:outline-none focus:ring-1 focus:ring-tes-gold"
              />
              <button
                type="button"
                onClick={addTag}
                className="rounded-md border border-slate-300 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
              >
                Add
              </button>
            </div>
          </section>
        </div>
      </div>

      <div className="flex justify-end gap-2 border-t border-slate-200 pt-4">
        <button
          type="button"
          onClick={() => router.push("/admin/products")}
          className="rounded-md border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="flex items-center gap-2 rounded-md bg-tes-gold px-5 py-2 text-sm font-semibold text-slate-900 hover:opacity-90 disabled:opacity-60"
        >
          {submitting && <Loader2 size={15} className="animate-spin" />}
          {mode === "edit" ? "Save Changes" : "Create Product"}
        </button>
      </div>
    </form>
  );
}

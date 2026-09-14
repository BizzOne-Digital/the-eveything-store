"use client";

import { useEffect } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { X, Loader2 } from "lucide-react";
import LocalImageField from "./LocalImageField";

const promotionFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  subtitle: z.string().optional(),
  description: z.string().optional(),
  image: z.string().optional(),
  ctaText: z.string().default("Shop Deals"),
  ctaLink: z.string().default("/shop"),
  discountText: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  active: z.boolean(),
  featured: z.boolean(),
});

export type PromotionFormValues = z.infer<typeof promotionFormSchema>;

interface PromotionFormProps {
  open: boolean;
  initialValues?: Partial<PromotionFormValues>;
  submitting?: boolean;
  onSubmit: (values: PromotionFormValues) => void;
  onClose: () => void;
}

export default function PromotionForm({
  open,
  initialValues,
  submitting,
  onSubmit,
  onClose,
}: PromotionFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<PromotionFormValues>({
    resolver: zodResolver(promotionFormSchema) as unknown as Resolver<PromotionFormValues>,
    defaultValues: {
      title: "",
      subtitle: "",
      description: "",
      image: "",
      ctaText: "Shop Deals",
      ctaLink: "/shop",
      discountText: "",
      startDate: "",
      endDate: "",
      active: true,
      featured: false,
    },
  });

  useEffect(() => {
    if (open) {
      reset({
        title: "",
        subtitle: "",
        description: "",
        image: "",
        ctaText: "Shop Deals",
        ctaLink: "/shop",
        discountText: "",
        startDate: "",
        endDate: "",
        active: true,
        featured: false,
        ...initialValues,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, initialValues]);

  const image = watch("image");

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40">
      <div className="flex h-full w-full max-w-md flex-col bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <h2 className="text-base font-semibold text-slate-900">
            {initialValues?.title ? "Edit Promotion" : "New Promotion"}
          </h2>
          <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-700">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex-1 space-y-4 overflow-y-auto px-5 py-4" noValidate>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Title *</label>
            <input
              {...register("title")}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-tes-gold focus:outline-none focus:ring-1 focus:ring-tes-gold"
            />
            {errors.title && <p className="mt-1 text-xs text-red-500">{errors.title.message}</p>}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Subtitle</label>
            <input
              {...register("subtitle")}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-tes-gold focus:outline-none focus:ring-1 focus:ring-tes-gold"
            />
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
            label="Promotion image"
            folder="gallery"
            value={image}
            onChange={(url) => setValue("image", url || "")}
          />

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">CTA text</label>
              <input
                {...register("ctaText")}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-tes-gold focus:outline-none focus:ring-1 focus:ring-tes-gold"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">CTA link</label>
              <input
                {...register("ctaLink")}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-tes-gold focus:outline-none focus:ring-1 focus:ring-tes-gold"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Discount text</label>
            <input
              {...register("discountText")}
              placeholder="e.g. 20% OFF"
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-tes-gold focus:outline-none focus:ring-1 focus:ring-tes-gold"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Start date</label>
              <input
                type="date"
                {...register("startDate")}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-tes-gold focus:outline-none focus:ring-1 focus:ring-tes-gold"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">End date</label>
              <input
                type="date"
                {...register("endDate")}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-tes-gold focus:outline-none focus:ring-1 focus:ring-tes-gold"
              />
            </div>
          </div>

          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 text-sm text-slate-700">
              <input type="checkbox" {...register("active")} className="h-4 w-4 rounded border-slate-300" />
              Active
            </label>
            <label className="flex items-center gap-2 text-sm text-slate-700">
              <input type="checkbox" {...register("featured")} className="h-4 w-4 rounded border-slate-300" />
              Featured
            </label>
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

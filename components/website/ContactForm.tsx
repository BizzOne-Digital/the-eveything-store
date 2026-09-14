"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Loader2, Send } from "lucide-react";

const INQUIRY_TYPES = ["Product Question", "Service Question", "Order Question", "Pricing", "Other"] as const;

const schema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  email: z.string().trim().email("Enter a valid email address"),
  phone: z.string().trim().optional(),
  subject: z.string().trim().min(1, "Subject is required"),
  inquiryType: z.enum(INQUIRY_TYPES),
  message: z.string().trim().min(10, "Please include at least a few details"),
});

type FormValues = z.infer<typeof schema>;

export default function ContactForm() {
  const searchParams = useSearchParams();
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { inquiryType: "Other" },
  });

  useEffect(() => {
    const type = searchParams.get("inquiryType");
    const subject = searchParams.get("subject");
    if (type && (INQUIRY_TYPES as readonly string[]).includes(type)) {
      setValue("inquiryType", type as (typeof INQUIRY_TYPES)[number]);
    }
    if (subject) setValue("subject", subject);
  }, [searchParams, setValue]);

  async function onSubmit(values: FormValues) {
    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong.");
      toast.success("Thanks for reaching out — we'll be in touch soon.");
      reset({ name: "", email: "", phone: "", subject: "", inquiryType: "Other", message: "" });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="name" className="block text-sm font-semibold text-tes-black mb-1.5">
            Full Name
          </label>
          <input
            id="name"
            {...register("name")}
            className="w-full rounded-lg border border-tes-border px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-tes-gold/60"
          />
          {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>}
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-semibold text-tes-black mb-1.5">
            Email Address
          </label>
          <input
            id="email"
            type="email"
            {...register("email")}
            className="w-full rounded-lg border border-tes-border px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-tes-gold/60"
          />
          {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="phone" className="block text-sm font-semibold text-tes-black mb-1.5">
            Phone Number <span className="text-tes-muted font-normal">(optional)</span>
          </label>
          <input
            id="phone"
            type="tel"
            {...register("phone")}
            className="w-full rounded-lg border border-tes-border px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-tes-gold/60"
          />
        </div>
        <div>
          <label htmlFor="inquiryType" className="block text-sm font-semibold text-tes-black mb-1.5">
            Inquiry Type
          </label>
          <select
            id="inquiryType"
            {...register("inquiryType")}
            className="w-full rounded-lg border border-tes-border px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-tes-gold/60"
          >
            {INQUIRY_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="subject" className="block text-sm font-semibold text-tes-black mb-1.5">
          Subject
        </label>
        <input
          id="subject"
          {...register("subject")}
          className="w-full rounded-lg border border-tes-border px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-tes-gold/60"
        />
        {errors.subject && <p className="mt-1 text-xs text-red-600">{errors.subject.message}</p>}
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-semibold text-tes-black mb-1.5">
          Message
        </label>
        <textarea
          id="message"
          rows={5}
          {...register("message")}
          className="w-full rounded-lg border border-tes-border px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-tes-gold/60"
        />
        {errors.message && <p className="mt-1 text-xs text-red-600">{errors.message.message}</p>}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-tes-black px-7 py-3 text-sm font-bold text-white hover:bg-tes-gold hover:text-tes-black transition-colors disabled:opacity-60"
      >
        {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        Send Message
      </button>
    </form>
  );
}

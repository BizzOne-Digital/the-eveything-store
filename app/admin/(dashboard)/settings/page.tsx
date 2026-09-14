"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import LocalImageField from "@/components/admin/LocalImageField";

interface SettingsValues {
  businessName: string;
  tagline: string;
  logo?: string;
  footerLogo?: string;
  favicon?: string;
  phone: string;
  email: string;
  website?: string;
  address?: string;
  socialLinks: { facebook?: string; instagram?: string; tiktok?: string };
  announcementBar?: string;
  heroHeading?: string;
  heroSubheading?: string;
  heroDescription?: string;
  heroImage?: string;
  heroCtaPrimaryText?: string;
  heroCtaPrimaryLink?: string;
  heroCtaSecondaryText?: string;
  heroCtaSecondaryLink?: string;
  footerDescription?: string;
  footerMission?: string;
  copyrightText?: string;
  seoTitle?: string;
  seoDescription?: string;
  paymentMethodLabel?: string;
}

const TABS = ["Business", "Hero & Footer", "SEO"] as const;

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [tab, setTab] = useState<(typeof TABS)[number]>("Business");
  const { register, handleSubmit, watch, setValue, reset } = useForm<SettingsValues>({
    defaultValues: { socialLinks: {} },
  });

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((res) => res.json())
      .then((data) => reset(data.item))
      .catch(() => toast.error("Failed to load settings"))
      .finally(() => setLoading(false));
  }, [reset]);

  async function onSubmit(values: SettingsValues) {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save settings");
      reset(data.item);
      toast.success("Settings saved");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save settings");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <p className="text-sm text-slate-400">Loading settings...</p>;

  const logo = watch("logo");
  const footerLogo = watch("footerLogo");
  const favicon = watch("favicon");
  const heroImage = watch("heroImage");

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-3xl space-y-6" noValidate>
      <div className="flex gap-2 border-b border-slate-200">
        {TABS.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`border-b-2 px-3 py-2 text-sm font-medium ${
              tab === t ? "border-tes-gold text-slate-900" : "border-transparent text-slate-400 hover:text-slate-600"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "Business" && (
        <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Business name</label>
              <input {...register("businessName")} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-tes-gold focus:outline-none focus:ring-1 focus:ring-tes-gold" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Tagline</label>
              <input {...register("tagline")} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-tes-gold focus:outline-none focus:ring-1 focus:ring-tes-gold" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Phone</label>
              <input {...register("phone")} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-tes-gold focus:outline-none focus:ring-1 focus:ring-tes-gold" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Email</label>
              <input {...register("email")} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-tes-gold focus:outline-none focus:ring-1 focus:ring-tes-gold" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Website</label>
              <input {...register("website")} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-tes-gold focus:outline-none focus:ring-1 focus:ring-tes-gold" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Payment method label</label>
              <input {...register("paymentMethodLabel")} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-tes-gold focus:outline-none focus:ring-1 focus:ring-tes-gold" />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Address</label>
            <textarea {...register("address")} rows={2} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-tes-gold focus:outline-none focus:ring-1 focus:ring-tes-gold" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Announcement bar</label>
            <input {...register("announcementBar")} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-tes-gold focus:outline-none focus:ring-1 focus:ring-tes-gold" />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Facebook</label>
              <input {...register("socialLinks.facebook")} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-tes-gold focus:outline-none focus:ring-1 focus:ring-tes-gold" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Instagram</label>
              <input {...register("socialLinks.instagram")} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-tes-gold focus:outline-none focus:ring-1 focus:ring-tes-gold" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">TikTok</label>
              <input {...register("socialLinks.tiktok")} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-tes-gold focus:outline-none focus:ring-1 focus:ring-tes-gold" />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <LocalImageField label="Logo" folder="misc" value={logo} onChange={(url) => setValue("logo", url || "")} />
            <LocalImageField label="Footer logo" folder="misc" value={footerLogo} onChange={(url) => setValue("footerLogo", url || "")} />
            <LocalImageField label="Favicon" folder="misc" value={favicon} onChange={(url) => setValue("favicon", url || "")} />
          </div>
        </div>
      )}

      {tab === "Hero & Footer" && (
        <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Hero heading</label>
            <textarea {...register("heroHeading")} rows={2} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-tes-gold focus:outline-none focus:ring-1 focus:ring-tes-gold" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Hero subheading</label>
            <input {...register("heroSubheading")} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-tes-gold focus:outline-none focus:ring-1 focus:ring-tes-gold" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Hero description</label>
            <textarea {...register("heroDescription")} rows={3} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-tes-gold focus:outline-none focus:ring-1 focus:ring-tes-gold" />
          </div>
          <LocalImageField label="Hero image" folder="pages" value={heroImage} onChange={(url) => setValue("heroImage", url || "")} />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Primary CTA text</label>
              <input {...register("heroCtaPrimaryText")} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-tes-gold focus:outline-none focus:ring-1 focus:ring-tes-gold" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Primary CTA link</label>
              <input {...register("heroCtaPrimaryLink")} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-tes-gold focus:outline-none focus:ring-1 focus:ring-tes-gold" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Secondary CTA text</label>
              <input {...register("heroCtaSecondaryText")} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-tes-gold focus:outline-none focus:ring-1 focus:ring-tes-gold" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Secondary CTA link</label>
              <input {...register("heroCtaSecondaryLink")} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-tes-gold focus:outline-none focus:ring-1 focus:ring-tes-gold" />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Footer description</label>
            <textarea {...register("footerDescription")} rows={2} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-tes-gold focus:outline-none focus:ring-1 focus:ring-tes-gold" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Footer mission</label>
            <textarea {...register("footerMission")} rows={2} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-tes-gold focus:outline-none focus:ring-1 focus:ring-tes-gold" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Copyright text</label>
            <input {...register("copyrightText")} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-tes-gold focus:outline-none focus:ring-1 focus:ring-tes-gold" />
          </div>
        </div>
      )}

      {tab === "SEO" && (
        <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">SEO Title</label>
            <input {...register("seoTitle")} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-tes-gold focus:outline-none focus:ring-1 focus:ring-tes-gold" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">SEO Description</label>
            <textarea {...register("seoDescription")} rows={3} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-tes-gold focus:outline-none focus:ring-1 focus:ring-tes-gold" />
          </div>
        </div>
      )}

      <div className="flex justify-end border-t border-slate-200 pt-4">
        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-2 rounded-md bg-tes-gold px-5 py-2 text-sm font-semibold text-slate-900 hover:opacity-90 disabled:opacity-60"
        >
          {saving && <Loader2 size={15} className="animate-spin" />}
          Save Settings
        </button>
      </div>
    </form>
  );
}

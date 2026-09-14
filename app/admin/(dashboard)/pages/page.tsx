"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { Loader2, Plus, Trash2 } from "lucide-react";
import LocalImageField from "@/components/admin/LocalImageField";

type Sections = Record<string, unknown>;

const PAGES = ["home", "about", "services", "pricing", "contact"] as const;
type PageKey = (typeof PAGES)[number];

function getPath(obj: unknown, path: string): unknown {
  return path.split(".").reduce<unknown>((acc, key) => {
    if (acc && typeof acc === "object") return (acc as Record<string, unknown>)[key];
    return undefined;
  }, obj);
}

function setPath(obj: Sections, path: string, value: unknown): Sections {
  const keys = path.split(".");
  const next: Sections = { ...obj };
  let cursor: Record<string, unknown> = next;
  keys.forEach((key, idx) => {
    if (idx === keys.length - 1) {
      cursor[key] = value;
    } else {
      const existing = cursor[key];
      const cloned = existing && typeof existing === "object" ? { ...(existing as Record<string, unknown>) } : {};
      cursor[key] = cloned;
      cursor = cloned as Record<string, unknown>;
    }
  });
  return next;
}

function TextField({
  sections,
  onChange,
  path,
  label,
  textarea,
}: {
  sections: Sections;
  onChange: (path: string, value: unknown) => void;
  path: string;
  label: string;
  textarea?: boolean;
}) {
  const value = (getPath(sections, path) as string) || "";
  const commonClass =
    "w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-tes-gold focus:outline-none focus:ring-1 focus:ring-tes-gold";
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-slate-700">{label}</label>
      {textarea ? (
        <textarea value={value} rows={3} onChange={(e) => onChange(path, e.target.value)} className={commonClass} />
      ) : (
        <input value={value} onChange={(e) => onChange(path, e.target.value)} className={commonClass} />
      )}
    </div>
  );
}

function ImageFieldAt({
  sections,
  onChange,
  path,
  label,
}: {
  sections: Sections;
  onChange: (path: string, value: unknown) => void;
  path: string;
  label: string;
}) {
  const value = getPath(sections, path) as string | undefined;
  return <LocalImageField label={label} folder="pages" value={value} onChange={(url) => onChange(path, url || "")} />;
}

function ToggleField({
  sections,
  onChange,
  path,
  label,
}: {
  sections: Sections;
  onChange: (path: string, value: unknown) => void;
  path: string;
  label: string;
}) {
  const value = getPath(sections, path);
  const checked = value === undefined ? true : Boolean(value);
  return (
    <label className="flex items-center gap-2 text-sm text-slate-700">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(path, e.target.checked)}
        className="h-4 w-4 rounded border-slate-300"
      />
      {label}
    </label>
  );
}

function RepeaterField({
  sections,
  onChange,
  path,
  itemFields,
  emptyItem,
  label,
}: {
  sections: Sections;
  onChange: (path: string, value: unknown) => void;
  path: string;
  itemFields: { key: string; label: string; textarea?: boolean }[];
  emptyItem: Record<string, string>;
  label: string;
}) {
  const items = (getPath(sections, path) as Record<string, string>[]) || [];

  function updateItem(index: number, key: string, value: string) {
    const next = items.map((item, i) => (i === index ? { ...item, [key]: value } : item));
    onChange(path, next);
  }

  function addItem() {
    onChange(path, [...items, { ...emptyItem }]);
  }

  function removeItem(index: number) {
    onChange(
      path,
      items.filter((_, i) => i !== index)
    );
  }

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <label className="text-sm font-medium text-slate-700">{label}</label>
        <button type="button" onClick={addItem} className="flex items-center gap-1 text-xs font-medium text-tes-gold hover:underline">
          <Plus size={13} /> Add
        </button>
      </div>
      {items.length === 0 && <p className="text-sm text-slate-400">No items yet.</p>}
      <div className="space-y-3">
        {items.map((item, index) => (
          <div key={index} className="rounded-md border border-slate-200 p-3">
            <div className="mb-2 flex justify-end">
              <button type="button" onClick={() => removeItem(index)} className="text-red-500 hover:text-red-700">
                <Trash2 size={14} />
              </button>
            </div>
            <div className="space-y-2">
              {itemFields.map((f) => (
                <div key={f.key}>
                  <label className="mb-1 block text-xs font-medium text-slate-500">{f.label}</label>
                  {f.textarea ? (
                    <textarea
                      value={item[f.key] || ""}
                      rows={2}
                      onChange={(e) => updateItem(index, f.key, e.target.value)}
                      className="w-full rounded-md border border-slate-300 px-2 py-1.5 text-sm focus:border-tes-gold focus:outline-none focus:ring-1 focus:ring-tes-gold"
                    />
                  ) : (
                    <input
                      value={item[f.key] || ""}
                      onChange={(e) => updateItem(index, f.key, e.target.value)}
                      className="w-full rounded-md border border-slate-300 px-2 py-1.5 text-sm focus:border-tes-gold focus:outline-none focus:ring-1 focus:ring-tes-gold"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function PagesEditorPage() {
  const [page, setPage] = useState<PageKey>("home");
  const [sections, setSections] = useState<Sections>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const load = useCallback(() => {
    setLoading(true);
    fetch(`/api/admin/pages/${page}`)
      .then((res) => res.json())
      .then((data) => setSections(data.item?.sections || {}))
      .catch(() => toast.error("Failed to load page content"))
      .finally(() => setLoading(false));
  }, [page]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- initial data fetch on mount
    load();
  }, [load]);

  function onChange(path: string, value: unknown) {
    setSections((prev) => setPath(prev, path, value));
  }

  async function handleSave() {
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/pages/${page}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sections }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save page");
      setSections(data.item.sections);
      toast.success("Page content saved");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save page");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex flex-wrap gap-2 border-b border-slate-200">
        {PAGES.map((p) => (
          <button
            key={p}
            onClick={() => setPage(p)}
            className={`border-b-2 px-3 py-2 text-sm font-medium capitalize ${
              page === p ? "border-tes-gold text-slate-900" : "border-transparent text-slate-400 hover:text-slate-600"
            }`}
          >
            {p}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-sm text-slate-400">Loading page content...</p>
      ) : (
        <div className="space-y-6">
          {page === "home" && (
            <>
              <section className="space-y-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                <h2 className="text-sm font-semibold text-slate-900">Hero</h2>
                <ToggleField sections={sections} onChange={onChange} path="visibility.hero" label="Show hero section" />
                <TextField sections={sections} onChange={onChange} path="hero.heading" label="Heading" />
                <TextField sections={sections} onChange={onChange} path="hero.subheading" label="Subheading" />
                <TextField sections={sections} onChange={onChange} path="hero.description" label="Description" textarea />
                <ImageFieldAt sections={sections} onChange={onChange} path="hero.image" label="Hero image" />
                <div className="grid grid-cols-2 gap-4">
                  <TextField sections={sections} onChange={onChange} path="hero.ctaPrimaryText" label="Primary CTA text" />
                  <TextField sections={sections} onChange={onChange} path="hero.ctaPrimaryLink" label="Primary CTA link" />
                  <TextField sections={sections} onChange={onChange} path="hero.ctaSecondaryText" label="Secondary CTA text" />
                  <TextField sections={sections} onChange={onChange} path="hero.ctaSecondaryLink" label="Secondary CTA link" />
                </div>
              </section>

              <section className="space-y-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                <h2 className="text-sm font-semibold text-slate-900">Mission</h2>
                <ToggleField sections={sections} onChange={onChange} path="visibility.mission" label="Show mission section" />
                <TextField sections={sections} onChange={onChange} path="mission.heading" label="Heading" />
                <TextField sections={sections} onChange={onChange} path="mission.description" label="Description" textarea />
                <ImageFieldAt sections={sections} onChange={onChange} path="mission.image" label="Mission image" />
              </section>

              <section className="space-y-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                <h2 className="text-sm font-semibold text-slate-900">Why Choose Us</h2>
                <ToggleField sections={sections} onChange={onChange} path="visibility.whyChooseUs" label="Show section" />
                <TextField sections={sections} onChange={onChange} path="whyChooseUs.heading" label="Heading" />
                <RepeaterField
                  sections={sections}
                  onChange={onChange}
                  path="whyChooseUs.items"
                  label="Reasons"
                  itemFields={[
                    { key: "icon", label: "Icon (lucide name)" },
                    { key: "title", label: "Title" },
                    { key: "description", label: "Description", textarea: true },
                  ]}
                  emptyItem={{ icon: "", title: "", description: "" }}
                />
              </section>

              <section className="space-y-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                <h2 className="text-sm font-semibold text-slate-900">Featured Sections</h2>
                <ToggleField sections={sections} onChange={onChange} path="visibility.featuredCategories" label="Show featured categories" />
                <TextField sections={sections} onChange={onChange} path="featuredCategoriesHeading" label="Featured categories heading" />
                <ToggleField sections={sections} onChange={onChange} path="visibility.featuredProducts" label="Show featured products" />
                <TextField sections={sections} onChange={onChange} path="featuredProductsHeading" label="Featured products heading" />
                <ToggleField sections={sections} onChange={onChange} path="visibility.promotions" label="Show promotions" />
              </section>

              <section className="space-y-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                <h2 className="text-sm font-semibold text-slate-900">Services Teaser</h2>
                <ToggleField sections={sections} onChange={onChange} path="visibility.servicesTeaser" label="Show services teaser" />
                <TextField sections={sections} onChange={onChange} path="servicesTeaser.heading" label="Heading" />
                <TextField sections={sections} onChange={onChange} path="servicesTeaser.description" label="Description" textarea />
                <div className="grid grid-cols-2 gap-4">
                  <TextField sections={sections} onChange={onChange} path="servicesTeaser.ctaText" label="CTA text" />
                  <TextField sections={sections} onChange={onChange} path="servicesTeaser.ctaLink" label="CTA link" />
                </div>
              </section>
            </>
          )}

          {page === "about" && (
            <>
              <section className="space-y-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                <h2 className="text-sm font-semibold text-slate-900">Hero</h2>
                <ToggleField sections={sections} onChange={onChange} path="visibility.hero" label="Show hero section" />
                <TextField sections={sections} onChange={onChange} path="hero.heading" label="Heading" />
                <TextField sections={sections} onChange={onChange} path="hero.subheading" label="Subheading" />
                <ImageFieldAt sections={sections} onChange={onChange} path="hero.image" label="Hero image" />
              </section>
              <section className="space-y-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                <h2 className="text-sm font-semibold text-slate-900">Our Story</h2>
                <ToggleField sections={sections} onChange={onChange} path="visibility.story" label="Show section" />
                <TextField sections={sections} onChange={onChange} path="story.heading" label="Heading" />
                <TextField sections={sections} onChange={onChange} path="story.description" label="Description" textarea />
                <ImageFieldAt sections={sections} onChange={onChange} path="story.image" label="Story image" />
              </section>
              <section className="space-y-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                <h2 className="text-sm font-semibold text-slate-900">Mission</h2>
                <ToggleField sections={sections} onChange={onChange} path="visibility.mission" label="Show section" />
                <TextField sections={sections} onChange={onChange} path="mission.heading" label="Heading" />
                <TextField sections={sections} onChange={onChange} path="mission.description" label="Description" textarea />
              </section>
              <section className="space-y-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                <h2 className="text-sm font-semibold text-slate-900">Values</h2>
                <ToggleField sections={sections} onChange={onChange} path="visibility.values" label="Show section" />
                <TextField sections={sections} onChange={onChange} path="values.heading" label="Heading" />
                <RepeaterField
                  sections={sections}
                  onChange={onChange}
                  path="values.items"
                  label="Values"
                  itemFields={[
                    { key: "icon", label: "Icon (lucide name)" },
                    { key: "title", label: "Title" },
                    { key: "description", label: "Description", textarea: true },
                  ]}
                  emptyItem={{ icon: "", title: "", description: "" }}
                />
              </section>
              <section className="space-y-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                <h2 className="text-sm font-semibold text-slate-900">Team</h2>
                <ToggleField sections={sections} onChange={onChange} path="visibility.team" label="Show section" />
                <TextField sections={sections} onChange={onChange} path="team.heading" label="Heading" />
                <TextField sections={sections} onChange={onChange} path="team.description" label="Description" textarea />
                <RepeaterField
                  sections={sections}
                  onChange={onChange}
                  path="team.members"
                  label="Team members"
                  itemFields={[
                    { key: "name", label: "Name" },
                    { key: "role", label: "Role" },
                    { key: "image", label: "Image URL" },
                  ]}
                  emptyItem={{ name: "", role: "", image: "" }}
                />
              </section>
            </>
          )}

          {page === "services" && (
            <>
              <section className="space-y-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                <h2 className="text-sm font-semibold text-slate-900">Hero</h2>
                <ToggleField sections={sections} onChange={onChange} path="visibility.hero" label="Show hero section" />
                <TextField sections={sections} onChange={onChange} path="hero.heading" label="Heading" />
                <TextField sections={sections} onChange={onChange} path="hero.subheading" label="Subheading" />
                <TextField sections={sections} onChange={onChange} path="hero.description" label="Description" textarea />
                <ImageFieldAt sections={sections} onChange={onChange} path="hero.image" label="Hero image" />
              </section>
              <section className="space-y-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                <h2 className="text-sm font-semibold text-slate-900">Intro</h2>
                <ToggleField sections={sections} onChange={onChange} path="visibility.intro" label="Show section" />
                <TextField sections={sections} onChange={onChange} path="intro.heading" label="Heading" />
                <TextField sections={sections} onChange={onChange} path="intro.description" label="Description" textarea />
              </section>
              <section className="space-y-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                <h2 className="text-sm font-semibold text-slate-900">CTA Banner</h2>
                <ToggleField sections={sections} onChange={onChange} path="visibility.ctaBanner" label="Show section" />
                <TextField sections={sections} onChange={onChange} path="ctaBanner.heading" label="Heading" />
                <TextField sections={sections} onChange={onChange} path="ctaBanner.description" label="Description" textarea />
                <div className="grid grid-cols-2 gap-4">
                  <TextField sections={sections} onChange={onChange} path="ctaBanner.ctaText" label="CTA text" />
                  <TextField sections={sections} onChange={onChange} path="ctaBanner.ctaLink" label="CTA link" />
                </div>
              </section>
            </>
          )}

          {page === "pricing" && (
            <>
              <section className="space-y-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                <h2 className="text-sm font-semibold text-slate-900">Hero</h2>
                <ToggleField sections={sections} onChange={onChange} path="visibility.hero" label="Show hero section" />
                <TextField sections={sections} onChange={onChange} path="hero.heading" label="Heading" />
                <TextField sections={sections} onChange={onChange} path="hero.subheading" label="Subheading" />
                <TextField sections={sections} onChange={onChange} path="hero.description" label="Description" textarea />
              </section>
              <section className="space-y-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                <h2 className="text-sm font-semibold text-slate-900">Plans</h2>
                <ToggleField sections={sections} onChange={onChange} path="visibility.plans" label="Show section" />
                <TextField sections={sections} onChange={onChange} path="plans.heading" label="Heading" />
                <TextField sections={sections} onChange={onChange} path="plans.description" label="Description" textarea />
                <RepeaterField
                  sections={sections}
                  onChange={onChange}
                  path="plans.items"
                  label="Plans"
                  itemFields={[
                    { key: "name", label: "Plan name" },
                    { key: "price", label: "Price" },
                    { key: "period", label: "Period (e.g. /month)" },
                    { key: "features", label: "Features (comma separated)" },
                    { key: "ctaText", label: "CTA text" },
                    { key: "ctaLink", label: "CTA link" },
                    { key: "highlighted", label: "Highlighted (true/false)" },
                  ]}
                  emptyItem={{
                    name: "",
                    price: "",
                    period: "",
                    features: "",
                    ctaText: "",
                    ctaLink: "",
                    highlighted: "false",
                  }}
                />
              </section>
              <section className="space-y-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                <h2 className="text-sm font-semibold text-slate-900">FAQ</h2>
                <ToggleField sections={sections} onChange={onChange} path="visibility.faq" label="Show section" />
                <TextField sections={sections} onChange={onChange} path="faq.heading" label="Heading" />
                <RepeaterField
                  sections={sections}
                  onChange={onChange}
                  path="faq.items"
                  label="Questions"
                  itemFields={[
                    { key: "question", label: "Question" },
                    { key: "answer", label: "Answer", textarea: true },
                  ]}
                  emptyItem={{ question: "", answer: "" }}
                />
              </section>
            </>
          )}

          {page === "contact" && (
            <>
              <section className="space-y-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                <h2 className="text-sm font-semibold text-slate-900">Hero</h2>
                <ToggleField sections={sections} onChange={onChange} path="visibility.hero" label="Show hero section" />
                <TextField sections={sections} onChange={onChange} path="hero.heading" label="Heading" />
                <TextField sections={sections} onChange={onChange} path="hero.subheading" label="Subheading" />
                <TextField sections={sections} onChange={onChange} path="hero.description" label="Description" textarea />
              </section>
              <section className="space-y-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                <h2 className="text-sm font-semibold text-slate-900">Contact Info</h2>
                <ToggleField sections={sections} onChange={onChange} path="visibility.info" label="Show section" />
                <TextField sections={sections} onChange={onChange} path="info.heading" label="Heading" />
                <TextField sections={sections} onChange={onChange} path="info.address" label="Address" />
                <TextField sections={sections} onChange={onChange} path="info.phone" label="Phone" />
                <TextField sections={sections} onChange={onChange} path="info.email" label="Email" />
                <TextField sections={sections} onChange={onChange} path="info.hours" label="Business hours" textarea />
              </section>
              <section className="space-y-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                <h2 className="text-sm font-semibold text-slate-900">Contact Form Section</h2>
                <ToggleField sections={sections} onChange={onChange} path="visibility.formSection" label="Show section" />
                <TextField sections={sections} onChange={onChange} path="formSection.heading" label="Heading" />
                <TextField sections={sections} onChange={onChange} path="formSection.description" label="Description" textarea />
              </section>
              <section className="space-y-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                <h2 className="text-sm font-semibold text-slate-900">Map</h2>
                <ToggleField sections={sections} onChange={onChange} path="visibility.map" label="Show map" />
                <TextField sections={sections} onChange={onChange} path="mapEmbedUrl" label="Map embed URL" />
              </section>
            </>
          )}

          <div className="flex justify-end border-t border-slate-200 pt-4">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 rounded-md bg-tes-gold px-5 py-2 text-sm font-semibold text-slate-900 hover:opacity-90 disabled:opacity-60"
            >
              {saving && <Loader2 size={15} className="animate-spin" />}
              Save Page Content
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

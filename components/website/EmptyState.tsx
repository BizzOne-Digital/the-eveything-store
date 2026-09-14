import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { PackageSearch } from "lucide-react";

export default function EmptyState({
  icon: Icon = PackageSearch,
  title,
  description,
  actionHref,
  actionLabel,
}: {
  icon?: LucideIcon;
  title: string;
  description?: string;
  actionHref?: string;
  actionLabel?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-4">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-tes-cream mb-4">
        <Icon className="h-8 w-8 text-tes-gold-dark" aria-hidden="true" />
      </div>
      <h3 className="font-display text-lg font-bold text-tes-black">{title}</h3>
      {description && <p className="mt-1.5 text-sm text-tes-muted max-w-sm">{description}</p>}
      {actionHref && actionLabel && (
        <Link
          href={actionHref}
          className="mt-5 inline-flex items-center rounded-full bg-tes-black px-6 py-2.5 text-sm font-semibold text-white hover:bg-tes-soft-black transition-colors"
        >
          {actionLabel}
        </Link>
      )}
    </div>
  );
}

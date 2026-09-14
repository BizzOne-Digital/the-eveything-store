import type { LucideIcon } from "lucide-react";

interface DashboardCardProps {
  icon: LucideIcon;
  label: string;
  value: number | string;
  subLabel?: string;
  tone?: "default" | "warning" | "success";
}

const TONE_CLASSES: Record<string, string> = {
  default: "bg-tes-gold/10 text-tes-gold",
  warning: "bg-amber-100 text-amber-600",
  success: "bg-emerald-100 text-emerald-600",
};

export default function DashboardCard({
  icon: Icon,
  label,
  value,
  subLabel,
  tone = "default",
}: DashboardCardProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-slate-500">{label}</span>
        <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${TONE_CLASSES[tone]}`}>
          <Icon size={18} />
        </div>
      </div>
      <div className="mt-2 text-2xl font-semibold text-slate-900">{value}</div>
      {subLabel && <div className="mt-1 text-xs text-slate-400">{subLabel}</div>}
    </div>
  );
}

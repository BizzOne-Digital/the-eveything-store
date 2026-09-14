"use client";

import { useRouter, usePathname } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { LogOut } from "lucide-react";

interface AdminHeaderProps {
  name: string;
  email: string;
}

const LABELS: Record<string, string> = {
  admin: "Dashboard",
  products: "Products",
  categories: "Categories",
  services: "Services",
  orders: "Orders",
  customers: "Customers",
  inquiries: "Inquiries",
  promotions: "Promotions",
  pages: "Pages",
  media: "Media",
  settings: "Settings",
  new: "New",
};

function useBreadcrumb() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);
  if (segments.length <= 1) return "Dashboard";
  return segments
    .slice(1)
    .map((seg) => LABELS[seg] || seg)
    .join(" / ");
}

export default function AdminHeader({ name, email }: AdminHeaderProps) {
  const router = useRouter();
  const title = useBreadcrumb();
  const [loggingOut, setLoggingOut] = useState(false);

  async function handleLogout() {
    setLoggingOut(true);
    try {
      await fetch("/api/admin/auth/logout", { method: "POST" });
      router.push("/admin/login");
      router.refresh();
    } catch {
      toast.error("Failed to log out");
      setLoggingOut(false);
    }
  }

  return (
    <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 pl-14 lg:pl-6">
      <h1 className="truncate text-base font-semibold text-slate-900 sm:text-lg">
        {title || "Dashboard"}
      </h1>
      <div className="flex items-center gap-3">
        <div className="hidden text-right sm:block">
          <div className="text-sm font-medium text-slate-800">{name}</div>
          <div className="text-xs text-slate-400">{email}</div>
        </div>
        <button
          type="button"
          onClick={handleLogout}
          disabled={loggingOut}
          className="flex items-center gap-1.5 rounded-md border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-50"
        >
          <LogOut size={15} />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </header>
  );
}

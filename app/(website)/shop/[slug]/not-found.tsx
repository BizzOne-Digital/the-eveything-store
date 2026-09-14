import EmptyState from "@/components/website/EmptyState";
import { PackageX } from "lucide-react";

export default function ProductNotFound() {
  return (
    <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-10 py-16">
      <EmptyState
        icon={PackageX}
        title="Product Not Found"
        description="This product may have been removed or is no longer available."
        actionHref="/shop"
        actionLabel="Continue Shopping"
      />
    </div>
  );
}

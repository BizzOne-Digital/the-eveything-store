import { Star } from "lucide-react";

/**
 * There is no review/rating system in the current data model, so this renders
 * a neutral, static "trust" indicator rather than fabricated review counts.
 */
export default function StarRating({ className }: { className?: string }) {
  return (
    <div className={`flex items-center gap-0.5 ${className ?? ""}`} aria-hidden="true">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className="h-3.5 w-3.5 fill-tes-gold text-tes-gold" />
      ))}
    </div>
  );
}

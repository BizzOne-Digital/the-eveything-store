"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Search, Loader2, Tag, Wrench, Package } from "lucide-react";
import { resolveImage, formatPrice } from "@/lib/utils";
import type { SuggestItem } from "@/app/api/search/suggest/route";

export default function SearchBar({ className }: { className?: string }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SuggestItem[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  useEffect(() => {
    if (!query.trim()) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- clearing results in response to query prop change
      setResults([]);
      return;
    }
    setLoading(true);
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search/suggest?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        setResults(data.results ?? []);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;
    setOpen(false);
    router.push(`/search?q=${encodeURIComponent(query.trim())}`);
  }

  const typeIcon = {
    product: Package,
    category: Tag,
    service: Wrench,
  };

  return (
    <div ref={containerRef} className={`relative w-full ${className ?? ""}`}>
      <form onSubmit={handleSubmit} role="search" className="relative">
        <label htmlFor="site-search" className="sr-only">
          Search products, categories, and services
        </label>
        <input
          id="site-search"
          type="search"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          placeholder="Search products, categories, services..."
          className="w-full rounded-full border border-tes-border bg-white py-2.5 pl-11 pr-4 text-sm text-tes-black placeholder:text-tes-muted focus:outline-none focus:ring-2 focus:ring-tes-gold/60"
        />
        <button
          type="submit"
          aria-label="Search"
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-tes-muted hover:text-tes-gold transition-colors"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
        </button>
      </form>

      {open && query.trim() && (
        <div className="absolute z-40 mt-2 w-full rounded-xl border border-tes-border bg-white shadow-xl overflow-hidden">
          {results.length === 0 && !loading && (
            <p className="px-4 py-4 text-sm text-tes-muted">No matches found for &quot;{query}&quot;.</p>
          )}
          <ul className="max-h-96 overflow-y-auto divide-y divide-tes-border">
            {results.map((r) => {
              const Icon = typeIcon[r.type];
              return (
                <li key={`${r.type}-${r.id}`}>
                  <Link
                    href={r.href}
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 hover:bg-tes-cream transition-colors"
                  >
                    <span className="relative h-10 w-10 shrink-0 overflow-hidden rounded-md bg-tes-cream">
                      {r.image ? (
                        <Image src={resolveImage(r.image)} alt="" fill className="object-cover" sizes="40px" />
                      ) : (
                        <Icon className="h-5 w-5 m-auto mt-2.5 text-tes-gold" />
                      )}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium text-tes-black">{r.title}</span>
                      <span className="block text-xs text-tes-muted capitalize">{r.type}</span>
                    </span>
                    {r.price !== undefined && (
                      <span className="shrink-0 text-sm font-semibold text-tes-black">
                        {formatPrice(r.salePrice || r.price)}
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
          {results.length > 0 && (
            <button
              onClick={handleSubmit}
              className="w-full border-t border-tes-border py-2.5 text-center text-xs font-semibold uppercase tracking-wide text-tes-gold-dark hover:bg-tes-cream transition-colors"
            >
              See all results for &quot;{query}&quot;
            </button>
          )}
        </div>
      )}
    </div>
  );
}

"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Mail, Loader2 } from "lucide-react";

export default function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      toast.success("You're subscribed. Thanks for joining us!");
      setEmail("");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="bg-tes-cream">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-10 py-14 flex flex-col items-center text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-tes-black text-tes-gold mb-4">
          <Mail className="h-6 w-6" />
        </div>
        <h2 className="font-display text-2xl sm:text-3xl font-bold text-tes-black">Stay in the Loop</h2>
        <p className="mt-2 max-w-md text-sm text-tes-muted">
          Get updates on new products, seasonal deals, and local service offers.
        </p>
        <form onSubmit={handleSubmit} className="mt-6 flex w-full max-w-md flex-col sm:flex-row gap-3">
          <label htmlFor="newsletter-email" className="sr-only">Email address</label>
          <input
            id="newsletter-email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="flex-1 rounded-full border border-tes-border bg-white px-5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-tes-gold/60"
          />
          <button
            type="submit"
            disabled={loading}
            className="flex items-center justify-center gap-2 rounded-full bg-tes-black px-6 py-3 text-sm font-bold text-white hover:bg-tes-gold hover:text-tes-black transition-colors disabled:opacity-60"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            Subscribe
          </button>
        </form>
      </div>
    </section>
  );
}

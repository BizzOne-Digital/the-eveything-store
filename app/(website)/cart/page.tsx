"use client";

import Link from "next/link";
import Image from "next/image";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { resolveImage, formatPrice } from "@/lib/utils";
import Breadcrumbs from "@/components/website/Breadcrumbs";
import EmptyState from "@/components/website/EmptyState";

export default function CartPage() {
  const { items, updateQuantity, removeItem, subtotal } = useCart();

  return (
    <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-10 py-8 sm:py-10">
      <Breadcrumbs items={[{ label: "Cart" }]} />
      <h1 className="mt-4 font-display text-3xl sm:text-4xl font-bold text-tes-black">Your Cart</h1>

      {items.length === 0 ? (
        <EmptyState
          icon={ShoppingBag}
          title="Your cart is empty."
          description="Browse our shop to find products you'll love."
          actionHref="/shop"
          actionLabel="Continue Shopping"
        />
      ) : (
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 flex flex-col gap-4">
            {items.map((item) => (
              <div
                key={item.productId}
                className="flex items-center gap-4 rounded-2xl border border-tes-border p-4"
              >
                <Link href={`/shop/${item.slug}`} className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-tes-cream">
                  <Image src={resolveImage(item.image)} alt={item.name} fill sizes="80px" className="object-cover" />
                </Link>
                <div className="flex-1 min-w-0">
                  <Link href={`/shop/${item.slug}`} className="font-display text-sm font-bold text-tes-black hover:text-tes-gold-dark transition-colors line-clamp-2">
                    {item.name}
                  </Link>
                  <p className="mt-1 text-sm text-tes-muted">{formatPrice(item.price)} each</p>
                </div>
                <div className="flex items-center rounded-full border border-tes-border shrink-0">
                  <button
                    type="button"
                    aria-label="Decrease quantity"
                    onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                    className="flex h-9 w-9 items-center justify-center disabled:opacity-30"
                  >
                    <Minus className="h-3.5 w-3.5" />
                  </button>
                  <span className="w-8 text-center text-sm font-semibold">{item.quantity}</span>
                  <button
                    type="button"
                    aria-label="Increase quantity"
                    onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                    disabled={item.quantity >= item.stock}
                    className="flex h-9 w-9 items-center justify-center disabled:opacity-30"
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </div>
                <p className="hidden sm:block w-20 shrink-0 text-right text-sm font-bold text-tes-black">
                  {formatPrice(item.price * item.quantity)}
                </p>
                <button
                  type="button"
                  aria-label={`Remove ${item.name} from cart`}
                  onClick={() => removeItem(item.productId)}
                  className="shrink-0 p-2 text-tes-muted hover:text-red-600 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
            <Link href="/shop" className="mt-2 inline-flex w-fit items-center gap-1 text-sm font-semibold text-tes-black hover:text-tes-gold-dark transition-colors">
              Continue Shopping
            </Link>
          </div>

          <div className="rounded-2xl border border-tes-border p-6 h-fit">
            <h2 className="font-display text-lg font-bold text-tes-black mb-4">Order Summary</h2>
            <div className="flex items-center justify-between text-sm text-tes-muted mb-2">
              <span>Subtotal</span>
              <span className="font-semibold text-tes-black">{formatPrice(subtotal)}</span>
            </div>
            <p className="text-xs text-tes-muted mb-4">Delivery fees, if any, are confirmed at checkout.</p>
            <Link
              href="/checkout"
              className="flex items-center justify-center gap-2 rounded-full bg-tes-black py-3.5 text-sm font-bold text-white hover:bg-tes-gold hover:text-tes-black transition-colors"
            >
              Proceed to Checkout <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

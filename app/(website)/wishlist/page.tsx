"use client";

import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import { Heart, ShoppingBag, Trash2 } from "lucide-react";
import { useWishlist } from "@/lib/wishlist-context";
import { useCart } from "@/lib/cart-context";
import { resolveImage, formatPrice } from "@/lib/utils";
import Breadcrumbs from "@/components/website/Breadcrumbs";
import EmptyState from "@/components/website/EmptyState";

export default function WishlistPage() {
  const { items, removeItem } = useWishlist();
  const { addItem } = useCart();

  function moveToCart(item: (typeof items)[number]) {
    addItem(
      {
        productId: item.productId,
        slug: item.slug,
        name: item.name,
        image: item.image,
        price: item.salePrice || item.price,
        stock: item.stock,
      },
      1
    );
    removeItem(item.productId);
    toast.success(`${item.name} moved to cart`);
  }

  return (
    <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-10 py-8 sm:py-10">
      <Breadcrumbs items={[{ label: "Wishlist" }]} />
      <h1 className="mt-4 font-display text-3xl sm:text-4xl font-bold text-tes-black">Your Wishlist</h1>

      {items.length === 0 ? (
        <EmptyState
          icon={Heart}
          title="Your wishlist is empty."
          description="Save products you love and revisit them anytime."
          actionHref="/shop"
          actionLabel="Browse Products"
        />
      ) : (
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((item) => (
            <div key={item.productId} className="flex gap-4 rounded-2xl border border-tes-border p-4">
              <Link href={`/shop/${item.slug}`} className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-tes-cream">
                <Image src={resolveImage(item.image)} alt={item.name} fill sizes="80px" className="object-cover" />
              </Link>
              <div className="flex-1 min-w-0 flex flex-col">
                <Link href={`/shop/${item.slug}`} className="font-display text-sm font-bold text-tes-black hover:text-tes-gold-dark transition-colors line-clamp-2">
                  {item.name}
                </Link>
                <p className="mt-1 text-sm font-semibold text-tes-black">
                  {formatPrice(item.salePrice || item.price)}
                </p>
                <div className="mt-auto flex items-center gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => moveToCart(item)}
                    className="flex items-center gap-1.5 rounded-full bg-tes-black px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-tes-gold hover:text-tes-black transition-colors"
                  >
                    <ShoppingBag className="h-3.5 w-3.5" /> Add to Cart
                  </button>
                  <button
                    type="button"
                    aria-label={`Remove ${item.name} from wishlist`}
                    onClick={() => removeItem(item.productId)}
                    className="p-1.5 text-tes-muted hover:text-red-600 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Heart, ShoppingBag, Zap, Share2, Minus, Plus } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { useWishlist } from "@/lib/wishlist-context";
import type { PlainProduct } from "@/lib/website/data";

export default function ProductActions({ product }: { product: PlainProduct }) {
  const router = useRouter();
  const { addItem } = useCart();
  const { toggleItem, isWishlisted } = useWishlist();
  const [quantity, setQuantity] = useState(1);

  const onSale = !!product.salePrice && product.salePrice > 0 && product.salePrice < product.price;
  const price = onSale ? (product.salePrice as number) : product.price;
  const outOfStock = product.stock <= 0;
  const wishlisted = isWishlisted(product._id);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("tes_recently_viewed");
      const list: string[] = raw ? JSON.parse(raw) : [];
      const next = [product.slug, ...list.filter((s) => s !== product.slug)].slice(0, 8);
      localStorage.setItem("tes_recently_viewed", JSON.stringify(next));
    } catch {
      // ignore
    }
  }, [product.slug]);

  function cartPayload() {
    return {
      productId: product._id,
      slug: product.slug,
      name: product.name,
      image: product.mainImage,
      price,
      stock: product.stock,
    };
  }

  function handleAddToCart() {
    if (outOfStock) return;
    addItem(cartPayload(), quantity);
    toast.success(`${product.name} added to cart`);
  }

  function handleBuyNow() {
    if (outOfStock) return;
    addItem(cartPayload(), quantity);
    router.push("/checkout");
  }

  function handleWishlist() {
    toggleItem({
      productId: product._id,
      slug: product.slug,
      name: product.name,
      image: product.mainImage,
      price: product.price,
      salePrice: product.salePrice,
      stock: product.stock,
    });
    toast.success(wishlisted ? "Removed from wishlist" : "Added to wishlist");
  }

  async function handleShare() {
    const shareData = {
      title: product.name,
      text: product.shortDescription || product.name,
      url: typeof window !== "undefined" ? window.location.href : "",
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(shareData.url);
        toast.success("Link copied to clipboard");
      }
    } catch {
      // user cancelled share — no-op
    }
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-3">
        <div className="flex items-center rounded-full border border-tes-border">
          <button
            type="button"
            aria-label="Decrease quantity"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="flex h-11 w-11 items-center justify-center text-tes-black disabled:opacity-30"
            disabled={quantity <= 1}
          >
            <Minus className="h-4 w-4" />
          </button>
          <span className="w-10 text-center text-sm font-semibold">{quantity}</span>
          <button
            type="button"
            aria-label="Increase quantity"
            onClick={() => setQuantity((q) => Math.min(product.stock || 1, q + 1))}
            className="flex h-11 w-11 items-center justify-center text-tes-black disabled:opacity-30"
            disabled={quantity >= product.stock}
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
        <button
          type="button"
          onClick={handleWishlist}
          aria-pressed={wishlisted}
          aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-tes-border hover:border-tes-gold transition-colors"
        >
          <Heart className={`h-5 w-5 ${wishlisted ? "fill-tes-gold text-tes-gold" : "text-tes-black"}`} />
        </button>
        <button
          type="button"
          onClick={handleShare}
          aria-label="Share this product"
          className="flex h-11 w-11 items-center justify-center rounded-full border border-tes-border hover:border-tes-gold transition-colors"
        >
          <Share2 className="h-5 w-5 text-tes-black" />
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <button
          type="button"
          onClick={handleAddToCart}
          disabled={outOfStock}
          className="flex flex-1 items-center justify-center gap-2 rounded-full bg-tes-black px-6 py-3.5 text-sm font-bold text-white hover:bg-tes-soft-black transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <ShoppingBag className="h-4 w-4" /> Add to Cart
        </button>
        <button
          type="button"
          onClick={handleBuyNow}
          disabled={outOfStock}
          className="flex flex-1 items-center justify-center gap-2 rounded-full bg-tes-gold px-6 py-3.5 text-sm font-bold text-tes-black hover:bg-tes-gold-light transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Zap className="h-4 w-4" /> Buy Now
        </button>
      </div>
      {outOfStock && <p className="text-sm font-medium text-red-600">This product is currently out of stock.</p>}
    </div>
  );
}

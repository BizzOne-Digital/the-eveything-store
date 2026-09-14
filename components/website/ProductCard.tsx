"use client";

import Link from "next/link";
import Image from "next/image";
import { Heart, ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import { resolveImage, formatPrice } from "@/lib/utils";
import { useCart } from "@/lib/cart-context";
import { useWishlist } from "@/lib/wishlist-context";
import type { PlainProduct } from "@/lib/website/data";

export default function ProductCard({
  product,
  categoryName,
}: {
  product: PlainProduct;
  categoryName?: string;
}) {
  const { addItem } = useCart();
  const { toggleItem, isWishlisted } = useWishlist();

  const onSale = !!product.salePrice && product.salePrice > 0 && product.salePrice < product.price;
  const discount = onSale
    ? Math.round(((product.price - (product.salePrice as number)) / product.price) * 100)
    : 0;
  const outOfStock = product.stock <= 0;
  const lowStock = !outOfStock && product.stock <= (product.lowStockThreshold ?? 5);
  const wishlisted = isWishlisted(product._id);

  function handleAddToCart(e: React.MouseEvent) {
    e.preventDefault();
    if (outOfStock) return;
    addItem(
      {
        productId: product._id,
        slug: product.slug,
        name: product.name,
        image: product.mainImage,
        price: onSale ? (product.salePrice as number) : product.price,
        stock: product.stock,
      },
      1
    );
    toast.success(`${product.name} added to cart`);
  }

  function handleWishlist(e: React.MouseEvent) {
    e.preventDefault();
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

  return (
    <Link
      href={`/shop/${product.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-tes-border bg-white transition-shadow hover:shadow-lg"
    >
      <div className="relative aspect-square w-full overflow-hidden bg-tes-cream">
        <Image
          src={resolveImage(product.mainImage)}
          alt={product.name}
          fill
          sizes="(min-width: 1024px) 23vw, (min-width: 640px) 33vw, 50vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {onSale && (
          <span className="absolute top-2.5 left-2.5 rounded-full bg-tes-gold px-2.5 py-1 text-[11px] font-bold text-tes-black">
            -{discount}%
          </span>
        )}
        {outOfStock && (
          <span className="absolute top-2.5 right-2.5 rounded-full bg-tes-black/85 px-2.5 py-1 text-[11px] font-semibold text-white">
            Out of Stock
          </span>
        )}
        <button
          type="button"
          onClick={handleWishlist}
          aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
          aria-pressed={wishlisted}
          className="absolute bottom-2.5 right-2.5 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 shadow hover:bg-white transition-colors"
        >
          <Heart className={`h-4 w-4 ${wishlisted ? "fill-tes-gold text-tes-gold" : "text-tes-black"}`} />
        </button>
      </div>

      <div className="flex flex-1 flex-col gap-1.5 p-3.5">
        {categoryName && (
          <span className="text-[11px] font-semibold uppercase tracking-wide text-tes-gold-dark">
            {categoryName}
          </span>
        )}
        <h3 className="line-clamp-2 font-display text-sm font-bold text-tes-black">{product.name}</h3>

        <div className="mt-auto flex items-center justify-between gap-2 pt-2">
          <div className="flex items-baseline gap-1.5">
            <span className="text-base font-bold text-tes-black">
              {formatPrice(onSale ? (product.salePrice as number) : product.price)}
            </span>
            {onSale && (
              <span className="text-xs text-tes-muted line-through">{formatPrice(product.price)}</span>
            )}
          </div>
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={outOfStock}
            aria-label={`Add ${product.name} to cart`}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-tes-black text-white transition-colors hover:bg-tes-gold hover:text-tes-black disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ShoppingBag className="h-4 w-4" />
          </button>
        </div>
        {lowStock && <p className="text-[11px] font-medium text-tes-gold-dark">Only {product.stock} left</p>}
      </div>
    </Link>
  );
}

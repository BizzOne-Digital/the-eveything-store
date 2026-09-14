"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Heart, ShoppingBag, Menu, X, User } from "lucide-react";
import Logo from "./Logo";
import SearchBar from "./SearchBar";
import { useCart } from "@/lib/cart-context";
import { useWishlist } from "@/lib/wishlist-context";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/services", label: "Services" },
  { href: "/about", label: "About Us" },
  { href: "/pricing", label: "Pricing" },
  { href: "/contact", label: "Contact" },
];

export default function HeaderClient({
  businessName,
  logo,
}: {
  businessName: string;
  logo?: string;
}) {
  const pathname = usePathname();
  const { itemCount } = useCart();
  const { items: wishlistItems } = useWishlist();
  const [mobileOpen, setMobileOpen] = useState(false);

  function isActive(href: string) {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  }

  return (
    <div className="bg-white border-b border-tes-border">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-10">
        <div className="flex items-center justify-between gap-4 py-3 lg:py-4">
          <Logo businessName={businessName} logo={logo} />

          <div className="hidden lg:block flex-1 max-w-xl mx-6">
            <SearchBar />
          </div>

          <div className="flex items-center gap-1 sm:gap-2">
            <Link
              href="/wishlist"
              aria-label="Wishlist"
              className="relative p-2 rounded-full hover:bg-tes-cream transition-colors"
            >
              <Heart className="h-5 w-5 text-tes-black" />
              {wishlistItems.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-tes-gold text-[10px] font-bold text-tes-black">
                  {wishlistItems.length}
                </span>
              )}
            </Link>
            <Link
              href="/cart"
              aria-label="Cart"
              className="relative p-2 rounded-full hover:bg-tes-cream transition-colors"
            >
              <ShoppingBag className="h-5 w-5 text-tes-black" />
              {itemCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-tes-gold text-[10px] font-bold text-tes-black">
                  {itemCount}
                </span>
              )}
            </Link>
            <Link
              href="/contact"
              aria-label="Account / Contact us"
              className="hidden sm:inline-flex p-2 rounded-full hover:bg-tes-cream transition-colors"
            >
              <User className="h-5 w-5 text-tes-black" />
            </Link>
            <button
              type="button"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              onClick={() => setMobileOpen((v) => !v)}
              className="lg:hidden p-2 rounded-full hover:bg-tes-cream transition-colors"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        <div className="lg:hidden pb-3">
          <SearchBar />
        </div>

        <nav aria-label="Primary" className="hidden lg:flex items-center gap-8 pb-3">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`relative py-1 text-sm font-semibold tracking-wide transition-colors ${
                isActive(link.href) ? "text-tes-black" : "text-tes-muted hover:text-tes-black"
              }`}
            >
              {link.label}
              {isActive(link.href) && (
                <span className="absolute -bottom-1 left-0 right-0 h-0.5 gold-gradient rounded-full" />
              )}
            </Link>
          ))}
        </nav>
      </div>

      {mobileOpen && (
        <div className="lg:hidden border-t border-tes-border bg-white">
          <nav aria-label="Mobile" className="flex flex-col px-4 py-3">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`py-3 text-sm font-semibold border-b border-tes-border last:border-none ${
                  isActive(link.href) ? "text-tes-gold-dark" : "text-tes-black"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </div>
  );
}

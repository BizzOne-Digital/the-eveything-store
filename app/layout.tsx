import type { Metadata } from "next";
import { Playfair_Display, Manrope } from "next/font/google";
import { Toaster } from "sonner";
import { CartProvider } from "@/lib/cart-context";
import { WishlistProvider } from "@/lib/wishlist-context";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800", "900"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: {
    default: "The Everything Shop & Services",
    template: "%s | The Everything Shop & Services",
  },
  description:
    "Everything for business, big or small. Household products, clothing, electronics, services, you name it — we've got it.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${manrope.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <CartProvider>
          <WishlistProvider>{children}</WishlistProvider>
        </CartProvider>
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}

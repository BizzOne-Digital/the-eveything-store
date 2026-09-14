"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Loader2, Truck, ShieldCheck } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { resolveImage, formatPrice } from "@/lib/utils";
import Breadcrumbs from "@/components/website/Breadcrumbs";

const schema = z.object({
  firstName: z.string().trim().min(1, "First name is required"),
  lastName: z.string().trim().min(1, "Last name is required"),
  email: z.string().trim().email("Enter a valid email address"),
  phone: z.string().trim().min(1, "Phone number is required"),
  address: z.string().trim().min(1, "Address is required"),
  city: z.string().trim().min(1, "City is required"),
  province: z.string().trim().min(1, "Province is required"),
  postalCode: z.string().trim().min(1, "Postal code is required"),
  deliveryNotes: z.string().trim().optional(),
});

type FormValues = z.infer<typeof schema>;

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, clearCart } = useCart();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  useEffect(() => {
    if (items.length === 0) router.replace("/cart");
  }, [items.length, router]);

  async function onSubmit(values: FormValues) {
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          items: items.map((item) => ({
            productId: item.productId,
            name: item.name,
            image: item.image,
            price: item.price,
            quantity: item.quantity,
          })),
          paymentMethod: "Pay on Delivery / Pickup",
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong.");
      clearCart();
      router.push(`/order-confirmation/${data.orderNumber}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    }
  }

  if (items.length === 0) return null;

  return (
    <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-10 py-8 sm:py-10">
      <Breadcrumbs items={[{ label: "Cart", href: "/cart" }, { label: "Checkout" }]} />
      <h1 className="mt-4 font-display text-3xl sm:text-4xl font-bold text-tes-black">Checkout</h1>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-10">
        <form onSubmit={handleSubmit(onSubmit)} className="lg:col-span-2 flex flex-col gap-5">
          <h2 className="font-display text-lg font-bold text-tes-black">Delivery Details</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="firstName" className="block text-sm font-semibold text-tes-black mb-1.5">First Name</label>
              <input id="firstName" {...register("firstName")} className="w-full rounded-lg border border-tes-border px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-tes-gold/60" />
              {errors.firstName && <p className="mt-1 text-xs text-red-600">{errors.firstName.message}</p>}
            </div>
            <div>
              <label htmlFor="lastName" className="block text-sm font-semibold text-tes-black mb-1.5">Last Name</label>
              <input id="lastName" {...register("lastName")} className="w-full rounded-lg border border-tes-border px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-tes-gold/60" />
              {errors.lastName && <p className="mt-1 text-xs text-red-600">{errors.lastName.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-tes-black mb-1.5">Email Address</label>
              <input id="email" type="email" {...register("email")} className="w-full rounded-lg border border-tes-border px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-tes-gold/60" />
              {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>}
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-semibold text-tes-black mb-1.5">Phone Number</label>
              <input id="phone" type="tel" {...register("phone")} className="w-full rounded-lg border border-tes-border px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-tes-gold/60" />
              {errors.phone && <p className="mt-1 text-xs text-red-600">{errors.phone.message}</p>}
            </div>
          </div>

          <div>
            <label htmlFor="address" className="block text-sm font-semibold text-tes-black mb-1.5">Street Address</label>
            <input id="address" {...register("address")} className="w-full rounded-lg border border-tes-border px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-tes-gold/60" />
            {errors.address && <p className="mt-1 text-xs text-red-600">{errors.address.message}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label htmlFor="city" className="block text-sm font-semibold text-tes-black mb-1.5">City</label>
              <input id="city" {...register("city")} className="w-full rounded-lg border border-tes-border px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-tes-gold/60" />
              {errors.city && <p className="mt-1 text-xs text-red-600">{errors.city.message}</p>}
            </div>
            <div>
              <label htmlFor="province" className="block text-sm font-semibold text-tes-black mb-1.5">Province</label>
              <input id="province" {...register("province")} className="w-full rounded-lg border border-tes-border px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-tes-gold/60" />
              {errors.province && <p className="mt-1 text-xs text-red-600">{errors.province.message}</p>}
            </div>
            <div>
              <label htmlFor="postalCode" className="block text-sm font-semibold text-tes-black mb-1.5">Postal Code</label>
              <input id="postalCode" {...register("postalCode")} className="w-full rounded-lg border border-tes-border px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-tes-gold/60" />
              {errors.postalCode && <p className="mt-1 text-xs text-red-600">{errors.postalCode.message}</p>}
            </div>
          </div>

          <div>
            <label htmlFor="deliveryNotes" className="block text-sm font-semibold text-tes-black mb-1.5">
              Delivery Notes <span className="text-tes-muted font-normal">(optional)</span>
            </label>
            <textarea id="deliveryNotes" rows={3} {...register("deliveryNotes")} className="w-full rounded-lg border border-tes-border px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-tes-gold/60" />
          </div>

          <div className="rounded-xl bg-tes-cream p-4 flex items-start gap-3">
            <Truck className="h-5 w-5 text-tes-gold-dark mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-semibold text-tes-black">Payment Method: Pay on Delivery / Pickup</p>
              <p className="text-xs text-tes-muted mt-0.5">
                No payment is collected online. You&apos;ll pay when your order is delivered or picked up.
              </p>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-2 flex items-center justify-center gap-2 rounded-full bg-tes-black py-3.5 text-sm font-bold text-white hover:bg-tes-gold hover:text-tes-black transition-colors disabled:opacity-60"
          >
            {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
            Place Order
          </button>
        </form>

        <div className="rounded-2xl border border-tes-border p-6 h-fit">
          <h2 className="font-display text-lg font-bold text-tes-black mb-4">Order Summary</h2>
          <div className="flex flex-col gap-3 max-h-72 overflow-y-auto pr-1">
            {items.map((item) => (
              <div key={item.productId} className="flex items-center gap-3">
                <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-tes-cream">
                  <Image src={resolveImage(item.image)} alt={item.name} fill sizes="56px" className="object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-tes-black line-clamp-1">{item.name}</p>
                  <p className="text-xs text-tes-muted">Qty {item.quantity}</p>
                </div>
                <p className="text-sm font-semibold text-tes-black shrink-0">{formatPrice(item.price * item.quantity)}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-tes-border flex items-center justify-between">
            <span className="text-sm text-tes-muted">Subtotal</span>
            <span className="text-base font-bold text-tes-black">{formatPrice(subtotal)}</span>
          </div>
          <div className="mt-4 flex items-start gap-2 text-xs text-tes-muted">
            <ShieldCheck className="h-4 w-4 text-tes-gold-dark shrink-0 mt-0.5" />
            <span>Your information is only used to fulfill your order.</span>
          </div>
        </div>
      </div>

      <Link href="/cart" className="mt-6 inline-block text-sm font-semibold text-tes-black hover:text-tes-gold-dark transition-colors">
        Back to Cart
      </Link>
    </div>
  );
}

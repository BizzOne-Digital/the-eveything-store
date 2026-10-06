"use client";

import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

export interface PayPalButtonItem {
  productId?: string;
  name: string;
  image?: string;
  price: number;
  quantity: number;
}

export interface PayPalCustomerDetails {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  province: string;
  postalCode: string;
  deliveryNotes?: string;
}

interface PayPalButtonProps {
  items: PayPalButtonItem[];
  validateAndGetCustomer: () => Promise<PayPalCustomerDetails | null>;
  onSuccess: (orderNumber: string) => void;
}

declare global {
  interface Window {
    paypal?: {
      Buttons: (config: Record<string, unknown>) => { render: (selector: string) => void };
    };
  }
}

const CONTAINER_ID = "paypal-button-container";

export default function PayPalButton({ items, validateAndGetCustomer, onSuccess }: PayPalButtonProps) {
  const [sdkReady, setSdkReady] = useState(false);
  const renderedRef = useRef(false);

  useEffect(() => {
    const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
    if (!clientId) return;

    const existing = document.getElementById("paypal-sdk");
    if (existing) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- script already present from a prior mount
      setSdkReady(true);
      return;
    }

    const script = document.createElement("script");
    script.id = "paypal-sdk";
    script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&currency=CAD&intent=capture`;
    script.onload = () => setSdkReady(true);
    script.onerror = () => toast.error("Failed to load PayPal. Please try again.");
    document.body.appendChild(script);
  }, []);

  useEffect(() => {
    if (!sdkReady || !window.paypal || renderedRef.current) return;
    renderedRef.current = true;

    window.paypal.Buttons({
      style: { layout: "vertical", color: "gold", shape: "pill", label: "paypal" },
      createOrder: async () => {
        const customer = await validateAndGetCustomer();
        if (!customer) {
          toast.error("Please fill in your delivery details before paying.");
          throw new Error("Validation failed");
        }
        const res = await fetch("/api/paypal/create-order", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ items }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to start PayPal checkout.");
        return data.id;
      },
      onApprove: async (data: { orderID: string }) => {
        const customer = await validateAndGetCustomer();
        if (!customer) {
          toast.error("Please fill in your delivery details.");
          return;
        }
        try {
          const res = await fetch("/api/paypal/capture-order", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...customer, items, paypalOrderId: data.orderID }),
          });
          const result = await res.json();
          if (!res.ok) throw new Error(result.error || "Failed to confirm payment.");
          onSuccess(result.orderNumber);
        } catch (err) {
          toast.error(err instanceof Error ? err.message : "Payment succeeded but order confirmation failed. Please contact us.");
        }
      },
      onError: () => {
        toast.error("PayPal checkout failed. Please try again.");
      },
    }).render(`#${CONTAINER_ID}`);
  }, [sdkReady, items, validateAndGetCustomer, onSuccess]);

  if (!process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID) {
    return <p className="text-xs text-tes-muted">PayPal is not configured yet.</p>;
  }

  return <div id={CONTAINER_ID} />;
}

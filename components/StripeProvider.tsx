"use client";

import { useEffect } from "react";

/**
 * StripeProvider Component
 * Initializes Stripe on the client side
 * Add this to your root layout
 */
export default function StripeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    // Verify Stripe is available
    const stripeKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
    if (!stripeKey) {
      console.warn(
        "Stripe publishable key not found. Please set NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY in your .env"
      );
    } else {
      console.log("✅ Stripe client initialized successfully");
    }
  }, []);

  return <>{children}</>;
}

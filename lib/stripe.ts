// lib/stripe.ts
import Stripe from 'stripe';

// Initialize Stripe client (server-side only)
export const stripe = new Stripe(
  process.env.STRIPE_SECRET_KEY || ''
);

// Stripe API URLs for client-side use
export const STRIPE_PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3001';

// Payment status types
export type PaymentStatus = 'pending' | 'succeeded' | 'processing' | 'requires_action' | 'failed';

// Checkout session response type
export interface CheckoutSession {
  url: string;
  sessionId: string;
  orderId: string;
  clientSecret?: string;
}

// Payment intent response type
export interface PaymentIntentResponse {
  clientSecret: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
}

// Helper function to format amount for Stripe (multiply by 100 for cents)
export function formatAmountForStripe(amount: number): number {
  return Math.round(amount * 100);
}

// Helper function to format amount from Stripe (divide by 100)
export function formatAmountFromStripe(amount: number): number {
  return amount / 100;
}

// Validate Stripe webhook signature
export function validateWebhookSignature(
  body: string,
  signature: string,
  secret: string
): Stripe.Event | null {
  try {
    return Stripe.webhooks.constructEvent(body, signature, secret);
  } catch (error) {
    console.error('Webhook signature verification failed:', error);
    return null;
  }
}

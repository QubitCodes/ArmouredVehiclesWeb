# Stripe Integration Complete Setup Guide

This guide covers the complete Stripe integration for the Armoured Vehicles Web application frontend.

## ✅ What Has Been Configured

### Frontend Changes Made

1. **Environment Variables** (`.env.example`)

   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` - Public key for Stripe
   - `STRIPE_SECRET_KEY` - Server-side secret key
   - `STRIPE_WEBHOOK_SECRET` - Webhook signing secret
   - `NEXT_PUBLIC_APP_URL` - Application URL

2. **Stripe Utility** (`lib/stripe.ts`)

   - Stripe client initialization
   - Helper functions for amount formatting
   - Webhook signature validation
   - Type definitions for payment responses

3. **Components Updated**

   **PaymentMethodModal** (`components/modal/PaymentMethodModal.tsx`)

   - Stripe-integrated payment method selector
   - Supports card payments (Tabby/Tamara coming soon)
   - Error handling and loading states
   - Secure payment messaging

   **CheckoutPage** (`components/checkout/CheckoutPage.tsx`)

   - Updated checkout flow with authentication check
   - Improved shipping calculation (free over 500 AED)
   - VAT calculation (5%)
   - Integration with PaymentMethodModal

   **OrderSummary** (`components/cart/OrderSummary.tsx`)

   - Added loading state support
   - Better button feedback during processing

4. **New Components**

   - `StripeProvider.tsx` - Client-side Stripe initialization
   - `app/checkout/success/page.tsx` - Order success page with verification

5. **Dependencies Added**
   - `stripe` - Stripe server SDK
   - `@stripe/react-stripe-js` - React Stripe integration
   - `@stripe/stripe-js` - Stripe.js client library

## 🚀 Quick Start Guide

### Step 1: Get Stripe Credentials

1. Go to [https://stripe.com](https://stripe.com)
2. Create account or login
3. Go to **Developers** → **API Keys**
4. Copy:
   - **Publishable Key** (pk*test*...)
   - **Secret Key** (sk*test*...)
5. Go to **Developers** → **Webhooks**
6. Create webhook for `/api/checkout/webhook`
7. Copy **Signing Secret** (whsec\_...)

### Step 2: Setup Environment Variables

1. Copy `.env.example` to `.env.local`:

   ```bash
   cp .env.example .env.local
   ```

2. Update `.env.local` with your credentials:
   ```env
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_key
   STRIPE_SECRET_KEY=sk_test_your_key
   STRIPE_WEBHOOK_SECRET=whsec_your_secret
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   NEXT_PUBLIC_API_BASE_URL=https://your-api-domain.com/api
   ```

### Step 3: Install Dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
```

### Step 4: Run Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:3000`

### Step 5: Update Root Layout (if needed)

If you want to add Stripe initialization globally, update `app/layout.tsx`:

```tsx
import StripeProvider from "@/components/StripeProvider";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <body>
        <StripeProvider>
          {/* Other providers */}
          {children}
        </StripeProvider>
      </body>
    </html>
  );
}
```

## 🔄 Payment Flow

### User Journey

```
1. User adds items to cart
   ↓
2. Clicks "Proceed to Checkout" → /checkout
   ↓
3. Reviews order and clicks "Place Order"
   ↓
4. Payment method modal appears
   ↓
5. Selects card payment → Clicks "Proceed to Payment"
   ↓
6. Frontend calls: POST /api/checkout/create-session
   ↓
7. Backend creates order and Stripe session
   ↓
8. Frontend redirects to Stripe checkout page
   ↓
9. User enters card details on Stripe (PCI compliant)
   ↓
10. Stripe processes payment
    ↓
    ├─ SUCCESS → Backend webhook updates order
    │           → User redirected to /checkout/success
    │
    └─ FAILED  → Backend webhook cancels order
                → User sees error
```

### Test Cards

Use these for testing:

| Card Type    | Number                | CVV | Expiry     |
| ------------ | --------------------- | --- | ---------- |
| Visa Success | `4242 4242 4242 4242` | Any | Any future |
| Visa Decline | `4000 0000 0000 0002` | Any | Any future |
| Mastercard   | `5555 5555 5555 4444` | Any | Any future |
| Amex         | `3782 822463 10005`   | Any | Any future |

## 🏗️ Backend Requirements

Your backend API **MUST** implement these endpoints:

### 1. Create Checkout Session

```
POST /api/checkout/create-session
Authorization: Bearer {token}

Response:
{
  "url": "https://checkout.stripe.com/pay/...",
  "sessionId": "cs_test_...",
  "orderId": "order-123"
}
```

### 2. Verify Session

```
POST /api/checkout/verify-session
Authorization: Bearer {token}
Body: {
  "sessionId": "cs_test_...",
  "orderId": "order-123"
}

Response:
{
  "status": "completed",
  "amount": 14700,
  "orderId": "order-123"
}
```

### 3. Webhook Handler

```
POST /api/checkout/webhook
Headers: stripe-signature: ...

Handles:
- checkout.session.completed
- payment_intent.payment_failed
- charge.refunded
```

See `docs/STRIPE_BACKEND_SETUP.md` for detailed implementation examples.

## 🔐 Security Checklist

- [ ] Never expose `STRIPE_SECRET_KEY` to frontend
- [ ] Use `NEXT_PUBLIC_` prefix only for public keys
- [ ] Validate webhook signatures in backend
- [ ] Verify payment amounts server-side
- [ ] Use HTTPS in production
- [ ] Enable 3D Secure for card payments
- [ ] Implement rate limiting on payment endpoints
- [ ] Log all payment transactions for auditing
- [ ] Rotate webhook secrets periodically
- [ ] Use environment variables for all secrets

## 📊 File Structure

```
app/
├── checkout/
│   ├── page.tsx                  # Checkout page
│   └── success/
│       └── page.tsx              # Success verification page
├── layout.tsx                    # Add StripeProvider here

components/
├── checkout/
│   └── CheckoutPage.tsx          # Updated with Stripe
├── cart/
│   └── OrderSummary.tsx          # Updated with loading state
├── modal/
│   └── PaymentMethodModal.tsx    # Stripe-integrated payment modal
├── StripeProvider.tsx            # Stripe initialization

lib/
├── stripe.ts                     # Stripe utilities & types
├── api.ts                        # API client

docs/
├── STRIPE_INTEGRATION.md         # This file
└── STRIPE_BACKEND_SETUP.md       # Backend implementation guide
```

## 🧪 Testing Locally with Webhooks

Use Stripe CLI to test webhooks locally:

```bash
# Install Stripe CLI
# macOS: brew install stripe/stripe-cli/stripe
# Linux: curl https://raw.githubusercontent.com/stripe/stripe-cli/master/install.sh -s | bash
# Windows: Download from https://stripe.com/docs/stripe-cli

# Login to your Stripe account
stripe login

# Listen for webhook events
stripe listen --forward-to localhost:3000/api/checkout/webhook

# In another terminal, trigger events
stripe trigger payment_intent.succeeded
```

## 🐛 Troubleshooting

### "Stripe credentials not found"

- Check `.env.local` has `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- Restart dev server: `npm run dev`
- Check browser console for errors

### Payment redirects to error page

- Verify Stripe API keys are correct
- Check `NEXT_PUBLIC_APP_URL` is set
- Look at browser console for detailed errors
- Check Stripe Dashboard for any issues

### Webhooks not working

- Verify webhook URL is publicly accessible
- Check `STRIPE_WEBHOOK_SECRET` matches Stripe Dashboard
- Ensure backend endpoint exists and is correct
- Use Stripe Dashboard logs to debug

### Cart not clearing after payment

- Verify backend is calling cart clear function
- Check database connection is working
- Monitor network requests in browser DevTools

### Session expired

- Sessions are valid for 24 hours
- Implement session refresh logic in backend if needed
- Show error to user if session expires

## 📚 Additional Resources

- [Stripe Documentation](https://stripe.com/docs)
- [Stripe API Reference](https://stripe.com/docs/api)
- [Stripe Checkout Guide](https://stripe.com/docs/payments/checkout)
- [Stripe CLI Documentation](https://stripe.com/docs/stripe-cli)
- [Stripe Testing](https://stripe.com/docs/testing)

## 📞 Support

For issues:

1. Check [Stripe Status Page](https://status.stripe.com)
2. Review [Stripe Documentation](https://stripe.com/docs)
3. Check application logs for error details
4. Contact Stripe Support for account issues

## 🎉 Next Steps

1. ✅ Frontend is configured
2. **TODO:** Implement backend endpoints
3. **TODO:** Set up webhook handler
4. **TODO:** Test with test cards
5. **TODO:** Set up production keys
6. **TODO:** Deploy to production

---

**Last Updated:** January 1, 2026
**Version:** 1.0.0

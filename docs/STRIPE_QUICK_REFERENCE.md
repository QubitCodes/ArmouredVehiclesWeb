# Stripe Integration - Quick Reference

## 🔑 Environment Variables

Copy to `.env.local`:

```env
# Stripe Keys (get from https://dashboard.stripe.com/apikeys)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# App URLs
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_API_BASE_URL=https://your-api.com/api
```

## 💳 Test Cards

```
Success:  4242 4242 4242 4242
Decline:  4000 0000 0000 0002
Mastercard: 5555 5555 5555 4444
Amex:     3782 822463 10005

All test cards:
- CVV: Any 3-4 digits
- Expiry: Any future date
```

## 📡 Frontend Flow

1. **CheckoutPage** → User clicks "Place Order"
2. **PaymentMethodModal** → Select payment method
3. **POST /api/checkout/create-session** → Creates order & Stripe session
4. **Redirect to Stripe** → User enters payment details
5. **Webhook** → Backend verifies payment
6. **Success Page** → `/checkout/success?session_id=...`

## 🔌 Backend Endpoints Required

```javascript
// 1. Create checkout session
POST /api/checkout/create-session
Headers: Authorization: Bearer {token}
Response: { url, sessionId, orderId }

// 2. Verify payment session
POST /api/checkout/verify-session
Headers: Authorization: Bearer {token}
Body: { sessionId, orderId }
Response: { status, amount, orderId }

// 3. Webhook handler
POST /api/checkout/webhook
Headers: stripe-signature: ...
Events:
  - checkout.session.completed
  - payment_intent.payment_failed
  - charge.refunded
```

## 📦 Files Modified/Created

| File                                      | Status     | Description                    |
| ----------------------------------------- | ---------- | ------------------------------ |
| `.env.example`                            | ✅ Created | Environment variables template |
| `lib/stripe.ts`                           | ✅ Created | Stripe utilities               |
| `components/StripeProvider.tsx`           | ✅ Created | Stripe initialization          |
| `components/modal/PaymentMethodModal.tsx` | ✅ Updated | Stripe-integrated modal        |
| `components/checkout/CheckoutPage.tsx`    | ✅ Updated | Updated checkout flow          |
| `components/cart/OrderSummary.tsx`        | ✅ Updated | Added loading state            |
| `app/checkout/success/page.tsx`           | ✅ Created | Success verification page      |
| `package.json`                            | ✅ Updated | Added Stripe dependencies      |
| `docs/STRIPE_INTEGRATION.md`              | ✅ Created | Complete setup guide           |
| `docs/STRIPE_BACKEND_SETUP.md`            | ✅ Created | Backend implementation guide   |

## 🚀 Quick Setup (5 minutes)

1. **Get Stripe Keys**

   ```
   Go to: https://dashboard.stripe.com/apikeys
   ```

2. **Update .env.local**

   ```bash
   cp .env.example .env.local
   # Edit with your Stripe keys
   ```

3. **Install Dependencies**

   ```bash
   npm install
   ```

4. **Run Dev Server**

   ```bash
   npm run dev
   # Visit http://localhost:3000
   ```

5. **Test Checkout**
   - Add items to cart
   - Go to checkout
   - Click "Place Order"
   - Use test card: `4242 4242 4242 4242`

## ⚠️ Important Notes

- **Never** expose `STRIPE_SECRET_KEY` to frontend
- **Always** prefix public keys with `NEXT_PUBLIC_`
- **Test** with test keys before going live
- **Backend** must implement the 3 required endpoints
- **Webhooks** must be configured for production

## 🧪 Test Webhook Locally

```bash
# Install Stripe CLI
brew install stripe/stripe-cli/stripe

# Login
stripe login

# Listen for events
stripe listen --forward-to localhost:3000/api/checkout/webhook

# Trigger test event (in another terminal)
stripe trigger payment_intent.succeeded
```

## 📞 Troubleshooting

| Issue                    | Solution                                                    |
| ------------------------ | ----------------------------------------------------------- |
| "Stripe not initialized" | Check `.env.local` has `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` |
| Payment fails            | Use test cards above, check Stripe Dashboard logs           |
| Webhooks not triggered   | Verify endpoint URL and webhook secret match                |
| Cart not clearing        | Ensure backend clears cart in `create-session` endpoint     |

## 📚 Documentation

- Full Setup: `docs/STRIPE_INTEGRATION.md`
- Backend Guide: `docs/STRIPE_BACKEND_SETUP.md`
- Stripe Docs: https://stripe.com/docs
- Test Cards: https://stripe.com/docs/testing

## ✅ Checklist for Production

- [ ] Get live Stripe keys (pk*live*, sk*live*)
- [ ] Update .env with live keys
- [ ] Configure production webhook URL
- [ ] Test with real card (small amount)
- [ ] Enable 3D Secure
- [ ] Set up error monitoring
- [ ] Configure email notifications
- [ ] Deploy to production
- [ ] Monitor Stripe Dashboard
- [ ] Test complete payment flow

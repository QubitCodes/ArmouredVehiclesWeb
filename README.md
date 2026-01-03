This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## 🚀 Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

## 💳 Stripe Payment Integration

This project includes full Stripe payment gateway integration.

### Quick Setup (5 minutes):

1. **Get Stripe Keys**: https://dashboard.stripe.com/apikeys
2. **Update `.env.local`**:
   ```env
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
   STRIPE_SECRET_KEY=sk_test_...
   STRIPE_WEBHOOK_SECRET=whsec_...
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```
3. **Install Dependencies**: `npm install`
4. **Run Server**: `npm run dev`
5. **Test Checkout** with card: `4242 4242 4242 4242`

### Documentation:

- 📖 [Complete Integration Guide](docs/STRIPE_INTEGRATION.md)
- 🛠️ [Backend Setup Guide](docs/STRIPE_BACKEND_SETUP.md)
- ⚡ [Quick Reference](docs/STRIPE_QUICK_REFERENCE.md)
- 📋 [Setup Summary](STRIPE_SETUP_SUMMARY.md)

---

## 📝 Backend API Configuration

To connect the app to your backend API, set the API base URL via environment variable:

Create a `.env.local` file in the project root with:

```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_key
STRIPE_SECRET_KEY=sk_test_your_key
STRIPE_WEBHOOK_SECRET=whsec_your_secret
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

Replace `5000` with your backend `PORT`. The app reads this value and attaches `Authorization: Bearer <access_token>` headers from `localStorage` when calling protected routes.

Login flows store `access_token` under `localStorage` key `access_token`. Ensure your backend accepts this token.

### Required Backend Endpoints for Payments:

- `POST /api/checkout/create-session` - Create Stripe checkout
- `POST /api/checkout/verify-session` - Verify payment
- `POST /api/checkout/webhook` - Handle Stripe webhooks

See [Backend Setup Guide](docs/STRIPE_BACKEND_SETUP.md) for implementation details.

---

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.
- [Stripe Documentation](https://stripe.com/docs) - payment integration guide.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

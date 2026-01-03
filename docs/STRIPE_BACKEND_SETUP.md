# Stripe Integration - Backend API Routes Setup

This document provides instructions for setting up the required backend API routes for Stripe payment processing.

## Required Backend Endpoints

Your backend API should implement the following endpoints:

### 1. Create Checkout Session

**Endpoint:** `POST /api/checkout/create-session`

**Authentication:** Required (Bearer token)

**Request:**

```json
{
  // No body required - uses user's cart and authentication
}
```

**Response:**

```json
{
  "url": "https://checkout.stripe.com/pay/...",
  "sessionId": "cs_test_...",
  "orderId": "order-12345"
}
```

**Implementation Notes:**

- Authenticate the user from the Bearer token
- Fetch the user's cart items
- Create an order in your database with status "pending"
- Create a Stripe checkout session with the order items
- Clear the user's cart after order creation
- Return the Stripe checkout URL and order details

### 2. Verify Checkout Session

**Endpoint:** `POST /api/checkout/verify-session`

**Authentication:** Required (Bearer token)

**Request:**

```json
{
  "sessionId": "cs_test_...",
  "orderId": "order-12345"
}
```

**Response:**

```json
{
  "status": "completed",
  "amount": 14700,
  "currency": "aed",
  "orderId": "order-12345"
}
```

**Implementation Notes:**

- Verify the session with Stripe using the sessionId
- Confirm payment was completed
- Update the order status to "processing"
- Return payment confirmation details

### 3. Webhook Handler

**Endpoint:** `POST /api/checkout/webhook`

**Authentication:** None (uses webhook signature verification)

**Headers Required:**

```
stripe-signature: t=timestamp,v1=signature
```

**Purpose:** Receives real-time payment events from Stripe

**Events to Handle:**

- `checkout.session.completed` - Payment successful, update order status
- `payment_intent.payment_failed` - Payment failed, update order status
- `charge.refunded` - Refund processed, update order status

**Implementation Notes:**

- Validate webhook signature using `STRIPE_WEBHOOK_SECRET`
- Update order status based on event type
- Send confirmation emails to customer
- Log all webhook events for debugging

## Frontend Integration

The frontend is already configured to:

1. **Initiate Checkout:** Call `/api/checkout/create-session`
2. **Redirect to Stripe:** User completes payment on Stripe's hosted page
3. **Success Page:** User redirected to `/checkout/success?session_id=...&order_id=...`
4. **Verify Payment:** Call `/api/checkout/verify-session` to confirm payment

## Environment Variables Required

Backend should have these environment variables:

```env
# Stripe API Keys
STRIPE_SECRET_KEY=sk_test_your_secret_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# Application URLs
APP_URL=http://localhost:3000
API_BASE_URL=https://your-api-domain.com

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/db
```

## Payment Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                     Checkout Page                            │
│          User reviews cart and clicks "Place Order"          │
└──────────────────┬──────────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────────┐
│              POST /api/checkout/create-session               │
│   - Create order in DB (status: pending)                     │
│   - Create Stripe checkout session                           │
│   - Clear user cart                                          │
│   - Return Stripe checkout URL                               │
└──────────────────┬──────────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────────┐
│                 Stripe Checkout Page                         │
│         User enters payment details securely                 │
└──────────────────┬──────────────────────────────────────────┘
                   │
         ┌─────────┴─────────┐
         │                   │
    ✅ Success         ❌ Failed
         │                   │
         ▼                   ▼
    Webhook Event      Webhook Event
    (payment_intent   (payment_intent
     completed)        failed)
         │                   │
         ▼                   ▼
   Update Order         Update Order
   Status:              Status:
   Processing           Cancelled
         │                   │
         └─────────┬─────────┘
                   │
                   ▼
    POST /api/checkout/verify-session
    (from success page)
         │
         ▼
    Return to App
    (/checkout/success)
```

## Testing the Integration

### 1. Local Testing

Use ngrok to expose your local API:

```bash
ngrok http 5000
# Get URL like: https://abc123.ngrok.io
```

Add to Stripe Dashboard:

- Webhook URL: `https://abc123.ngrok.io/api/checkout/webhook`

### 2. Test Payment

Use test card: `4242 4242 4242 4242`

- Expiry: Any future date
- CVV: Any 3 digits

### 3. Test Webhook Locally

Use Stripe CLI:

```bash
stripe listen --forward-to localhost:5000/api/checkout/webhook
stripe trigger payment_intent.succeeded
```

## Common Implementation Patterns

### Node.js/Express Example

```javascript
// Create checkout session
app.post(
  "/api/checkout/create-session",
  authenticateToken,
  async (req, res) => {
    try {
      const user = req.user;
      const cartItems = await getCartItems(user.id);

      // Create order
      const order = await createOrder(user.id, cartItems, "pending");

      // Create Stripe session
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        customer_email: user.email,
        line_items: cartItems.map((item) => ({
          price_data: {
            currency: "aed",
            product_data: {
              name: item.productName,
              images: [item.imageUrl],
            },
            unit_amount: Math.round(item.price * 100),
          },
          quantity: item.quantity,
        })),
        mode: "payment",
        success_url: `${process.env.APP_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}&order_id=${order.id}`,
        cancel_url: `${process.env.APP_URL}/cart`,
        metadata: {
          orderId: order.id,
          userId: user.id,
        },
      });

      // Clear cart
      await clearCart(user.id);

      res.json({
        url: session.url,
        sessionId: session.id,
        orderId: order.id,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

// Webhook handler
app.post(
  "/api/checkout/webhook",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    const sig = req.headers["stripe-signature"];

    try {
      const event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );

      switch (event.type) {
        case "checkout.session.completed":
          const session = event.data.object;
          const order = await getOrder(session.metadata.orderId);
          await updateOrderStatus(order.id, "processing");
          await sendConfirmationEmail(session.customer_email, order);
          break;

        case "payment_intent.payment_failed":
          const failedSession = event.data.object;
          const failedOrder = await getOrder(failedSession.metadata.orderId);
          await updateOrderStatus(failedOrder.id, "cancelled");
          break;
      }

      res.json({ received: true });
    } catch (error) {
      res.status(400).send(`Webhook Error: ${error.message}`);
    }
  }
);
```

## Troubleshooting

### Payment redirects to error page

- Check Stripe API keys are correct
- Verify APP_URL is set correctly
- Check browser console for detailed errors

### Webhooks not triggering

- Verify webhook URL is accessible
- Check STRIPE_WEBHOOK_SECRET is correct
- Use Stripe CLI to test: `stripe trigger checkout.session.completed`

### Orders created but payment not processed

- Verify webhook endpoint is configured in Stripe Dashboard
- Check webhook logs in Stripe Dashboard for errors
- Ensure webhook secret matches in code

## Security Notes

1. **Never expose** `STRIPE_SECRET_KEY` to frontend
2. **Always verify** webhook signatures
3. **Validate** all payment amounts server-side
4. **Use HTTPS** in production
5. **Store sensitive data** securely in database
6. **Log payment events** for auditing

## Additional Resources

- [Stripe Documentation](https://stripe.com/docs)
- [Stripe API Reference](https://stripe.com/docs/api)
- [Stripe CLI Documentation](https://stripe.com/docs/stripe-cli)
- [Checkout Integration](https://stripe.com/docs/payments/checkout)

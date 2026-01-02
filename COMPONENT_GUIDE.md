# 🎯 Stripe Integration - Visual Component Guide

## Component Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      App Root                                │
│              (add StripeProvider here)                       │
└──────────────────┬──────────────────────────────────────────┘
                   │
        ┌──────────┴──────────┐
        ↓                     ↓
   ┌────────────┐      ┌─────────────┐
   │   Cart     │      │  Checkout   │
   │   Page     │      │   Page      │
   └──────┬─────┘      └──────┬──────┘
          │                   │
          │            ┌──────┴──────┐
          │            ↓             ↓
          │      ┌──────────────┐  ┌──────────────┐
          │      │   Shipping   │  │   Payment    │
          │      │   Address    │  │   Section    │
          │      └──────────────┘  └──────┬───────┘
          │                               │
          └───────────┬───────────────────┘
                      ↓
              ┌──────────────────┐
              │ OrderSummary     │
              │ (with isLoading) │
              └────────┬─────────┘
                       │
               Click "Place Order"
                       ↓
              ┌──────────────────────────┐
              │ PaymentMethodModal       │
              │ (Stripe integrated)      │
              └────────┬────────────────┘
                       │
            Select Card → Click Proceed
                       ↓
       ┌─────────────────────────────────┐
       │ POST /api/checkout/create-session│
       │ (Backend creates order & session)│
       └────────────┬────────────────────┘
                    ↓
       Redirect to Stripe Checkout Page
                    ↓
       User enters card details (Stripe)
                    ↓
       Stripe processes payment
                    ↓
        ┌───────────┴──────────┐
        ↓                      ↓
     SUCCESS                 FAILED
        ↓                      ↓
    Webhook              Webhook
        │                      │
        ├─ Update order        ├─ Cancel order
        ├─ Send email          ├─ Send error email
        └─ Log event           └─ Log event
        │                      │
        ↓                      ↓
   /checkout/success    Error message
   (verify payment)     (show in modal)
        ↓
   Show confirmation
```

---

## Component Interactions

### 1. CheckoutPage Component

```
CheckoutPage
├─ State:
│  ├─ selectedReceiver: "self" | "other"
│  ├─ deliveryInstructions: boolean
│  ├─ selectedPayment: string
│  ├─ showPaymentModal: boolean
│  ├─ isProcessing: boolean
│  └─ Calculations (subtotal, shipping, vat, total)
│
├─ Event Handlers:
│  ├─ handleCheckout() → Opens PaymentMethodModal
│  ├─ setSelectedReceiver() → Updates receiver
│  └─ setDeliveryInstructions() → Updates instructions
│
├─ Child Components:
│  ├─ ShippingAddress section
│  ├─ Your Order section
│  ├─ Payment section (info display)
│  ├─ OrderSummary
│  │  └─ Shows total with loading state
│  │
│  └─ PaymentMethodModal (when showPaymentModal = true)
│
└─ Features:
   ├─ Free shipping over 500 AED
   ├─ 5% VAT calculation
   ├─ Authentication check
   └─ Loading state feedback
```

### 2. PaymentMethodModal Component

```
PaymentMethodModal
├─ Props:
│  ├─ onClose: () => void
│  ├─ subtotal?: number
│  └─ onPaymentSuccess?: () => void
│
├─ State:
│  ├─ isProcessing: boolean
│  ├─ selectedPaymentMethod: "card" | "tabby" | "tamara"
│  └─ error?: string
│
├─ Event Handlers:
│  ├─ handleSubmit()
│  │  └─ POST /api/checkout/create-session
│  │     └─ Redirect to Stripe checkout
│  │
│  ├─ setSelectedPaymentMethod()
│  └─ setError()
│
├─ Features:
│  ├─ Payment method selection
│  ├─ Stripe integration (card payment)
│  ├─ Error handling
│  ├─ Loading spinner
│  ├─ Security messaging
│  ├─ Amount display
│  └─ Cancel button
│
└─ Payment Methods:
   ├─ ✅ Card (Stripe)
   ├─ ⏳ Tabby (Coming Soon)
   └─ ⏳ Tamara (Coming Soon)
```

### 3. OrderSummary Component

```
OrderSummary
├─ Props:
│  ├─ subtotal: number
│  ├─ onCheckout?: () => void
│  ├─ buttonText?: string
│  └─ isLoading?: boolean
│
├─ Display Sections:
│  ├─ Title: "ORDER SUMMARY"
│  ├─ Subtotal with currency
│  ├─ Promo code input
│  ├─ Total amount (with VAT note)
│  └─ Checkout button
│
├─ Button State:
│  ├─ Normal: "PLACE ORDER"
│  ├─ Loading: Spinner + "PLACE ORDER"
│  └─ Disabled when isLoading = true
│
└─ Styling:
   └─ Responsive (mobile & desktop)
```

### 4. StripeProvider Component

```
StripeProvider
├─ Purpose:
│  └─ Initialize Stripe on client side
│
├─ Effects:
│  └─ useEffect (on mount)
│     ├─ Check NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
│     ├─ Log success message
│     └─ Warn if not configured
│
├─ Wrap in:
│  └─ app/layout.tsx (at root level)
│
└─ Output:
   └─ Console: "✅ Stripe client initialized successfully"
```

### 5. Success Page (`/checkout/success`)

```
Success Page
├─ Query Params:
│  ├─ session_id: string (from Stripe)
│  └─ order_id: string (from backend)
│
├─ Effects:
│  └─ useEffect (on mount)
│     └─ POST /api/checkout/verify-session
│
├─ States:
│  ├─ loading: boolean
│  ├─ orderData?: OrderData
│  └─ error?: string
│
├─ Display:
│  ├─ If loading: Spinner
│  ├─ If success:
│  │  ├─ ✓ Success icon
│  │  ├─ Order ID
│  │  ├─ Amount paid
│  │  ├─ Status
│  │  ├─ "Track Order" button
│  │  └─ "Back to Home" button
│  │
│  └─ If failed: Error message
│
└─ Actions:
   ├─ Track order → /orders
   └─ Home → /
```

---

## Data Flow Diagram

```
USER DATA FLOW:

Cart Data
  ↓
[Add to Cart]
  ↓
Cart Page (Review items)
  ↓
[Proceed to Checkout]
  ↓
Checkout Page (Review address & shipping)
  ↓
Order Summary Component (Show total)
  ↓
[Place Order] button
  ↓
CheckoutPage state: showPaymentModal = true
  ↓
PaymentMethodModal (Select payment method)
  ↓
[Proceed to Payment]
  ↓
Frontend Action:
┌─────────────────────────────────────┐
│ POST /api/checkout/create-session   │
│ Headers: Authorization: Bearer token │
│ Body: (empty - uses auth token)      │
└──────────┬──────────────────────────┘
           ↓
Backend Processing:
┌──────────────────────────────────────────┐
│ 1. Get user from token                   │
│ 2. Fetch user's cart items               │
│ 3. Create order in DB (status: pending)  │
│ 4. Create Stripe checkout session        │
│ 5. Clear user's cart                     │
│ 6. Return { url, sessionId, orderId }    │
└──────────┬───────────────────────────────┘
           ↓
Response:
┌──────────────────────────┐
│ {                        │
│   url: "stripe.com/...", │
│   sessionId: "cs_...",    │
│   orderId: "order-..."    │
│ }                        │
└──────────┬───────────────┘
           ↓
Frontend:
window.location.href = data.url
           ↓
Redirect to Stripe Checkout
           ↓
Stripe Processing:
┌────────────────────────────────┐
│ User enters card details       │
│ Stripe validates & processes   │
└────────────┬───────────────────┘
             ↓
        ✓ Success OR ✗ Failed
             ↓
        Webhook Event
             ↓
Backend Webhook Handler:
┌──────────────────────────────────┐
│ - Verify signature               │
│ - Update order status            │
│ - Send confirmation email        │
│ - Log payment event              │
└──────────┬───────────────────────┘
           ↓
Payment Status Updated
           ↓
Frontend Redirect:
/checkout/success?session_id=...&order_id=...
           ↓
Success Page:
POST /api/checkout/verify-session
           ↓
Backend Verification:
┌──────────────────────────────┐
│ - Fetch order from DB        │
│ - Verify Stripe session      │
│ - Return payment details     │
└──────────┬──────────────────┘
           ↓
Display Order Confirmation
           ↓
User can:
├─ Track Order
└─ Go to Home
```

---

## Component Dependencies

```
StripeProvider (Root)
  ├─ All components below can use Stripe

CheckoutPage
  ├─ ShippingAddress Component
  ├─ YourOrder Component (maps mockShipments)
  │  └─ Each shipment displays products
  ├─ Payment Section (info only)
  ├─ OrderSummary
  │  └─ Props: subtotal, onCheckout, buttonText, isLoading
  └─ PaymentMethodModal
     ├─ Props: onClose, subtotal, onPaymentSuccess
     └─ Uses: useMutation (react-query)

Success Page
  ├─ Uses: useSearchParams, useRouter
  └─ Calls: POST /api/checkout/verify-session
```

---

## Error Handling Flow

```
Try Action
  ↓
  ├─ Success → Show result
  │
  └─ Error →
     ├─ Catch error
     ├─ Set error state
     ├─ Display error message
     ├─ Log to console
     └─ Allow user to retry
```

---

## Styling Reference

### Color Scheme

```
Primary Orange: #D35400
Light Orange:   #B84A00
Beige:          #EBE3D6
Light Beige:    #F0EBE3
Dark Green:     #39482C
Gray:           #6E6E6E
Black:          #1A1A1A
```

### Responsive Breakpoints

```
Mobile:  < 640px  (default)
Tablet:  640px+   (sm:)
Desktop: 1024px+  (lg:)
Large:   1280px+  (xl:)
```

---

**Last Updated:** January 1, 2026
**Version:** 1.0.0

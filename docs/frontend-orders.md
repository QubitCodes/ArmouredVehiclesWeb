# Frontend Integration Guide — Orders API

This document explains how to implement the customer-facing Orders API in the frontend. It covers available endpoints, TypeScript types, a small HTTP wrapper, React Query examples, error handling, and testing instructions.

**Location**: server routes are implemented in `server/routes.ts` and storage functions in `server/storage.ts`.

---

## Overview

The Orders API exposes endpoints under `/api/orders` (and vendor/admin variants under `/api/vendor/orders` and `/api/admin/orders`). For the customer frontend you will primarily use:

- `GET /api/orders` — List orders for the authenticated user.
- `GET /api/orders/:id` — Get details for a single order (string `id`).
- `POST /api/orders` — Create a new order (checkout success flow). Body contains `items` array.

All customer endpoints require authentication (bearer token). Requests without auth will return 401.

---

## Endpoint details

- GET /api/orders
  - Auth: Bearer token required
  - Returns: `Order[]` with their `items` (order items)

- GET /api/orders/:id
  - Auth: Bearer token required
  - Returns: `Order` with `items`
  - Access: only owner can view the order, returns 403 otherwise

- POST /api/orders
  - Auth: Bearer token required
  - Body: `{ items: Array<{ productId:number, name:string, image?:string, price:string, quantity:number }> }`
  - Server calculates `total`, validates items with `insertOrderItemSchema`, creates order and clears the cart
  - Returns: created `Order` (201)

---

## TypeScript types (suggested)

Copy these to your frontend `types` module or augment your existing types.

```ts
export interface OrderItem {
  id?: number;
  orderId?: string;
  productId: number;
  name?: string;
  image?: string | null;
  price: string; // stored as string in backend
  quantity: number;
  vendorId?: string | null;
}

export interface Order {
  id: string;
  userId: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'returned';
  total: string; // stringified decimal
  trackingNumber?: string | null;
  estimatedDelivery?: string | null;
  createdAt: string;
  items: OrderItem[];
}
```

---

## Minimal HTTP helper

You can adapt this for `fetch`, `axios`, or your existing API client. The examples below use `fetch` and expect a bearer token.

```ts
const API_BASE = '/api';

async function authFetch(input: RequestInfo, init: RequestInit = {}) {
  const token = localStorage.getItem('token'); // or use your auth store
  const headers = new Headers(init.headers || {});
  headers.set('Content-Type', 'application/json');
  if (token) headers.set('Authorization', `Bearer ${token}`);

  const res = await fetch(input, { ...init, headers });
  if (!res.ok) {
    const errBody = await res.json().catch(() => ({}));
    const err: any = new Error(errBody.error || res.statusText || 'Request failed');
    err.status = res.status;
    err.body = errBody;
    throw err;
  }
  if (res.status === 204) return undefined;
  return res.json();
}

export const ordersApi = {
  list: () => authFetch(`${API_BASE}/orders`),
  get: (id: string) => authFetch(`${API_BASE}/orders/${encodeURIComponent(id)}`),
  create: (items: any[]) => authFetch(`${API_BASE}/orders`, { method: 'POST', body: JSON.stringify({ items }) }),
};
```

---

## React Query examples (recommended)

If your project uses React Query (TanStack Query), here's how to wire the endpoints into hooks used by the UI.

```tsx
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ordersApi } from '@/lib/api'; // path where you put helper above

// List orders
export function useOrders() {
  return useQuery(['orders'], () => ordersApi.list());
}

// Get single order
export function useOrder(id?: string) {
  return useQuery(['orders', id], () => ordersApi.get(id!), { enabled: !!id });
}

// Create order (checkout)
export function useCreateOrder() {
  const qc = useQueryClient();
  return useMutation((items: any[]) => ordersApi.create(items), {
    onSuccess: () => {
      qc.invalidateQueries(['cart']);
      qc.invalidateQueries(['orders']);
    }
  });
}
```

Usage notes:
- When creating an order, the server will clear the cart for the user. Invalidate the `cart` query to update UI.
- On successful order creation, you may redirect the user to an order confirmation page and show the returned `order.id`.

---

## Example usage in a component

Create order after a successful payment or from a checkout review page:

```tsx
function CheckoutButton({ items }: { items: any[] }) {
  const create = useCreateOrder();

  const handlePlaceOrder = async () => {
    try {
      await create.mutateAsync(items);
      // navigate to /checkout/success or /orders
    } catch (err: any) {
      // show error toast using your UI system
      console.error('Order failed:', err);
    }
  };

  return <button onClick={handlePlaceOrder} disabled={create.isLoading}>Place Order</button>;
}
```

To show a list of the user's orders on a page:

```tsx
function OrdersPage() {
  const { data: orders, isLoading, error } = useOrders();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading orders</div>;

  return (
    <div>
      {orders?.map((o: any) => (
        <div key={o.id}>{o.id} — {o.status} — {o.items.length} items</div>
      ))}
    </div>
  );
}
```

---

## Error handling and common status codes

- 401: Authentication required — ensure user is logged in and token is sent.
- 403: Access denied — trying to fetch an order that is not owned by the user.
- 400: Bad request — invalid payload or validation error (Zod errors are returned by the server as `error.errors`).
- 500: Server error — surface a friendly message and log details if available.

When catching errors thrown by `authFetch`, check `err.status` and `err.body` to show useful messages.

---

## Testing (curl)

Replace `$TOKEN` and `PORT` accordingly.

- List orders:

```bash
curl -H "Authorization: Bearer $TOKEN" http://localhost:PORT/api/orders
```

- Get order:

```bash
curl -H "Authorization: Bearer $TOKEN" http://localhost:PORT/api/orders/<ORDER_ID>
```

- Create order:

```bash
curl -X POST -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d '{"items":[{"productId":123,"name":"Part A","image":"/img.jpg","price":"19.99","quantity":2}]}' \
  http://localhost:PORT/api/orders
```

If you use the server's checkout session endpoints (Stripe) the flow may differ — orders can be created after successful payment in the `/api/checkout` flow. This docs file focuses on direct `/api/orders` usage for the frontend.

---

## Where to put the code

- `types`: add the TypeScript interfaces where your app keeps global types (e.g. `client/src/types/orders.ts`).
- `api wrapper`: add the `ordersApi` helper to `client/src/lib/api.ts` or your existing API client module.
- `hooks`: add React Query hooks to `client/src/hooks/useOrders.ts` or a similar folder.
- `pages/components`: use `client/src/pages/checkout.tsx`, `client/src/pages/cart.tsx`, or `client/src/pages/orders.tsx` to wire UI.

---

If you'd like, I can:
- add the suggested helper functions directly to `client/src/lib/api.ts`,
- create React Query hooks under `client/src/hooks/`, or
- add `client/src/types/orders.ts` and example components.

File created: `docs/frontend-orders.md`

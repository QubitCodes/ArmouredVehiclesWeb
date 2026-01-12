"use client";

import api, { getAccessToken } from "@/lib/api";
import { useCartStore, CartItemLocal } from "@/lib/cart-store";

// Helper: find server cart item id by productId (for update/delete)
async function findServerCartItemId(productId: number) {
  const items = await api.cart.get();
  const match = (items || []).find((ci: any) => Number(ci.productId ?? ci.product?.id) === Number(productId));
  return match?.id as number | undefined;
}

export async function syncAddToServer(productId: number, quantity: number) {
  // if (!token) return; // Allow guests to sync via session ID
  try {
    await api.cart.add(productId, quantity);
  } catch (e) {
    // Swallow errors in optimistic flow
    // console.warn("Cart add sync failed", e);
  }
}

export async function syncUpdateQtyToServer(productId: number, quantity: number) {
  // if (!token) return;
  try {
    const cartItemId = await findServerCartItemId(productId);
    if (cartItemId) {
      await api.cart.update(cartItemId, quantity);
    } else {
      // If not present, treat as add
      if (quantity > 0) await api.cart.add(productId, quantity);
    }
  } catch (e) {
    // console.warn("Cart update sync failed", e);
  }
}

export async function syncRemoveFromServer(productId: number) {
  // if (!token) return;
  try {
    const cartItemId = await findServerCartItemId(productId);
    if (cartItemId) await api.cart.remove(cartItemId);
  } catch (e) {
    // console.warn("Cart remove sync failed", e);
  }
}

export async function hydrateCartFromServer() {
  // if (!token) return;
  try {
    const serverItems = await api.cart.get();
    const mapped: CartItemLocal[] = (serverItems || []).map((ci: any) => ({
      id: String(ci.productId ?? ci.product?.id ?? ci.id),
      name: ci.product?.name ?? `Product #${ci.productId}`,
      price: Number(ci.product?.price ?? 0),
      qty: Number(ci.quantity ?? 1),
      image:
        ci.product?.image ??
        ci.product?.images?.[0] ??
  "/product/rim.png",
      sku: ci.product?.sku,
      stock: ci.product?.stock,
    }));
    const setItems = useCartStore.getState().setItems;
    setItems(mapped);
  } catch (e) {
    // console.warn("Hydrate from server failed", e);
  }
}

export async function pushLocalCartToServer() {
  // if (!token) return;
  try {
    const items = useCartStore.getState().items;
    for (const i of items) {
      const pid = Number(i.id);
      if (!Number.isFinite(pid)) continue;
      await api.cart.add(pid, i.qty);
    }
  } catch (e) {
    // console.warn("Push local cart failed", e);
  }
}

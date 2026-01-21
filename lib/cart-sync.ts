"use client";

import api, { getAccessToken } from "@/lib/api";
import { useCartStore, CartItemLocal } from "@/lib/cart-store";

// Helper: find server cart item id by productId (for update/delete)
async function findServerCartItemId(productId: number) {
  try {
    const response: any = await api.cart.get();
    const items = Array.isArray(response) ? response : (response.data?.items || response.items || []);

    // Check common key variations
    // The server cart item usually has an 'id' (cart item id) and 'productId' (product id).
    // Sometimes it might be nested in 'product'. 
    const match = items.find((ci: any) => {
        const pId = ci.productId ?? ci.product_id ?? ci.product?.id;
        // console.log(`Debug: Checking item ${ci.id}, pId found: ${pId}`);
        return String(pId) === String(productId);
    });
    
    if (!match) {
        console.warn(`Cart sync warning: Could not find server cart item for product ID ${productId}`);
    } else {
        // console.log(`Debug: Found match, cart item ID: ${match.id}`);
    }
    
    return match?.id as number | undefined;
  } catch (e) {
    console.error("Error finding server cart item id", e);
    return undefined;
  }
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
    console.log(`[SyncRemove] ProductId: ${productId} -> CartItemId: ${cartItemId}`);
    if (cartItemId) {
        const res = await api.cart.remove(cartItemId);
        console.log(`[SyncRemove] Remove result:`, res);
    } else {
        console.warn(`[SyncRemove] Could not find cart item to remove for product ${productId}`);
    }
  } catch (e) {
    console.error("Cart remove sync failed", e);
  }
}

export async function hydrateCartFromServer() {
  // if (!token) return;
  try {
    const response: any = await api.cart.get();
    // Helper to find the items array regardless of wrapper
    const serverItems = Array.isArray(response) ? response : (response.data?.items || response.items || []);

    const mapped: CartItemLocal[] = serverItems.map((ci: any) => ({
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
      is_controlled: ci.product?.is_controlled,
      vendorId: ci.product?.vendor_id || ci.product?.vendorId,
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

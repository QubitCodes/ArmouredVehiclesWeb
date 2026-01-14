import API from "./api";

export interface WishlistItemProduct {
  id: number;
  name: string;
  price?: number | string;
  base_price?: number;
  image?: string;
  gallery?: string[];
  rating?: number;
  reviewCount?: number | string;
  is_controlled?: boolean;
}

export interface WishlistItem {
  id: number;
  productId: number;
  product?: WishlistItemProduct;
}

export type WishlistResponse = {
  id?: number;
  items: WishlistItem[];
} | WishlistItem[];

export async function getWishlist(): Promise<WishlistResponse> {
  const res = await API.get("wishlist");
  return res.data;
}

export async function addWishlistItem(productId: number): Promise<WishlistItem> {
  const res = await API.post("wishlist/items", { productId });
  return res.data;
}

export async function removeWishlistItem(itemId: number): Promise<{ success?: boolean } | void> {
  const res = await API.delete(`wishlist/items/${itemId}`);
  return res.data;
}

"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/lib/auth-context";
import { api } from "@/lib/api";
import { type WishlistResponse } from "@/app/services/wishlist";

export function useWishlist() {
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();

  // Fetch Wishlist
  const { data, isLoading, isError } = useQuery<WishlistResponse>({
    queryKey: ["wishlist"],
    queryFn: () => api.wishlist.get(),
    enabled: isAuthenticated,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Extract items safely
  // API returns { status: true, data: { wishlist, items: [] } }
  // OR sometimes raw array if simplified. Handling both cases.
  const wishlistItems = Array.isArray(data)
    ? data
    : (data as any)?.data?.items ?? (data as any)?.items ?? [];

  // Mutations
  const { mutateAsync: addItem } = useMutation({
    mutationFn: async (productId: string) => {
      return api.wishlist.add(productId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
    },
  });

  const { mutateAsync: removeItem } = useMutation({
    mutationFn: async (itemId: string) => {
      return api.wishlist.remove(itemId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
    },
  });

  // Helpers
  const isInWishlist = (productId: number | string | undefined) => {
    if (!productId) return false;
    const pid = Number(productId);
    return wishlistItems.some((item: any) => item.product_id === pid || item.productId === pid);
  };

  const toggleWishlist = async (productId: string) => {
    if (!isAuthenticated) return false;
    if (!productId) return;

    const pid = productId;
    const existingItem = wishlistItems.find((item: any) => item.product_id === pid || item.productId === pid);

    if (existingItem) {
      await removeItem(existingItem.id);
      return false; // Removed
    } else {
      await addItem(pid);
      return true; // Added
    }
  };

  return {
    wishlistItems,
    isInWishlist,
    toggleWishlist,
    addItem,
    removeItem,
    isLoading,
    isError,
  };
}

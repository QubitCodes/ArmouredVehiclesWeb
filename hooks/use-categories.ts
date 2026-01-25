
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export const CATEGORIES_QUERY_KEY = ["categories", "all"];

export function useCategories() {
  return useQuery({
    queryKey: CATEGORIES_QUERY_KEY,
    queryFn: async () => {
      const res = await api.categories.getAll();
      return Array.isArray(res) ? res : [];
    },
    staleTime: 1000 * 60 * 10, // 10 minutes cache
    refetchOnWindowFocus: false,
  });
}

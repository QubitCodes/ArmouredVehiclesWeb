"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import type { Order } from "@/lib/types";

export function useOrders() {
  return useQuery<Order[]>({
    queryKey: ["orders"],
    queryFn: () => api.orders.getAll(),
  });
}

export function useOrder(id?: string) {
  return useQuery<Order>({
    queryKey: ["orders", id],
    queryFn: () => api.orders.getById(id!),
    enabled: !!id,
  });
}

export function useCreateOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (items: any[]) => api.orders.create(items),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["cart"] });
      qc.invalidateQueries({ queryKey: ["orders"] });
    },
  });
}

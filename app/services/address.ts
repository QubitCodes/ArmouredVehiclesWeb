import API from "./api";
import { Address } from "@/lib/types";

// Get all user addresses
export const getAddresses = () => {
  return API.get<Address[]>("/addresses");
};

// Create new address
export const createAddress = (data: Omit<Address, "id" | "userId" | "createdAt" | "isVerified">) => {
  return API.post("/addresses", data);
};

// Update address
export const updateAddress = (id: number, data: Partial<Address>) => {
  return API.put(`/addresses/${id}`, data);
};

// Delete address
export const deleteAddress = (id: number) => {
  return API.delete(`/addresses/${id}`);
};

// Set default address
export const setDefaultAddress = (id: number) => {
  return API.post(`/addresses/${id}/default`);
};

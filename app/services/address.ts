import API from "./api";
import { Address } from "@/lib/types";

// Map Backend (snake_case) -> Frontend (camelCase)
const toCamelCase = (data: any): Address => {
  return {
    id: data.id,
    userId: data.user_id,
    label: data.label,
    addressType: data.address_type || 'home', 
    fullName: data.full_name,
    phone: data.phone,
    addressLine1: data.address_line1,
    addressLine2: data.address_line2,
    city: data.city,
    state: data.state,
    postalCode: data.postal_code,
    country: data.country,
    isDefault: data.is_default,
    isVerified: false, // Not currently in backend model
    createdAt: data.created_at,
  };
};

// Map Frontend (camelCase) -> Backend (snake_case)
const toSnakeCase = (data: Partial<Address>) => {
  const payload: any = { ...data };
  if (data.fullName) {
    payload.full_name = data.fullName;
    delete payload.fullName;
  }
  if (data.addressLine1) {
    payload.address_line1 = data.addressLine1;
    delete payload.addressLine1;
  }
  if (data.addressLine2) {
    payload.address_line2 = data.addressLine2;
    delete payload.addressLine2;
  }
  if (data.postalCode) {
    payload.postal_code = data.postalCode;
    delete payload.postalCode;
  }
  if (data.isDefault !== undefined) {
    payload.is_default = data.isDefault;
    delete payload.isDefault;
  }
  if (data.userId) {
      payload.user_id = data.userId;
      delete payload.userId;
  }
  return payload;
};

// Get all user addresses
export const getAddresses = async (): Promise<Address[]> => {
  const res = await API.get("/profile/addresses");
  const list = (res.data as any)?.data?.addresses || [];
  return list.map(toCamelCase);
};

// Create new address
export const createAddress = async (data: Partial<Address>): Promise<Address> => {
  const payload = toSnakeCase(data);
  const res = await API.post("/profile/addresses", payload);
  const raw = (res.data as any)?.data?.address || (res.data as any)?.data;
  return toCamelCase(raw);
};

// Update address
export const updateAddress = async (id: number, data: Partial<Address>) => {
  const payload = toSnakeCase(data);
  return API.put(`/profile/addresses/${id}`, payload);
};

// Delete address
export const deleteAddress = (id: number) => {
  return API.delete(`/profile/addresses/${id}`);
};

// Set default address
export const setDefaultAddress = (id: number) => {
  return API.post(`/profile/addresses/${id}/default`);
};

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

// Map Frontend (camelCase) -> Backend (no change needed as Controller expects camelCase)
const toSnakeCase = (data: Partial<Address>) => {
  // Pass through without renaming keys. Controller expects camelCase (fullName, addressLine1, etc.)
  // Remove fields that shouldn't be sent if necessary, but spreading is usually fine.
  const payload: any = { ...data };
  
  // We don't need to send userId as it's handled by token
  if (payload.userId) delete payload.userId;
  
  // We don't need to send createdAt or isVerified usually
  if (payload.createdAt) delete payload.createdAt;
  
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

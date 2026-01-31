import API from "./api";

/** @deprecated Standard auth is legacy. */
export const logout = (refreshToken: string) => {
  return API.post("/auth/logout", { refreshToken });
};

// Firebase/OTP flows (Active)

// OTP Registration Flow (Customer)
/** @deprecated OTP Registration is legacy. Use Firebase flows instead. */
export const startOtpRegister = (payload: {
  identifier?: string;
  email: string;
  username: string;
  name: string;
  userType?: 'customer' | 'seller';
}) => {
  return API.post("/auth/otp/register/start", {
    ...payload,
    userType: payload.userType ?? 'customer',
  });
};

/** @deprecated OTP Verification is legacy. Use Firebase flows instead. */
export const verifyEmailOtp = (payload: {
  userId: string;
  email: string;
  code: string;
}) => {
  return API.post("/auth/otp/register/verify", payload);
};

/** @deprecated OTP Phone Binding is legacy. Use Firebase flows instead. */
export const setPhone = (payload: {
  userId: string;
  phone: string;
  countryCode: string;
}) => {
  return API.post("/auth/otp/set-phone", payload);
};

/** @deprecated OTP Phone Verification is legacy. Use Firebase flows instead. */
export const verifyPhoneOtp = (payload: {
  userId: string;
  phone: string;
  code: string;
  firebaseUid?: string;
}) => {
  return API.post("/auth/otp/phone/register/verify", payload);
};

/** @deprecated OTP Resend is legacy. Use Firebase flows instead. */
export const resendPhoneOtp = (payload: {
  userId: string;
  phone: string;
}) => {
  return API.post("/auth/otp/resend-phone", payload);
};

// Product Search
export interface SearchProductsParams {
  page?: number | null;
  limit?: number | null;
  // Preferred param name for API: "search"
  search?: string | null;
  // Back-compat for callers using "q"
  q?: string | null;
  category_id?: number | null;
  min_price?: number | null;
  max_price?: number | null;
  // When true, API returns filter options in misc
  need_filters?: boolean | null;
}

export const searchProducts = (params: SearchProductsParams = {}) => {
  const queryParams: Record<string, string | number> = {};

  if (params.page != null) {
    queryParams.page = params.page;
  }
  if (params.limit != null) {
    queryParams.limit = params.limit;
  }

  // Use "search" param expected by products listing endpoint
  const query = (params.search ?? params.q ?? "").toString().trim();
  if (query) {
    queryParams.search = query;
  }

  if (params.category_id != null) {
    queryParams.category_id = params.category_id;
  }
  if (params.min_price != null) {
    queryParams.min_price = params.min_price;
  }
  if (params.max_price != null) {
    queryParams.max_price = params.max_price;
  }
  if (params.need_filters != null) {
    queryParams.need_filters = params.need_filters ? 1 : 0;
  }

  // API supports search via GET /products with query params
  return API.get("/products", { params: queryParams });
};
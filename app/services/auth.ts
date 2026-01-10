import API from "./api";

export const registerConsumer = (data: {
  name: string;
  email: string;
  password: string;
}) => {
  return API.post("/auth/register", {
    ...data,
    userType: "customer",
  });
};

export const loginConsumer = (data: { identifier: string; password: string }) => {
  return API.post("/auth/login", {
    ...data,
  });
}

export const loginSeller = (data: { email: string; password: string }) => {
  return API.post("/auth/login", {
    ...data,
    userType: "seller",
  });
};


export const registerSeller = (data: {
  name: string;
  email: string;
  password: string;
}) => {
  return API.post("/auth/register", {
    ...data,
    userType: "seller",
  });
}

// OTP Login Flow (Email-based)
export const startOtpLogin = (identifier: string) => {
  return API.post("/auth/otp/login/start", { identifier });
};

export const verifyOtpLogin = (identifier: string, code: string) => {
  return API.post("/auth/otp/login/verify", { identifier, code });
};

// OTP Registration Flow (Customer)
export const startOtpRegister = (payload: {
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

export const verifyEmailOtp = (payload: {
  userId: string;
  email: string;
  code: string;
}) => {
  return API.post("/auth/otp/register/verify ", payload);
};

export const setPhone = (payload: {
  userId: string;
  phone: string;
  countryCode: string;
}) => {
  return API.post("/auth/otp/set-phone", payload);
};

export const verifyPhoneOtp = (payload: {
  userId: string;
  phone: string;
  code: string;
  firebaseUid?: string;
}) => {
  return API.post("/auth/otp/verify-phone", payload);
};

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
  q?: string | null;
  category_id?: number | null;
  min_price?: number | null;
  max_price?: number | null;
}

export const searchProducts = (params: SearchProductsParams = {}) => {
  const queryParams: Record<string, string | number> = {};

  if (params.page != null) {
    queryParams.page = params.page;
  }
  if (params.limit != null) {
    queryParams.limit = params.limit;
  }
  if (params.q != null && params.q.trim() !== "") {
    queryParams.q = params.q;
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

  return API.get("/products/search", { params: queryParams });
};
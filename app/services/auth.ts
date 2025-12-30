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
export const startOtpLogin = (email: string) => {
  return API.post("/auth/otp/login/start", { email });
};

export const verifyOtpLogin = (email: string, code: string) => {
  return API.post("/auth/otp/login/verify", { email, code });
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
  return API.post("/auth/otp/verify-email", payload);
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
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
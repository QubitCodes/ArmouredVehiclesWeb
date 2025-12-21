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

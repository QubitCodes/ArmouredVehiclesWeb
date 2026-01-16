import axios from "axios";

const API = axios.create({
<<<<<<< HEAD
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "https://amstoreweb.vercel.app/",
=======
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
>>>>>>> 2a12aeb083930f7fe38c81bbbcb10ff1e2562157

  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Attach Authorization header from localStorage tokens, if present
API.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token =
      localStorage.getItem("access_token") || localStorage.getItem("accessToken");
    if (token) {
      config.headers = config.headers || {};
      (config.headers as any).Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export default API;

// apps/web/src/lib/apiInstance.ts

import axios, { AxiosInstance } from "axios";

export const API_CONFIG = {
  BASE_URL:
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:3002/api/internal/v1",
  TIMEOUT: 10000, // 10 seconds
  HEADERS: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
};

export const ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/authenticate",
    GOOGLE: "/auth/google",
  },
};

export const apiInstance: AxiosInstance = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: API_CONFIG.HEADERS,
});

// Request interceptor
apiInstance.interceptors.request.use(
  (config: any) => {
    const token = localStorage.getItem("auth_token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error: any) => Promise.reject(error)
);

// Response interceptor
apiInstance.interceptors.response.use(
  (response: any) => response,
  async (error: { response: { status: number } }) => {
    if (error.response.status === 401) {
      localStorage.removeItem("auth_token");
      window.location.href = "/auth";
    }
    return Promise.reject(error);
  }
);

export default apiInstance;

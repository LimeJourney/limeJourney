// apps/web/src/lib/apiInstance.ts

import axios, { AxiosError, AxiosInstance } from "axios";
import Router from "next/router";
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

interface ApiResponse<T> {
  status: "success" | "error";
  data: T | null;
  message: string;
}

export const apiInstance: AxiosInstance = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: API_CONFIG.HEADERS,
});

export async function apiCall<T>(
  method: "get" | "post",
  url: string,
  data?: any
): Promise<T> {
  try {
    const response = await (method === "get"
      ? apiInstance.get<ApiResponse<T>>(
          url,
          data ? { params: data } : undefined
        )
      : apiInstance.post<ApiResponse<T>>(url, data));

    if (response.data.status === "error") {
      throw new Error(response.data.message);
    }

    return response.data.data as T;
  } catch (error) {
    if (error instanceof AxiosError) {
      // Check the status code from the headers
      const statusCode = error.response?.status;

      if (statusCode === 401) {
        // Redirect to login page for unauthorized access
        Router.push("/login");
        throw new Error("Unauthorized access. Please log in.");
      } else if (statusCode === 403) {
        throw new Error(
          "Access forbidden. You do not have permission to perform this action."
        );
      }

      // For other error status codes, throw the error message from the API if available
      if (error.response?.data && error.response.data.message) {
        throw new Error(error.response.data.message);
      }
    }
    // If it's not an AxiosError or doesn't have a response, throw the original error
    throw error;
  }
}

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

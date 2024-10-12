// apps/web/src/lib/apiInstance.ts

import axios, { AxiosError, AxiosInstance, AxiosResponse } from "axios";
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

type Method = "get" | "post" | "put" | "delete";
export async function apiCall<T>(
  method: Method,
  url: string,
  data?: any
): Promise<T> {
  try {
    const response = await apiInstance.request<ApiResponse<T>>({
      method,
      url,
      data: method !== "get" ? data : undefined,
      params: method === "get" ? data : undefined,
    });

    if (response.data.status === "error") {
      throw new Error(response.data.message);
    }
    return response.data.data as T;
  } catch (error) {
    if (error instanceof AxiosError) {
      const statusCode = error.response?.status;
      if (statusCode === 401) {
        Router.push("/login");
        throw new Error("Unauthorized access. Please log in.");
      } else if (statusCode === 403) {
        throw new Error(
          "Access forbidden. You do not have permission to perform this action."
        );
      }
      if (error.response?.data && error.response.data.message) {
        throw new Error(error.response.data.message);
      }
    }
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

const noRedirectUrlPatterns = [/\/organizations\/invitations\/[\w-]+$/];

// Response interceptor
apiInstance.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    console.log("error87", error.response);

    if (error.response?.status === 401) {
      const requestUrl = error.config?.url;

      console.log("requestUrl", requestUrl);

      if (requestUrl) {
        const shouldRedirect = !noRedirectUrlPatterns.some((pattern) =>
          pattern.test(requestUrl)
        );

        if (shouldRedirect) {
          localStorage.removeItem("auth_token");
          window.location.href = "/auth";
        }
      }
    }

    return Promise.reject(error);
  }
);

export default apiInstance;

import axios from "axios";

/**
 * Next.js:
 * - process.env.NEXT_PUBLIC_API_URL
 * - Được inject khác nhau theo môi trường
 */
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");

if (!API_BASE_URL) {
  console.warn(
    "⚠️ NEXT_PUBLIC_API_URL is not defined, fallback to localhost"
  );
}

export const api = axios.create({
  baseURL: API_BASE_URL || "http://localhost:3001",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Request interceptor
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        window.location.replace("/login");
      }
    }
    return Promise.reject(error);
  }
);

export default api;

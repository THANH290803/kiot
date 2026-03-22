import axios from "axios"

const isDevelopment = process.env.NODE_ENV === "development"

const API_BASE_URL = isDevelopment
  ? process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001"
  : process.env.NEXT_PUBLIC_API_URL_QA ?? process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001"

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
})

apiClient.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token")

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
  }

  return config
})

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== "undefined") {
      localStorage.removeItem("token")
      localStorage.removeItem("user")
      window.location.replace("/admin/login")
    }

    return Promise.reject(error)
  },
)

import { apiClient } from "@/shared/lib/api/client"
import type { LoginCredentials, LoginResponse } from "@/shared/types/auth"

export const authService = {
  async login(payload: LoginCredentials) {
    const response = await apiClient.post<LoginResponse>("/api/auth/login", payload)
    return response.data
  },
}

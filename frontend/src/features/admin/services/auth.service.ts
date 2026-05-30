import { apiClient } from "@/shared/lib/api/client"
import type { LoginCredentials, LoginResponse } from "@/shared/types/auth"

export const authService = {
  async login(payload: LoginCredentials) {
    const response = await apiClient.post<LoginResponse>("/api/auth/login", payload)
    return response.data
  },

  async verifyTwoFactorLogin(payload: { temp_token: string; otp_code: string }) {
    const response = await apiClient.post<LoginResponse>("/api/auth/login/verify-2fa", payload)
    return response.data
  },

  async getTwoFactorStatus() {
    const response = await apiClient.get<{
      is_two_factor_enabled: boolean
      email: string
      two_factor_enabled_at?: string | null
    }>("/api/auth/2fa/status")
    return response.data
  },

  async requestTwoFactorAction(payload: { action: "enable" | "disable" }) {
    const response = await apiClient.post<{
      message: string
      action: "enable" | "disable"
      expires_at: string
      masked_email: string
    }>("/api/auth/2fa/request", payload)
    return response.data
  },

  async confirmTwoFactorAction(payload: { action: "enable" | "disable"; otp_code: string }) {
    const response = await apiClient.post<{
      message: string
      is_two_factor_enabled: boolean
      two_factor_enabled_at?: string | null
    }>("/api/auth/2fa/confirm", payload)
    return response.data
  },
}

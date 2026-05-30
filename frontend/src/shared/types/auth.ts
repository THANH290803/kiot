export interface AuthRole {
  id?: number
  name: string
}

export interface AuthUser {
  id?: number
  username: string
  name?: string
  email?: string
  storeName?: string
  role?: AuthRole
  is_two_factor_enabled?: boolean
  two_factor_enabled_at?: string | null
}

export interface LoginCredentials {
  username: string
  password: string
}

export interface LoginSuccessResponse {
  token: string
  expires_at?: string
  user: AuthUser
}

export interface LoginRequiresTwoFactorResponse {
  requires_2fa: true
  temp_token: string
  expires_at: string
  masked_email: string
  message?: string
}

export type LoginResponse = LoginSuccessResponse | LoginRequiresTwoFactorResponse

export interface AuthRole {
  id?: number
  name: string
}

export interface AuthUser {
  id?: number
  username: string
  name?: string
  storeName?: string
  role?: AuthRole
}

export interface LoginCredentials {
  username: string
  password: string
}

export interface LoginResponse {
  token: string
  user: AuthUser
}

"use client"

import { createContext, useContext, useState } from "react"
import { authService } from "@/features/admin/services/auth.service"
import type { AuthUser, LoginResponse } from "@/shared/types/auth"

interface AuthContextType {
  isAuthenticated: boolean
  user: AuthUser | null
  login: (username: string, password: string, rememberMe?: boolean) => Promise<LoginResponse>
  verifyTwoFactor: (tempToken: string, otpCode: string, rememberMe?: boolean) => Promise<LoginResponse>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [initialAuthState] = useState(() => {
    if (typeof window === "undefined") {
      return {
        user: null as AuthUser | null,
        isAuthenticated: false,
      }
    }

    const token = localStorage.getItem("token")
    const savedUser = localStorage.getItem("user")

    if (token && savedUser) {
      return {
        user: JSON.parse(savedUser) as AuthUser,
        isAuthenticated: true,
      }
    }

    return {
      user: null as AuthUser | null,
      isAuthenticated: false,
    }
  })

  const [user, setUser] = useState<AuthUser | null>(initialAuthState.user)
  const [isAuthenticated, setIsAuthenticated] = useState(initialAuthState.isAuthenticated)

  const persistAuth = (token: string, user: AuthUser, rememberMe = false) => {
    localStorage.setItem("token", token)
    localStorage.setItem("user", JSON.stringify(user))
    localStorage.setItem("rememberMe", String(rememberMe))

    setUser(user)
    setIsAuthenticated(true)
  }

  const login = async (username: string, password: string, rememberMe = false) => {
    const response = await authService.login({ username, password })

    if ("token" in response && response.token) {
      persistAuth(response.token, response.user, rememberMe)
    }

    return response
  }

  const verifyTwoFactor = async (tempToken: string, otpCode: string, rememberMe = false) => {
    const response = await authService.verifyTwoFactorLogin({
      temp_token: tempToken,
      otp_code: otpCode,
    })

    if ("token" in response && response.token) {
      persistAuth(response.token, response.user, rememberMe)
    }

    return response
  }

  const logout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    localStorage.removeItem("rememberMe")
    setUser(null)
    setIsAuthenticated(false)
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, verifyTwoFactor, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within AuthProvider")
  return ctx
}

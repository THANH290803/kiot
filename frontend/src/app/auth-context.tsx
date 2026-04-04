"use client"

import { createContext, useContext, useState } from "react"
import { authService } from "@/features/admin/services/auth.service"
import type { AuthUser } from "@/shared/types/auth"

interface AuthContextType {
  isAuthenticated: boolean
  user: AuthUser | null
  login: (username: string, password: string, rememberMe?: boolean) => Promise<void>
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

  const login = async (username: string, password: string, rememberMe = false) => {
    const { token, user } = await authService.login({ username, password })

    localStorage.setItem("token", token)
    localStorage.setItem("user", JSON.stringify(user))
    localStorage.setItem("rememberMe", String(rememberMe))

    setUser(user)
    setIsAuthenticated(true)
  }

  const logout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    localStorage.removeItem("rememberMe")
    setUser(null)
    setIsAuthenticated(false)
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within AuthProvider")
  return ctx
}

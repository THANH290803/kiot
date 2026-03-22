"use client"

import type { ReactNode } from "react"
import { AuthProvider } from "@/features/user/lib/auth-context"
import { CartProvider } from "@/features/user/lib/cart-context"

export function UserProviders({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <CartProvider>{children}</CartProvider>
    </AuthProvider>
  )
}

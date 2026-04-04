"use client"

import type { ReactNode } from "react"
import { useAdminSession } from "../hooks/use-admin-session"

export function AdminAuthGuard({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAdminSession()

  if (!isAuthenticated) {
    return null
  }

  return <>{children}</>
}

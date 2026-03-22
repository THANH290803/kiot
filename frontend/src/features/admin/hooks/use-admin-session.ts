"use client"

import { useAuth } from "@/app/auth-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export function useAdminSession() {
  const auth = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!auth.isAuthenticated) {
      router.replace("/admin/login")
    }
  }, [auth.isAuthenticated, router])

  return auth
}

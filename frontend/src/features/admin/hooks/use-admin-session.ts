"use client"

import { useAuth } from "@/app/auth-context"
import { usePathname, useRouter } from "next/navigation"
import { useEffect } from "react"

export function useAdminSession() {
  const auth = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const isHydrated = typeof window !== "undefined"

  useEffect(() => {
    if (!isHydrated) {
      return
    }

    if (!auth.isAuthenticated) {
      const currentPath = pathname || "/admin/dashboard"
      const redirectTarget = encodeURIComponent(currentPath)
      router.replace(`/admin/login?redirect=${redirectTarget}`)
    }
  }, [auth.isAuthenticated, isHydrated, pathname, router])

  return {
    ...auth,
    isHydrated,
  }
}

"use client"

import type { ReactNode } from "react"
import { useAdminSession } from "../hooks/use-admin-session"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useMemo } from "react"
import { resolveAdminRoutePermissions, resolveFirstAccessibleAdminPath } from "@/features/admin/lib/rbac"
import { useAdminPermissions } from "@/features/admin/providers/admin-permission-provider"

export function AdminAuthGuard({ children }: { children: ReactNode }) {
  const { isAuthenticated, isHydrated } = useAdminSession()
  const pathname = usePathname()
  const router = useRouter()
  const { hasPermission, isLoadingPermissions, permissionCodes } = useAdminPermissions()

  const requiredPermissions = resolveAdminRoutePermissions(pathname || "")
  const hasRoutePermission =
    requiredPermissions.length === 0 ? true : hasPermission(requiredPermissions)
  const fallbackPath = useMemo(
    () => resolveFirstAccessibleAdminPath(hasPermission),
    [hasPermission],
  )

  useEffect(() => {
    if (!isHydrated || !isAuthenticated || isLoadingPermissions || hasRoutePermission) {
      return
    }

    if (fallbackPath && fallbackPath !== pathname) {
      router.replace(fallbackPath)
    }
  }, [
    fallbackPath,
    hasRoutePermission,
    isAuthenticated,
    isHydrated,
    isLoadingPermissions,
    pathname,
    router,
  ])

  if (!isHydrated || !isAuthenticated) {
    return null
  }

  if (isLoadingPermissions && permissionCodes.size === 0) {
    return null
  }

  if (!hasRoutePermission) {
    if (fallbackPath && fallbackPath !== pathname) {
      return null
    }

    return (
      <div className="flex min-h-[50vh] items-center justify-center px-6">
        <div className="max-w-md rounded-lg border bg-background p-6 text-center">
          <h2 className="text-lg font-semibold">Bạn không có quyền truy cập chức năng này</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Vui lòng liên hệ quản trị viên để được cấp quyền phù hợp.
          </p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}

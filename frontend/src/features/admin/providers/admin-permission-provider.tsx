"use client"

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react"
import { usePathname } from "next/navigation"
import { useAuth } from "@/app/auth-context"
import api from "@/lib/api"
import { checkHasAnyPermission, normalizePermissionSet, type PermissionRequirement } from "@/features/admin/lib/rbac"

interface BackendPermission {
  id: number
  code: string
}

interface AdminPermissionContextValue {
  isLoadingPermissions: boolean
  permissionCodes: Set<string>
  hasPermission: (required: PermissionRequirement) => boolean
  refreshPermissions: () => Promise<void>
}

const AdminPermissionContext = createContext<AdminPermissionContextValue | undefined>(undefined)

export function AdminPermissionProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated, user } = useAuth()
  const pathname = usePathname()
  const [isLoadingPermissions, setIsLoadingPermissions] = useState(false)
  const [permissionCodes, setPermissionCodes] = useState<Set<string>>(new Set())

  const refreshPermissions = useCallback(async () => {
    if (!isAuthenticated) {
      setPermissionCodes(new Set())
      return
    }

    const roleId = Number(user?.role?.id)
    if (!Number.isFinite(roleId) || roleId <= 0) {
      setPermissionCodes(new Set())
      return
    }

    setIsLoadingPermissions(true)
    try {
      const response = await api.get<BackendPermission[]>(`/api/roles/${roleId}/permissions`)
      const codes = Array.isArray(response.data)
        ? response.data.map((permission) => permission.code).filter(Boolean)
        : []
      setPermissionCodes(normalizePermissionSet(codes))
    } catch (error) {
      console.error("Fetch dynamic permissions error:", error)
      setPermissionCodes(new Set())
    } finally {
      setIsLoadingPermissions(false)
    }
  }, [isAuthenticated, user?.role?.id])

  useEffect(() => {
    void refreshPermissions()
  }, [refreshPermissions])

  useEffect(() => {
    if (!isAuthenticated) {
      return
    }

    void refreshPermissions()
  }, [isAuthenticated, pathname, refreshPermissions])

  useEffect(() => {
    if (!isAuthenticated || typeof window === "undefined") {
      return
    }

    const handleRefresh = () => {
      void refreshPermissions()
    }

    window.addEventListener("admin-permissions:refresh", handleRefresh)

    return () => {
      window.removeEventListener("admin-permissions:refresh", handleRefresh)
    }
  }, [isAuthenticated, refreshPermissions])

  const hasPermission = useCallback(
    (required: PermissionRequirement) => checkHasAnyPermission(permissionCodes, required),
    [permissionCodes],
  )

  const value = useMemo<AdminPermissionContextValue>(
    () => ({
      isLoadingPermissions,
      permissionCodes,
      hasPermission,
      refreshPermissions,
    }),
    [hasPermission, isLoadingPermissions, permissionCodes, refreshPermissions],
  )

  return <AdminPermissionContext.Provider value={value}>{children}</AdminPermissionContext.Provider>
}

export function useAdminPermissions() {
  const context = useContext(AdminPermissionContext)

  if (!context) {
    throw new Error("useAdminPermissions must be used within AdminPermissionProvider")
  }

  return context
}

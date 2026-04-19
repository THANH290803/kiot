"use client"

import type { ReactNode } from "react"
import { AdminPermissionProvider } from "@/features/admin/providers/admin-permission-provider"

export function AdminProviders({ children }: { children: ReactNode }) {
  return <AdminPermissionProvider>{children}</AdminPermissionProvider>
}

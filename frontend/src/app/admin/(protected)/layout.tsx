import type { ReactNode } from "react"
import { AdminAuthGuard, AdminLayoutShell } from "@/features/admin"
import { AdminProviders } from "@/features/admin/providers/admin-providers"

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <AdminProviders>
      <AdminAuthGuard>
        <AdminLayoutShell>{children}</AdminLayoutShell>
      </AdminAuthGuard>
    </AdminProviders>
  )
}

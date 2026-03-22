import type { ReactNode } from "react"

export function AdminLayoutShell({ children }: { children: ReactNode }) {
  return <div className="min-h-screen bg-[linear-gradient(180deg,#eff6ff_0%,#f8fafc_25%,#f8fafc_100%)]">{children}</div>
}

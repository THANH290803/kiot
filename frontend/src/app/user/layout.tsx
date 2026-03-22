import type { ReactNode } from "react"
import { UserProviders } from "@/features/user/providers/user-providers"

export default function UserLayout({ children }: { children: ReactNode }) {
  return <UserProviders>{children}</UserProviders>
}

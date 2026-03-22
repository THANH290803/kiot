"use client"

import { ThemeProvider } from "@/shared/components/theme-provider"
import { AuthProvider } from "@/app/auth-context"
import { QueryProvider } from "./query-provider"

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <QueryProvider>
        <AuthProvider>{children}</AuthProvider>
      </QueryProvider>
    </ThemeProvider>
  )
}

"use client"

import React from "react"
import { AppProviders } from "@/shared/lib/providers/app-providers"

export function Providers({ children }: { children: React.ReactNode }) {
  return <AppProviders>{children}</AppProviders>
}

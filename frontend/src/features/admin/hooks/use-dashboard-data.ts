"use client"

import { useState } from "react"
import { dashboardService } from "../services/dashboard.service"

export function useDashboardData() {
  const [period, setPeriod] = useState<"hour" | "day" | "week" | "month">("day")

  return {
    period,
    setPeriod,
    metrics: dashboardService.getMetrics(),
    revenue: dashboardService.getRevenue(period),
    categories: dashboardService.getCategoryShare(),
  }
}

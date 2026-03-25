"use client"

import { useEffect, useState } from "react"
import { dashboardService } from "../services/dashboard.service"
import type { CategoryShare, RevenueDatum, StatisticsPeriod } from "../types/dashboard"

export function useDashboardData() {
  const [period, setPeriod] = useState<StatisticsPeriod>("day")
  const [metrics, setMetrics] = useState([
    { label: "Doanh thu kỳ này", value: "0 đ", delta: "Đang tải...", tone: "neutral" as const },
    { label: "Số đơn hàng", value: "0", delta: "Đang tải...", tone: "neutral" as const },
    { label: "Khách hàng mới", value: "0", delta: "Đang tải...", tone: "neutral" as const },
    { label: "Lợi nhuận ước tính", value: "0 đ", delta: "Đang tải...", tone: "neutral" as const },
  ])
  const [revenue, setRevenue] = useState<RevenueDatum[]>([])
  const [categories, setCategories] = useState<CategoryShare[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let active = true

    const fetchDashboard = async () => {
      try {
        setIsLoading(true)
        setError(null)

        const dashboardData = await dashboardService.getDashboardData(period)

        if (!active) {
          return
        }

        setMetrics(dashboardData.metrics)
        setRevenue(dashboardData.revenue)
        setCategories(dashboardData.categories)
      } catch (fetchError) {
        if (!active) {
          return
        }

        console.error("Load dashboard data error:", fetchError)
        setError("Không tải được dữ liệu thống kê. Vui lòng thử lại.")
      } finally {
        if (active) {
          setIsLoading(false)
        }
      }
    }

    void fetchDashboard()

    return () => {
      active = false
    }
  }, [period])

  return {
    period,
    setPeriod,
    metrics,
    revenue,
    categories,
    isLoading,
    error,
  }
}

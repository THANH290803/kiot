import { api } from "@/lib/api"
import type { AdminMetric, CategoryShare, DashboardData, RevenueDatum, StatisticsPeriod } from "../types/dashboard"

const chartPointCountByPeriod: Record<StatisticsPeriod, number> = {
  hour: 24,
  day: 7,
  week: 4,
  month: 12,
}

const categoryColors = ["#0ea5e9", "#2563eb", "#14b8a6", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4"]

interface OverviewResponse {
  statistics?: {
    revenue?: { current?: number; change?: number }
    orders?: { current?: number; change?: number }
    newCustomers?: { current?: number; change?: number }
    estimatedProfit?: { current?: number; change?: number }
  }
}

interface RevenueBarChartResponse {
  data?: Array<{
    label?: string
    revenue?: number
  }>
}

interface CategoryRevenuePieResponse {
  data?: Array<{
    category_name?: string
    percentage?: number
  }>
}

function formatCurrency(value: number) {
  return `${Math.round(value || 0).toLocaleString("vi-VN")} đ`
}

function formatDelta(change: number | undefined) {
  if (typeof change !== "number" || Number.isNaN(change)) {
    return "Không có dữ liệu so sánh"
  }

  if (change > 0) {
    return `Tăng ${change.toFixed(2)}% so với kỳ trước`
  }

  if (change < 0) {
    return `Giảm ${Math.abs(change).toFixed(2)}% so với kỳ trước`
  }

  return "Không thay đổi so với kỳ trước"
}

function resolveTone(change: number | undefined): AdminMetric["tone"] {
  if (typeof change !== "number" || Number.isNaN(change)) {
    return "neutral"
  }

  if (change > 0) {
    return "positive"
  }

  if (change < 0) {
    return "negative"
  }

  return "neutral"
}

function mapMetrics(overview: OverviewResponse): AdminMetric[] {
  const revenueChange = overview.statistics?.revenue?.change
  const ordersChange = overview.statistics?.orders?.change
  const newCustomersChange = overview.statistics?.newCustomers?.change
  const profitChange = overview.statistics?.estimatedProfit?.change

  return [
    {
      label: "Doanh thu kỳ này",
      value: formatCurrency(overview.statistics?.revenue?.current || 0),
      delta: formatDelta(revenueChange),
      tone: resolveTone(revenueChange),
    },
    {
      label: "Số đơn hàng",
      value: `${Math.round(overview.statistics?.orders?.current || 0).toLocaleString("vi-VN")}`,
      delta: formatDelta(ordersChange),
      tone: resolveTone(ordersChange),
    },
    {
      label: "Khách hàng mới",
      value: `${Math.round(overview.statistics?.newCustomers?.current || 0).toLocaleString("vi-VN")}`,
      delta: formatDelta(newCustomersChange),
      tone: resolveTone(newCustomersChange),
    },
    {
      label: "Lợi nhuận ước tính",
      value: formatCurrency(overview.statistics?.estimatedProfit?.current || 0),
      delta: formatDelta(profitChange),
      tone: resolveTone(profitChange),
    },
  ]
}

function mapRevenue(revenueBar: RevenueBarChartResponse): RevenueDatum[] {
  return (revenueBar.data || []).map((item) => ({
    name: item.label || "N/A",
    revenue: Number(item.revenue || 0),
  }))
}

function mapCategories(categoryPie: CategoryRevenuePieResponse): CategoryShare[] {
  const mapped = (categoryPie.data || []).map((item, index) => ({
    name: item.category_name || "Khác",
    value: Number(item.percentage || 0),
    color: categoryColors[index % categoryColors.length],
  }))

  return mapped.length > 0 ? mapped : [{ name: "Chưa có dữ liệu", value: 100, color: "#94a3b8" }]
}

export const dashboardService = {
  async getDashboardData(period: StatisticsPeriod): Promise<DashboardData> {
    const [overviewResponse, revenueResponse, categoryResponse] = await Promise.allSettled([
      api.get<OverviewResponse>("/api/statistics/overview", {
        params: { period },
      }),
      api.get<RevenueBarChartResponse>("/api/statistics/revenue-bar-chart", {
        params: {
          period,
          count: chartPointCountByPeriod[period],
        },
      }),
      api.get<CategoryRevenuePieResponse>("/api/statistics/category-revenue-pie", {
        params: { period },
      }),
    ])

    const overviewData =
      overviewResponse.status === "fulfilled"
        ? overviewResponse.value.data || {}
        : {}
    const revenueData =
      revenueResponse.status === "fulfilled"
        ? revenueResponse.value.data || {}
        : {}
    const categoryData =
      categoryResponse.status === "fulfilled"
        ? categoryResponse.value.data || {}
        : {}

    return {
      metrics: mapMetrics(overviewData),
      revenue: mapRevenue(revenueData),
      categories: mapCategories(categoryData),
    }
  },
}

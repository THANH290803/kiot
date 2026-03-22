import type { AdminMetric, CategoryShare, RevenueDatum } from "../types/dashboard"

const revenueByPeriod: Record<"hour" | "day" | "week" | "month", RevenueDatum[]> = {
  hour: [
    { name: "8h", revenue: 1200000 },
    { name: "9h", revenue: 2100000 },
    { name: "10h", revenue: 1800000 },
    { name: "11h", revenue: 2400000 },
    { name: "12h", revenue: 3200000 },
    { name: "13h", revenue: 2800000 },
    { name: "14h", revenue: 3500000 },
    { name: "15h", revenue: 2900000 },
  ],
  day: [
    { name: "T2", revenue: 8500000 },
    { name: "T3", revenue: 9200000 },
    { name: "T4", revenue: 7800000 },
    { name: "T5", revenue: 10500000 },
    { name: "T6", revenue: 12500000 },
    { name: "T7", revenue: 11200000 },
    { name: "CN", revenue: 9800000 },
  ],
  week: [
    { name: "Tuần 1", revenue: 45000000 },
    { name: "Tuần 2", revenue: 52000000 },
    { name: "Tuần 3", revenue: 48000000 },
    { name: "Tuần 4", revenue: 58000000 },
  ],
  month: [
    { name: "T1", revenue: 120000000 },
    { name: "T2", revenue: 135000000 },
    { name: "T3", revenue: 142000000 },
    { name: "T4", revenue: 138000000 },
    { name: "T5", revenue: 155000000 },
    { name: "T6", revenue: 168000000 },
  ],
}

const metrics: AdminMetric[] = [
  { label: "Doanh thu hôm nay", value: "12.500.000 đ", delta: "+20.1% so với hôm qua", tone: "positive" },
  { label: "Số đơn hàng", value: "45", delta: "+5 đơn mới", tone: "positive" },
  { label: "Khách hàng mới", value: "12", delta: "Tăng trưởng ổn định trong ngày", tone: "positive" },
  { label: "Lợi nhuận ước tính", value: "3.200.000 đ", delta: "+12% mục tiêu tháng", tone: "positive" },
]

const categories: CategoryShare[] = [
  { name: "Thời trang", value: 45, color: "#0ea5e9" },
  { name: "Giày dép", value: 30, color: "#2563eb" },
  { name: "Phụ kiện", value: 25, color: "#f59e0b" },
]

export const dashboardService = {
  getMetrics() {
    return metrics
  },
  getRevenue(period: keyof typeof revenueByPeriod) {
    return revenueByPeriod[period]
  },
  getCategoryShare() {
    return categories
  },
}

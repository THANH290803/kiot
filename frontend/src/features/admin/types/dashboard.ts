export interface AdminMetric {
  label: string
  value: string
  delta: string
  tone: "positive" | "neutral" | "negative"
}

export interface RevenueDatum {
  name: string
  revenue: number
}

export interface CategoryShare {
  name: string
  value: number
  color: string
}

export type StatisticsPeriod = "hour" | "day" | "week" | "month"

export interface DashboardData {
  metrics: AdminMetric[]
  revenue: RevenueDatum[]
  categories: CategoryShare[]
}

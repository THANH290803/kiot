export interface AdminMetric {
  label: string
  value: string
  delta: string
  tone: "positive" | "neutral"
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

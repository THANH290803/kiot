"use client"

import { HeaderNav } from "@/features/admin/components/header-nav"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowDownRight, ArrowUpRight, Calendar, Clock, DollarSign, ShoppingBag, TrendingUp, Users } from "lucide-react"
import { Bar, BarChart, CartesianGrid, Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { useDashboardData } from "../hooks/use-dashboard-data"

const periodLabels = {
  hour: "Giờ",
  day: "Ngày",
  week: "Tuần",
  month: "Tháng",
} as const

const metricIcons = [TrendingUp, ShoppingBag, Users, DollarSign]

export function AdminDashboardScreen() {
  const { period, setPeriod, metrics, revenue, categories, isLoading, error } = useDashboardData()

  return (
    <>
      <HeaderNav />
      <main className="container mx-auto space-y-8 px-4 py-6 md:px-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary/70">Admin workspace</p>
            <h1 className="text-3xl font-semibold tracking-tight">Bảng điều hành vận hành cửa hàng</h1>
            <p className="mt-2 text-sm text-muted-foreground">Theo dõi doanh thu, đơn hàng và hiệu quả bán hàng theo thời gian thực.</p>
          </div>
          <Tabs value={period} onValueChange={(value) => setPeriod(value as typeof period)} className="w-full md:w-auto">
            <TabsList className="grid w-full grid-cols-4 md:w-[420px]">
              <TabsTrigger value="hour">
                <Clock className="mr-1 h-3 w-3" />
                {periodLabels.hour}
              </TabsTrigger>
              <TabsTrigger value="day">
                <Calendar className="mr-1 h-3 w-3" />
                {periodLabels.day}
              </TabsTrigger>
              <TabsTrigger value="week">{periodLabels.week}</TabsTrigger>
              <TabsTrigger value="month">{periodLabels.month}</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {metrics.map((metric, index) => {
            const Icon = metricIcons[index]
            const deltaClassName =
              metric.tone === "negative"
                ? "text-rose-500"
                : metric.tone === "positive"
                  ? "text-emerald-500"
                  : "text-muted-foreground"
            const DeltaIcon = metric.tone === "negative" ? ArrowDownRight : ArrowUpRight

            return (
              <Card key={metric.label} className="border-primary/10 bg-white/80 shadow-sm backdrop-blur">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">{metric.label}</CardTitle>
                  <Icon className="h-4 w-4 text-primary" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{metric.value}</div>
                  <p className={`mt-1 flex items-center gap-1 text-xs ${deltaClassName}`}>
                    <DeltaIcon className="h-3 w-3" />
                    {metric.delta}
                  </p>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {error ? (
          <div className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div>
        ) : null}

        <div className="grid gap-6 xl:grid-cols-10">
          <Card className="xl:col-span-6">
            <CardHeader>
              <CardTitle>Doanh thu theo chu kỳ</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex h-[320px] items-center justify-center text-sm text-muted-foreground">Đang tải biểu đồ doanh thu...</div>
              ) : revenue.length === 0 ? (
                <div className="flex h-[320px] items-center justify-center text-sm text-muted-foreground">Chưa có dữ liệu doanh thu.</div>
              ) : (
                <ResponsiveContainer width="100%" height={320}>
                  <BarChart data={revenue}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
                    <YAxis stroke="#64748b" fontSize={12} tickFormatter={(value) => `${(value / 1000000).toFixed(0)}M`} />
                    <Tooltip formatter={(value: number) => [`${value.toLocaleString()} đ`, "Doanh thu"]} />
                    <Legend />
                    <Bar dataKey="revenue" fill="oklch(0.45 0.15 250)" radius={[8, 8, 0, 0]} name="Doanh thu" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

          <Card className="xl:col-span-4">
            <CardHeader>
              <CardTitle>Cơ cấu ngành hàng</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="share" className="w-full">
                <TabsList className="mb-4">
                  <TabsTrigger value="share">Biểu đồ tròn</TabsTrigger>
                  <TabsTrigger value="notes">Biểu đồ cột</TabsTrigger>
                </TabsList>
                <TabsContent value="share" className="mt-0">
                  {isLoading ? (
                    <div className="flex h-[280px] items-center justify-center text-sm text-muted-foreground">Đang tải cơ cấu ngành hàng...</div>
                  ) : (
                    <ResponsiveContainer width="100%" height={280}>
                      <PieChart>
                        <Pie data={categories} dataKey="value" nameKey="name" innerRadius={60} outerRadius={96} paddingAngle={4}>
                          {categories.map((entry) => (
                            <Cell key={entry.name} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value: number) => [`${value}%`, "Tỷ trọng"]} />
                      </PieChart>
                    </ResponsiveContainer>
                  )}
                  <div className="space-y-3">
                    {categories.map((item) => (
                      <div key={item.name} className="flex items-center justify-between rounded-lg border border-border/60 px-3 py-2">
                        <div className="flex items-center gap-2">
                          <span className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
                          <span className="text-sm font-medium">{item.name}</span>
                        </div>
                        <span className="text-sm text-muted-foreground">{item.value}%</span>
                      </div>
                    ))}
                  </div>
                </TabsContent>
                <TabsContent value="notes" className="mt-0">
                  <ResponsiveContainer width="100%" height={280}>
                    <BarChart data={categories}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
                      <YAxis stroke="#64748b" fontSize={12} unit="%" />
                      <Tooltip formatter={(value: number) => [`${value}%`, "Tỷ trọng"]} />
                      <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                        {categories.map((entry) => (
                          <Cell key={`bar-${entry.name}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  )
}

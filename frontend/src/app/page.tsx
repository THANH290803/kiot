"use client"

import { useAuth } from "@/app/auth-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { HeaderNav } from "@/components/header-nav"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  TrendingUp,
  Users,
  ShoppingBag,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  Calendar,
  DollarSign,
  Flame,
} from "lucide-react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const revenueData = {
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

const categoryData = [
  { name: "Thời trang", value: 45, color: "#0ea5e9" },
  { name: "Giày dép", value: 30, color: "#8b5cf6" },
  { name: "Phụ kiện", value: 25, color: "#f59e0b" },
]

const bestSellingProducts = [
  { id: 1, name: "Áo thun Cotton Premium", sold: 156, revenue: 39000000, growth: 12.5, image: "/shirt.jpg" },
  {
    id: 2,
    name: "Quần Jean Slim Fit",
    sold: 98,
    revenue: 44100000,
    growth: 8.3,
    image: "/various-styles-of-pants.png",
  },
  { id: 3, name: "Giày Sneaker White", sold: 87, revenue: 73950000, growth: 15.7, image: "/assorted-shoes.png" },
  { id: 4, name: "Mũ bảo hiểm 3/4", sold: 65, revenue: 20800000, growth: -2.1, image: "/protective-helmet.png" },
  { id: 5, name: "Ví da bò thật", sold: 52, revenue: 9360000, growth: 6.8, image: "/leather-wallet-contents.png" },
]

export default function DashboardPage() {
  const { isAuthenticated } = useAuth()
  const router = useRouter()
  const [timeFilter, setTimeFilter] = useState<"hour" | "day" | "week" | "month">("day")

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, router])

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <HeaderNav />
      <main className="container mx-auto p-6 space-y-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Tổng quan cửa hàng</h1>
            <p className="text-sm text-muted-foreground">Theo dõi hoạt động kinh doanh của bạn</p>
          </div>
          <Tabs value={timeFilter} onValueChange={(v) => setTimeFilter(v as any)} className="w-full md:w-auto">
            <TabsList className="grid w-full grid-cols-4 md:w-[400px]">
              <TabsTrigger value="hour" className="flex items-center gap-1">
                <Clock className="h-3 w-3" /> Giờ
              </TabsTrigger>
              <TabsTrigger value="day" className="flex items-center gap-1">
                <Calendar className="h-3 w-3" /> Ngày
              </TabsTrigger>
              <TabsTrigger value="week">Tuần</TabsTrigger>
              <TabsTrigger value="month">Tháng</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Thống kê nhanh */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Doanh thu hôm nay</CardTitle>
              <TrendingUp className="h-4 w-4 text-emerald-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12.500.000 đ</div>
              <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                <ArrowUpRight className="h-3 w-3 text-emerald-500" /> +20.1% so với hôm qua
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Số đơn hàng</CardTitle>
              <ShoppingBag className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">45</div>
              <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                <ArrowUpRight className="h-3 w-3 text-emerald-500" /> +5 đơn mới
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Khách hàng mới</CardTitle>
              <Users className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                <ArrowDownRight className="h-3 w-3 text-rose-500" /> -2 so với hôm qua
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Lợi nhuận ước tính</CardTitle>
              <DollarSign className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3.200.000 đ</div>
              <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                <ArrowUpRight className="h-3 w-3 text-emerald-500" /> +12% mục tiêu tháng
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Phân tích kinh doanh và Sản phẩm bán chạy */}
        <div className="grid gap-6 lg:grid-cols-10">
          <Card className="lg:col-span-6">
            <CardHeader>
              <CardTitle>Phân tích kinh doanh</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="revenue" className="w-full">
                <TabsList className="mb-4">
                  <TabsTrigger value="revenue">Biểu đồ doanh thu</TabsTrigger>
                  <TabsTrigger value="category">Tỷ trọng theo danh mục</TabsTrigger>
                </TabsList>

                <TabsContent value="revenue" className="mt-0">
                  <ResponsiveContainer width="100%" height={350}>
                    <BarChart data={revenueData[timeFilter]}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="name" stroke="#6b7280" fontSize={12} />
                      <YAxis
                        stroke="#6b7280"
                        fontSize={12}
                        tickFormatter={(value) => `${(value / 1000000).toFixed(0)}M`}
                      />
                      <Tooltip
                        formatter={(value: number) => [`${value.toLocaleString()} đ`, "Doanh thu"]}
                        contentStyle={{ borderRadius: "8px", border: "1px solid #e5e7eb" }}
                      />
                      <Legend />
                      <Bar dataKey="revenue" fill="oklch(0.45 0.15 250)" name="Doanh thu" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </TabsContent>

                <TabsContent value="category" className="mt-0">
                  <div className="flex flex-col md:flex-row items-center gap-8">
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={categoryData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {categoryData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value: number) => [`${value}%`, "Tỷ lệ"]} />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="space-y-3 w-full md:w-auto">
                      {categoryData.map((cat) => (
                        <div key={cat.name} className="flex items-center justify-between gap-8 text-sm">
                          <div className="flex items-center gap-2">
                            <div className="h-4 w-4 rounded-full" style={{ backgroundColor: cat.color }} />
                            <span className="font-medium">{cat.name}</span>
                          </div>
                          <span className="font-bold text-lg">{cat.value}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          <Card className="lg:col-span-4">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Flame className="h-4 w-4 text-orange-500" />
                Sản phẩm bán chạy
              </CardTitle>
            </CardHeader>
            <CardContent className="px-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="pl-6">Sản phẩm</TableHead>
                    <TableHead className="text-right pr-6">Đã bán</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bestSellingProducts.map((product, index) => (
                    <TableRow key={product.id}>
                      <TableCell className="pl-6">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded bg-muted overflow-hidden shrink-0">
                            <img
                              src={product.image || "/placeholder.svg"}
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <span className="text-sm font-medium line-clamp-1">{product.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right pr-6 font-bold text-primary">{product.sold}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

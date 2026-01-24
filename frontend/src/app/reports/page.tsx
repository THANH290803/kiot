import { HeaderNav } from "@/components/header-nav"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart3, TrendingUp, PieChart, DollarSign, ArrowUpRight } from "lucide-react"

export default function ReportsPage() {
  return (
    <div className="min-h-screen bg-background">
      <HeaderNav />
      <main className="container mx-auto p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Báo cáo doanh thu</h1>
          <Tabs defaultValue="month">
            <TabsList>
              <TabsTrigger value="day">Ngày</TabsTrigger>
              <TabsTrigger value="week">Tuần</TabsTrigger>
              <TabsTrigger value="month">Tháng</TabsTrigger>
              <TabsTrigger value="year">Năm</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Doanh thu thuần</CardTitle>
              <DollarSign className="h-4 w-4 text-emerald-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">450.000.000 đ</div>
              <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                <ArrowUpRight className="h-3 w-3 text-emerald-500" /> +15.2% so với tháng trước
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Giá vốn bán hàng</CardTitle>
              <BarChart3 className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">280.000.000 đ</div>
              <p className="text-xs text-muted-foreground mt-1">Tỉ lệ giá vốn: 62%</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Lợi nhuận gộp</CardTitle>
              <TrendingUp className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">170.000.000 đ</div>
              <p className="text-xs text-muted-foreground mt-1">Biên lợi nhuận: 38%</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <BarChart3 className="h-4 w-4 text-primary" /> Doanh thu theo thời gian
              </CardTitle>
            </CardHeader>
            <CardContent className="h-[300px] flex items-center justify-center border-2 border-dashed rounded-lg bg-muted/50">
              <p className="text-muted-foreground">Biểu đồ cột doanh thu</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <PieChart className="h-4 w-4 text-primary" /> Cơ cấu doanh thu theo nhóm hàng
              </CardTitle>
            </CardHeader>
            <CardContent className="h-[300px] flex items-center justify-center border-2 border-dashed rounded-lg bg-muted/50">
              <p className="text-muted-foreground">Biểu đồ tròn cơ cấu hàng hóa</p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

import { HeaderNav } from "@/components/header-nav"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Edit, Mail, Phone, Briefcase, Calendar, MapPin, Shield } from "lucide-react"
import Link from "next/link"
import { getRolePermissions } from "@/lib/permissions"

const ROLES = {
  admin: { label: "Quản lý cao cấp", color: "bg-red-100 text-red-700" },
  manager: { label: "Quản lý", color: "bg-purple-100 text-purple-700" },
  sales: { label: "Nhân viên bán hàng", color: "bg-blue-100 text-blue-700" },
  warehouse: { label: "Nhân viên kho", color: "bg-emerald-100 text-emerald-700" },
}

export default function EmployeeDetailPage({ params }: { params: { id: string } }) {
  const employee = {
    id: params.id,
    code: "NV001",
    name: "Nguyễn Văn A",
    email: "nguyenvana@kiotv0.com",
    phone: "0901234567",
    role: "admin" as const,
    branch: "Chi nhánh trung tâm",
    address: "123 Đường ABC, Quận 1, TP. HCM",
    status: "active",
    joinDate: "01/01/2025",
    salary: 15000000,
    department: "Quản lý",
  }

  const roleConfig = ROLES[employee.role as keyof typeof ROLES]
  const permissions = getRolePermissions(employee.role)

  return (
    <div className="min-h-screen bg-background">
      <HeaderNav />
      <main className="container mx-auto p-6 space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/employees">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold">{employee.name}</h1>
            <p className="text-sm text-muted-foreground">Mã: {employee.code}</p>
          </div>
          <Button className="bg-primary">
            <Edit className="h-4 w-4 mr-2" /> Chỉnh sửa
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Thông tin cơ bản</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-6">
                  <div className="flex items-start gap-3">
                    <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-xs text-muted-foreground uppercase font-semibold">Email</p>
                      <p className="font-medium">{employee.email}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-xs text-muted-foreground uppercase font-semibold">Số điện thoại</p>
                      <p className="font-medium">{employee.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-xs text-muted-foreground uppercase font-semibold">Ngày vào làm</p>
                      <p className="font-medium">{employee.joinDate}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-xs text-muted-foreground uppercase font-semibold">Chi nhánh</p>
                      <p className="font-medium">{employee.branch}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Briefcase className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-xs text-muted-foreground uppercase font-semibold">Phòng ban</p>
                      <p className="font-medium">{employee.department}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Shield className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-xs text-muted-foreground uppercase font-semibold">Vai trò</p>
                      <Badge
                        className={roleConfig ? roleConfig.color : "bg-gray-100 text-gray-700"}
                        variant="secondary"
                      >
                        {roleConfig ? roleConfig.label : employee.role}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" /> Quyền hạn chi tiết
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {["products", "orders", "employees", "reports", "settings"].map((category) => {
                  const categoryPermissions = permissions.filter((p) => p.category === category)
                  if (categoryPermissions.length === 0) return null

                  const categoryLabels: Record<string, string> = {
                    products: "Quản lý sản phẩm",
                    orders: "Quản lý hoá đơn",
                    employees: "Quản lý nhân viên",
                    reports: "Báo cáo",
                    settings: "Cấu hình hệ thống",
                  }

                  return (
                    <div key={category}>
                      <h4 className="font-semibold mb-3 text-sm">{categoryLabels[category]}</h4>
                      <ul className="space-y-2 ml-2">
                        {categoryPermissions.map((permission) => (
                          <li key={permission.id} className="flex items-start gap-3">
                            <div className="w-2 h-2 rounded-full bg-primary mt-1.5 shrink-0"></div>
                            <div>
                              <p className="text-sm font-medium">{permission.label}</p>
                              <p className="text-xs text-muted-foreground">{permission.description}</p>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )
                })}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Thông tin nhân viên</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-xs text-muted-foreground uppercase font-semibold">Mã nhân viên</p>
                  <p className="text-lg font-bold text-primary">{employee.code}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase font-semibold">Trạng thái</p>
                  <Badge variant={employee.status === "active" ? "default" : "outline"} className="mt-1">
                    {employee.status === "active" ? "Đang hoạt động" : "Ngừng hoạt động"}
                  </Badge>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase font-semibold">Lương cơ bản</p>
                  <p className="text-lg font-bold text-emerald-600">{employee.salary.toLocaleString()} đ</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase font-semibold">Địa chỉ</p>
                  <p className="text-sm">{employee.address}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Tổng số quyền</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-primary">{permissions.length}</p>
                <p className="text-xs text-muted-foreground mt-1">quyền hạn được cấp</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}

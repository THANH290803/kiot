import { HeaderNav } from "@/components/header-nav"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Store, ShieldCheck } from "lucide-react"

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-background">
      <HeaderNav />
      <main className="container mx-auto p-6 max-w-4xl space-y-8">
        <div>
          <h1 className="text-2xl font-bold">Thiết lập hệ thống</h1>
          <p className="text-sm text-muted-foreground">Quản lý cấu hình cửa hàng và thông tin chung</p>
        </div>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Store className="h-5 w-5 text-primary" /> Thông tin cửa hàng
              </CardTitle>
              <CardDescription>Cập nhật tên, địa chỉ và số điện thoại liên hệ của cửa hàng</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="store-name">Tên cửa hàng</Label>
                <Input id="store-name" defaultValue="KiotV0 - Thời trang Nam" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="phone">Số điện thoại</Label>
                  <Input id="phone" defaultValue="0912 345 678" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email liên hệ</Label>
                  <Input id="email" defaultValue="contact@kiotv0.com" />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="address">Địa chỉ</Label>
                <Input id="address" defaultValue="123 Đường ABC, Quận 1, TP. Hồ Chí Minh" />
              </div>
              <Button className="bg-primary">Lưu thay đổi</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-primary" /> Bảo mật & Phân quyền
              </CardTitle>
              <CardDescription>Quản lý mật khẩu và quyền truy cập của nhân viên</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium text-sm">Xác thực 2 yếu tố (2FA)</p>
                  <p className="text-xs text-muted-foreground">Tăng cường bảo mật cho tài khoản admin</p>
                </div>
                <Button variant="outline" size="sm">
                  Thiết lập
                </Button>
              </div>
              <Separator />
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium text-sm">Quản lý nhân viên</p>
                  <p className="text-xs text-muted-foreground">Hiện có 5 nhân viên đang hoạt động</p>
                </div>
                <Button variant="outline" size="sm">
                  Chi tiết
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

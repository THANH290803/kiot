import { HeaderNav } from "@/components/header-nav"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Camera, ShieldCheck } from "lucide-react"

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-background">
      <HeaderNav />
      <main className="container mx-auto p-6 space-y-6">
        <h1 className="text-2xl font-bold">Hồ sơ người dùng</h1>

        <div className="grid gap-6 md:grid-cols-3">
          <Card className="md:col-span-1">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div className="relative mb-4">
                <Avatar className="h-32 w-32 border-4 border-primary/10">
                  <AvatarImage src="/user-avatar.jpg" />
                  <AvatarFallback className="text-4xl">AD</AvatarFallback>
                </Avatar>
                <Button size="icon" variant="secondary" className="absolute bottom-0 right-0 rounded-full h-8 w-8">
                  <Camera className="h-4 w-4" />
                </Button>
              </div>
              <h2 className="text-xl font-bold">Admin Quản trị</h2>
              <p className="text-sm text-muted-foreground">Chi nhánh trung tâm</p>
              <div className="mt-4 flex items-center gap-2 px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold">
                <ShieldCheck className="h-3 w-3" /> Tài khoản quản trị
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Thông tin cá nhân</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="fullname">Họ và tên</Label>
                  <Input id="fullname" defaultValue="Admin Quản trị" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email liên hệ</Label>
                  <Input id="email" defaultValue="admin@kiotv0.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Số điện thoại</Label>
                  <Input id="phone" defaultValue="0988 123 456" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="branch">Chi nhánh</Label>
                  <Input id="branch" defaultValue="Chi nhánh trung tâm" disabled />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Địa chỉ công tác</Label>
                <Input id="address" defaultValue="123 Đường ABC, Quận 1, TP. HCM" />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline">Hủy thay đổi</Button>
                <Button className="bg-primary">Lưu hồ sơ</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

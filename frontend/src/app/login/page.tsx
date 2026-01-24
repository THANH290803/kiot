import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Store } from "lucide-react"
import Link from "next/link"

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-2">
            <div className="bg-primary p-2 rounded-lg text-white">
              <Store className="h-8 w-8" />
            </div>
            <h1 className="text-3xl font-bold text-primary tracking-tight">KiotV0</h1>
          </div>
        </div>

        <Card className="shadow-xl border-t-4 border-t-primary">
          <CardHeader>
            <CardTitle className="text-xl">Đăng nhập</CardTitle>
            <CardDescription>Chào mừng bạn quay trở lại hệ thống quản lý</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="store">Tên cửa hàng</Label>
              <Input id="store" placeholder="my-store-name" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="username">Tên đăng nhập</Label>
              <Input id="username" placeholder="admin" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Mật khẩu</Label>
              <Input id="password" type="password" />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button className="w-full bg-primary hover:bg-primary/90 h-11 text-base font-medium" asChild>
              <Link href="/">ĐĂNG NHẬP</Link>
            </Button>
            <div className="text-center text-sm text-muted-foreground">
              Quên mật khẩu?{" "}
              <Link href="#" className="text-primary font-medium">
                Lấy lại mật khẩu
              </Link>
            </div>
          </CardFooter>
        </Card>

        <p className="text-center mt-8 text-sm text-muted-foreground">
          © 2025 KiotV0. Hệ thống quản lý bán hàng chuyên nghiệp.
        </p>
      </div>
    </div>
  )
}

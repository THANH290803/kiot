"use client"

import React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Store } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { useAuth } from "@/app/auth-context"

export default function LoginPage() {
  const router = useRouter()
  const { login, isAuthenticated } = useAuth()
  const [storeName, setStoreName] = useState("")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  // Redirect to dashboard if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      router.push("/")
    }
  }, [isAuthenticated, router])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    if (!username || !password) {
      setError("Vui lòng điền đầy đủ thông tin")
      setIsLoading(false)
      return
    }

    try {
      await login(username, password)
      router.push("/")
    } catch (err: any) {
      setError(err.response?.data?.message || "Đăng nhập thất bại")
      setIsLoading(false)
    }
  }


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
          <form onSubmit={handleLogin}>
            <CardContent className="space-y-4">
              {error && (
                <div className="bg-destructive/10 border border-destructive text-destructive text-sm p-3 rounded-md">
                  {error}
                </div>
              )}
              {/* <div className="space-y-2">
                <Label htmlFor="store">Tên cửa hàng</Label>
                <Input
                  id="store"
                  placeholder="my-store-name"
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                  disabled={isLoading}
                />
              </div> */}
              <div className="space-y-2">
                <Label htmlFor="username">Tên đăng nhập</Label>
                <Input
                  id="username"
                  placeholder="Nhập username của bạn"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Mật khẩu</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Nhập password của bạn"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              <div className="flex items-center gap-2 pt-2">
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                  disabled={isLoading}
                />
                <Label htmlFor="remember" className="text-sm font-normal cursor-pointer">
                  Nhớ tôi
                </Label>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4 pt-8">
              <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90 h-11 text-base font-medium"
                disabled={isLoading}
              >
                {isLoading ? "Đang đăng nhập..." : "ĐĂNG NHẬP"}
              </Button>
              <div className="text-center text-sm text-muted-foreground">
                Quên mật khẩu?{" "}
                <Link href="#" className="text-primary font-medium">
                  Lấy lại mật khẩu
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>

        <p className="text-center mt-8 text-sm text-muted-foreground">
          © 2025 KiotV0. Hệ thống quản lý bán hàng chuyên nghiệp.
        </p>
      </div>
    </div>
  )
}

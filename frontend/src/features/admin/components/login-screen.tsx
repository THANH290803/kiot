"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { Store } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useAuth } from "@/app/auth-context"

function getErrorMessage(error: unknown) {
  if (typeof error === "object" && error !== null && "response" in error) {
    const response = (error as { response?: { data?: { message?: string } } }).response
    return response?.data?.message || "Đăng nhập thất bại"
  }

  return "Đăng nhập thất bại"
}

export function LoginScreen() {
  const router = useRouter()
  const { login, isAuthenticated } = useAuth()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (isAuthenticated) {
      router.replace("/admin/dashboard")
    }
  }, [isAuthenticated, router])

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault()
    setError("")
    setIsLoading(true)

    if (!username || !password) {
      setError("Vui lòng điền đầy đủ thông tin")
      setIsLoading(false)
      return
    }

    try {
      await login(username, password, rememberMe)
      router.replace("/admin/dashboard")
    } catch (error) {
      setError(getErrorMessage(error))
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,#dbeafe_0%,#eff6ff_20%,#f8fafc_50%,#f8fafc_100%)] p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 flex justify-center">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-primary p-3 text-white shadow-lg shadow-primary/20">
              <Store className="h-8 w-8" />
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.25em] text-primary/70">Admin portal</p>
              <h1 className="text-3xl font-bold tracking-tight text-primary">Kiot</h1>
            </div>
          </div>
        </div>

        <Card className="border-primary/10 bg-white/90 shadow-2xl backdrop-blur">
          <CardHeader>
            <CardTitle className="text-xl text-center">Đăng nhập quản trị</CardTitle>
            {/*<CardDescription>Không để business logic rải rác trong route, login đi qua service của feature admin.</CardDescription>*/}
          </CardHeader>
          <form onSubmit={handleLogin}>
            <CardContent className="space-y-4">
              {error ? <div className="rounded-md border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive">{error}</div> : null}
              <div className="space-y-2">
                <Label htmlFor="username">Tên đăng nhập</Label>
                <Input id="username" placeholder="Nhập username của bạn" value={username} onChange={(event) => setUsername(event.target.value)} disabled={isLoading} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Mật khẩu</Label>
                <Input id="password" type="password" placeholder="Nhập password của bạn" value={password} onChange={(event) => setPassword(event.target.value)} disabled={isLoading} />
              </div>
              <div className="flex items-center gap-2 pt-1">
                <Checkbox id="remember" checked={rememberMe} onCheckedChange={(checked) => setRememberMe(Boolean(checked))} disabled={isLoading} />
                <Label htmlFor="remember" className="cursor-pointer text-sm font-normal">
                  Nhớ tôi
                </Label>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4 pt-8">
              <Button type="submit" className="h-11 w-full text-base font-medium" disabled={isLoading}>
                {isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
              </Button>
              <p className="text-center text-sm text-muted-foreground">
                Quên mật khẩu?{" "}
                <Link href="#" className="font-medium text-primary">
                  Lấy lại mật khẩu
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  )
}

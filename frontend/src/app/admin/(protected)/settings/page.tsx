"use client"

import { useEffect, useState } from "react"
import { HeaderNav } from "@/features/admin/components/header-nav"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Store, ShieldCheck } from "lucide-react"
import { authService } from "@/features/admin/services/auth.service"

function getErrorMessage(error: unknown) {
  if (typeof error === "object" && error !== null && "response" in error) {
    const response = (error as { response?: { data?: { message?: string } } }).response
    return response?.data?.message || "Thao tác thất bại"
  }

  return "Thao tác thất bại"
}

export default function SettingsPage() {
  const [isTwoFactorEnabled, setIsTwoFactorEnabled] = useState(false)
  const [twoFactorEmail, setTwoFactorEmail] = useState("")
  const [twoFactorEnabledAt, setTwoFactorEnabledAt] = useState<string | null>(null)
  const [isLoadingTwoFactor, setIsLoadingTwoFactor] = useState(true)
  const [isTwoFactorDialogOpen, setIsTwoFactorDialogOpen] = useState(false)
  const [twoFactorAction, setTwoFactorAction] = useState<"enable" | "disable">("enable")
  const [maskedEmail, setMaskedEmail] = useState("")
  const [otpCode, setOtpCode] = useState("")
  const [feedbackMessage, setFeedbackMessage] = useState("")
  const [errorMessage, setErrorMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const loadTwoFactorStatus = async () => {
    try {
      setIsLoadingTwoFactor(true)
      const response = await authService.getTwoFactorStatus()
      setIsTwoFactorEnabled(response.is_two_factor_enabled)
      setTwoFactorEmail(response.email)
      setTwoFactorEnabledAt(response.two_factor_enabled_at || null)
    } catch (error) {
      setErrorMessage(getErrorMessage(error))
    } finally {
      setIsLoadingTwoFactor(false)
    }
  }

  useEffect(() => {
    void loadTwoFactorStatus()
  }, [])

  const handleRequestTwoFactorAction = async (action: "enable" | "disable") => {
    try {
      setIsSubmitting(true)
      setErrorMessage("")
      setFeedbackMessage("")

      const response = await authService.requestTwoFactorAction({ action })
      setTwoFactorAction(action)
      setMaskedEmail(response.masked_email)
      setOtpCode("")
      setFeedbackMessage(response.message)
      setIsTwoFactorDialogOpen(true)
    } catch (error) {
      setErrorMessage(getErrorMessage(error))
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleConfirmTwoFactorAction = async () => {
    try {
      setIsSubmitting(true)
      setErrorMessage("")
      setFeedbackMessage("")

      const response = await authService.confirmTwoFactorAction({
        action: twoFactorAction,
        otp_code: otpCode,
      })

      setIsTwoFactorEnabled(response.is_two_factor_enabled)
      setTwoFactorEnabledAt(response.two_factor_enabled_at || null)
      setFeedbackMessage(response.message)
      setIsTwoFactorDialogOpen(false)
      setOtpCode("")
    } catch (error) {
      setErrorMessage(getErrorMessage(error))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <HeaderNav />
      <main className="container mx-auto max-w-4xl space-y-8 p-6">
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
              {(errorMessage || feedbackMessage) ? (
                <div className={errorMessage ? "rounded-lg border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive" : "rounded-lg border border-primary/20 bg-primary/5 p-3 text-sm text-primary"}>
                  {errorMessage || feedbackMessage}
                </div>
              ) : null}
              <div className="flex items-center justify-between rounded-lg border p-3">
                <div>
                  <p className="font-medium text-sm">Xác thực 2 yếu tố (2FA)</p>
                  <p className="text-xs text-muted-foreground">
                    {isLoadingTwoFactor
                      ? "Đang tải trạng thái bảo mật..."
                      : isTwoFactorEnabled
                        ? `Đang bật cho ${twoFactorEmail}${twoFactorEnabledAt ? ` từ ${new Date(twoFactorEnabledAt).toLocaleString("vi-VN")}` : ""}`
                        : "Hiện đang tắt. Khi bật, hệ thống sẽ gửi OTP qua email sau bước đăng nhập."}
                  </p>
                </div>
                <Button
                  variant={isTwoFactorEnabled ? "destructive" : "outline"}
                  size="sm"
                  disabled={isLoadingTwoFactor || isSubmitting}
                  onClick={() => void handleRequestTwoFactorAction(isTwoFactorEnabled ? "disable" : "enable")}
                >
                  {isTwoFactorEnabled ? "Tắt 2FA" : "Thiết lập"}
                </Button>
              </div>
              <Separator />
              <div className="flex items-center justify-between rounded-lg border p-3">
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

      <Dialog open={isTwoFactorDialogOpen} onOpenChange={setIsTwoFactorDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{twoFactorAction === "enable" ? "Bật xác thực 2 lớp" : "Tắt xác thực 2 lớp"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="rounded-lg border border-primary/15 bg-primary/5 p-3 text-sm text-muted-foreground">
              Mã OTP đã được gửi tới <span className="font-medium text-foreground">{maskedEmail}</span>.
            </div>
            <div className="space-y-2">
              <Label htmlFor="two-factor-otp">Mã OTP</Label>
              <Input
                id="two-factor-otp"
                inputMode="numeric"
                maxLength={6}
                placeholder="Nhập mã 6 số"
                value={otpCode}
                onChange={(event) => setOtpCode(event.target.value.replace(/\D/g, "").slice(0, 6))}
                disabled={isSubmitting}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsTwoFactorDialogOpen(false)} disabled={isSubmitting}>
              Hủy
            </Button>
            <Button onClick={() => void handleConfirmTwoFactorAction()} disabled={isSubmitting || otpCode.length !== 6}>
              {isSubmitting ? "Đang xác nhận..." : "Xác nhận"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

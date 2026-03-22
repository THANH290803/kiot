"use client"

import Link from "next/link"
import { Suspense, useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { api } from "@/lib/api"

function VNPayReturnContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [message, setMessage] = useState("Đang xác thực thanh toán VNPay...")
  const [isSuccess, setIsSuccess] = useState(false)
  const [orderCode, setOrderCode] = useState("")

  useEffect(() => {
    let active = true

    const handleReturn = async () => {
      try {
        const verifyResponse = await api.get("/api/payments/vnpay/verify-return", {
          params: Object.fromEntries(searchParams.entries()),
        })

        if (!active) {
          return
        }

        if (!verifyResponse.data?.success) {
          setIsSuccess(false)
          setMessage(verifyResponse.data?.message || "Thanh toán VNPay chưa thành công.")
          return
        }

        setIsSuccess(true)
        setOrderCode(verifyResponse.data?.order_code || "")
        setMessage("Thanh toán VNPay thành công. Đơn hàng đã được cập nhật.")
        sessionStorage.removeItem("pendingPosReceipt")

        window.setTimeout(() => {
          router.replace("/admin/pos")
        }, 1800)
      } catch (error) {
        console.error("VNPay return handling error:", error)
        if (active) {
          setIsSuccess(false)
          setMessage("Không thể xác thực thanh toán hoặc tạo đơn hàng sau khi thanh toán.")
        }
      }
    }

    void handleReturn()

    return () => {
      active = false
    }
  }, [router, searchParams])

  return (
    <main className="min-h-screen bg-muted/30 px-4 py-10">
      <div className="mx-auto max-w-xl rounded-2xl bg-background p-8 shadow-sm">
        <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">VNPay Return</p>
        <h1 className="mt-3 text-2xl font-semibold">
          {isSuccess ? "Thanh toán thành công" : "Đang xử lý thanh toán"}
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">{message}</p>
        {orderCode ? (
          <div className="mt-6 rounded-xl border bg-muted/20 p-4 text-sm">
            <p>
              Mã đơn hàng: <span className="font-medium">{orderCode}</span>
            </p>
          </div>
        ) : null}
        <div className="mt-6 flex gap-3">
          <Button asChild>
            <Link href="/admin/pos">Quay lại POS</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/admin/orders">Xem đơn hàng</Link>
          </Button>
        </div>
      </div>
    </main>
  )
}

export default function VNPayReturnPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-muted/30 px-4 py-10">
          <div className="mx-auto max-w-xl rounded-2xl bg-background p-8 shadow-sm">
            <p className="text-sm text-muted-foreground">Đang tải kết quả thanh toán...</p>
          </div>
        </main>
      }
    >
      <VNPayReturnContent />
    </Suspense>
  )
}

"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import Link from "next/link"
import { ArrowLeft, Banknote, Calendar, CreditCard, Printer, ShoppingCart, User } from "lucide-react"
import { HeaderNav } from "@/features/admin/components/header-nav"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { api } from "@/lib/api"
import { getOrderStatusClassName, getOrderStatusLabel } from "@/features/admin/hooks/use-orders-page"

interface OrderDetailPageProps {
  params: Promise<{ id: string }>
}

interface OrderDetailResponse {
  id: number
  order_code: string
  total_amount: number
  total_quantity: number
  payment_method: string
  status: string
  note: string | null
  created_at: string
  customer?: {
    name?: string
    email?: string
    phone_number?: string
    address?: string
  } | null
  user?: {
    name?: string
    email?: string
  } | null
  orderItems?: Array<{
    id: number
    quantity: number
    price: number
    total: number
    product?: {
      name?: string
    } | null
    variant?: {
      sku?: string
      color?: {
        name?: string
      } | null
      size?: {
        name?: string
      } | null
      product?: {
        name?: string
      } | null
    } | null
  }>
}

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("vi-VN", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(value))
}

function getPaymentLabel(value: string) {
  const paymentLabels: Record<string, string> = {
    cash: "Tiền mặt",
    bank_transfer: "Chuyển khoản QR",
    momo: "MoMo",
    card: "Thẻ",
  }

  return paymentLabels[value] || value
}

export default function OrderDetailPage({ params }: OrderDetailPageProps) {
  const [orderId, setOrderId] = useState<string>("")
  const [order, setOrder] = useState<OrderDetailResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const printRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let active = true

    const resolveParamsAndFetch = async () => {
      try {
        const resolvedParams = await params
        if (!active) {
          return
        }

        setOrderId(resolvedParams.id)
        setIsLoading(true)
        setError(null)

        const response = await api.get(`/api/orders/${resolvedParams.id}`)

        if (!active) {
          return
        }

        setOrder(response.data)
      } catch (fetchError) {
        console.error("Fetch order detail error:", fetchError)
        if (active) {
          setError("Không tải được chi tiết hóa đơn.")
          setOrder(null)
        }
      } finally {
        if (active) {
          setIsLoading(false)
        }
      }
    }

    void resolveParamsAndFetch()

    return () => {
      active = false
    }
  }, [params])

  const orderItems = useMemo(() => order?.orderItems || [], [order?.orderItems])
  const subtotal = useMemo(() => orderItems.reduce((sum, item) => sum + Number(item.total || item.price * item.quantity || 0), 0), [orderItems])
  const paymentLabel = useMemo(() => getPaymentLabel(order?.payment_method || ""), [order?.payment_method])

  const handlePrint = () => {
    if (!printRef.current) {
      return
    }

    const printWindow = window.open("", "_blank", "width=900,height=700")

    if (!printWindow) {
      return
    }

    printWindow.document.write(`
      <!doctype html>
      <html>
        <head>
          <meta charset="utf-8" />
          <title>In hóa đơn</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 24px; color: #111827; }
            table { width: 100%; border-collapse: collapse; }
            th, td { text-align: left; padding: 8px 0; border-bottom: 1px solid #e5e7eb; }
          </style>
        </head>
        <body>${printRef.current.innerHTML}</body>
      </html>
    `)
    printWindow.document.close()
    printWindow.focus()
    window.setTimeout(() => {
      printWindow.print()
      printWindow.close()
    }, 250)
  }

  return (
    <div className="min-h-screen bg-background">
      <HeaderNav />
      <main className="container mx-auto p-6 space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/admin/orders">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold">Chi tiết hóa đơn {order?.order_code || `#${orderId}`}</h1>
            <p className="text-sm text-muted-foreground">
              Trạng thái:{" "}
              {order ? (
                <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${getOrderStatusClassName(order.status)}`}>
                  {getOrderStatusLabel(order.status)}
                </span>
              ) : (
                "Đang tải"
              )}
            </p>
          </div>
          <Button className="bg-primary" onClick={handlePrint} disabled={!order}>
            <Printer className="mr-2 h-4 w-4" /> In hóa đơn
          </Button>
        </div>

        {isLoading ? (
          <div className="rounded-lg border bg-white px-6 py-10 text-center text-muted-foreground">Đang tải chi tiết hóa đơn...</div>
        ) : error ? (
          <div className="rounded-lg border border-destructive/20 bg-destructive/10 px-6 py-4 text-sm text-destructive">{error}</div>
        ) : !order ? (
          <div className="rounded-lg border bg-white px-6 py-10 text-center text-muted-foreground">Không tìm thấy hóa đơn.</div>
        ) : (
          <div ref={printRef} className="grid gap-6 md:grid-cols-3">
            <div className="space-y-6 md:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <ShoppingCart className="h-5 w-5 text-primary" /> Danh sách mặt hàng
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Sản phẩm</TableHead>
                        <TableHead>Biến thể</TableHead>
                        <TableHead className="text-right">Đơn giá</TableHead>
                        <TableHead className="text-center">SL</TableHead>
                        <TableHead className="text-right">Thành tiền</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {orderItems.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} className="py-8 text-center text-muted-foreground">
                            Hóa đơn chưa có mặt hàng.
                          </TableCell>
                        </TableRow>
                      ) : (
                        orderItems.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell>
                              <div>
                                <p className="font-medium">{item.product?.name || item.variant?.product?.name || "Sản phẩm"}</p>
                                <p className="text-xs font-mono text-muted-foreground">SKU: {item.variant?.sku || "Không có SKU"}</p>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-1">
                                <Badge variant="outline" className="font-normal text-xs">
                                  {item.variant?.color?.name || "Chưa có màu"}
                                </Badge>
                                <Badge variant="outline" className="font-normal text-xs">
                                  {item.variant?.size?.name || "Chưa có size"}
                                </Badge>
                              </div>
                            </TableCell>
                            <TableCell className="text-right">{Number(item.price || 0).toLocaleString("vi-VN")} đ</TableCell>
                            <TableCell className="text-center">{item.quantity}</TableCell>
                            <TableCell className="text-right font-medium">{Number(item.total || 0).toLocaleString("vi-VN")} đ</TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>

                  <div className="mt-6 flex justify-end">
                    <div className="w-full space-y-3 md:w-80">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Tổng tiền hàng:</span>
                        <span className="font-medium">{subtotal.toLocaleString("vi-VN")} đ</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Giảm giá:</span>
                        <span className="font-medium">0 đ</span>
                      </div>
                      <Separator />
                      <div className="flex items-center justify-between rounded-lg bg-primary/5 p-3 text-primary">
                        <span className="text-base font-bold">KHÁCH PHẢI TRẢ:</span>
                        <span className="text-xl font-bold">{Number(order.total_amount || 0).toLocaleString("vi-VN")} đ</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <CreditCard className="h-5 w-5 text-primary" /> Thanh toán
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between rounded-lg bg-muted/50 p-4">
                    <div className="flex items-center gap-3">
                      {paymentLabel === "Tiền mặt" ? (
                        <Banknote className="h-8 w-8 text-emerald-500" />
                      ) : (
                        <CreditCard className="h-8 w-8 text-blue-500" />
                      )}
                      <div>
                        <p className="font-bold">{paymentLabel}</p>
                        <p className="text-xs text-muted-foreground">Trạng thái: {getOrderStatusLabel(order.status)}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg text-emerald-600">{Number(order.total_amount || 0).toLocaleString("vi-VN")} đ</p>
                    </div>
                  </div>
                  {order.note ? (
                    <div className="rounded-lg border bg-muted/20 p-4 text-sm">
                      <p className="mb-1 font-medium">Ghi chú</p>
                      <p className="text-muted-foreground">{order.note}</p>
                    </div>
                  ) : null}
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <User className="h-5 w-5 text-primary" /> Thông tin khách hàng
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-xs font-semibold uppercase text-muted-foreground">Tên khách hàng</p>
                    <p className="font-medium">{order.customer?.name || "Khách lẻ"}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase text-muted-foreground">Số điện thoại</p>
                    <p className="font-medium">{order.customer?.phone_number || "Chưa có số điện thoại"}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase text-muted-foreground">Email</p>
                    <p className="text-sm">{order.customer?.email || "Chưa có email"}</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Calendar className="h-5 w-5 text-primary" /> Thông tin bổ sung
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-xs font-semibold uppercase text-muted-foreground">Thời gian</p>
                    <p className="text-sm">{formatDateTime(order.created_at)}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase text-muted-foreground">Thu ngân</p>
                    <p className="text-sm font-medium">{order.user?.name || "Không rõ"}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase text-muted-foreground">Tổng số lượng</p>
                    <p className="text-sm">{order.total_quantity}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

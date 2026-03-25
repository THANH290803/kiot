"use client"

import { useEffect, useMemo, useState } from "react"
import { api } from "@/lib/api"
import type { OrderApiResponse, OrderView, PaginationState } from "@/features/admin/types/orders-page"

const defaultPagination: PaginationState = {
  total: 0,
  page: 1,
  limit: 10,
  totalPages: 1,
}

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("vi-VN", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(value))
}

function mapPaymentMethod(value: string) {
  const paymentLabels: Record<string, string> = {
    cash: "Tiền mặt",
    bank_transfer: "Chuyển khoản QR",
    momo: "MoMo",
    card: "Thẻ",
  }

  return paymentLabels[value] || value
}

function mapOrder(order: OrderApiResponse): OrderView {
  return {
    id: order.id,
    code: order.order_code,
    time: formatDateTime(order.created_at),
    customer: order.customer?.name || "Khách lẻ",
    total: Number(order.total_amount || 0),
    status: order.status,
    payment: mapPaymentMethod(order.payment_method),
    itemCount: order.orderItems?.length || 0,
  }
}

function extractOrders(payload: unknown): OrderApiResponse[] {
  if (payload && typeof payload === "object" && Array.isArray((payload as { orders?: unknown[] }).orders)) {
    return (payload as { orders: OrderApiResponse[] }).orders
  }

  return []
}

function extractPagination(payload: unknown): PaginationState {
  if (payload && typeof payload === "object") {
    const pagination = (payload as { pagination?: Partial<PaginationState> }).pagination

    if (pagination) {
      return {
        total: pagination.total ?? 0,
        page: pagination.page ?? 1,
        limit: pagination.limit ?? 10,
        totalPages: pagination.totalPages ?? 1,
      }
    }
  }

  return defaultPagination
}

export function getOrderStatusLabel(status: string) {
  const statusLabels: Record<string, string> = {
    pending: "Chờ xác nhận",
    confirmed: "Đã xác nhận",
    shipping: "Đang giao",
    delivered: "Đã giao",
    completed: "Hoàn thành",
    cancelled: "Đã hủy",
  }

  return statusLabels[status] || status
}

export function getOrderStatusClassName(status: string) {
  const statusClassNames: Record<string, string> = {
    pending: "bg-amber-100 text-amber-700",
    confirmed: "bg-sky-100 text-sky-700",
    shipping: "bg-violet-100 text-violet-700",
    delivered: "bg-indigo-100 text-indigo-700",
    completed: "bg-emerald-100 text-emerald-700",
    cancelled: "bg-rose-100 text-rose-700",
  }

  return statusClassNames[status] || "bg-slate-100 text-slate-700"
}

export function getNextOrderStatuses(status: string) {
  switch (status) {
    case "pending":
      return ["confirmed", "cancelled"]
    case "confirmed":
      return ["shipping"]
    case "shipping":
      return ["delivered"]
    case "delivered":
      return ["completed"]
    case "completed":
    case "cancelled":
      return []
    default:
      return []
  }
}

export function useOrdersPage() {
  const [orders, setOrders] = useState<OrderView[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [keyword, setKeyword] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [currentPage, setCurrentPage] = useState(1)
  const [pagination, setPagination] = useState<PaginationState>(defaultPagination)

  useEffect(() => {
    let active = true

    const fetchOrders = async () => {
      try {
        setIsLoading(true)
        setError(null)

        const response = await api.get("/api/orders", {
          params: {
            keyword: keyword || undefined,
            status: selectedStatus !== "all" ? selectedStatus : undefined,
            page: currentPage,
            limit: rowsPerPage,
          },
        })

        if (!active) {
          return
        }

        const rawOrders = extractOrders(response.data)
        setOrders(rawOrders.map(mapOrder))
        setPagination(extractPagination(response.data))
      } catch (fetchError) {
        if (!active) {
          return
        }

        console.error("Fetch orders error:", fetchError)
        setOrders([])
        setPagination(defaultPagination)
        setError("Không tải được danh sách giao dịch. Vui lòng thử lại.")
      } finally {
        if (active) {
          setIsLoading(false)
        }
      }
    }

    fetchOrders()

    return () => {
      active = false
    }
  }, [keyword, selectedStatus, currentPage, rowsPerPage])

  const totalPages = useMemo(
    () => Math.max(1, pagination.totalPages || 1),
    [pagination.totalPages],
  )

  const resetFilters = () => {
    setCurrentPage(1)
    setKeyword("")
    setSelectedStatus("all")
  }

  const updateOrderStatus = async (orderId: number, nextStatus: string) => {
    try {
      setIsUpdatingStatus(true)
      setError(null)

      await api.patch(`/api/orders/${orderId}/status`, {
        status: nextStatus,
      })

      setOrders((currentOrders) =>
        currentOrders.map((order) =>
          order.id === orderId
            ? {
                ...order,
                status: nextStatus,
              }
            : order,
        ),
      )
    } catch (updateError) {
      console.error("Update order status error:", updateError)
      setError("Không cập nhật được trạng thái giao dịch. Vui lòng thử lại.")
    } finally {
      setIsUpdatingStatus(false)
    }
  }

  return {
    orders,
    isLoading,
    isUpdatingStatus,
    error,
    keyword,
    setKeyword,
    selectedStatus,
    setSelectedStatus,
    rowsPerPage,
    setRowsPerPage,
    currentPage,
    setCurrentPage,
    pagination,
    totalPages,
    resetFilters,
    updateOrderStatus,
  }
}

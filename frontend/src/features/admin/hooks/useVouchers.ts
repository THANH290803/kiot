import { useCallback, useEffect, useState } from "react"
import api from "@/lib/api"

export interface Voucher {
  id: number
  code: string
  description: string | null
  discount_type: "percent" | "fixed"
  discount_value: number
  max_use: number
  used_count: number
  status: "active" | "inactive"
  start_date: string
  end_date: string
}

interface VoucherListResponse {
  vouchers: Voucher[]
  pagination: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}

interface FetchVoucherParams {
  keyword?: string
  status?: string
  page: number
  limit: number
}

interface VoucherPayload {
  code: string
  description?: string
  discount_type: "percent" | "fixed"
  discount_value: number
  max_use: number
  status?: "active" | "inactive"
  start_date: string
  end_date: string
}

export function useVouchers(params: FetchVoucherParams) {
  const [vouchers, setVouchers] = useState<Voucher[]>([])
  const [loading, setLoading] = useState(false)
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: params.limit,
    totalPages: 1,
  })

  const fetchVouchers = useCallback(async () => {
    try {
      setLoading(true)
      const response = await api.get<VoucherListResponse>("/api/vouchers", {
        params: {
          keyword: params.keyword || undefined,
          status: params.status && params.status !== "all" ? params.status : undefined,
          page: params.page,
          limit: params.limit,
        },
      })

      setVouchers(response.data.vouchers || [])
      setPagination(response.data.pagination || {
        total: 0,
        page: params.page,
        limit: params.limit,
        totalPages: 1,
      })
    } catch (error) {
      console.error("Fetch vouchers error:", error)
      setVouchers([])
      setPagination({
        total: 0,
        page: params.page,
        limit: params.limit,
        totalPages: 1,
      })
    } finally {
      setLoading(false)
    }
  }, [params.keyword, params.limit, params.page, params.status])

  useEffect(() => {
    fetchVouchers()
  }, [fetchVouchers])

  const createVoucher = async (payload: VoucherPayload) => {
    await api.post("/api/vouchers", payload)
    await fetchVouchers()
  }

  const updateVoucher = async (id: number, payload: Partial<VoucherPayload>) => {
    await api.patch(`/api/vouchers/${id}`, payload)
    await fetchVouchers()
  }

  const deleteVoucher = async (id: number) => {
    await api.delete(`/api/vouchers/${id}`)
    await fetchVouchers()
  }

  return {
    vouchers,
    loading,
    pagination,
    fetchVouchers,
    createVoucher,
    updateVoucher,
    deleteVoucher,
  }
}

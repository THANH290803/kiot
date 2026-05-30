import { useCallback, useState } from "react"
import api from "@/lib/api"
import type { Voucher } from "@/features/admin/hooks/useVouchers"

export interface CustomerVoucherRecord {
  id: number
  customer_id: number
  voucher_id: number
  status: "available" | "used" | "expired"
  expired_at?: string | null
  voucher?: Voucher
}

export function useCustomerVouchers() {
  const [loading, setLoading] = useState(false)

  const fetchAssignments = useCallback(async (params?: Record<string, unknown>) => {
    setLoading(true)
    try {
      const response = await api.get("/api/customer-vouchers", {
        params,
      })

      return response.data.customer_vouchers ?? []
    } finally {
      setLoading(false)
    }
  }, [])

  const assignVoucher = useCallback(async (voucherId: number, customerId: number, expiredAt?: string) => {
    await api.post("/api/customer-vouchers", {
      voucher_id: voucherId,
      customer_id: customerId,
      expired_at: expiredAt || undefined,
    })
  }, [])

  const assignVoucherBulk = useCallback(
    async (voucherIds: number[], customerIds: number[], expiredAt?: string) => {
      for (const voucherId of voucherIds) {
        for (const customerId of customerIds) {
          await assignVoucher(voucherId, customerId, expiredAt)
        }
      }
    },
    [assignVoucher]
  )

  const buildCustomerVoucherCounts = useCallback((assignments: CustomerVoucherRecord[]) => {
    return assignments.reduce<Record<number, number>>((accumulator, assignment) => {
      accumulator[assignment.customer_id] = (accumulator[assignment.customer_id] || 0) + 1
      return accumulator
    }, {})
  }, [])

  return {
    loading,
    fetchAssignments,
    assignVoucher,
    assignVoucherBulk,
    buildCustomerVoucherCounts,
  }
}

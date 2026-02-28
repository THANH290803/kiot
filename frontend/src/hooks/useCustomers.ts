"use client"

import { useEffect, useState } from "react"
import api from "@/lib/api"

/* ================= TYPE ================= */
export type Customer = {
    id: number
    name: string
    email: string
    phone_number: string
    address: string
    total_spending: number
    created_at: string
}

/* ================= HOOK ================= */
export function useCustomers() {
    const [customers, setCustomers] = useState<Customer[]>([])
    const [keyword, setKeyword] = useState("")
    const [page, setPage] = useState(1)
    const [limit, setLimit] = useState(10)
    const [totalPages, setTotalPages] = useState(1)
    const [total, setTotal] = useState(0)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        let ignore = false

        const fetchCustomers = async () => {
            try {
                setLoading(true)

                const res = await api.get("/api/customers", {
                    params: {
                        keyword: keyword || undefined,
                        page,
                        limit,
                    },
                })

                if (ignore) return

                setCustomers(res.data.customers ?? [])
                setTotalPages(res.data.pagination?.totalPages ?? 1)
                setTotal(res.data.pagination?.total ?? 0)
            } catch (err) {
                if (!ignore) {
                    setCustomers([])
                    setTotalPages(1)
                    setTotal(0)
                }
            } finally {
                if (!ignore) setLoading(false)
            }
        }

        fetchCustomers()

        return () => {
            ignore = true
        }
    }, [keyword, page, limit])

    return {
        customers,
        keyword,
        setKeyword,
        page,
        setPage,
        limit,
        setLimit,
        totalPages,
        total,
        loading,
    }
}
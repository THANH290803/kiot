import { useEffect, useState, useCallback } from "react"
import api from "@/lib/api"

export interface Size {
  id: number
  name: string
  description?: string
}

export function useSizes() {
  const [sizes, setSizes] = useState<Size[]>([])
  const [loading, setLoading] = useState(false)

  const [page, setPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  const fetchSizes = useCallback(async () => {
    try {
      setLoading(true)
      const res = await api.get("/api/sizes")
      setSizes(res.data.data ?? res.data)
    } catch (err) {
      console.error("Fetch sizes error:", err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchSizes()
  }, [fetchSizes])

  const totalPages = Math.ceil(sizes.length / rowsPerPage)
  const startIndex = (page - 1) * rowsPerPage
  const paginatedSizes = sizes.slice(startIndex, startIndex + rowsPerPage)

  /* ===== CRUD ===== */
  const createSize = async (payload: { name: string; description?: string }) => {
    await api.post("/api/sizes", payload)
    fetchSizes()
  }

  const updateSize = async (id: number, payload: { name: string; description?: string }) => {
    await api.patch(`/api/sizes/${id}`, payload)
    fetchSizes()
  }

  const deleteSize = async (id: number) => {
    await api.delete(`/api/sizes/${id}`)
    fetchSizes()
  }

  return {
    sizes,
    paginatedSizes,
    loading,

    page,
    setPage,
    rowsPerPage,
    setRowsPerPage,
    totalPages,

    createSize,
    updateSize,
    deleteSize,
  }
}

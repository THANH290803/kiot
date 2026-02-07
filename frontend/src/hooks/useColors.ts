import { useEffect, useState, useCallback } from "react"
import api from "@/lib/api"

export interface Color {
  id: number
  name: string
  code: string
}

export function useColors() {
  const [colors, setColors] = useState<Color[]>([])
  const [loading, setLoading] = useState(false)

  const [page, setPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  const fetchColors = useCallback(async () => {
    try {
      setLoading(true)
      const res = await api.get("/api/colors")
      setColors(res.data.data ?? res.data)
    } catch (err) {
      console.error("Fetch colors error:", err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchColors()
  }, [fetchColors])

  const totalItems = colors.length
  const totalPages = Math.ceil(totalItems / rowsPerPage)

  const startIndex = (page - 1) * rowsPerPage
  const paginatedColors = colors.slice(startIndex, startIndex + rowsPerPage)

  /* ===== CRUD ===== */
  const createColor = async (payload: { name: string; code: string }) => {
    await api.post("/api/colors", payload)
    fetchColors()
  }

  const updateColor = async (id: number, payload: { name: string; code: string }) => {
    await api.patch(`/api/colors/${id}`, payload)
    fetchColors()
  }

  const deleteColor = async (id: number) => {
    await api.delete(`/api/colors/${id}`)
    fetchColors()
  }

  return {
    paginatedColors,
    totalItems,
    totalPages,
    page,
    setPage,
    rowsPerPage,
    setRowsPerPage,

    createColor,
    updateColor,
    deleteColor,
  }
}

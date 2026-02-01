import { useState, useEffect, useCallback } from "react"
import api from "@/lib/api"

export function useBrands() {
  const [brands, setBrands] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  const [search, setSearch] = useState("")
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [currentPage, setCurrentPage] = useState(1)

  const [editingBrand, setEditingBrand] = useState<any>(null)
  const [deletingBrand, setDeletingBrand] = useState<any>(null)

  const [newName, setNewName] = useState("")
  const [newDescription, setNewDescription] = useState("")

  const [editName, setEditName] = useState("")
  const [editDescription, setEditDescription] = useState("")

  // ===== Fetch =====
  const fetchBrands = useCallback(async () => {
    try {
      setLoading(true)
      const res = await api.get("/api/brands")
      setBrands(res.data.data ?? res.data)
    } catch (err) {
      console.error("Fetch brands error:", err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchBrands()
  }, [fetchBrands])

  // ===== Filter + Pagination =====
  const filteredBrands = brands.filter((b) =>
    b.name.toLowerCase().includes(search.toLowerCase())
  )

  const totalItems = filteredBrands.length

  const totalPages = Math.ceil(filteredBrands.length / rowsPerPage)
  const startIndex = (currentPage - 1) * rowsPerPage
  const paginatedBrands = filteredBrands.slice(
    startIndex,
    startIndex + rowsPerPage
  )

  // ===== Create =====
  const createBrand = async () => {
    if (!newName.trim()) return

    try {
      setLoading(true)
      await api.post("/api/brands", {
        name: newName,
        description: newDescription || null,
      })
      setNewName("")
      setNewDescription("")
      fetchBrands()
    } finally {
      setLoading(false)
    }
  }

  // ===== Update =====
  const updateBrand = async () => {
    if (!editingBrand || !editName.trim()) return

    try {
      setLoading(true)
      await api.patch(`/api/brands/${editingBrand.id}`, {
        name: editName,
        description: editDescription || null,
      })
      setEditingBrand(null)
      fetchBrands()
    } finally {
      setLoading(false)
    }
  }

  // ===== Delete =====
  const deleteBrand = async () => {
    if (!deletingBrand) return

    try {
      setLoading(true)
      await api.delete(`/api/brands/${deletingBrand.id}`)

      if ((currentPage - 1) * rowsPerPage >= filteredBrands.length - 1) {
        setCurrentPage((p) => Math.max(1, p - 1))
      }

      setDeletingBrand(null)
      fetchBrands()
    } finally {
      setLoading(false)
    }
  }

  return {
    brands,
    paginatedBrands,
    loading,

    search,
    setSearch,

    rowsPerPage,
    setRowsPerPage,
    currentPage,
    setCurrentPage,
    totalPages,
    totalItems,

    newName,
    setNewName,
    newDescription,
    setNewDescription,
    createBrand,

    editingBrand,
    setEditingBrand,
    editName,
    setEditName,
    editDescription,
    setEditDescription,
    updateBrand,

    deletingBrand,
    setDeletingBrand,
    deleteBrand,
  }
}

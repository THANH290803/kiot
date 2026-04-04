import { useState, useEffect, useCallback } from "react"
import api from "@/lib/api"

export function useCategories() {
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  const [search, setSearch] = useState("")
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [currentPage, setCurrentPage] = useState(1)

  const [editingCategory, setEditingCategory] = useState<any>(null)
  const [deletingCategory, setDeletingCategory] = useState<any>(null)

  const [newName, setNewName] = useState("")
  const [newDescription, setNewDescription] = useState("")

  const [editName, setEditName] = useState("")
  const [editDescription, setEditDescription] = useState("")

  // ===== Fetch =====
  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true)
      const res = await api.get("/api/categories")
      setCategories(res.data.data ?? res.data)
    } catch (err) {
      console.error("Fetch categories error:", err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchCategories()
  }, [fetchCategories])

  // ===== Filter + Pagination =====
  const filteredCategories = categories.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  )

  const totalPages = Math.ceil(filteredCategories.length / rowsPerPage)

  const startIndex = (currentPage - 1) * rowsPerPage
  const paginatedCategories = filteredCategories.slice(
    startIndex,
    startIndex + rowsPerPage
  )

  // ===== Create =====
  const createCategory = async () => {
    if (!newName.trim()) return

    try {
      setLoading(true)
      await api.post("/api/categories", {
        name: newName,
        description: newDescription || null,
      })

      setNewName("")
      setNewDescription("")
      fetchCategories()
    } catch (err) {
      console.error("Create category error:", err)
    } finally {
      setLoading(false)
    }
  }

  // ===== Update =====
  const updateCategory = async () => {
    if (!editingCategory || !editName.trim()) return

    try {
      setLoading(true)
      await api.patch(`/api/categories/${editingCategory.id}`, {
        name: editName,
        description: editDescription || null,
      })

      setEditingCategory(null)
      setEditName("")
      setEditDescription("")
      fetchCategories()
    } catch (err) {
      console.error("Update category error:", err)
    } finally {
      setLoading(false)
    }
  }

  // ===== Delete =====
  const deleteCategory = async () => {
    if (!deletingCategory) return

    try {
      setLoading(true)
      await api.delete(`/api/categories/${deletingCategory.id}`)

      // nếu trang hiện tại rỗng thì lùi lại
      if ((currentPage - 1) * rowsPerPage >= filteredCategories.length - 1) {
        setCurrentPage((p) => Math.max(1, p - 1))
      }

      setDeletingCategory(null)
      fetchCategories()
    } catch (err) {
      console.error("Delete category error:", err)
    } finally {
      setLoading(false)
    }
  }

  return {
    // data
    categories,
    paginatedCategories,
    filteredCategories,
    loading,

    // pagination
    rowsPerPage,
    setRowsPerPage,
    currentPage,
    setCurrentPage,
    totalPages,

    // search
    search,
    setSearch,

    // create
    newName,
    setNewName,
    newDescription,
    setNewDescription,
    createCategory,

    // edit
    editingCategory,
    setEditingCategory,
    editName,
    setEditName,
    editDescription,
    setEditDescription,
    updateCategory,

    // delete
    deletingCategory,
    setDeletingCategory,
    deleteCategory,
  }
}

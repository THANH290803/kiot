import { useState, useEffect, useCallback, useMemo } from "react"
import api from "@/lib/api"

export type CategoryItem = {
  id: number
  name: string
  description?: string | null
  parent_id?: number | null
  parent?: {
    id?: number
    name?: string | null
  } | null
  parentName?: string
}

export function useCategories() {
  const [categories, setCategories] = useState<CategoryItem[]>([])
  const [loading, setLoading] = useState(false)

  const [search, setSearch] = useState("")
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [currentPage, setCurrentPage] = useState(1)

  const [editingCategory, setEditingCategory] = useState<CategoryItem | null>(null)
  const [deletingCategory, setDeletingCategory] = useState<CategoryItem | null>(null)

  const [newName, setNewName] = useState("")
  const [newDescription, setNewDescription] = useState("")
  const [newParentId, setNewParentId] = useState("none")

  const [editName, setEditName] = useState("")
  const [editDescription, setEditDescription] = useState("")
  const [editParentId, setEditParentId] = useState("none")

  const resetCreateCategoryForm = useCallback(() => {
    setNewName("")
    setNewDescription("")
    setNewParentId("none")
  }, [])

  const resetEditCategoryForm = useCallback(() => {
    setEditingCategory(null)
    setEditName("")
    setEditDescription("")
    setEditParentId("none")
  }, [])

  const resetDeleteCategoryState = useCallback(() => {
    setDeletingCategory(null)
  }, [])

  // ===== Fetch =====
  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true)
      const res = await api.get("/api/categories")
      const nextCategories = res.data.data ?? res.data
      setCategories(Array.isArray(nextCategories) ? nextCategories : [])
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
  const categoryById = useMemo(
    () => new Map(categories.map((category) => [String(category.id), category])),
    [categories],
  )

  const categoriesWithParent = useMemo(
    () =>
      categories.map((category) => ({
        ...category,
        parentName:
          category.parent?.name ||
          (category.parent_id ? categoryById.get(String(category.parent_id))?.name : "") ||
          "",
      })),
    [categories, categoryById],
  )

  const parentOptions = categoriesWithParent
  const filteredCategories = categoriesWithParent.filter((c) =>
    `${c.name} ${c.description || ""} ${c.parentName}`.toLowerCase().includes(search.toLowerCase())
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
        parent_id: newParentId === "none" ? null : Number(newParentId),
      })

      resetCreateCategoryForm()
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
        parent_id: editParentId === "none" ? null : Number(editParentId),
      })

      resetEditCategoryForm()
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

      resetDeleteCategoryState()
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
    parentOptions,
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
    newParentId,
    setNewParentId,
    createCategory,
    resetCreateCategoryForm,

    // edit
    editingCategory,
    setEditingCategory,
    editName,
    setEditName,
    editDescription,
    setEditDescription,
    editParentId,
    setEditParentId,
    updateCategory,
    resetEditCategoryForm,

    // delete
    deletingCategory,
    setDeletingCategory,
    deleteCategory,
    resetDeleteCategoryState,
  }
}

"use client"

import { useEffect, useState } from "react"
import { api } from "@/lib/api"
import type {
  ApiProduct,
  EntityOption,
  PaginationState,
  ProductVariantView,
  ProductView,
} from "@/features/admin/types/products-page"

const defaultPagination: PaginationState = {
  total: 0,
  page: 1,
  limit: 10,
  total_pages: 1,
}

function mapStatus(status: number, totalStock: number): ProductView["status"] {
  if (status === 2) {
    return "out_of_stock"
  }

  if (status === 1) {
    return "active"
  }

  return totalStock > 0 ? "active" : "inactive"
}

function mapProduct(product: ApiProduct): ProductView {
  const variantsWithSortedImages = product.variants.map((variant) => ({
    ...variant,
    images: [...(variant.images || [])].sort((left, right) => {
      if (left.is_primary !== right.is_primary) {
        return left.is_primary ? -1 : 1
      }

      return left.sort_order - right.sort_order
    }),
  }))

  const variants = variantsWithSortedImages.map((variant) => ({
    id: variant.id,
    sku: variant.sku,
    color: variant.color?.name || "Chưa có màu",
    size: variant.size?.name || "Chưa có size",
    stock: variant.quantity,
    price: variant.price,
    variantAvatar: variant.images?.find((image) => image.is_primary)?.url || variant.images?.[0]?.url,
    variantImages: (variant.images || []).map((image) => ({
      id: image.id,
      url: image.url,
      variantId: variant.id,
      color: variant.color?.name || null,
      isAvatar: image.is_primary,
    })),
  }))

  const images = variantsWithSortedImages.flatMap((variant) =>
    (variant.images || []).map((image) => ({
      id: image.id,
      url: image.url,
      variantId: variant.id,
      color: variant.color?.name || null,
      isAvatar: image.is_primary,
    })),
  )

  const totalStock = variants.reduce((sum, variant) => sum + variant.stock, 0)
  const sortedPrices = variants.map((variant) => variant.price).sort((a, b) => a - b)

  return {
    id: product.id,
    code: variants[0]?.sku || `PRD-${product.id}`,
    name: product.name,
    category: product.category?.name || "Chưa phân loại",
    brand: product.brand?.name || "Chưa có thương hiệu",
    basePrice: sortedPrices[0] || 0,
    totalStock,
    status: mapStatus(product.status, totalStock),
    description: product.description,
    avatar: product.avatar || null,
    images,
    variants,
  }
}

function extractCollection<T>(payload: unknown): T[] {
  if (Array.isArray(payload)) {
    return payload as T[]
  }

  if (payload && typeof payload === "object") {
    const record = payload as Record<string, unknown>

    if (Array.isArray(record.data)) {
      return record.data as T[]
    }

    if (Array.isArray(record.items)) {
      return record.items as T[]
    }

    if (Array.isArray(record.products)) {
      return record.products as T[]
    }
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
        total_pages: pagination.total_pages ?? 1,
      }
    }
  }

  return defaultPagination
}

export function useProductsPage() {
  const [products, setProducts] = useState<ProductView[]>([])
  const [categories, setCategories] = useState<EntityOption[]>([])
  const [brands, setBrands] = useState<EntityOption[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [searchName, setSearchName] = useState("")
  const [selectedCategoryId, setSelectedCategoryId] = useState("all")
  const [selectedBrandId, setSelectedBrandId] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<ProductView | null>(null)
  const [deletingProductId, setDeletingProductId] = useState<number | null>(null)
  const [expandedRows, setExpandedRows] = useState<number[]>([])
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [currentPage, setCurrentPage] = useState(1)
  const [zoomImage, setZoomImage] = useState<string | null>(null)
  const [pagination, setPagination] = useState<PaginationState>(defaultPagination)
  const [refreshToken, setRefreshToken] = useState(0)
  const [isExporting, setIsExporting] = useState(false)

  useEffect(() => {
    let active = true

    const fetchFilterOptions = async () => {
      try {
        const [categoryResponse, brandResponse] = await Promise.all([api.get("/api/categories"), api.get("/api/brands")])

        if (!active) {
          return
        }

        setCategories(extractCollection<EntityOption>(categoryResponse.data))
        setBrands(extractCollection<EntityOption>(brandResponse.data))
      } catch (fetchError) {
        console.error("Load product filters error:", fetchError)
      }
    }

    fetchFilterOptions()

    return () => {
      active = false
    }
  }, [])

  useEffect(() => {
    let active = true

    const fetchProducts = async () => {
      try {
        setIsLoading(true)
        setError(null)

        const response = await api.get("/api/products/get-all-with-variants", {
          params: {
            page: currentPage,
            limit: rowsPerPage,
            name: searchName || undefined,
            category_id: selectedCategoryId !== "all" ? Number(selectedCategoryId) : undefined,
            brand_id: selectedBrandId !== "all" ? Number(selectedBrandId) : undefined,
            status: selectedStatus !== "all" ? Number(selectedStatus) : undefined,
          },
        })

        if (!active) {
          return
        }

        const rawProducts = extractCollection<ApiProduct>(response.data)
        setProducts(rawProducts.map(mapProduct))
        setPagination(extractPagination(response.data))
      } catch (fetchError) {
        if (!active) {
          return
        }

        console.error("Fetch products error:", fetchError)
        setProducts([])
        setPagination(defaultPagination)
        setError("Không tải được danh sách hàng hóa. Vui lòng thử lại.")
      } finally {
        if (active) {
          setIsLoading(false)
        }
      }
    }

    fetchProducts()

    return () => {
      active = false
    }
  }, [currentPage, rowsPerPage, searchName, selectedCategoryId, selectedBrandId, selectedStatus, refreshToken])

  const handleEditProduct = (product: ProductView) => {
    setEditingProduct(product)
    setIsDialogOpen(true)
  }

  const handleRequestDeleteProduct = (productId: number) => {
    setDeletingProductId(productId)
    setIsDeleteDialogOpen(true)
  }

  const handleDelete = async (id: number) => {
    await api.delete(`/api/products/${id}`)

    setProducts((prevProducts) => prevProducts.filter((product) => product.id !== id))
    setIsDeleteDialogOpen(false)
    setDeletingProductId(null)
  }

  const handleSaveProduct = (productData?: Partial<ProductView>) => {
    if (!productData) {
      setRefreshToken((prev) => prev + 1)
      setEditingProduct(null)
      setIsDialogOpen(false)
      return
    }

    if (editingProduct) {
      setProducts((prevProducts) =>
        prevProducts.map((product) => (product.id === editingProduct.id ? { ...product, ...productData } : product)),
      )
    } else {
      const nextId = Math.max(0, ...products.map((product) => product.id)) + 1

      setProducts((prevProducts) => [
        {
          id: nextId,
          code: productData.code || `PRD-${nextId}`,
          name: productData.name || "Sản phẩm mới",
          category: productData.category || "Chưa phân loại",
          brand: productData.brand || "Chưa có thương hiệu",
          basePrice: productData.basePrice || 0,
          totalStock: productData.totalStock || 0,
          status: productData.status || "inactive",
          description: productData.description || null,
          images: productData.images || [],
          variants: productData.variants || [],
        },
        ...prevProducts,
      ])
    }

    setEditingProduct(null)
    setIsDialogOpen(false)
  }

  const toggleRow = (id: number) => {
    setExpandedRows((prevRows) => (prevRows.includes(id) ? prevRows.filter((rowId) => rowId !== id) : [...prevRows, id]))
  }

  const handleVariantEdit = (variant: ProductVariantView) => {
    const parentProduct = products.find((product) => product.variants.some((item) => item.id === variant.id))
    if (!parentProduct) {
      return
    }

    setEditingProduct({
      ...parentProduct,
      editingVariantId: variant.id,
    })
    setIsDialogOpen(true)
  }

  const handleVariantDelete = async (variant: ProductVariantView) => {
    await api.delete(`/api/product-variants/${variant.id}`)

    setProducts((prevProducts) =>
      prevProducts.map((product) => {
        const nextVariants = product.variants.filter((item) => item.id !== variant.id)
        const nextImages = product.images.filter((image) => image.variantId !== variant.id)
        const nextStock = nextVariants.reduce((sum, item) => sum + item.stock, 0)

        return product.variants.some((item) => item.id === variant.id)
          ? {
              ...product,
              variants: nextVariants,
              images: nextImages,
              totalStock: nextStock,
              status: product.status === "inactive" ? "inactive" : nextStock > 0 ? "active" : "out_of_stock",
            }
          : product
      }),
    )
  }

  const handleChangeProductStatus = async (productId: number, nextStatus: ProductView["status"]) => {
    const statusMap: Record<ProductView["status"], number> = {
      active: 1,
      out_of_stock: 2,
      inactive: 0,
    }

    await api.patch(`/api/products/${productId}/status`, {
      status: statusMap[nextStatus],
    })

    setProducts((currentProducts) =>
      currentProducts.map((product) =>
        product.id === productId
          ? {
              ...product,
              status: nextStatus,
            }
          : product,
      ),
    )
  }

  const resetFilters = () => {
    setCurrentPage(1)
    setSearchName("")
    setSelectedCategoryId("all")
    setSelectedBrandId("all")
    setSelectedStatus("all")
  }

  const handleExportProducts = async () => {
    try {
      setIsExporting(true)

      const response = await api.get("/api/products/export/excel", {
        params: {
          name: searchName || undefined,
          category_id: selectedCategoryId !== "all" ? Number(selectedCategoryId) : undefined,
          brand_id: selectedBrandId !== "all" ? Number(selectedBrandId) : undefined,
          status: selectedStatus !== "all" ? Number(selectedStatus) : undefined,
        },
        responseType: "blob",
      })

      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement("a")

      link.href = url
      link.download = "danh_sach_hang_hoa.xlsx"
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
    } finally {
      setIsExporting(false)
    }
  }

  const totalPages = Math.max(1, pagination.total_pages || 1)

  return {
    products,
    categories,
    brands,
    isLoading,
    error,
    searchName,
    setSearchName,
    selectedCategoryId,
    setSelectedCategoryId,
    selectedBrandId,
    setSelectedBrandId,
    selectedStatus,
    setSelectedStatus,
    isDialogOpen,
    setIsDialogOpen,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    editingProduct,
    setEditingProduct,
    deletingProductId,
    expandedRows,
    rowsPerPage,
    setRowsPerPage,
    currentPage,
    setCurrentPage,
    zoomImage,
    setZoomImage,
    pagination,
    totalPages,
    isExporting,
    handleEditProduct,
    handleRequestDeleteProduct,
    handleDelete,
    handleSaveProduct,
    handleChangeProductStatus,
    toggleRow,
    handleVariantEdit,
    handleVariantDelete,
    resetFilters,
    handleExportProducts,
  }
}

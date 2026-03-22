"use client"

import { useEffect, useMemo, useState } from "react"
import { api } from "@/lib/api"
import type {
  ColorOption,
  CreateFormState,
  CreateVariantForm,
  DraftVariantState,
  EditFormState,
  EditableVariant,
  EntityOption,
  ProductDialogData,
} from "@/features/admin/types/product-form-dialog"
import type { SizeOption } from "@/features/admin/types/product-form-dialog"

const defaultCreateForm: CreateFormState = {
  name: "",
  description: "",
  categoryId: "",
  brandId: "",
}

const defaultDraftVariant: DraftVariantState = {
  colorId: "",
  sizeId: "",
  price: "",
  quantity: "",
}

const defaultEditForm: EditFormState = {
  name: "",
  category: "",
  brand: "",
  status: "active",
  description: "",
  avatar: "",
  avatarPayload: null,
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
  }

  return []
}

function createLocalId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

async function fileToDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result || ""))
    reader.onerror = () => reject(new Error("Không đọc được file ảnh"))
    reader.readAsDataURL(file)
  })
}

function buildEditableVariants(product: ProductDialogData | null | undefined): EditableVariant[] {
  if (!product) {
    return []
  }

  return product.variants.map((variant) => {
    const variantImages = product.images.filter((image) => image.color === variant.color).map((image) => image.url)
    const variantAvatar =
      variant.variantAvatar ||
      product.images.find((image) => image.color === variant.color && image.isAvatar)?.url ||
      variantImages[0]

    return {
      ...variant,
      variantAvatar,
      variantImages,
      variantImageFiles: [],
    }
  })
}

function updateEditableVariant(
  variants: EditableVariant[],
  variantId: number,
  updater: (variant: EditableVariant) => EditableVariant,
) {
  return variants.map((variant) => (variant.id === variantId ? updater(variant) : variant))
}

interface UseProductFormDialogParams {
  open: boolean
  product?: ProductDialogData | null
  categories: EntityOption[]
  brands: EntityOption[]
  onOpenChange: (open: boolean) => void
  onSave: (productData?: Partial<ProductDialogData>) => void | Promise<void>
}

export function useProductFormDialog({
  open,
  product,
  categories,
  brands,
  onOpenChange,
  onSave,
}: UseProductFormDialogParams) {
  const [colors, setColors] = useState<ColorOption[]>([])
  const [sizes, setSizes] = useState<SizeOption[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [createForm, setCreateForm] = useState(defaultCreateForm)
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [avatarPreview, setAvatarPreview] = useState("")
  const [createVariants, setCreateVariants] = useState<CreateVariantForm[]>([])
  const [draftVariant, setDraftVariant] = useState(defaultDraftVariant)
  const [editForm, setEditForm] = useState(defaultEditForm)
  const [editableVariants, setEditableVariants] = useState<EditableVariant[]>([])
  const [selectedVariantId, setSelectedVariantId] = useState<number | null>(null)
  const [zoomImage, setZoomImage] = useState<string | null>(null)

  const isEditing = Boolean(product)
  const isEditingVariant = product?.editingVariantId !== undefined
  const isSelectingVariantForImages = product?.selectedVariantForImages !== undefined
  const isEditingMainProduct = isEditing && !isEditingVariant && !isSelectingVariantForImages

  useEffect(() => {
    if (!open) {
      return
    }

    let active = true

    const loadOptions = async () => {
      try {
        const [colorsResponse, sizesResponse] = await Promise.all([api.get("/api/colors"), api.get("/api/sizes")])

        if (!active) {
          return
        }

        setColors(extractCollection<ColorOption>(colorsResponse.data))
        setSizes(extractCollection<SizeOption>(sizesResponse.data))
      } catch (error) {
        if (active) {
          console.error("Load product form options error:", error)
        }
      }
    }

    loadOptions()

    return () => {
      active = false
    }
  }, [open])

  useEffect(() => {
    if (!open) {
      return
    }

    setSubmitError(null)

    if (product) {
      setEditableVariants(buildEditableVariants(product))
      setSelectedVariantId(product.editingVariantId ?? product.selectedVariantForImages ?? null)
      setEditForm({
        name: product.name || "",
        category: product.category || "",
        brand: product.brand || "",
        status: product.status || "active",
        description: product.description || "",
        avatar: product.avatar || product.images.find((image) => image.isAvatar)?.url || product.images[0]?.url || "",
        avatarPayload: null,
      })
      return
    }

    setCreateForm({
      name: "",
      description: "",
      categoryId: categories[0] ? String(categories[0].id) : "",
      brandId: brands[0] ? String(brands[0].id) : "",
    })
    setAvatarFile(null)
    setAvatarPreview("")
    setCreateVariants([])
    setDraftVariant(defaultDraftVariant)
    setEditForm(defaultEditForm)
    setEditableVariants([])
    setSelectedVariantId(null)
  }, [open, product, categories, brands])

  const createVariantSummary = useMemo(
    () =>
      createVariants.map((variant) => ({
        ...variant,
        colorName: colors.find((item) => item.id === variant.colorId)?.name || `Màu #${variant.colorId}`,
        sizeName: sizes.find((item) => item.id === variant.sizeId)?.name || `Size #${variant.sizeId}`,
      })),
    [createVariants, colors, sizes],
  )

  const editingVariant = useMemo(
    () =>
      isEditingVariant || isSelectingVariantForImages
        ? editableVariants.find((variant) => variant.id === selectedVariantId) || null
        : null,
    [editableVariants, isEditingVariant, isSelectingVariantForImages, selectedVariantId],
  )

  const handleClose = () => {
    if (!isSubmitting) {
      onOpenChange(false)
    }
  }

  const handleAvatarChange = async (file: File | null) => {
    if (!file) {
      return
    }

    const previewUrl = URL.createObjectURL(file)

    if (isEditing) {
      const payload = await fileToDataUrl(file)
      setEditForm((current) => ({ ...current, avatar: previewUrl, avatarPayload: payload }))
      return
    }

    setAvatarFile(file)
    setAvatarPreview(previewUrl)
  }

  const clearAvatar = () => {
    if (isEditing) {
      setEditForm((current) => ({ ...current, avatar: "", avatarPayload: null }))
      return
    }

    setAvatarFile(null)
    setAvatarPreview("")
  }

  const handleAddCreateVariant = () => {
    if (!draftVariant.colorId || !draftVariant.sizeId || !draftVariant.price || !draftVariant.quantity) {
      return
    }

    const colorId = Number(draftVariant.colorId)
    const sizeId = Number(draftVariant.sizeId)
    const exists = createVariants.some((variant) => variant.colorId === colorId && variant.sizeId === sizeId)

    if (exists) {
      setSubmitError("Biến thể màu và kích thước này đã tồn tại.")
      return
    }

    setSubmitError(null)
    setCreateVariants((currentVariants) => [
      ...currentVariants,
      {
        localId: createLocalId(),
        colorId,
        sizeId,
        price: draftVariant.price,
        quantity: draftVariant.quantity,
        images: [],
        previewUrls: [],
      },
    ])
    setDraftVariant(defaultDraftVariant)
  }

  const handleCreateVariantImagesChange = (localId: string, files: FileList | null) => {
    if (!files?.length) {
      return
    }

    const nextFiles = Array.from(files)
    const nextPreviews = nextFiles.map((file) => URL.createObjectURL(file))

    setCreateVariants((currentVariants) =>
      currentVariants.map((variant) =>
        variant.localId === localId
          ? {
              ...variant,
              images: [...variant.images, ...nextFiles],
              previewUrls: [...variant.previewUrls, ...nextPreviews],
            }
          : variant,
      ),
    )
  }

  const handleRemoveCreateVariant = (localId: string) => {
    setCreateVariants((currentVariants) => currentVariants.filter((variant) => variant.localId !== localId))
  }

  const handleRemoveCreateVariantImage = (localId: string, index: number) => {
    setCreateVariants((currentVariants) =>
      currentVariants.map((variant) =>
        variant.localId === localId
          ? {
              ...variant,
              images: variant.images.filter((_, imageIndex) => imageIndex !== index),
              previewUrls: variant.previewUrls.filter((_, imageIndex) => imageIndex !== index),
            }
          : variant,
      ),
    )
  }

  const handleEditVariantImagesChange = (variantId: number, files: FileList | null) => {
    if (!files?.length) {
      return
    }

    const nextFiles = Array.from(files)
    const nextImages = nextFiles.map((file) => URL.createObjectURL(file))

    setEditableVariants((currentVariants) =>
      currentVariants.map((variant) =>
        variant.id === variantId
          ? {
              ...variant,
              variantImages: [...(variant.variantImages || []), ...nextImages],
              variantImageFiles: [...(variant.variantImageFiles || []), ...nextFiles],
              variantAvatar: variant.variantAvatar || nextImages[0],
            }
          : variant,
      ),
    )
  }

  const removeVariantImage = (variantId: number, imageIndex: number) => {
    setEditableVariants((currentVariants) =>
      currentVariants.map((variant) => {
        if (variant.id !== variantId) {
          return variant
        }

        const nextVariantImages = (variant.variantImages || []).filter((_, index) => index !== imageIndex)
        const nextAvatar =
          variant.variantAvatar && nextVariantImages.includes(variant.variantAvatar)
            ? variant.variantAvatar
            : nextVariantImages[0]

        return {
          ...variant,
          variantImages: nextVariantImages,
          variantImageFiles: (variant.variantImageFiles || []).filter((_, index) => index !== imageIndex),
          variantAvatar: nextAvatar,
        }
      }),
    )
  }

  const handleSaveEditProduct = async () => {
    const categoryId = categories.find((category) => category.name === editForm.category)?.id
    const brandId = brands.find((brand) => brand.name === editForm.brand)?.id

    if (!categoryId || !brandId || !product?.id) {
      setSubmitError("Thiếu danh mục hoặc thương hiệu hợp lệ để cập nhật hàng hóa.")
      return
    }

    const statusMap: Record<ProductDialogData["status"], number> = {
      active: 1,
      out_of_stock: 2,
      inactive: 0,
    }

    try {
      setIsSubmitting(true)
      setSubmitError(null)

      await api.patch(`/api/products/${product.id}`, {
        name: editForm.name.trim(),
        description: editForm.description.trim() || null,
        status: statusMap[editForm.status],
        category_id: categoryId,
        brand_id: brandId,
        avatar: editForm.avatarPayload || undefined,
      })

      await onSave()
      onOpenChange(false)
    } catch (error) {
      console.error("Update product error:", error)
      setSubmitError("Cập nhật hàng hóa thất bại. Vui lòng thử lại.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSaveEditVariant = async () => {
    if (!editingVariant || !product?.id) {
      return
    }

    const colorId = colors.find((color) => color.name === editingVariant.color)?.id
    const sizeId = sizes.find((size) => size.name === editingVariant.size)?.id

    if (!colorId || !sizeId) {
      setSubmitError("Thiếu màu hoặc kích thước hợp lệ để cập nhật biến thể.")
      return
    }

    try {
      setIsSubmitting(true)
      setSubmitError(null)

      await api.patch(`/api/product-variants/${editingVariant.id}`, {
        sku: editingVariant.sku,
        price: editingVariant.price,
        quantity: editingVariant.stock,
        color_id: colorId,
        size_id: sizeId,
      })

      if (editingVariant.variantImageFiles && editingVariant.variantImageFiles.length > 0) {
        const formData = new FormData()
        formData.append("product_id", String(product.id))
        formData.append("variant_id", String(editingVariant.id))

        editingVariant.variantImageFiles.forEach((file) => {
          formData.append("images", file)
        })

        await api.post("/api/images/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
      }

      await onSave()
    } catch (error) {
      console.error("Update variant error:", error)
      setSubmitError("Cập nhật biến thể thất bại. Vui lòng thử lại.")
      return
    } finally {
      setIsSubmitting(false)
    }

    onOpenChange(false)
  }

  const handleCreate = async () => {
    if (!createForm.name.trim()) {
      setSubmitError("Tên hàng hóa là bắt buộc.")
      return
    }

    if (!createForm.categoryId || !createForm.brandId) {
      setSubmitError("Danh mục và thương hiệu là bắt buộc.")
      return
    }

    if (createVariants.length === 0) {
      setSubmitError("Cần ít nhất một biến thể trước khi lưu.")
      return
    }

    const formData = new FormData()
    formData.append("name", createForm.name.trim())
    formData.append("description", createForm.description.trim())
    formData.append("category_id", createForm.categoryId)
    formData.append("brand_id", createForm.brandId)

    if (avatarFile) {
      formData.append("avatar", avatarFile)
    }

    const variantsPayload = createVariants.map((variant) => ({
      color_id: variant.colorId,
      size_id: variant.sizeId,
      price: Number(variant.price),
      quantity: Number(variant.quantity),
    }))

    const imageMap: Record<string, { color_id: number; size_id: number }> = {}
    let fileIndex = 0

    createVariants.forEach((variant) => {
      variant.images.forEach((file) => {
        formData.append("images", file)
        imageMap[String(fileIndex)] = {
          color_id: variant.colorId,
          size_id: variant.sizeId,
        }
        fileIndex += 1
      })
    })

    formData.append("variants", JSON.stringify(variantsPayload))
    formData.append("image_map", JSON.stringify(imageMap))

    try {
      setIsSubmitting(true)
      setSubmitError(null)
      await api.post("/api/products/create-with-variants", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      await onSave()
      onOpenChange(false)
    } catch (error) {
      console.error("Create product error:", error)
      setSubmitError("Tạo hàng hóa thất bại. Vui lòng kiểm tra lại dữ liệu và thử lại.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return {
    colors,
    sizes,
    isSubmitting,
    submitError,
    createForm,
    setCreateForm,
    avatarPreview,
    createVariants,
    draftVariant,
    setDraftVariant,
    editForm,
    setEditForm,
    editableVariants,
    setEditableVariants,
    selectedVariantId,
    setSelectedVariantId,
    zoomImage,
    setZoomImage,
    isEditing,
    isEditingVariant,
    isSelectingVariantForImages,
    isEditingMainProduct,
    createVariantSummary,
    editingVariant,
    handleClose,
    handleAvatarChange,
    clearAvatar,
    handleAddCreateVariant,
    handleCreateVariantImagesChange,
    handleRemoveCreateVariant,
    handleRemoveCreateVariantImage,
    handleEditVariantImagesChange,
    removeVariantImage,
    handleSaveEditProduct,
    handleSaveEditVariant,
    handleCreate,
    updateEditableVariant,
  }
}

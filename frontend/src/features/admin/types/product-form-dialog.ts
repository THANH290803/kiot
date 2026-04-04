export interface EntityOption {
  id: number
  name: string
}

export interface ProductImage {
  id: string | number
  url: string
  color: string | null
  isAvatar: boolean
}

export interface EditableVariant {
  id: number
  sku: string
  color: string
  size: string
  stock: number
  price: number
  variantAvatar?: string
  variantImages?: string[]
  variantImageFiles?: File[]
}

export interface ProductDialogData {
  id: number
  name: string
  category: string
  brand: string
  status: "active" | "inactive" | "out_of_stock"
  description: string | null
  avatar?: string | null
  basePrice: number
  totalStock: number
  images: ProductImage[]
  variants: EditableVariant[]
  editingVariantId?: number
  selectedVariantForImages?: number
}

export interface ProductFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  product?: ProductDialogData | null
  categories: EntityOption[]
  brands: EntityOption[]
  onSave: (productData?: Partial<ProductDialogData>) => void | Promise<void>
}

export interface ColorOption extends EntityOption {
  code?: string
}

export interface SizeOption extends EntityOption {
  description?: string
}

export interface CreateVariantForm {
  localId: string
  colorId: number
  sizeId: number
  price: string
  quantity: string
  images: File[]
  previewUrls: string[]
}

export interface CreateFormState {
  name: string
  description: string
  categoryId: string
  brandId: string
}

export interface DraftVariantState {
  colorId: string
  sizeId: string
  price: string
  quantity: string
}

export interface EditFormState {
  name: string
  category: string
  brand: string
  status: ProductDialogData["status"]
  description: string
  avatar: string
  avatarPayload: string | null
}

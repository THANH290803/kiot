export interface EntityOption {
  id: number
  name: string
}

export interface ApiImage {
  id: number
  url: string
  is_primary: boolean
  sort_order: number
}

export interface ApiVariant {
  id: number
  sku: string
  quantity: number
  price: number
  color?: EntityOption | null
  size?: EntityOption | null
  images?: ApiImage[]
}

export interface ApiProduct {
  id: number
  name: string
  description: string | null
  avatar?: string | null
  status: number
  category?: EntityOption | null
  brand?: EntityOption | null
  variants: ApiVariant[]
}

export interface ProductImage {
  id: number
  url: string
  variantId: number
  color: string | null
  isAvatar: boolean
}

export interface ProductVariantView {
  id: number
  sku: string
  color: string
  size: string
  stock: number
  price: number
  variantAvatar?: string
  variantImages?: ProductImage[]
}

export interface ProductView {
  id: number
  code: string
  name: string
  category: string
  brand: string
  basePrice: number
  totalStock: number
  status: "active" | "inactive" | "out_of_stock"
  description: string | null
  avatar?: string | null
  images: ProductImage[]
  variants: ProductVariantView[]
  editingVariantId?: number
  selectedVariantForImages?: number
}

export interface PaginationState {
  total: number
  page: number
  limit: number
  total_pages: number
}

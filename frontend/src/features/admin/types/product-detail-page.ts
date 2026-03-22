export interface EntityOption {
  id: number
  name: string
}

export interface ProductImage {
  id: number
  url: string
  is_primary: boolean
  sort_order: number
}

export interface ProductVariant {
  id: number
  product_id: number
  sku: string
  quantity: number
  price: number
  color_id: number
  size_id: number
  created_at: string
  updated_at: string
  color?: EntityOption | null
  size?: EntityOption | null
  images?: ProductImage[]
}

export interface ProductDetailResponse {
  id: number
  name: string
  description: string | null
  avatar: string | null
  status: number
  category_id: number
  brand_id: number
  created_at: string
  updated_at: string
  category?: EntityOption | null
  brand?: EntityOption | null
  variants: ProductVariant[]
}

export interface StatusBadge {
  text: string
  className: string
}

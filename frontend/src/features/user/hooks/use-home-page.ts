'use client'

import { useEffect, useMemo, useState } from 'react'
import { api } from '@/lib/api'

interface ApiCategory {
  id: number
  name: string
}

interface ApiBrand {
  id: number
  name: string
}

interface ApiImage {
  id: number
  url: string
}

interface ApiVariant {
  id: number
  price: number
  images?: ApiImage[]
}

interface ApiProduct {
  id: number
  name: string
  avatar?: string | null
  category?: {
    id: number
    name: string
  }
  variants?: ApiVariant[]
}

interface ApiProductsResponse {
  data: ApiProduct[]
}

export interface ProductCardItem {
  id: string
  name: string
  price: number
  originalPrice: number
  image: string
  category: string
  rating: number
  reviews: number
}

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&h=500&fit=crop'

export function useHomePage() {
  const [products, setProducts] = useState<ProductCardItem[]>([])
  const [categories, setCategories] = useState<ApiCategory[]>([])
  const [brandsCount, setBrandsCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true

    const fetchHomeData = async () => {
      try {
        setLoading(true)
        setError(null)

        const [productsResponse, categoriesResponse, brandsResponse] = await Promise.all([
          api.get<ApiProductsResponse>('/api/products/get-all-with-variants', {
            params: { page: 1, limit: 8, status: 1 },
          }),
          api.get<ApiCategory[]>('/api/categories'),
          api.get<ApiBrand[]>('/api/brands'),
        ])

        if (!isMounted) return

        const mappedProducts: ProductCardItem[] = (productsResponse.data?.data ?? []).map((product) => {
          const variantPrices = (product.variants ?? [])
            .map((variant) => Number(variant.price))
            .filter((price) => Number.isFinite(price) && price > 0)

          const firstVariantImage = (product.variants ?? [])
            .flatMap((variant) => variant.images ?? [])[0]?.url

          const price = variantPrices.length > 0 ? Math.min(...variantPrices) : 0

          return {
            id: String(product.id),
            name: product.name,
            price,
            originalPrice: price > 0 ? Math.round(price * 1.15) : price,
            image: product.avatar || firstVariantImage || FALLBACK_IMAGE,
            category: product.category?.name || 'Khác',
            rating: 4.5 + ((product.id % 5) * 0.1),
            reviews: 20 + product.id * 3,
          }
        })

        setProducts(mappedProducts)
        setCategories(categoriesResponse.data ?? [])
        setBrandsCount((brandsResponse.data ?? []).length)
      } catch {
        if (!isMounted) return
        setError('Không thể tải dữ liệu trang chủ. Vui lòng thử lại.')
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    fetchHomeData()

    return () => {
      isMounted = false
    }
  }, [])

  const featuredCollections = useMemo(() => {
    const fromCategories = categories.slice(0, 3).map((category) => {
      const firstProduct = products.find((product) => product.category === category.name)
      return {
        id: category.id,
        name: category.name,
        image: firstProduct?.image || FALLBACK_IMAGE,
      }
    })

    if (fromCategories.length > 0) {
      return fromCategories
    }

    return products.slice(0, 3).map((product, index) => ({
      id: index + 1,
      name: product.category || 'Bộ sưu tập',
      image: product.image || FALLBACK_IMAGE,
    }))
  }, [categories, products])

  return {
    products,
    loading,
    error,
    brandsCount,
    featuredCollections,
  }
}

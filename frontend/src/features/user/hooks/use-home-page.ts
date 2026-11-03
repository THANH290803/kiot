'use client'

import { useEffect, useMemo, useState } from 'react'
import { api } from '@/lib/api'

export interface ApiCategory {
  id: number
  name: string
  parent_id?: number | null
  parent?: {
    id: number
    name: string
  } | null
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
  category?: ApiCategory
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

export interface CategoryNode extends ApiCategory {
  children: CategoryNode[]
}

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&h=500&fit=crop'

function getSelectableCategories(categories: ApiCategory[]) {
  const parentIds = new Set(
    categories
      .map((category) => category.parent_id)
      .filter((parentId): parentId is number => parentId !== null && parentId !== undefined),
  )
  const leafCategories = categories.filter((category) => !parentIds.has(category.id))

  return leafCategories.length > 0 ? leafCategories : categories
}

function getCategoryLabel(category: ApiCategory | undefined | null, categories: ApiCategory[]) {
  if (!category) return 'Khác'

  const parentName =
    category.parent?.name ||
    (category.parent_id
      ? categories.find((item) => String(item.id) === String(category.parent_id))?.name
      : '')

  return parentName ? `${parentName} / ${category.name}` : category.name
}

function getCategoryTree(categories: ApiCategory[]): CategoryNode[] {
  const sortedCategories = [...categories].sort((a, b) => a.id - b.id)
  const nodeById = new Map<number, CategoryNode>(
    sortedCategories.map((category) => [category.id, { ...category, children: [] }]),
  )
  const syntheticRootById = new Map<number, CategoryNode>()
  const roots: CategoryNode[] = []

  sortedCategories.forEach((category) => {
    const node = nodeById.get(category.id)
    if (!node) return

    if (!category.parent_id) {
      roots.push(node)
      return
    }

    const parentNode = nodeById.get(category.parent_id)
    if (parentNode) {
      parentNode.children.push(node)
      return
    }

    const syntheticRoot =
      syntheticRootById.get(category.parent_id) ??
      {
        id: category.parent_id,
        name: category.parent?.name || 'Danh mục',
        parent_id: null,
        children: [],
      }

    syntheticRoot.children.push(node)
    syntheticRootById.set(category.parent_id, syntheticRoot)
  })

  return [...roots, ...Array.from(syntheticRootById.values())]
}

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

        const fetchedCategories = categoriesResponse.data ?? []
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
            category: getCategoryLabel(product.category, fetchedCategories),
            rating: 4.5 + ((product.id % 5) * 0.1),
            reviews: 20 + product.id * 3,
          }
        })

        setProducts(mappedProducts)
        setCategories(fetchedCategories)
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
    const fromCategories = getSelectableCategories(categories).slice(0, 3).map((category) => {
      const categoryLabel = getCategoryLabel(category, categories)
      const firstProduct = products.find((product) => product.category === categoryLabel)
      return {
        id: category.id,
        name: categoryLabel,
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

  const categoryGroups = useMemo(() => getCategoryTree(categories), [categories])

  return {
    products,
    loading,
    error,
    brandsCount,
    featuredCollections,
    categoryGroups,
  }
}

'use client'

import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { api } from '@/lib/api'

interface ApiCategory {
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
  color?: { id: number; name: string }
  size?: { id: number; name: string }
  images?: ApiImage[]
}

interface ApiProduct {
  id: number
  name: string
  avatar?: string | null
  category?: { id: number; name: string }
  variants?: ApiVariant[]
}

interface ApiProductsResponse {
  data: ApiProduct[]
}

export interface ShopProduct {
  id: string
  productVariantId?: number
  name: string
  price: number
  originalPrice: number
  image: string
  category: string
  rating: number
  reviews: number
  sizes: string[]
  colors: string[]
  defaultSize?: string
  defaultColor?: string
}

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&h=500&fit=crop'

export function useShopPage() {
  const searchParams = useSearchParams()
  const categoryIdFromQuery = searchParams.get('category_id')

  const [allProducts, setAllProducts] = useState<ShopProduct[]>([])
  const [categories, setCategories] = useState<ApiCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('Tất cả')
  const [selectedSize, setSelectedSize] = useState<string[]>([])
  const [selectedColor, setSelectedColor] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000])
  const [sortBy, setSortBy] = useState('latest')

  const maxProductPrice = useMemo(() => {
    const max = allProducts.reduce((currentMax, product) => Math.max(currentMax, product.price), 0)
    return Math.max(10000, max)
  }, [allProducts])

  const categoryOptions = useMemo(
    () => ['Tất cả', ...categories.map((category) => category.name)],
    [categories],
  )

  const sizeOptions = useMemo(() => {
    return Array.from(new Set(allProducts.flatMap((product) => product.sizes))).sort()
  }, [allProducts])

  const colorOptions = useMemo(() => {
    return Array.from(new Set(allProducts.flatMap((product) => product.colors))).sort()
  }, [allProducts])

  useEffect(() => {
    let isMounted = true

    const fetchShopData = async () => {
      try {
        setLoading(true)
        setError(null)

        const [productsResponse, categoriesResponse] = await Promise.all([
          api.get<ApiProductsResponse>('/api/products/get-all-with-variants', {
            params: { page: 1, limit: 200, status: 1 },
          }),
          api.get<ApiCategory[]>('/api/categories'),
        ])

        if (!isMounted) return

        const mappedProducts: ShopProduct[] = (productsResponse.data?.data ?? []).map((product) => {
          const validVariants = (product.variants ?? []).filter(
            (variant) => Number.isFinite(Number(variant.price)) && Number(variant.price) > 0,
          )
          const variantPrices = validVariants.map((variant) => Number(variant.price))
          const defaultVariant = validVariants[0]

          const firstVariantImage = (product.variants ?? [])
            .flatMap((variant) => variant.images ?? [])[0]?.url

          const sizes = Array.from(
            new Set((product.variants ?? []).map((variant) => variant.size?.name).filter(Boolean)),
          ) as string[]
          const colors = Array.from(
            new Set((product.variants ?? []).map((variant) => variant.color?.name).filter(Boolean)),
          ) as string[]

          const price = variantPrices.length > 0 ? Math.min(...variantPrices) : 0

          return {
            id: String(product.id),
            productVariantId: defaultVariant?.id,
            name: product.name,
            price,
            originalPrice: price > 0 ? Math.round(price * 1.15) : price,
            image: product.avatar || firstVariantImage || FALLBACK_IMAGE,
            category: product.category?.name || 'Khác',
            rating: 4.5 + ((product.id % 5) * 0.1),
            reviews: 20 + product.id * 3,
            sizes,
            colors,
            defaultSize: defaultVariant?.size?.name || sizes[0] || '',
            defaultColor: defaultVariant?.color?.name || colors[0] || '',
          }
        })

        setAllProducts(mappedProducts)
        setCategories(categoriesResponse.data ?? [])
      } catch {
        if (!isMounted) return
        setError('Không thể tải dữ liệu sản phẩm. Vui lòng thử lại.')
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    fetchShopData()

    return () => {
      isMounted = false
    }
  }, [])

  useEffect(() => {
    if (!categoryIdFromQuery) {
      setSelectedCategory('Tất cả')
      return
    }

    const categoryId = Number(categoryIdFromQuery)
    if (!Number.isFinite(categoryId)) {
      setSelectedCategory('Tất cả')
      return
    }

    const matchedCategory = categories.find((category) => category.id === categoryId)
    if (matchedCategory) {
      setSelectedCategory(matchedCategory.name)
    }
  }, [categoryIdFromQuery, categories])

  useEffect(() => {
    setPriceRange([0, maxProductPrice])
  }, [maxProductPrice])

  const filteredProducts = useMemo(() => {
    let filtered = [...allProducts]

    if (searchTerm) {
      filtered = filtered.filter((product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (selectedCategory !== 'Tất cả') {
      filtered = filtered.filter((product) => product.category === selectedCategory)
    }

    if (selectedSize.length > 0) {
      filtered = filtered.filter((product) =>
        selectedSize.some((size) => product.sizes.includes(size)),
      )
    }

    if (selectedColor.length > 0) {
      filtered = filtered.filter((product) =>
        selectedColor.some((color) => product.colors.includes(color)),
      )
    }

    filtered = filtered.filter(
      (product) => product.price >= priceRange[0] && product.price <= priceRange[1],
    )

    if (sortBy === 'price-low') {
      filtered.sort((a, b) => a.price - b.price)
    } else if (sortBy === 'price-high') {
      filtered.sort((a, b) => b.price - a.price)
    } else if (sortBy === 'popular') {
      filtered.sort((a, b) => b.reviews - a.reviews)
    } else if (sortBy === 'rating') {
      filtered.sort((a, b) => b.rating - a.rating)
    } else {
      filtered.sort((a, b) => Number(b.id) - Number(a.id))
    }

    return filtered
  }, [allProducts, searchTerm, selectedCategory, selectedSize, selectedColor, priceRange, sortBy])

  return {
    filteredProducts,
    loading,
    error,
    searchTerm,
    selectedCategory,
    selectedSize,
    selectedColor,
    priceRange,
    sortBy,
    maxProductPrice,
    categoryOptions,
    sizeOptions,
    colorOptions,
    setSearchTerm,
    setSelectedCategory,
    setSelectedSize,
    setSelectedColor,
    setPriceRange,
    setSortBy,
  }
}

'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { useParams } from 'next/navigation'
import { api } from '@/lib/api'
import { useCart } from '@/features/user/lib/cart-context'

interface ApiImage {
  id: number
  url: string
  is_primary?: boolean
}

interface ApiOption {
  id: number
  name: string
}

interface ApiVariant {
  id: number
  price: number
  quantity: number
  color?: ApiOption
  size?: ApiOption
  images?: ApiImage[]
}

interface ApiProductDetail {
  id: number
  name: string
  description?: string | null
  avatar?: string | null
  variants?: ApiVariant[]
}

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&h=500&fit=crop'

export function useProductDetailPage() {
  const params = useParams()
  const productId = params.id as string
  const { addItem } = useCart()

  const [product, setProduct] = useState<ApiProductDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedSize, setSelectedSize] = useState<string>('')
  const [selectedColor, setSelectedColor] = useState<string>('')
  const [quantity, setQuantity] = useState(1)
  const [isAdded, setIsAdded] = useState(false)
  const [activeTab, setActiveTab] = useState<'description' | 'reviews'>('description')
  const [selectedImageUrl, setSelectedImageUrl] = useState<string>('')

  useEffect(() => {
    if (!productId) return

    let isMounted = true

    const fetchProduct = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await api.get<ApiProductDetail>(`/api/products/get-details-with-variants/${productId}`)
        if (!isMounted) return
        setProduct(response.data)
      } catch {
        if (!isMounted) return
        setError('Không thể tải chi tiết sản phẩm.')
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    fetchProduct()

    return () => {
      isMounted = false
    }
  }, [productId])

  const variants = useMemo(() => product?.variants ?? [], [product?.variants])

  const sizeOptions = useMemo(() => {
    return Array.from(new Set(variants.map((variant) => variant.size?.name).filter(Boolean))) as string[]
  }, [variants])

  const colorOptions = useMemo(() => {
    return Array.from(new Set(variants.map((variant) => variant.color?.name).filter(Boolean))) as string[]
  }, [variants])

  const isSizeEnabled = useCallback((size: string) => {
    if (!selectedColor) return true
    return variants.some((variant) => variant.size?.name === size && variant.color?.name === selectedColor)
  }, [selectedColor, variants])

  const isColorEnabled = (color: string) => colorOptions.includes(color)

  useEffect(() => {
    if (!selectedColor && colorOptions.length > 0) {
      setSelectedColor(colorOptions[0])
    }
  }, [selectedColor, colorOptions])

  useEffect(() => {
    const firstEnabledSize = sizeOptions.find((size) => isSizeEnabled(size))
    if (!selectedSize && firstEnabledSize) {
      setSelectedSize(firstEnabledSize)
      return
    }

    if (selectedSize && !isSizeEnabled(selectedSize) && firstEnabledSize) {
      setSelectedSize(firstEnabledSize)
    }
  }, [selectedSize, selectedColor, sizeOptions, isSizeEnabled])

  const selectedVariant = useMemo(() => {
    return variants.find(
      (variant) => variant.size?.name === selectedSize && variant.color?.name === selectedColor,
    )
  }, [variants, selectedSize, selectedColor])

  const availableStock = selectedVariant?.quantity ?? 0
  const unitPrice = selectedVariant?.price ?? 0
  const originalPrice = unitPrice > 0 ? Math.round(unitPrice * 1.15) : unitPrice

  const galleryImages = useMemo(() => {
    const urls = new Set<string>()

    ;(selectedVariant?.images ?? []).forEach((image) => {
      if (image?.url) urls.add(image.url)
    })

    if (urls.size === 0) {
      ;(product?.variants ?? []).forEach((variant) => {
        ;(variant.images ?? []).forEach((image) => {
          if (image?.url) urls.add(image.url)
        })
      })
    }

    if (product?.avatar) urls.add(product.avatar)
    if (urls.size === 0) urls.add(FALLBACK_IMAGE)

    return Array.from(urls)
  }, [product?.avatar, product?.variants, selectedVariant?.images])

  useEffect(() => {
    const defaultImage =
      selectedVariant?.images?.find((image) => image.is_primary)?.url ||
      selectedVariant?.images?.[0]?.url ||
      galleryImages[0] ||
      FALLBACK_IMAGE

    setSelectedImageUrl(defaultImage)
  }, [selectedVariant, galleryImages])

  const activeImage = selectedImageUrl || galleryImages[0] || FALLBACK_IMAGE

  const rating = product ? 4.5 + ((product.id % 5) * 0.1) : 0
  const reviews = product ? 20 + product.id * 3 : 0
  const discount =
    originalPrice > unitPrice && originalPrice > 0
      ? Math.round(((originalPrice - unitPrice) / originalPrice) * 100)
      : 0

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      maximumFractionDigits: 0,
    }).format(price)

  const handleAddToCart = () => {
    if (!selectedVariant) {
      alert('Vui lòng chọn size và màu sắc hợp lệ')
      return
    }

    if (availableStock <= 0) {
      alert('Biến thể này đã hết hàng')
      return
    }

    addItem({
      productId: String(product?.id),
      productVariantId: selectedVariant.id,
      name: product?.name || '',
      price: unitPrice,
      quantity,
      size: selectedSize,
      color: selectedColor,
      image: activeImage,
    })

    setIsAdded(true)
    setTimeout(() => setIsAdded(false), 2000)
  }

  return {
    product,
    loading,
    error,
    selectedSize,
    selectedColor,
    quantity,
    isAdded,
    activeTab,
    selectedImageUrl,
    sizeOptions,
    colorOptions,
    selectedVariant,
    availableStock,
    unitPrice,
    originalPrice,
    galleryImages,
    activeImage,
    rating,
    reviews,
    discount,
    setSelectedSize,
    setSelectedColor,
    setQuantity,
    setActiveTab,
    setSelectedImageUrl,
    isColorEnabled,
    isSizeEnabled,
    formatPrice,
    handleAddToCart,
  }
}

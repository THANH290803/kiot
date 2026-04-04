"use client"

import { useEffect, useMemo, useState } from "react"
import { api } from "@/lib/api"
import type {
  ProductDetailResponse,
  ProductImage,
  ProductVariant,
  StatusBadge,
} from "@/features/admin/types/product-detail-page"

function sortImages(images?: ProductImage[]) {
  return [...(images || [])].sort((left, right) => {
    if (left.is_primary !== right.is_primary) {
      return left.is_primary ? -1 : 1
    }

    return left.sort_order - right.sort_order
  })
}

function getStatusLabel(status: number): StatusBadge {
  if (status === 1) {
    return {
      text: "Đang kinh doanh",
      className: "bg-emerald-100 text-emerald-700 hover:bg-emerald-100",
    }
  }

  if (status === 2) {
    return {
      text: "Không còn hàng",
      className: "bg-amber-100 text-amber-700 hover:bg-amber-100",
    }
  }

  return {
    text: "Ngừng kinh doanh",
    className: "bg-slate-100 text-slate-700 hover:bg-slate-100",
  }
}

export function formatProductDetailDate(value: string) {
  return new Intl.DateTimeFormat("vi-VN").format(new Date(value))
}

export function useProductDetailPage(productId?: string) {
  const [product, setProduct] = useState<ProductDetailResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let active = true

    const fetchProductDetails = async () => {
      try {
        setIsLoading(true)
        setError(null)

        const response = await api.get(`/api/products/get-details-with-variants/${productId}`)

        if (!active) {
          return
        }

        setProduct(response.data as ProductDetailResponse)
      } catch (fetchError) {
        if (!active) {
          return
        }

        console.error("Fetch product details error:", fetchError)
        setProduct(null)
        setError("Không tải được chi tiết hàng hóa. Vui lòng thử lại.")
      } finally {
        if (active) {
          setIsLoading(false)
        }
      }
    }

    if (productId) {
      fetchProductDetails()
    } else {
      setIsLoading(false)
      setError("Mã hàng hóa không hợp lệ.")
    }

    return () => {
      active = false
    }
  }, [productId])

  const variants = useMemo<ProductVariant[]>(
    () =>
      (product?.variants || []).map((variant) => ({
        ...variant,
        images: sortImages(variant.images),
      })),
    [product],
  )

  const totalStock = useMemo(
    () => variants.reduce((sum, variant) => sum + variant.quantity, 0),
    [variants],
  )

  const lowestPrice = useMemo(
    () => (variants.length > 0 ? Math.min(...variants.map((variant) => variant.price)) : 0),
    [variants],
  )

  const primaryImage = useMemo(
    () =>
      product?.avatar ||
      variants.flatMap((variant) => variant.images || []).find((image) => image.is_primary)?.url ||
      variants.flatMap((variant) => variant.images || [])[0]?.url ||
      null,
    [product, variants],
  )

  const galleryImages = useMemo(
    () =>
      Array.from(
        new Map(
          variants.flatMap((variant) => variant.images || []).map((image) => [image.id, image]),
        ).values(),
      ),
    [variants],
  )

  const status = useMemo(
    () => (product ? getStatusLabel(product.status) : null),
    [product],
  )

  return {
    product,
    isLoading,
    error,
    variants,
    totalStock,
    lowestPrice,
    primaryImage,
    galleryImages,
    status,
  }
}

'use client'

import { Heart, ShoppingCart } from 'lucide-react'
import { useState } from 'react'
import Link from 'next/link'
import { useCart } from '@/features/user/lib/cart-context'

interface ProductCardProps {
    id: string
    productVariantId?: number
    name: string
    price: number
    originalPrice: number
    image: string
    category: string
    rating: number
    reviews: number
    defaultSize?: string
    defaultColor?: string
}

export function ProductCard({
                                id,
                                productVariantId,
                                name,
                                price,
                                originalPrice,
                                image,
                                rating,
                                reviews,
                                defaultSize,
                                defaultColor,
                            }: ProductCardProps) {
    const [isFavorite, setIsFavorite] = useState(false)
    const [isAdded, setIsAdded] = useState(false)
    const { addItem } = useCart()

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault()
        addItem({
            productId: id,
            productVariantId,
            name,
            price,
            quantity: 1,
            size: defaultSize || 'M',
            color: defaultColor || 'Trắng',
            image
        })
        setIsAdded(true)
        setTimeout(() => setIsAdded(false), 1500)
    }

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
            maximumFractionDigits: 0
        }).format(price)
    }

    const discount = Math.round(
        ((originalPrice - price) / originalPrice) * 100
    )

    return (
        <Link href={`/user/product/${id}`}>
            <div className="group bg-white rounded-lg overflow-hidden border border-border hover:shadow-xl transition-all duration-300 cursor-pointer h-full">
                {/* Image Container */}
                <div className="relative w-full aspect-square bg-secondary overflow-hidden">
                    <img
                        src={image}
                        alt={name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    {discount > 0 && (
                        <div className="absolute top-4 left-4 bg-destructive text-white px-3 py-1 rounded-full text-xs font-bold">
                            -{discount}%
                        </div>
                    )}
                    <button
                        onClick={(e) => {
                            e.preventDefault()
                            setIsFavorite(!isFavorite)
                        }}
                        className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-all"
                    >
                        <Heart
                            className={`w-5 h-5 transition-colors ${
                                isFavorite ? 'fill-accent text-accent' : 'text-foreground'
                            }`}
                        />
                    </button>
                </div>

                {/* Content */}
                <div className="p-4 space-y-3">
                    {/* Product Name */}
                    <h3 className="font-serif font-semibold text-foreground line-clamp-2 group-hover:text-accent transition-colors">
                        {name}
                    </h3>

                    {/* Rating */}
                    <div className="flex items-center gap-2">
                        <div className="flex">
                            {[...Array(5)].map((_, i) => (
                                <span
                                    key={i}
                                    className={`${
                                        i < Math.floor(rating) ? 'text-accent' : 'text-muted'
                                    }`}
                                >
                  ★
                </span>
                            ))}
                        </div>
                        <span className="text-xs text-muted-foreground">
              ({reviews} đánh giá)
            </span>
                    </div>

                    {/* Price */}
                    <div className="flex items-baseline gap-2">
            <span className="text-xl font-bold text-primary">
              {formatPrice(price)}
            </span>
                        {originalPrice > price && (
                            <span className="text-sm text-muted-foreground line-through">
                {formatPrice(originalPrice)}
              </span>
                        )}
                    </div>

                    {/* Add to Cart Button */}
                    <button
                        onClick={handleAddToCart}
                        className={`w-full py-2 px-4 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
                            isAdded
                                ? 'bg-accent text-white'
                                : 'bg-secondary text-foreground hover:bg-accent hover:text-white'
                        }`}
                    >
                        <ShoppingCart className="w-4 h-4" />
                        {isAdded ? 'Đã thêm!' : 'Thêm vào giỏ'}
                    </button>
                </div>
            </div>
        </Link>
    )
}

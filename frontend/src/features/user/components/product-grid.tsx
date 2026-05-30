'use client'

import { ProductCard } from './product-card'

interface Product {
    id: string
    productVariantId?: number
    name: string
    price: number
    image: string
    category: string
    rating: number
    reviews: number
    defaultSize?: string
    defaultColor?: string
}

interface ProductGridProps {
    products: Product[]
    loading?: boolean
}

export function ProductGrid({ products, loading }: ProductGridProps) {
    if (loading) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                    <div key={i} className="bg-secondary rounded-lg aspect-square animate-pulse" />
                ))}
            </div>
        )
    }

    if (products.length === 0) {
        return (
            <div className="col-span-full flex flex-col items-center justify-center py-12">
                <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mb-4">
                    <svg className="w-8 h-8 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Không tìm thấy sản phẩm</h3>
                <p className="text-muted-foreground text-center max-w-sm">
                    Hãy thử thay đổi các tiêu chí tìm kiếm hoặc lọc của bạn để tìm những sản phẩm bạn yêu thích
                </p>
            </div>
        )
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
                <ProductCard key={product.id} {...product} />
            ))}
        </div>
    )
}

'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { mockProducts } from '@/features/user/lib/mock-data'
import { useCart } from '@/features/user/lib/cart-context'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Header } from '@/features/user/components/header'
import { Footer } from '@/features/user/components/footer'

export default function ProductDetailPage() {
    const params = useParams()
    const productId = params.id as string
    const product = mockProducts.find(p => p.id === productId)
    const { addItem } = useCart()

    const [selectedSize, setSelectedSize] = useState<string>('')
    const [selectedColor, setSelectedColor] = useState<string>('')
    const [quantity, setQuantity] = useState(1)
    const [isAdded, setIsAdded] = useState(false)
    const [activeTab, setActiveTab] = useState<'description' | 'reviews'>('description')

    if (!product) {
        return (
            <>
                <Header />
                <div className="min-h-screen bg-background flex items-center justify-center">
                    <Card className="p-8 text-center max-w-md">
                        <h1 className="text-2xl font-bold text-foreground mb-4">
                            Sản phẩm không tìm thấy
                        </h1>
                        <Link href="/user/home">
                            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                                Quay lại trang chủ
                            </Button>
                        </Link>
                    </Card>
                </div>
                <Footer />
            </>
        )
    }

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
            maximumFractionDigits: 0
        }).format(price)
    }

    const discount = Math.round(
        ((product.originalPrice - product.price) / product.originalPrice) * 100
    )

    const handleAddToCart = () => {
        if (!selectedSize || !selectedColor) {
            alert('Vui lòng chọn size và màu sắc')
            return
        }

        addItem({
            productId: product.id,
            name: product.name,
            price: product.price,
            quantity,
            size: selectedSize,
            color: selectedColor,
            image: product.image
        })

        setIsAdded(true)
        setTimeout(() => setIsAdded(false), 2000)
    }

    return (
        <>
            <Header />
            <div className="min-h-screen bg-background">
                <div className="container mx-auto px-4 py-12">
                    {/* Breadcrumb */}
                    <div className="mb-8">
                        <Link href="/user/home" className="text-primary hover:underline">
                            Trang chủ
                        </Link>
                        <span className="text-muted-foreground mx-2">/</span>
                        <span className="text-foreground">{product.name}</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        {/* Product Image */}
                        <div>
                            <Card className="overflow-hidden mb-4">
                                <div className="relative bg-secondary aspect-square">
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        className="w-full h-full object-cover"
                                    />
                                    {discount > 0 && (
                                        <div className="absolute top-4 right-4 bg-destructive text-white px-3 py-1 rounded-full text-sm font-bold">
                                            -{discount}%
                                        </div>
                                    )}
                                </div>
                            </Card>
                        </div>

                        {/* Product Info */}
                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                                {product.name}
                            </h1>

                            {/* Rating */}
                            <div className="flex items-center gap-2 mb-6">
                                <div className="flex items-center">
                                    {'★'.repeat(Math.round(product.rating))}
                                    <span className="text-muted-foreground ml-2">
                  ({product.reviews} đánh giá)
                </span>
                                </div>
                            </div>

                            {/* Price */}
                            <div className="mb-8">
                                <div className="flex items-center gap-3">
                                    <p className="text-4xl font-bold text-primary">
                                        {formatPrice(product.price)}
                                    </p>
                                    {product.originalPrice > product.price && (
                                        <p className="text-xl text-muted-foreground line-through">
                                            {formatPrice(product.originalPrice)}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Description */}
                            <p className="text-foreground mb-8 leading-relaxed">
                                {product.description}
                            </p>

                            {/* Size Selection */}
                            <div className="mb-8">
                                <label className="block text-sm font-semibold text-foreground mb-3">
                                    Chọn kích thước
                                </label>
                                <div className="flex flex-wrap gap-3">
                                    {product.sizes.map(size => (
                                        <button
                                            key={size}
                                            onClick={() => setSelectedSize(size)}
                                            className={`px-4 py-2 border rounded-lg font-medium transition-all ${
                                                selectedSize === size
                                                    ? 'bg-primary text-primary-foreground border-primary'
                                                    : 'border-border text-foreground hover:border-primary'
                                            }`}
                                        >
                                            {size}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Color Selection */}
                            <div className="mb-8">
                                <label className="block text-sm font-semibold text-foreground mb-3">
                                    Chọn màu sắc
                                </label>
                                <div className="flex flex-wrap gap-3">
                                    {product.colors.map(color => (
                                        <button
                                            key={color}
                                            onClick={() => setSelectedColor(color)}
                                            className={`px-4 py-2 border rounded-lg font-medium transition-all ${
                                                selectedColor === color
                                                    ? 'bg-primary text-primary-foreground border-primary'
                                                    : 'border-border text-foreground hover:border-primary'
                                            }`}
                                        >
                                            {color}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Quantity */}
                            <div className="mb-8">
                                <label className="block text-sm font-semibold text-foreground mb-3">
                                    Số lượng
                                </label>
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center border border-border rounded-lg">
                                        <button
                                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                            className="px-4 py-2 text-foreground hover:bg-secondary"
                                        >
                                            −
                                        </button>
                                        <span className="px-4 py-2 border-l border-r border-border">
                    {quantity}
                  </span>
                                        <button
                                            onClick={() => setQuantity(quantity + 1)}
                                            className="px-4 py-2 text-foreground hover:bg-secondary"
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Add to Cart Button */}
                            <Button
                                onClick={handleAddToCart}
                                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 py-6 text-lg font-semibold mb-4"
                            >
                                {isAdded ? '✓ Đã thêm vào giỏ hàng' : 'Thêm vào giỏ hàng'}
                            </Button>

                            <Link href="/user/cart" className="block">
                                <Button variant="outline" className="w-full">
                                    Xem giỏ hàng
                                </Button>
                            </Link>

                            {/* Additional Info */}
                            <div className="mt-12 pt-8 border-t border-border space-y-4">
                                <div>
                                    <h3 className="font-semibold text-foreground mb-2">
                                        Chính sách hoàn trả
                                    </h3>
                                    <p className="text-sm text-muted-foreground">
                                        Hoàn trả miễn phí trong 30 ngày từ ngày mua hàng
                                    </p>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-foreground mb-2">
                                        Giao hàng
                                    </h3>
                                    <p className="text-sm text-muted-foreground">
                                        Giao hàng miễn phí cho đơn hàng từ 500.000đ
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Related Products Link */}
                    <div className="mt-16">
                        <Link href="/user/home">
                            <Button variant="outline">
                                Xem thêm sản phẩm khác
                            </Button>
                        </Link>
                    </div>

                    {/* Tabs Section */}
                    <div className="mt-16 border-t border-border pt-8">
                        <div className="flex gap-8 mb-6 border-b border-border">
                            <button
                                onClick={() => setActiveTab('description')}
                                className={`pb-4 font-semibold transition-colors ${
                                    activeTab === 'description'
                                        ? 'text-primary border-b-2 border-primary'
                                        : 'text-muted-foreground hover:text-foreground'
                                }`}
                            >
                                Mô Tả Sản Phẩm
                            </button>
                            <button
                                onClick={() => setActiveTab('reviews')}
                                className={`pb-4 font-semibold transition-colors ${
                                    activeTab === 'reviews'
                                        ? 'text-primary border-b-2 border-primary'
                                        : 'text-muted-foreground hover:text-foreground'
                                }`}
                            >
                                Đánh Giá ({product.reviews} đánh giá)
                            </button>
                        </div>

                        {/* Description Tab */}
                        {activeTab === 'description' && (
                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-lg font-semibold text-foreground mb-3">Thông Tin Sản Phẩm</h3>
                                    <p className="text-muted-foreground leading-relaxed">
                                        Đây là một sản phẩm thời trang cao cấp được thiết kế với sự chú ý đến chi tiết và chất lượng.
                                        Chất liệu được chọn lọc kỹ càng để đảm bảo độ bền và thoải mái trong suốt ngày dài.
                                    </p>
                                </div>

                                <div>
                                    <h3 className="text-lg font-semibold text-foreground mb-3">Chất Liệu & Bảo Dưỡng</h3>
                                    <ul className="list-disc list-inside text-muted-foreground space-y-2">
                                        <li>Chất liệu cao cấp, lụa tự nhiên 100%</li>
                                        <li>Được xử lý bằng công nghệ tiên tiến</li>
                                        <li>Khuyến nghị giặt tay với nước lạnh</li>
                                        <li>Không nên dùng máy sấy</li>
                                        <li>Ủi với nhiệt độ thấp</li>
                                    </ul>
                                </div>

                                <div>
                                    <h3 className="text-lg font-semibold text-foreground mb-3">Đặc Điểm</h3>
                                    <ul className="list-disc list-inside text-muted-foreground space-y-2">
                                        <li>Thiết kế tối giản nhưng sang trọng</li>
                                        <li>Phù hợp với nhiều phong cách thời trang</li>
                                        <li>Có sẵn nhiều kích thước và màu sắc</li>
                                        <li>Phù hợp cho cả ngày thường và dự tiệc</li>
                                    </ul>
                                </div>
                            </div>
                        )}

                        {/* Reviews Tab */}
                        {activeTab === 'reviews' && (
                            <div className="space-y-6">
                                <div className="mb-8">
                                    <h3 className="text-lg font-semibold text-foreground mb-4">Đánh Giá Từ Khách Hàng</h3>

                                    <div className="space-y-4">
                                        {[
                                            { name: 'Nguyễn Thanh A', rating: 5, comment: 'Sản phẩm rất đẹp, chất lượng tốt. Giao hàng nhanh!' },
                                            { name: 'Trần Thị B', rating: 5, comment: 'Tôi rất hài lòng với chiếc áo này. Vải mịn, màu sắc đẹp.' },
                                            { name: 'Phạm Văn C', rating: 4, comment: 'Hàng có chất lượng, chỉ hơi nhỏ so với kích thước thường.' },
                                        ].map((review, idx) => (
                                            <Card key={idx} className="p-4">
                                                <div className="flex justify-between items-start mb-2">
                                                    <div>
                                                        <p className="font-semibold text-foreground">{review.name}</p>
                                                        <div className="flex gap-1 mt-1">
                                                            {[...Array(5)].map((_, i) => (
                                                                <span
                                                                    key={i}
                                                                    className={i < review.rating ? 'text-accent' : 'text-muted'}
                                                                >
                                ★
                              </span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                                <p className="text-muted-foreground text-sm">{review.comment}</p>
                                            </Card>
                                        ))}
                                    </div>
                                </div>

                                <div className="bg-secondary p-6 rounded-lg">
                                    <h4 className="font-semibold text-foreground mb-4">Viết Đánh Giá Của Bạn</h4>
                                    <p className="text-muted-foreground text-sm mb-4">
                                        Vui lòng đăng nhập để viết đánh giá cho sản phẩm này
                                    </p>
                                    <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                                        Viết Đánh Giá
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <Footer />
        </>
    )
}

'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Header } from '@/features/user/components/header'
import { Footer } from '@/features/user/components/footer'
import { useProductDetailPage } from '@/features/user/hooks/use-product-detail-page'

export default function ProductDetailPage() {
  const {
    product,
    loading,
    error,
    selectedSize,
    selectedColor,
    quantity,
    isAdded,
    activeTab,
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
  } = useProductDetailPage()

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-background flex items-center justify-center">
          <Card className="p-8 text-center max-w-md">Đang tải sản phẩm...</Card>
        </div>
        <Footer />
      </>
    )
  }

  if (error || !product) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-background flex items-center justify-center">
          <Card className="p-8 text-center max-w-md">
            <h1 className="text-2xl font-bold text-foreground mb-4">
              {error || 'Sản phẩm không tìm thấy'}
            </h1>
            <Link href="/user/home">
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90">Quay lại trang chủ</Button>
            </Link>
          </Card>
        </div>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-12">
          <div className="mb-8">
            <Link href="/user/home" className="text-primary hover:underline">
              Trang chủ
            </Link>
            <span className="text-muted-foreground mx-2">/</span>
            <span className="text-foreground">{product.name}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <Card className="overflow-hidden mb-4">
                <div className="relative bg-secondary aspect-square">
                  <img src={activeImage} alt={product.name} className="w-full h-full object-cover" />
                  {discount > 0 && (
                    <div className="absolute top-4 right-4 bg-destructive text-white px-3 py-1 rounded-full text-sm font-bold">
                      -{discount}%
                    </div>
                  )}
                </div>
              </Card>

              <div className="grid grid-cols-5 gap-3">
                {galleryImages.map((imageUrl) => (
                  <button
                    key={imageUrl}
                    type="button"
                    onClick={() => setSelectedImageUrl(imageUrl)}
                    className={`rounded-lg overflow-hidden border-2 transition-all ${
                      activeImage === imageUrl ? 'border-primary' : 'border-border hover:border-primary/60'
                    }`}
                  >
                    <img
                      src={imageUrl}
                      alt={product.name}
                      className="w-full aspect-square object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">{product.name}</h1>

              <div className="flex items-center gap-2 mb-6">
                <div className="flex items-center">
                  {'★'.repeat(Math.round(rating))}
                  <span className="text-muted-foreground ml-2">({reviews} đánh giá)</span>
                </div>
              </div>

              <div className="mb-4">
                <div className="flex items-center gap-3">
                  <p className="text-4xl font-bold text-primary">{formatPrice(unitPrice)}</p>
                  {originalPrice > unitPrice && (
                    <p className="text-xl text-muted-foreground line-through">{formatPrice(originalPrice)}</p>
                  )}
                </div>
              </div>

              <p className="text-sm text-muted-foreground mb-8">
                Tồn kho: {availableStock > 0 ? `${availableStock} sản phẩm` : 'Hết hàng'}
              </p>

              <p className="text-foreground mb-8 leading-relaxed">
                {product.description || 'Sản phẩm thời trang chất lượng cao, phù hợp nhiều phong cách.'}
              </p>

              <div className="mb-8">
                <label className="block text-sm font-semibold text-foreground mb-3">Chọn màu sắc</label>
                <div className="flex flex-wrap gap-3">
                  {colorOptions.map((color) => (
                    <button
                      key={color}
                      disabled={!isColorEnabled(color)}
                      onClick={() => {
                        if (!isColorEnabled(color)) return
                        setSelectedColor(color)
                      }}
                      className={`px-4 py-2 border rounded-lg font-medium transition-all ${
                        selectedColor === color
                          ? 'bg-primary text-primary-foreground border-primary'
                          : isColorEnabled(color)
                            ? 'border-border text-foreground hover:border-primary'
                            : 'border-border text-muted-foreground bg-secondary cursor-not-allowed opacity-60'
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-8">
                <label className="block text-sm font-semibold text-foreground mb-3">Chọn kích thước</label>
                <div className="flex flex-wrap gap-3">
                  {sizeOptions.map((size) => (
                    <button
                      key={size}
                      disabled={!isSizeEnabled(size)}
                      onClick={() => {
                        if (!isSizeEnabled(size)) return
                        setSelectedSize(size)
                      }}
                      className={`px-4 py-2 border rounded-lg font-medium transition-all ${
                        selectedSize === size
                          ? 'bg-primary text-primary-foreground border-primary'
                          : isSizeEnabled(size)
                            ? 'border-border text-foreground hover:border-primary'
                            : 'border-border text-muted-foreground bg-secondary cursor-not-allowed opacity-60'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-8">
                <label className="block text-sm font-semibold text-foreground mb-3">Số lượng</label>
                <div className="flex items-center gap-4">
                  <div className="flex items-center border border-border rounded-lg">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-4 py-2 text-foreground hover:bg-secondary"
                    >
                      −
                    </button>
                    <span className="px-4 py-2 border-l border-r border-border">{quantity}</span>
                    <button
                      onClick={() => setQuantity(Math.min(Math.max(1, availableStock || 1), quantity + 1))}
                      className="px-4 py-2 text-foreground hover:bg-secondary"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              <Button
                onClick={handleAddToCart}
                disabled={!selectedVariant || availableStock <= 0}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 py-6 text-lg font-semibold mb-4"
              >
                {isAdded ? '✓ Đã thêm vào giỏ hàng' : 'Thêm vào giỏ hàng'}
              </Button>

              <Link href="/user/cart" className="block">
                <Button variant="outline" className="w-full">
                  Xem giỏ hàng
                </Button>
              </Link>

              <div className="mt-12 pt-8 border-t border-border space-y-4">
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Chính sách hoàn trả</h3>
                  <p className="text-sm text-muted-foreground">Hoàn trả miễn phí trong 30 ngày từ ngày mua hàng</p>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Giao hàng</h3>
                  <p className="text-sm text-muted-foreground">Giao hàng miễn phí cho đơn hàng từ 500.000đ</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-16">
            <Link href="/user/home">
              <Button variant="outline">Xem thêm sản phẩm khác</Button>
            </Link>
          </div>

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
                Đánh Giá ({reviews} đánh giá)
              </button>
            </div>

            {activeTab === 'description' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-3">Thông Tin Sản Phẩm</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {product.description || 'Sản phẩm được chọn lọc kỹ, chất liệu tốt và phù hợp mặc hằng ngày.'}
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-6">
                <div className="bg-secondary p-6 rounded-lg">
                  <h4 className="font-semibold text-foreground mb-4">Đánh giá</h4>
                  <p className="text-muted-foreground text-sm mb-4">Chức năng đánh giá sẽ được cập nhật sớm.</p>
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

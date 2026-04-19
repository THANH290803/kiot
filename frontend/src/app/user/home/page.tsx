'use client'

import Link from 'next/link'
import { Header } from '@/features/user/components/header'
import { Footer } from '@/features/user/components/footer'
import { ProductGrid } from '@/features/user/components/product-grid'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ChevronRight, Truck, ShieldCheck, RotateCcw } from 'lucide-react'
import { useHomePage } from '@/features/user/hooks/use-home-page'

export default function HomePage() {
  const { products, loading, error, brandsCount, featuredCollections } = useHomePage()

  return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />

        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary via-primary to-accent text-white py-24 md:py-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              {/* Left Content */}
              <div className="space-y-6">
                <div>
                  <p className="text-accent font-semibold mb-2 uppercase tracking-widest">Chào mừng đến ELEGANCE</p>
                  <h1 className="text-5xl md:text-6xl font-serif font-bold leading-tight text-balance">
                    Phong cách là sự lựa chọn
                  </h1>
                </div>
                <p className="text-lg text-gray-100 text-pretty leading-relaxed">
                  Khám phá bộ sưu tập thời trang cao cấp được thiết kế cho phụ nữ hiện đại. Mỗi sản phẩm là biểu tượng của sang trọng, chất lượng và tinh tế.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <Link href="/user/shop">
                    <Button className="w-full sm:w-auto bg-white text-primary hover:bg-gray-100 px-8 py-6 text-lg font-semibold">
                      Mua sắm ngay
                      <ChevronRight className="ml-2 w-5 h-5" />
                    </Button>
                  </Link>
                  <Link href="/user/shop">
                    <Button variant="outline" className="w-full sm:w-auto border-white text-primary hover:bg-white hover:text-primary px-8 py-6 text-lg font-semibold">
                      Xem bộ sưu tập
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Right Image */}
              <div className="hidden md:block">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-transparent rounded-3xl" />
                  <img
                      src="https://images.unsplash.com/photo-1567049677904-d289f35393bf?w=600&h=600&fit=crop"
                      alt="Fashion collection"
                      className="w-full rounded-3xl shadow-2xl"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 md:py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-4">
                Tại sao chọn ELEGANCE?
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Chúng tôi cam kết mang lại trải nghiệm mua sắm tốt nhất
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <Card className="p-8 text-center hover:shadow-lg transition-shadow">
                <div className="mb-4 flex justify-center">
                  <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center">
                    <Truck className="w-8 h-8 text-primary" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">Giao hàng miễn phí</h3>
                <p className="text-muted-foreground">
                  Miễn phí giao hàng cho tất cả đơn hàng trên toàn quốc
                </p>
              </Card>

              {/* Feature 2 */}
              <Card className="p-8 text-center hover:shadow-lg transition-shadow">
                <div className="mb-4 flex justify-center">
                  <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center">
                    <ShieldCheck className="w-8 h-8 text-primary" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">Chất lượng đảm bảo</h3>
                <p className="text-muted-foreground">
                  {products.length > 0
                    ? `${products.length} sản phẩm đang mở bán và được kiểm tra kỹ lưỡng`
                    : 'Tất cả sản phẩm đều được kiểm tra chất lượng kỹ lưỡng'}
                </p>
              </Card>

              {/* Feature 3 */}
              <Card className="p-8 text-center hover:shadow-lg transition-shadow">
                <div className="mb-4 flex justify-center">
                  <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center">
                    <RotateCcw className="w-8 h-8 text-primary" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">Hoàn trả dễ dàng</h3>
                <p className="text-muted-foreground">
                  {brandsCount > 0
                    ? `Sản phẩm chính hãng từ ${brandsCount} thương hiệu uy tín`
                    : 'Hoàn trả miễn phí trong vòng 30 ngày không yêu cầu'}
                </p>
              </Card>
            </div>
          </div>
        </section>

        {/* New Products */}
        <section className="py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-4">
                Sản phẩm mới
              </h2>
              <p className="text-lg text-muted-foreground">
                Cập nhật trực tiếp từ dữ liệu cửa hàng
              </p>
            </div>

            {error ? (
              <Card className="p-6 text-center text-destructive">{error}</Card>
            ) : (
              <ProductGrid products={products.slice(0, 6)} loading={loading} />
            )}
          </div>
        </section>

        {/* Featured Collections */}
        <section className="py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-4">
                Bộ sưu tập nổi bật
              </h2>
              <p className="text-lg text-muted-foreground">
                Khám phá những xu hướng thời trang mới nhất
              </p>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[...Array(3)].map((_, index) => (
                  <Card key={index} className="h-80 animate-pulse bg-secondary" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {featuredCollections.map((collection) => (
                  <Link key={collection.id} href="/user/shop" className="group overflow-hidden rounded-2xl">
                    <Card className="overflow-hidden h-80 hover:shadow-2xl transition-all duration-300">
                      <div className="relative w-full h-full">
                        <img
                          src={collection.image}
                          alt={collection.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors flex flex-col justify-end p-6">
                          <h3 className="text-2xl font-serif font-bold text-white mb-2">{collection.name}</h3>
                          <p className="text-gray-200">Khám phá bộ sưu tập {collection.name.toLowerCase()} mới nhất</p>
                        </div>
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gradient-to-r from-primary to-accent text-white py-16 md:py-24">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">
              Sẵn sàng khám phá phong cách của bạn?
            </h2>
            <p className="text-lg text-gray-100 mb-8 text-pretty">
              Tham gia cộng đồng của hàng ngàn khách hàng hài lòng và tìm kiếm chiếc quần áo yêu thích của bạn hôm nay
            </p>
            <Link href="/user/shop">
              <Button className="bg-white text-primary hover:bg-gray-100 px-8 py-6 text-lg font-semibold">
                Bắt đầu mua sắm
                <ChevronRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </section>

        {/* Newsletter Section */}
        <section className="bg-secondary py-12 md:py-16">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h3 className="text-2xl font-serif font-bold text-foreground mb-3">
              Nhận ưu đãi độc quyền
            </h3>
            <p className="text-muted-foreground mb-6">
              Đăng ký nhận bản tin của chúng tôi để nhận thông tin về bộ sưu tập mới và những ưu đãi độc quyền
            </p>
            <div className="flex gap-2">
              <input
                  type="email"
                  placeholder="Nhập email của bạn"
                  className="flex-1 px-4 py-3 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90 px-6">
                Đăng ký
              </Button>
            </div>
          </div>
        </section>

        <Footer />
      </div>
  )
}

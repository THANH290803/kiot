'use client'

import Link from 'next/link'
import { Header } from '@/features/user/components/header'
import { Footer } from '@/features/user/components/footer'
import { ProductGrid } from '@/features/user/components/product-grid'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ArrowUpRight, ChevronDown, ChevronRight, Grid2X2, RotateCcw, ShieldCheck, Sparkles, Truck } from 'lucide-react'
import { useHomePage, type CategoryNode } from '@/features/user/hooks/use-home-page'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

function countNestedCategories(category: CategoryNode): number {
  return category.children.reduce((total, child) => total + 1 + countNestedCategories(child), 0)
}

function CategoryNestedMenu({ nodes, level = 0 }: { nodes: CategoryNode[]; level?: number }) {
  if (nodes.length === 0) {
    return null
  }

  return (
    <div className={level === 0 ? 'mt-2 space-y-1 pl-3' : 'mt-1 space-y-1 pl-4'}>
      {nodes.map((node) => {
        const hasChildren = node.children.length > 0

        return (
          <div key={node.id}>
            <DropdownMenuItem asChild className="cursor-pointer rounded-lg p-0">
              <Link
                href={`/user/shop?category_id=${node.id}`}
                className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors ${
                  level === 0
                    ? 'text-foreground hover:text-primary'
                    : 'text-muted-foreground hover:text-primary'
                }`}
              >
                <span className="min-w-0 truncate">{node.name}</span>
                {hasChildren ? <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" /> : <ArrowUpRight className="h-3.5 w-3.5" />}
              </Link>
            </DropdownMenuItem>
            <CategoryNestedMenu nodes={node.children} level={level + 1} />
          </div>
        )
      })}
    </div>
  )
}

export default function HomePage() {
  const { products, loading, error, brandsCount, featuredCollections, categoryGroups } = useHomePage()

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

        {/* Categories */}
        <section className="py-14 md:py-18">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <div className="mb-3 inline-flex items-center gap-2 px-3 py-1 text-sm font-semibold text-primary">
                  <Grid2X2 className="h-4 w-4" />
                  Mua theo nhóm
                </div>
                <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground">
                  Danh mục nổi bật
                </h2>
                <p className="mt-2 max-w-2xl text-muted-foreground">
                  Chọn nhanh nhóm thời trang, sau đó mở danh mục con để đi thẳng tới sản phẩm phù hợp.
                </p>
              </div>
              <Link href="/user/shop" className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary/80">
                Xem tất cả sản phẩm
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {[...Array(4)].map((_, index) => (
                  <div key={index} className="h-36 animate-pulse rounded-xl bg-secondary" />
                ))}
              </div>
            ) : categoryGroups.length > 0 ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {categoryGroups.map((group) => {
                  const previewChildren = group.children.slice(0, 3)
                  const nestedCount = countNestedCategories(group)
                  const href = group.children[0]
                    ? `/user/shop?category_id=${group.children[0].id}`
                    : `/user/shop?category_id=${group.id}`

                  return (
                    <DropdownMenu key={group.id}>
                      <DropdownMenuTrigger asChild>
                        <button className="group flex min-h-40 w-full flex-col justify-between rounded-xl p-5 text-left transition-all hover:-translate-y-0.5">
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <div className="mb-3 flex h-10 w-10 items-center justify-center text-primary">
                                <Sparkles className="h-5 w-5" />
                              </div>
                              <h3 className="text-xl font-bold text-foreground">{group.name}</h3>
                              <p className="mt-1 text-sm text-muted-foreground">
                                {nestedCount > 0
                                  ? `${nestedCount} danh mục bên trong`
                                  : 'Xem sản phẩm trong nhóm này'}
                              </p>
                            </div>
                            <div className="flex h-9 w-9 items-center justify-center text-muted-foreground transition-colors group-hover:text-primary">
                              <ChevronDown className="h-4 w-4" />
                            </div>
                          </div>

                          <div className="mt-5 flex flex-wrap gap-2">
                            {(previewChildren.length > 0 ? previewChildren : [{ id: group.id, name: 'Khám phá' }]).map((child) => (
                              <span
                                key={child.id}
                                className="px-3 py-1 text-xs font-semibold text-muted-foreground"
                              >
                                {child.name}
                              </span>
                            ))}
                            {nestedCount > previewChildren.length && (
                              <span className="px-3 py-1 text-xs font-semibold text-primary">
                                +{nestedCount - previewChildren.length}
                              </span>
                            )}
                          </div>
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start" className="w-[min(640px,calc(100vw-2rem))] border-0 p-0">
                        <div className="px-3 py-2">
                          <div className="px-3 py-2">
                            <p className="text-sm font-bold text-foreground">{group.name}</p>
                            <p className="text-xs text-muted-foreground">
                              Chọn danh mục con hoặc cấp sâu hơn
                            </p>
                          </div>
                        </div>
                        {group.children.length > 0 ? (
                          <div className="grid max-h-[420px] gap-3 overflow-y-auto px-3 pb-3 sm:grid-cols-2">
                            {group.children.map((child) => (
                              <div key={child.id} className="p-3">
                                <DropdownMenuItem asChild className="cursor-pointer rounded-lg p-0">
                                  <Link
                                    href={`/user/shop?category_id=${child.id}`}
                                    className="flex items-center justify-between px-3 py-2 text-sm font-bold text-foreground hover:text-primary"
                                  >
                                    <span className="min-w-0 truncate">{child.name}</span>
                                    {child.children.length > 0 ? <ChevronDown className="h-4 w-4 text-muted-foreground" /> : <ArrowUpRight className="h-4 w-4 text-muted-foreground" />}
                                  </Link>
                                </DropdownMenuItem>
                                <CategoryNestedMenu nodes={child.children} />
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="px-3 pb-3">
                            <DropdownMenuItem asChild className="cursor-pointer rounded-lg p-0">
                              <Link href={href} className="flex w-full items-center justify-between px-3 py-2.5">
                                <span>{group.name}</span>
                                <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
                              </Link>
                            </DropdownMenuItem>
                          </div>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )
                })}
              </div>
            ) : (
              <Card className="p-6 text-center text-muted-foreground">
                Chưa có danh mục để hiển thị.
              </Card>
            )}
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

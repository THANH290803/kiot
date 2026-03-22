"use client"

import Link from "next/link"
import { useParams } from "next/navigation"
import { ArrowLeft, Boxes, Clock3, Edit, Package, Tag } from "lucide-react"
import { HeaderNav } from "@/features/admin/components/header-nav"
import { formatProductDetailDate, useProductDetailPage } from "@/features/admin/hooks/use-product-detail-page"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function ProductDetailPage() {
  const params = useParams<{ id: string }>()
  const productId = Array.isArray(params.id) ? params.id[0] : params.id
  const { product, isLoading, error, variants, totalStock, lowestPrice, primaryImage, galleryImages, status } =
    useProductDetailPage(productId)

  return (
    <div className="min-h-screen bg-background">
      <HeaderNav />
      <main className="container mx-auto space-y-6 p-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/admin/products">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold">{product?.name || "Chi tiết hàng hóa"}</h1>
            <p className="text-sm text-muted-foreground">Mã sản phẩm gốc: #{productId}</p>
          </div>
          <Button className="bg-primary hover:bg-primary/90" asChild>
            <Link href="/admin/products">
              <Edit className="mr-2 h-4 w-4" /> Quay lại chỉnh sửa
            </Link>
          </Button>
        </div>

        {isLoading ? (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">Đang tải chi tiết hàng hóa...</CardContent>
          </Card>
        ) : error || !product ? (
          <Card>
            <CardContent className="py-12 text-center text-destructive">
              {error || "Không tìm thấy chi tiết hàng hóa."}
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="grid gap-6 lg:grid-cols-[1.1fr_1.4fr]">
              <Card>
                <CardContent className="space-y-4 p-6">
                  <div className="overflow-hidden rounded-2xl border bg-slate-50">
                    {primaryImage ? (
                      <img src={primaryImage} alt={product.name} className="aspect-square w-full object-cover" />
                    ) : (
                      <div className="flex aspect-square items-center justify-center text-sm text-muted-foreground">
                        Chưa có ảnh đại diện
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-4 gap-3">
                    {galleryImages.length > 0 ? (
                      galleryImages.map((image) => (
                        <div key={image.id} className="overflow-hidden rounded-xl border bg-slate-50">
                          <img src={image.url} alt={`Ảnh sản phẩm ${image.id}`} className="aspect-square w-full object-cover" />
                        </div>
                      ))
                    ) : (
                      <div className="col-span-4 rounded-xl border border-dashed px-4 py-8 text-center text-sm text-muted-foreground">
                        Sản phẩm này chưa có ảnh chi tiết.
                      </div>
                    )}
                  </div>

                  <div className="space-y-3 rounded-2xl border bg-white p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Danh mục</span>
                      <Badge variant="outline">{product.category?.name || "Chưa phân loại"}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Thương hiệu</span>
                      <Badge variant="outline">{product.brand?.name || "Chưa có thương hiệu"}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Trạng thái</span>
                      <Badge className={status?.className}>{status?.text}</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Thông tin chi tiết</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Card>
                      <CardContent className="flex items-center gap-3 p-4">
                        <div className="rounded-xl bg-blue-100 p-2">
                          <Package className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Tổng tồn kho</p>
                          <p className="text-xl font-bold">{totalStock}</p>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="flex items-center gap-3 p-4">
                        <div className="rounded-xl bg-emerald-100 p-2">
                          <Tag className="h-5 w-5 text-emerald-600" />
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Giá bán thấp nhất</p>
                          <p className="text-xl font-bold">{lowestPrice.toLocaleString("vi-VN")} đ</p>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="flex items-center gap-3 p-4">
                        <div className="rounded-xl bg-orange-100 p-2">
                          <Boxes className="h-5 w-5 text-orange-600" />
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Số biến thể</p>
                          <p className="text-xl font-bold">{variants.length}</p>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="flex items-center gap-3 p-4">
                        <div className="rounded-xl bg-purple-100 p-2">
                          <Clock3 className="h-5 w-5 text-purple-600" />
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Ngày tạo</p>
                          <p className="text-sm font-medium">{formatProductDetailDate(product.created_at)}</p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-semibold">Mô tả sản phẩm</h3>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {product.description || "Sản phẩm chưa có mô tả."}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Danh sách biến thể</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>SKU</TableHead>
                      <TableHead>Màu sắc</TableHead>
                      <TableHead>Kích thước</TableHead>
                      <TableHead className="text-right">Giá bán</TableHead>
                      <TableHead className="text-right">Tồn kho</TableHead>
                      <TableHead>Ảnh</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {variants.length > 0 ? (
                      variants.map((variant) => (
                        <TableRow key={variant.id}>
                          <TableCell className="font-medium">{variant.sku}</TableCell>
                          <TableCell>{variant.color?.name || "Chưa có màu"}</TableCell>
                          <TableCell>{variant.size?.name || "Chưa có size"}</TableCell>
                          <TableCell className="text-right font-semibold">
                            {variant.price.toLocaleString("vi-VN")} đ
                          </TableCell>
                          <TableCell className="text-right">
                            <Badge variant={variant.quantity > 0 ? "default" : "secondary"}>{variant.quantity}</Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2 overflow-x-auto">
                              {(variant.images || []).length > 0 ? (
                                variant.images?.map((image) => (
                                  <div
                                    key={image.id}
                                    className={`relative h-12 w-12 shrink-0 overflow-hidden rounded-lg border ${image.is_primary ? "ring-2 ring-primary border-primary" : ""}`}
                                  >
                                    <img src={image.url} alt={`Ảnh biến thể ${variant.sku}`} className="h-full w-full object-cover" />
                                  </div>
                                ))
                              ) : (
                                <span className="text-xs text-muted-foreground">Chưa có ảnh</span>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="py-8 text-center text-muted-foreground">
                          Sản phẩm này chưa có biến thể.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </>
        )}
      </main>
    </div>
  )
}

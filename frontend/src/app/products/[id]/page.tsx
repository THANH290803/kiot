import { HeaderNav } from "@/components/header-nav"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Edit, Package, TrendingUp, ShoppingCart, Clock } from "lucide-react"
import Link from "next/link"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const product = {
    id: params.id,
    code: "HH0001",
    name: "Áo thun Cotton Premium",
    category: "Thời trang",
    brand: "Nike",
    basePrice: 250000,
    cost: 150000,
    totalStock: 45,
    status: "active",
    description:
      "Áo thun cotton cao cấp, chất liệu thoáng mát, thấm hút mồ hôi tốt. Thiết kế hiện đại, phù hợp nhiều lứa tuổi.",
    image: "/shirt.jpg",
    createdAt: "01/11/2025",
    material: "100% Cotton",
    variants: [
      { id: 101, sku: "HH0001-T-L", color: "Trắng", size: "L", stock: 15, price: 250000 },
      { id: 102, sku: "HH0001-T-M", color: "Trắng", size: "M", stock: 10, price: 250000 },
      { id: 103, sku: "HH0001-D-L", color: "Đen", size: "L", stock: 20, price: 260000 },
    ],
  }

  const transactions = [
    { id: 1, type: "Nhập", date: "25/12/2025", quantity: 20, note: "Nhập hàng đầu tháng" },
    { id: 2, type: "Bán", date: "26/12/2025", quantity: -5, note: "Đơn hàng #HD001" },
    { id: 3, type: "Bán", date: "28/12/2025", quantity: -3, note: "Đơn hàng #HD012" },
  ]

  return (
    <div className="min-h-screen bg-background">
      <HeaderNav />
      <main className="container mx-auto p-6 space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/products">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold">{product.name}</h1>
            <p className="text-sm text-muted-foreground">Mã: {product.code}</p>
          </div>
          <Button className="bg-primary">
            <Edit className="h-4 w-4 mr-2" /> Chỉnh sửa
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <Card className="md:col-span-1">
            <CardContent className="p-6">
              <div className="aspect-square bg-muted rounded-lg overflow-hidden mb-4">
                <img
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Danh mục</span>
                  <Badge variant="outline">{product.category}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Thương hiệu</span>
                  <Badge variant="outline">{product.brand}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Trạng thái</span>
                  <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">Đang bán</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Thông tin chi tiết</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Package className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Tồn kho</p>
                        <p className="text-xl font-bold">{product.totalStock}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-emerald-100 rounded-lg">
                        <TrendingUp className="h-5 w-5 text-emerald-600" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Giá bán</p>
                        <p className="text-xl font-bold">{product.basePrice.toLocaleString()} đ</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-orange-100 rounded-lg">
                        <ShoppingCart className="h-5 w-5 text-orange-600" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Giá vốn</p>
                        <p className="text-xl font-bold">{product.cost.toLocaleString()} đ</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <Clock className="h-5 w-5 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Ngày tạo</p>
                        <p className="text-sm font-medium">{product.createdAt}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Mô tả sản phẩm</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{product.description}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Các phiên bản sản phẩm</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {product.variants.map((variant) => (
                <div key={variant.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className="w-12 h-12 rounded-lg border-2 border-muted-foreground flex-shrink-0"
                      title={variant.color}
                      style={{
                        backgroundColor:
                          variant.color === "Trắng"
                            ? "#FFFFFF"
                            : variant.color === "Đen"
                              ? "#000000"
                              : variant.color === "Xanh"
                                ? "#3B82F6"
                                : variant.color === "Đỏ"
                                  ? "#EF4444"
                                  : variant.color === "Nâu"
                                    ? "#92400E"
                                    : variant.color === "Vàng"
                                      ? "#FBBF24"
                                      : "#CCCCCC",
                        borderColor: variant.color === "Trắng" ? "#000000" : "white",
                      }}
                    />
                    <div className="flex-1">
                      <p className="font-semibold text-sm">{variant.color}</p>
                      <p className="text-xs text-muted-foreground">Size: {variant.size}</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">SKU</span>
                      <code className="text-xs bg-muted px-2 py-1 rounded font-mono">{variant.sku}</code>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">Giá</span>
                      <span className="font-semibold text-sm">{variant.price.toLocaleString()} đ</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">Tồn kho</span>
                      <Badge variant={variant.stock > 0 ? "default" : "destructive"} className="text-xs">
                        {variant.stock} cái
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Lịch sử nhập xuất</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Loại</TableHead>
                  <TableHead>Ngày</TableHead>
                  <TableHead className="text-right">Số lượng</TableHead>
                  <TableHead>Ghi chú</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((trans) => (
                  <TableRow key={trans.id}>
                    <TableCell>
                      <Badge variant={trans.type === "Nhập" ? "default" : "outline"}>{trans.type}</Badge>
                    </TableCell>
                    <TableCell>{trans.date}</TableCell>
                    <TableCell
                      className={`text-right font-medium ${trans.quantity > 0 ? "text-emerald-600" : "text-rose-600"}`}
                    >
                      {trans.quantity > 0 ? `+${trans.quantity}` : trans.quantity}
                    </TableCell>
                    <TableCell className="text-muted-foreground">{trans.note}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

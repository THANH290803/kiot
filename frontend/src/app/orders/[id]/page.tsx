import { HeaderNav } from "@/components/header-nav" 
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Printer, ShoppingCart, User, CreditCard, Banknote, Calendar } from "lucide-react"
import Link from "next/link"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"

export default function OrderDetailPage({ params }: { params: { id: string } }) {
  const order = {
    id: params.id,
    code: "HD0001",
    time: "31/12/2025 14:35",
    customer: {
      name: "Nguyễn Văn A",
      phone: "0901234567",
      address: "123 Đường ABC, Quận 1, TP. HCM",
    },
    items: [
      {
        id: 1,
        name: "Áo thun Cotton Premium",
        sku: "HH0001-T-L",
        color: "Trắng",
        size: "L",
        quantity: 2,
        price: 250000,
        total: 500000,
      },
      {
        id: 2,
        name: "Quần Jean Slim Fit",
        sku: "HH0002-X-32",
        color: "Xanh",
        size: "32",
        quantity: 1,
        price: 450000,
        total: 450000,
      },
      {
        id: 3,
        name: "Ví da bò thật",
        sku: "HH0005-N-L",
        color: "Nâu",
        size: "L",
        quantity: 1,
        price: 300000,
        total: 300000,
      },
    ],
    subtotal: 1250000,
    discount: 0,
    total: 1250000,
    paymentMethod: "Tiền mặt",
    status: "completed",
    cashier: "Admin",
  }

  return (
    <div className="min-h-screen bg-background">
      <HeaderNav />
      <main className="container mx-auto p-6 space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/orders">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold">Chi tiết hóa đơn {order.code}</h1>
            <p className="text-sm text-muted-foreground">Trạng thái: Hoàn thành</p>
          </div>
          <Button className="bg-primary">
            <Printer className="h-4 w-4 mr-2" /> In hóa đơn
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5 text-primary" /> Danh sách mặt hàng
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Sản phẩm</TableHead>
                      <TableHead>Biến thể</TableHead>
                      <TableHead className="text-right">Đơn giá</TableHead>
                      <TableHead className="text-center">SL</TableHead>
                      <TableHead className="text-right">Thành tiền</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {order.items.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{item.name}</p>
                            <p className="text-xs text-muted-foreground font-mono">SKU: {item.sku}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Badge variant="outline" className="font-normal text-xs">
                              {item.color}
                            </Badge>
                            <Badge variant="outline" className="font-normal text-xs">
                              {item.size}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">{item.price.toLocaleString()} đ</TableCell>
                        <TableCell className="text-center">{item.quantity}</TableCell>
                        <TableCell className="text-right font-medium">{item.total.toLocaleString()} đ</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                <div className="mt-6 flex justify-end">
                  <div className="w-full md:w-80 space-y-3">
                    <div className="flex justify-between text-sm items-center">
                      <span className="text-muted-foreground">Tổng tiền hàng:</span>
                      <span className="font-medium">{order.subtotal.toLocaleString()} đ</span>
                    </div>
                    <div className="flex justify-between text-sm items-center">
                      <span className="text-muted-foreground">Giảm giá:</span>
                      <span className="font-medium">{order.discount.toLocaleString()} đ</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between items-center text-primary bg-primary/5 p-3 rounded-lg">
                      <span className="text-base font-bold whitespace-nowrap">KHÁCH PHẢI TRẢ:</span>
                      <span className="text-xl font-bold whitespace-nowrap">{order.total.toLocaleString()} đ</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-primary" /> Thanh toán
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    {order.paymentMethod === "Tiền mặt" ? (
                      <Banknote className="h-8 w-8 text-emerald-500" />
                    ) : (
                      <CreditCard className="h-8 w-8 text-blue-500" />
                    )}
                    <div>
                      <p className="font-bold">{order.paymentMethod}</p>
                      <p className="text-xs text-muted-foreground">Thanh toán hoàn tất</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg text-emerald-600">{order.total.toLocaleString()} đ</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <User className="h-5 w-5 text-primary" /> Thông tin khách hàng
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-xs text-muted-foreground uppercase font-semibold">Tên khách hàng</p>
                  <p className="font-medium">{order.customer.name}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase font-semibold">Số điện thoại</p>
                  <p className="font-medium">{order.customer.phone}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase font-semibold">Địa chỉ</p>
                  <p className="text-sm">{order.customer.address}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" /> Thông tin bổ sung
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-xs text-muted-foreground uppercase font-semibold">Thời gian</p>
                  <p className="text-sm">{order.time}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase font-semibold">Thu ngân</p>
                  <p className="text-sm font-medium">{order.cashier}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase font-semibold">Chi nhánh</p>
                  <p className="text-sm">Chi nhánh trung tâm</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}

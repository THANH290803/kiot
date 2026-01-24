"use client"

import { useState, useRef, useEffect } from "react"
import {
  Search,
  ShoppingCart,
  UserPlus,
  Trash2,
  Calculator,
  CreditCard,
  Banknote,
  User,
  X,
  Check,
  Printer,
  Plus,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { cn } from "@/lib/utils"

const products = [
  {
    id: 1,
    code: "HH0001",
    name: "Áo thun Cotton Premium",
    price: 250000,
    category: "Thời trang",
    image: "/shirt.jpg",
    color: "Trắng",
    size: "L",
  },
  {
    id: 2,
    code: "HH0002",
    name: "Quần Jean Slim Fit",
    price: 450000,
    category: "Thời trang",
    image: "/various-styles-of-pants.png",
    color: "Xanh",
    size: "32",
  },
  {
    id: 3,
    code: "HH0003",
    name: "Giày Sneaker White",
    price: 850000,
    category: "Giày dép",
    image: "/assorted-shoes.png",
    color: "Trắng",
    size: "42",
  },
  {
    id: 4,
    code: "HH0004",
    name: "Mũ bảo hiểm 3/4",
    price: 320000,
    category: "Phụ kiện",
    image: "/protective-helmet.png",
    color: "Đỏ",
    size: "M",
  },
  {
    id: 5,
    code: "HH0005",
    name: "Ví da bò thật",
    price: 180000,
    category: "Phụ kiện",
    image: "/leather-wallet-contents.png",
    color: "Nâu",
    size: "S",
  },
  {
    id: 6,
    code: "HH0006",
    name: "Thắt lưng công sở",
    price: 220000,
    category: "Phụ kiện",
    image: "/leather-belt.png",
    color: "Đen",
    size: "L",
  },
]

const CATEGORIES = [
  { id: "all", label: "Tất cả" },
  { id: "fashion", label: "Thời trang" },
  { id: "accessory", label: "Phụ kiện" },
  { id: "shoes", label: "Giày dép" },
  { id: "electronics", label: "Điện tử" },
  { id: "home", label: "Gia dụng" },
  { id: "beauty", label: "Làm đẹp" },
  { id: "sports", label: "Thể thao" },
]

export default function POSPage() {
  const [cart, setCart] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [customer, setCustomer] = useState<{ name: string; phone: string } | null>(null)
  const [isCustomerDialogOpen, setIsCustomerDialogOpen] = useState(false)
  const [customerType, setCustomerType] = useState<"existing" | "new">("existing")
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "transfer">("cash")
  const [isReceiptDialogOpen, setIsReceiptDialogOpen] = useState(false)
  const [newCustomerName, setNewCustomerName] = useState("")
  const [newCustomerPhone, setNewCustomerPhone] = useState("")

  const searchRef = useRef<HTMLDivElement>(null)

  const [customers] = useState([
    { name: "Nguyễn Văn A", phone: "0901234567" },
    { name: "Trần Thị B", phone: "0987654321" },
  ])

  const filteredSuggestions = products
    .filter((p) => p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.id.toString().includes(searchQuery))
    .slice(0, 5)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const addToCart = (product: any) => {
    const existing = cart.find((item) => item.id === product.id)
    if (existing) {
      setCart(cart.map((item) => (item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item)))
    } else {
      setCart([...cart, { ...product, quantity: 1 }])
    }
    setShowSuggestions(false)
    setSearchQuery("")
  }

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

  const handleCheckout = () => {
    if (cart.length === 0) return
    setIsReceiptDialogOpen(true)
  }

  const handleCreateNewCustomer = () => {
    if (newCustomerName.trim() && newCustomerPhone.trim()) {
      setCustomer({ name: newCustomerName, phone: newCustomerPhone })
      setIsCustomerDialogOpen(false)
      setNewCustomerName("")
      setNewCustomerPhone("")
    }
  }

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Danh sách sản phẩm (Bên trái) */}
      <div className="flex-1 flex flex-col min-w-0 border-r">
        <div className="bg-white border-b shadow-sm">
          <div className="flex items-center gap-4 px-4 py-3">
            <div className="relative flex-1" ref={searchRef}>
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm tên hoặc mã hàng (F3)"
                className="pl-9 h-10 border-primary/20 focus-visible:ring-primary shadow-inner"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  setShowSuggestions(true)
                }}
                onFocus={() => setShowSuggestions(true)}
              />
              {showSuggestions && searchQuery.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border rounded-md shadow-lg z-50 overflow-hidden">
                  {filteredSuggestions.length > 0 ? (
                    <div className="divide-y">
                      {filteredSuggestions.map((p) => (
                        <div
                          key={p.id}
                          className="p-3 hover:bg-primary/5 cursor-pointer flex items-center justify-between"
                          onClick={() => addToCart(p)}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded bg-muted overflow-hidden shrink-0">
                              <img
                                src={p.image || "/placeholder.svg"}
                                alt={p.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div>
                              <p className="text-sm font-medium">{p.name}</p>
                              <div className="flex items-center gap-2 mt-0.5">
                                <Badge variant="outline" className="text-[10px] px-1 h-4">
                                  {p.color}
                                </Badge>
                                <Badge variant="outline" className="text-[10px] px-1 h-4">
                                  {p.size}
                                </Badge>
                                <span className="text-xs text-muted-foreground">Mã: {p.code}</span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-bold text-primary">{p.price.toLocaleString()} đ</p>
                            <p className="text-xs text-muted-foreground">Tồn: 25</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 text-center text-sm text-muted-foreground">Không tìm thấy sản phẩm</div>
                  )}
                </div>
              )}
            </div>
            <Button variant="ghost" size="icon" className="shrink-0 text-muted-foreground">
              <Plus className="h-5 w-5" />
            </Button>
          </div>
          <ScrollArea className="w-full">
            <div className="px-4 pb-2">
              <Tabs defaultValue="all" className="w-full">
                <TabsList className="bg-transparent h-auto p-0 gap-2 flex">
                  {CATEGORIES.map((cat) => (
                    <TabsTrigger
                      key={cat.id}
                      value={cat.id}
                      className="whitespace-nowrap rounded-full border border-muted-foreground/20 px-4 py-1 data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:border-primary hover:bg-muted transition-all"
                    >
                      {cat.label}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>
            <ScrollBar orientation="horizontal" className="hidden" />
          </ScrollArea>
        </div>

        <ScrollArea className="flex-1 p-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
            {products.map((p) => (
              <Card
                key={p.id}
                className="overflow-hidden cursor-pointer hover:ring-2 hover:ring-primary/50 transition-all border-none shadow-sm"
                onClick={() => addToCart(p)}
              >
                <div className="aspect-square bg-muted relative">
                  <img src={p.image || "/placeholder.svg"} alt={p.name} className="w-full h-full object-cover" />
                  <Badge className="absolute top-2 right-2 bg-primary/90 text-[10px] px-1 h-4">25</Badge>
                </div>
                <CardContent className="p-2 space-y-1">
                  <p className="text-sm font-medium line-clamp-1">{p.name}</p>
                  <div className="flex gap-1">
                    <Badge variant="outline" className="text-[10px] px-1 py-0 h-3 font-normal opacity-70">
                      {p.color}
                    </Badge>
                    <Badge variant="outline" className="text-[10px] px-1 py-0 h-3 font-normal opacity-70">
                      {p.size}
                    </Badge>
                  </div>
                  <p className="text-sm font-bold text-primary">{p.price.toLocaleString()} đ</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Giỏ hàng & Thanh toán (Bên phải) */}
      <div className="w-[420px] flex flex-col bg-white shadow-xl">
        <div className="p-4 border-b flex items-center justify-between bg-primary/5">
          <div className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5 text-primary" />
            <span className="font-bold">Đơn hàng #12345</span>
          </div>
          {customer ? (
            <div className="flex items-center gap-2 bg-primary/10 px-2 py-1 rounded-md">
              <User className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">{customer.name}</span>
              <Button variant="ghost" size="icon" className="h-5 w-5 p-0" onClick={() => setCustomer(null)}>
                <X className="h-3 w-3" />
              </Button>
            </div>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              className="text-primary hover:text-primary hover:bg-primary/10"
              onClick={() => setIsCustomerDialogOpen(true)}
            >
              <UserPlus className="h-4 w-4 mr-2" /> Chọn khách hàng
            </Button>
          )}
        </div>

        <ScrollArea className="flex-1">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-muted-foreground p-8 text-center">
              <ShoppingCart className="h-12 w-12 mb-4 opacity-20" />
              <p>Chưa có sản phẩm nào trong giỏ hàng</p>
            </div>
          ) : (
            <div className="divide-y">
              {cart.map((item) => (
                <div key={item.id} className="p-4 flex gap-3 group">
                  <div className="w-12 h-12 rounded bg-muted overflow-hidden shrink-0">
                    <img
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{item.name}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[10px] font-mono text-muted-foreground">{item.code}</span>
                      <span className="text-[10px] text-muted-foreground">•</span>
                      <span className="text-[10px] font-medium">{item.color}</span>
                      <span className="text-[10px] text-muted-foreground">•</span>
                      <span className="text-[10px] font-medium">{item.size}</span>
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="icon" className="h-6 w-6 bg-transparent" onClick={() => {}}>
                          {" "}
                          -{" "}
                        </Button>
                        <span className="text-sm w-8 text-center font-medium">{item.quantity}</span>
                        <Button variant="outline" size="icon" className="h-6 w-6 bg-transparent" onClick={() => {}}>
                          {" "}
                          +{" "}
                        </Button>
                      </div>
                      <p className="text-sm font-bold">{(item.price * item.quantity).toLocaleString()} đ</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>

        <div className="p-4 bg-muted/30 space-y-3">
          <div className="flex justify-between text-sm">
            <span>Tổng số lượng ({cart.length}):</span>
            <span className="font-medium">{cart.reduce((s, i) => s + i.quantity, 0)}</span>
          </div>
          <div className="flex justify-between text-lg font-bold">
            <span>Tổng tiền:</span>
            <span className="text-primary">{total.toLocaleString()} đ</span>
          </div>

          <RadioGroup
            value={paymentMethod}
            onValueChange={(v) => setPaymentMethod(v as any)}
            className="grid grid-cols-2 gap-2 py-2"
          >
            <div>
              <RadioGroupItem value="cash" id="cash" className="sr-only" />
              <Label
                htmlFor="cash"
                className={cn(
                  "flex h-12 items-center justify-center rounded-md border-2 border-primary/20 bg-transparent px-4 font-medium cursor-pointer transition-all",
                  paymentMethod === "cash"
                    ? "border-primary bg-primary/10 text-primary shadow-sm"
                    : "hover:bg-primary/5",
                )}
              >
                <Banknote className="mr-2 h-4 w-4" /> Tiền mặt
                {paymentMethod === "cash" && <Check className="ml-2 h-3 w-3" />}
              </Label>
            </div>
            <div>
              <RadioGroupItem value="transfer" id="transfer" className="sr-only" />
              <Label
                htmlFor="transfer"
                className={cn(
                  "flex h-12 items-center justify-center rounded-md border-2 border-primary/20 bg-transparent px-4 font-medium cursor-pointer transition-all",
                  paymentMethod === "transfer"
                    ? "border-primary bg-primary/10 text-primary shadow-sm"
                    : "hover:bg-primary/5",
                )}
              >
                <CreditCard className="mr-2 h-4 w-4" /> Chuyển khoản
                {paymentMethod === "transfer" && <Check className="ml-2 h-3 w-3" />}
              </Label>
            </div>
          </RadioGroup>

          <Button
            className="w-full h-14 text-lg font-bold bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20"
            onClick={handleCheckout}
          >
            <Calculator className="mr-2 h-5 w-5" /> THANH TOÁN (F9)
          </Button>
        </div>
      </div>

      <Dialog open={isCustomerDialogOpen} onOpenChange={setIsCustomerDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Thông tin khách hàng</DialogTitle>
          </DialogHeader>
          <Tabs
            value={customerType}
            onValueChange={(v) => {
              setCustomerType(v as any)
              setNewCustomerName("")
              setNewCustomerPhone("")
            }}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="existing">Khách hàng cũ</TabsTrigger>
              <TabsTrigger value="new">Khách hàng mới</TabsTrigger>
            </TabsList>
            <div className="py-4 space-y-4">
              {customerType === "existing" ? (
                <div className="space-y-2">
                  <Label>Tìm theo số điện thoại</Label>
                  <div className="space-y-1">
                    {customers.map((c) => (
                      <div
                        key={c.phone}
                        className="p-3 border rounded-md hover:bg-primary/5 cursor-pointer flex justify-between items-center"
                        onClick={() => {
                          setCustomer(c)
                          setIsCustomerDialogOpen(false)
                        }}
                      >
                        <div>
                          <p className="font-medium">{c.name}</p>
                          <p className="text-xs text-muted-foreground">{c.phone}</p>
                        </div>
                        <Check className="h-4 w-4 text-emerald-500 opacity-0 group-hover:opacity-100" />
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="space-y-1">
                    <Label htmlFor="new-name">Tên khách hàng</Label>
                    <Input
                      id="new-name"
                      placeholder="Nhập họ tên..."
                      value={newCustomerName}
                      onChange={(e) => setNewCustomerName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="new-phone">Số điện thoại</Label>
                    <Input
                      id="new-phone"
                      placeholder="Nhập số điện thoại..."
                      value={newCustomerPhone}
                      onChange={(e) => setNewCustomerPhone(e.target.value)}
                    />
                  </div>
                </div>
              )}
            </div>
          </Tabs>
          <DialogFooter>
            {customerType === "new" && (
              <Button
                className="w-full bg-primary"
                onClick={handleCreateNewCustomer}
                disabled={!newCustomerName.trim() || !newCustomerPhone.trim()}
              >
                Tạo mới và chọn
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isReceiptDialogOpen} onOpenChange={setIsReceiptDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle className="text-center">HÓA ĐƠN BÁN HÀNG</DialogTitle>
          </DialogHeader>
          <div className="p-4 border border-dashed rounded-md bg-white text-xs font-mono space-y-4">
            <div className="text-center border-b pb-2">
              <p className="font-bold text-base">KIOTV0 - RETAIL SYSTEM</p>
              <p>123 Đường ABC, Quận 1, TP. HCM</p>
              <p>Hotline: 1900 1234</p>
            </div>
            <div className="space-y-1">
              <p>Mã HĐ: HD12345</p>
              <p>Ngày: {new Date().toLocaleString()}</p>
              <p>Thu ngân: Admin</p>
              <p>Khách hàng: {customer?.name || "Khách lẻ"}</p>
            </div>
            <table className="w-full text-left">
              <thead className="border-y border-dashed">
                <tr>
                  <th className="py-1">SL x ĐG</th>
                  <th className="text-right">T.Tiền</th>
                </tr>
              </thead>
              <tbody>
                {cart.map((item) => (
                  <tr key={item.id} className="border-b border-dashed border-gray-100">
                    <td className="py-2">
                      <p className="font-bold">{item.name}</p>
                      <p>
                        {item.quantity} x {item.price.toLocaleString()}
                      </p>
                    </td>
                    <td className="text-right align-top py-2">{(item.quantity * item.price).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="space-y-1 pt-2 border-t border-dashed">
              <div className="flex justify-between font-bold text-sm">
                <span>TỔNG CỘNG:</span>
                <span>{total.toLocaleString()} đ</span>
              </div>
              <div className="flex justify-between">
                <span>HT thanh toán:</span>
                <span>{paymentMethod === "cash" ? "Tiền mặt" : "Chuyển khoản"}</span>
              </div>
            </div>
            <div className="text-center pt-4 italic">
              <p>Cảm ơn quý khách!</p>
              <p>Hẹn gặp lại.</p>
            </div>
          </div>
          <DialogFooter className="grid grid-cols-2 gap-2">
            <Button variant="outline" onClick={() => setIsReceiptDialogOpen(false)}>
              Đóng
            </Button>
            <Button className="bg-primary">
              <Printer className="mr-2 h-4 w-4" /> In hóa đơn
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

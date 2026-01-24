"use client"

import { Suspense, useState } from "react"
import { HeaderNav } from "@/components/header-nav"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Search, MoreVertical, Edit, Trash2, Palette, Ruler, ChevronLeft, ChevronRight } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

function AttributesPageContent() {
  const [isAddColorDialogOpen, setIsAddColorDialogOpen] = useState(false)
  const [isAddSizeDialogOpen, setIsAddSizeDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [colorPage, setColorPage] = useState(1)
  const [sizePage, setSizePage] = useState(1)
  const [colorRowsPerPage, setColorRowsPerPage] = useState(10)
  const [sizeRowsPerPage, setSizeRowsPerPage] = useState(10)

  const allColors = [
    { id: 1, name: "Đen", code: "#000000" },
    { id: 2, name: "Trắng", code: "#FFFFFF" },
    { id: 3, name: "Đỏ", code: "#FF0000" },
    { id: 4, name: "Xanh dương", code: "#0000FF" },
    { id: 5, name: "Xanh lá", code: "#00FF00" },
    { id: 6, name: "Vàng", code: "#FFFF00" },
    { id: 7, name: "Tím", code: "#800080" },
    { id: 8, name: "Cam", code: "#FFA500" },
  ]

  const allSizes = [
    { id: 1, name: "S", description: "Small" },
    { id: 2, name: "M", description: "Medium" },
    { id: 3, name: "L", description: "Large" },
    { id: 4, name: "XL", description: "Extra Large" },
    { id: 5, name: "XXL", description: "Double Extra Large" },
    { id: 6, name: "XXXL", description: "Triple Extra Large" },
    { id: 7, name: "28", description: "Kích cỡ 28" },
    { id: 8, name: "30", description: "Kích cỡ 30" },
  ]

  const colorTotalPages = Math.ceil(allColors.length / colorRowsPerPage)
  const sizeTotalPages = Math.ceil(allSizes.length / sizeRowsPerPage)
  const colorStartIdx = (colorPage - 1) * colorRowsPerPage
  const sizeStartIdx = (sizePage - 1) * sizeRowsPerPage
  const colors = allColors.slice(colorStartIdx, colorStartIdx + colorRowsPerPage)
  const sizes = allSizes.slice(sizeStartIdx, sizeStartIdx + sizeRowsPerPage)

  return (
    <div className="min-h-screen bg-background">
      <HeaderNav />
      <main className="container mx-auto p-6 space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Quản lý thuộc tính sản phẩm</h1>
            <p className="text-sm text-muted-foreground">Quản lý màu sắc, kích cỡ và các thuộc tính khác</p>
          </div>
        </div>

        <Tabs defaultValue="colors" className="w-full">
          <TabsList>
            <TabsTrigger value="colors">Màu sắc</TabsTrigger>
            <TabsTrigger value="sizes">Kích cỡ</TabsTrigger>
          </TabsList>

          <TabsContent value="colors" className="mt-6">
            <Card>
              <CardHeader>
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Palette className="h-5 w-5 text-primary" />
                    Danh sách màu sắc
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <div className="relative w-full md:w-64">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input placeholder="Tìm kiếm màu..." className="pl-8" />
                    </div>
                    <Dialog open={isAddColorDialogOpen} onOpenChange={setIsAddColorDialogOpen}>
                      <DialogTrigger asChild>
                        <Button className="bg-primary">
                          <Plus className="h-4 w-4 mr-2" /> Thêm màu
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Thêm màu sắc mới</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <div className="space-y-2">
                            <Label htmlFor="color-name">Tên màu</Label>
                            <Input id="color-name" placeholder="Nhập tên màu..." />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="color-code">Mã màu (Hex)</Label>
                            <div className="flex gap-2">
                              <Input id="color-code" type="color" className="w-16 h-10" defaultValue="#000000" />
                              <Input placeholder="#000000" className="flex-1" />
                            </div>
                          </div>
                        </div>
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setIsAddColorDialogOpen(false)}>
                            Hủy
                          </Button>
                          <Button className="bg-primary" onClick={() => setIsAddColorDialogOpen(false)}>
                            Lưu
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Màu sắc</TableHead>
                      <TableHead>Tên màu</TableHead>
                      <TableHead>Mã màu</TableHead>
                      <TableHead className="text-right">Thao tác</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {colors.map((color) => (
                      <TableRow key={color.id}>
                        <TableCell>
                          <div
                            className="w-10 h-10 rounded border-2 border-border"
                            style={{ backgroundColor: color.code }}
                          />
                        </TableCell>
                        <TableCell className="font-medium">{color.name}</TableCell>
                        <TableCell className="text-muted-foreground font-mono">{color.code}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Edit className="h-4 w-4 mr-2" /> Sửa
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-destructive"
                                onClick={() => setIsDeleteDialogOpen(true)}
                              >
                                <Trash2 className="h-4 w-4 mr-2" /> Xóa
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
              </TableBody>
            </Table>
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Hiển thị</span>
                <Select value={colorRowsPerPage.toString()} onValueChange={(val) => {
                  setColorRowsPerPage(parseInt(val))
                  setColorPage(1)
                }}>
                  <SelectTrigger className="w-20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="25">25</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                    <SelectItem value="100">100</SelectItem>
                  </SelectContent>
                </Select>
                <span className="text-sm">bản ghi</span>
                <span className="text-sm text-muted-foreground">Tổng số: {allColors.length}</span>
              </div>
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setColorPage(Math.max(1, colorPage - 1))}
                  disabled={colorPage === 1}
                  className="gap-1"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>
                <span className="text-sm font-medium">{colorPage}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setColorPage(Math.min(colorTotalPages, colorPage + 1))}
                  disabled={colorPage === colorTotalPages}
                  className="gap-1"
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
          </TabsContent>

          <TabsContent value="sizes" className="mt-6">
            <Card>
              <CardHeader>
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Ruler className="h-5 w-5 text-primary" />
                    Danh sách kích cỡ
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <div className="relative w-full md:w-64">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input placeholder="Tìm kiếm kích cỡ..." className="pl-8" />
                    </div>
                    <Dialog open={isAddSizeDialogOpen} onOpenChange={setIsAddSizeDialogOpen}>
                      <DialogTrigger asChild>
                        <Button className="bg-primary">
                          <Plus className="h-4 w-4 mr-2" /> Thêm size
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Thêm kích cỡ mới</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <div className="space-y-2">
                            <Label htmlFor="size-name">Tên kích cỡ</Label>
                            <Input id="size-name" placeholder="VD: S, M, L, XL..." />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="size-desc">Mô tả</Label>
                            <Input id="size-desc" placeholder="VD: Small, Medium..." />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setIsAddSizeDialogOpen(false)}>
                            Hủy
                          </Button>
                          <Button className="bg-primary" onClick={() => setIsAddSizeDialogOpen(false)}>
                            Lưu
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tên kích cỡ</TableHead>
                      <TableHead>Mô tả</TableHead>
                      <TableHead className="text-right">Thao tác</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sizes.map((size) => (
                      <TableRow key={size.id}>
                        <TableCell className="font-bold text-lg">{size.name}</TableCell>
                        <TableCell className="text-muted-foreground">{size.description}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Edit className="h-4 w-4 mr-2" /> Sửa
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-destructive"
                                onClick={() => setIsDeleteDialogOpen(true)}
                              >
                                <Trash2 className="h-4 w-4 mr-2" /> Xóa
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Hiển thị</span>
                    <Select value={sizeRowsPerPage.toString()} onValueChange={(val) => {
                      setSizeRowsPerPage(parseInt(val))
                      setSizePage(1)
                    }}>
                      <SelectTrigger className="w-20">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="10">10</SelectItem>
                        <SelectItem value="25">25</SelectItem>
                        <SelectItem value="50">50</SelectItem>
                        <SelectItem value="100">100</SelectItem>
                      </SelectContent>
                    </Select>
                    <span className="text-sm">bản ghi</span>
                    <span className="text-sm text-muted-foreground">Tổng số: {allSizes.length}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSizePage(Math.max(1, sizePage - 1))}
                      disabled={sizePage === 1}
                      className="gap-1"
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Previous
                    </Button>
                    <span className="text-sm font-medium">{sizePage}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSizePage(Math.min(sizeTotalPages, sizePage + 1))}
                      disabled={sizePage === sizeTotalPages}
                      className="gap-1"
                    >
                      Next
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
              <AlertDialogDescription>
                Bạn có chắc chắn muốn xóa mục này không? Hành động này không thể hoàn tác.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Hủy</AlertDialogCancel>
              <AlertDialogAction className="bg-destructive text-destructive-foreground">Xóa</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </main>
    </div>
  )
}

export default function AttributesPage() {
  return (
    <Suspense fallback={null}>
      <AttributesPageContent />
    </Suspense>
  )
}

"use client"

import { Suspense, useState } from "react"
import { HeaderNav } from "@/components/header-nav"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Search, MoreVertical, Edit, Trash2, Tag, ChevronLeft, ChevronRight } from "lucide-react"
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
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

function BrandsPageContent() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  const allBrands = [
    { id: 1, name: "Nike", origin: "USA", productCount: 78 },
    { id: 2, name: "Adidas", origin: "Germany", productCount: 65 },
    { id: 3, name: "Uniqlo", origin: "Japan", productCount: 52 },
    { id: 4, name: "Zara", origin: "Spain", productCount: 48 },
    { id: 5, name: "H&M", origin: "Sweden", productCount: 42 },
    { id: 6, name: "Gucci", origin: "Italy", productCount: 38 },
    { id: 7, name: "Prada", origin: "Italy", productCount: 35 },
    { id: 8, name: "Louis Vuitton", origin: "France", productCount: 45 },
  ]

  const totalPages = Math.ceil(allBrands.length / rowsPerPage)
  const startIdx = (currentPage - 1) * rowsPerPage
  const brands = allBrands.slice(startIdx, startIdx + rowsPerPage)

  return (
    <div className="min-h-screen bg-background">
      <HeaderNav />
      <main className="container mx-auto p-6 space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Quản lý thương hiệu</h1>
            <p className="text-sm text-muted-foreground">Quản lý các thương hiệu sản phẩm kinh doanh</p>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary">
                <Plus className="h-4 w-4 mr-2" /> Thêm thương hiệu
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Thêm thương hiệu mới</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="brand-name">Tên thương hiệu</Label>
                  <Input id="brand-name" placeholder="Nhập tên thương hiệu..." />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="brand-origin">Xuất xứ</Label>
                  <Input id="brand-origin" placeholder="Quốc gia xuất xứ..." />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Hủy
                </Button>
                <Button className="bg-primary" onClick={() => setIsAddDialogOpen(false)}>
                  Lưu
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <CardTitle className="flex items-center gap-2">
                <Tag className="h-5 w-5 text-primary" />
                Danh sách thương hiệu
              </CardTitle>
              <div className="relative w-full md:w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Tìm kiếm thương hiệu..." className="pl-8" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tên thương hiệu</TableHead>
                  <TableHead>Xuất xứ</TableHead>
                  <TableHead className="text-right">Số sản phẩm</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {brands.map((brand) => (
                  <TableRow key={brand.id}>
                    <TableCell className="font-medium">{brand.name}</TableCell>
                    <TableCell className="text-muted-foreground">{brand.origin}</TableCell>
                    <TableCell className="text-right">
                      <Badge variant="secondary">{brand.productCount}</Badge>
                    </TableCell>
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
                          <DropdownMenuItem className="text-destructive" onClick={() => setIsDeleteDialogOpen(true)}>
                            <Trash2 className="h-4 w-4 mr-2" /> Xóa
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-t pt-4">
              <div className="flex items-center gap-2">
                <span className="text-sm">Hiển thị</span>
                <Select value={rowsPerPage.toString()} onValueChange={(val) => {
                  setRowsPerPage(parseInt(val))
                  setCurrentPage(1)
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
                <span className="text-sm text-muted-foreground">Tổng số: {allBrands.length}</span>
              </div>
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="gap-1"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>
                <span className="text-sm font-medium">{currentPage}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="gap-1"
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Xác nhận xóa thương hiệu</AlertDialogTitle>
              <AlertDialogDescription>
                Bạn có chắc chắn muốn xóa thương hiệu này không? Hành động này không thể hoàn tác.
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

export default function BrandsPage() {
  return (
    <Suspense fallback={null}>
      <BrandsPageContent />
    </Suspense>
  )
}

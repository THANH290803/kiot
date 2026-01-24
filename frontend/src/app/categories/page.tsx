"use client"

import { Label } from "@/components/ui/label"

import { Suspense, useState } from "react"
import { HeaderNav } from "@/components/header-nav"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Search, MoreVertical, Edit, Trash2, FolderOpen } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog"
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
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

function CategoriesPageContent() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  const categories = [
    { id: 1, name: "Thời trang", description: "Quần áo, áo thun, áo sơ mi", productCount: 145 },
    { id: 2, name: "Giày dép", description: "Giày sneaker, sandal, dép", productCount: 89 },
    { id: 3, name: "Phụ kiện", description: "Ví, thắt lưng, mũ", productCount: 67 },
    { id: 4, name: "Đồ thể thao", description: "Trang phục và dụng cụ thể thao", productCount: 42 },
  ]

  return (
    <div className="min-h-screen bg-background">
      <HeaderNav />
      <main className="container mx-auto p-6 space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Quản lý danh mục</h1>
            <p className="text-sm text-muted-foreground">Phân loại và tổ chức sản phẩm theo danh mục</p>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary">
                <Plus className="h-4 w-4 mr-2" /> Thêm danh mục
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Thêm danh mục mới</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="category-name">Tên danh mục</Label>
                  <Input id="category-name" placeholder="Nhập tên danh mục..." />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category-desc">Mô tả</Label>
                  <Input id="category-desc" placeholder="Mô tả ngắn về danh mục..." />
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
                <FolderOpen className="h-5 w-5 text-primary" />
                Danh sách danh mục
              </CardTitle>
              <div className="relative w-full md:w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Tìm kiếm danh mục..." className="pl-8" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tên danh mục</TableHead>
                  <TableHead>Mô tả</TableHead>
                  <TableHead className="text-right">Số sản phẩm</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.map((category) => (
                  <TableRow key={category.id}>
                    <TableCell className="font-medium">{category.name}</TableCell>
                    <TableCell className="text-muted-foreground">{category.description}</TableCell>
                    <TableCell className="text-right">
                      <Badge variant="secondary">{category.productCount}</Badge>
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

            <div className="flex items-center justify-between py-4 mt-2 border-t">
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <span>Dòng mỗi trang</span>
                  <Select value={String(rowsPerPage)} onValueChange={(v) => setRowsPerPage(Number(v))}>
                    <SelectTrigger className="h-8 w-[70px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="10">10</SelectItem>
                      <SelectItem value="20">20</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Pagination className="mx-0 w-auto">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious href="#" />
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href="#" isActive>
                      1
                    </PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationNext href="#" />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          </CardContent>
        </Card>

        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Xác nhận xóa danh mục</AlertDialogTitle>
              <AlertDialogDescription>
                Bạn có chắc chắn muốn xóa danh mục này không? Hành động này không thể hoàn tác.
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

export default function CategoriesPage() {
  return (
    <Suspense fallback={null}>
      <CategoriesPageContent />
    </Suspense>
  )
}

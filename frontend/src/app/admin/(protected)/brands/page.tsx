"use client"

import { Suspense, useState } from "react"
import { HeaderNav } from "@/features/admin/components/header-nav"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Plus, Search, MoreVertical, Edit, Trash2, Tag,
} from "lucide-react"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Label } from "@/components/ui/label"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"

import { useBrands } from "@/features/admin/hooks/useBrands"

function BrandsPageContent() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  const {
    paginatedBrands,
    loading,

    search,
    setSearch,

    rowsPerPage,
    setRowsPerPage,
    currentPage,
    setCurrentPage,
    totalPages,
    totalItems, // 👈 tổng số bản ghi

    newName,
    setNewName,
    newDescription,
    setNewDescription,
    createBrand,

    editingBrand,
    setEditingBrand,
    editName,
    setEditName,
    editDescription,
    setEditDescription,
    updateBrand,

    deletingBrand,
    setDeletingBrand,
    deleteBrand,
  } = useBrands()

  return (
    <div className="min-h-screen bg-background">
      <HeaderNav />
      <main className="container mx-auto p-6 space-y-6">

        {/* HEADER */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Quản lý thương hiệu</h1>
            <p className="text-sm text-muted-foreground">
              Quản lý các thương hiệu sản phẩm kinh doanh
            </p>
          </div>

          {/* ADD */}
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" /> Thêm thương hiệu
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Thêm thương hiệu mới</DialogTitle>
              </DialogHeader>

              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Tên thương hiệu</Label>
                  <Input value={newName} onChange={(e) => setNewName(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Mô tả</Label>
                  <Input value={newDescription} onChange={(e) => setNewDescription(e.target.value)} />
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Hủy</Button>
                <Button
                  onClick={async () => {
                    await createBrand()
                    setIsAddDialogOpen(false)
                  }}
                  disabled={loading}
                >
                  {loading ? "Đang lưu..." : "Lưu"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* TABLE */}
        <Card>
          <CardHeader>
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <CardTitle className="flex items-center gap-2">
                <Tag className="h-5 w-5 text-primary" />
                Danh sách thương hiệu
              </CardTitle>

              <div className="relative w-full md:w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Tìm kiếm thương hiệu..."
                  className="pl-8"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value)
                    setCurrentPage(1)
                  }}
                />
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tên thương hiệu</TableHead>
                  <TableHead>Mô tả</TableHead>
                  <TableHead className="text-right">Hành động</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedBrands.length ? paginatedBrands.map((brand) => (
                  <TableRow key={brand.id}>
                    <TableCell className="font-medium">{brand.name}</TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {brand.description || "--"}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => {
                              setEditingBrand(brand)
                              setEditName(brand.name)
                              setEditDescription(brand.description || "")
                              setIsEditDialogOpen(true)
                            }}
                          >
                            <Edit className="h-4 w-4 mr-2" /> Sửa
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => {
                              setDeletingBrand(brand)
                              setIsDeleteDialogOpen(true)
                            }}
                          >
                            <Trash2 className="h-4 w-4 mr-2" /> Xóa
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                )) : (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center text-muted-foreground">
                      Không tìm thấy thương hiệu
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>

            {/* PAGINATION (ĐẸP + ĐÚNG YÊU CẦU) */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-t pt-4">

              {/* LEFT */}
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <span>Hiển thị</span>
                <Select
                  value={rowsPerPage.toString()}
                  onValueChange={(v) => {
                    setRowsPerPage(Number(v))
                    setCurrentPage(1)
                  }}
                >
                  <SelectTrigger className="h-8 w-[70px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[10, 25, 50, 100].map(v => (
                      <SelectItem key={v} value={v.toString()}>{v}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <span>bản ghi · Tổng số:</span>
                <b>{totalItems}</b>
              </div>

              {/* RIGHT */}
              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="icon"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(1)}
                >
                  «
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(currentPage - 1)}
                >
                  ‹
                </Button>

                <span className="px-3 text-sm font-medium">
                  {currentPage} / {totalPages}
                </span>

                <Button
                  variant="outline"
                  size="icon"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(currentPage + 1)}
                >
                  ›
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(totalPages)}
                >
                  »
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* EDIT */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Sửa thương hiệu</DialogTitle>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Tên thương hiệu</Label>
                <Input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Mô tả</Label>
                <Input
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsEditDialogOpen(false)}
              >
                Hủy
              </Button>
              <Button
                onClick={async () => {
                  await updateBrand()
                  setIsEditDialogOpen(false)
                }}
                disabled={loading}
              >
                {loading ? "Đang lưu..." : "Lưu"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* DELETE */}
        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Xác nhận xóa thương hiệu</AlertDialogTitle>
              <AlertDialogDescription>
                Bạn có chắc chắn muốn xóa{" "}
                <b>{deletingBrand?.name}</b> không? Hành động này không thể hoàn tác.
              </AlertDialogDescription>
            </AlertDialogHeader>

            <AlertDialogFooter>
              <AlertDialogCancel>Hủy</AlertDialogCancel>
              <AlertDialogAction
                className="bg-destructive text-destructive-foreground"
                onClick={async () => {
                  await deleteBrand()
                  setIsDeleteDialogOpen(false)
                }}
              >
                Xóa
              </AlertDialogAction>
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

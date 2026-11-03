"use client"

import { Label } from "@/components/ui/label"

import { Suspense, useState } from "react"
import { HeaderNav } from "@/features/admin/components/header-nav"
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

import { useCategories, type CategoryItem } from "@/features/admin/hooks/useCategories"

function CategoriesPageContent() {
  // ===== UI state =====
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  // ===== Hook =====
  const {
    categories,
    parentOptions,
    paginatedCategories,
    loading,

    rowsPerPage,
    setRowsPerPage,
    currentPage,
    setCurrentPage,
    totalPages,

    search,
    setSearch,

    newName,
    setNewName,
    newDescription,
    setNewDescription,
    newParentId,
    setNewParentId,
    createCategory,
    resetCreateCategoryForm,

    editingCategory,
    setEditingCategory,
    editName,
    setEditName,
    editDescription,
    setEditDescription,
    editParentId,
    setEditParentId,
    updateCategory,
    resetEditCategoryForm,

    deletingCategory,
    setDeletingCategory,
    deleteCategory,
    resetDeleteCategoryState,
  } = useCategories()

  // ===== handlers =====
  const handleAddDialogOpenChange = (open: boolean) => {
    setIsAddDialogOpen(open)

    if (!open) {
      resetCreateCategoryForm()
    }
  }

  const handleEditDialogOpenChange = (open: boolean) => {
    setIsEditDialogOpen(open)

    if (!open) {
      resetEditCategoryForm()
    }
  }

  const handleDeleteDialogOpenChange = (open: boolean) => {
    setIsDeleteDialogOpen(open)

    if (!open) {
      resetDeleteCategoryState()
    }
  }

  const handleCreateCategory = async () => {
    await createCategory()
    handleAddDialogOpenChange(false)
  }

  const handleUpdateCategory = async () => {
    await updateCategory()
    handleEditDialogOpenChange(false)
  }

  const handleDeleteCategory = async () => {
    await deleteCategory()
    handleDeleteDialogOpenChange(false)
  }

  const getParentName = (category: CategoryItem) => {
    if (category.parent?.name) return category.parent.name
    if (!category.parent_id) return "--"

    return categories.find((item) => String(item.id) === String(category.parent_id))?.name || "--"
  }
  
  return (
    <div className="min-h-screen bg-background">
      <HeaderNav />
      <main className="container mx-auto p-6 space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Quản lý danh mục</h1>
            <p className="text-sm text-muted-foreground">Phân loại và tổ chức sản phẩm theo danh mục</p>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={handleAddDialogOpenChange}>
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
                  <Input id="category-name"
                    placeholder="Nhập tên danh mục..."
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category-desc">Mô tả</Label>
                  <Input id="category-desc"
                    placeholder="Mô tả ngắn về danh mục..."
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category-parent">Danh mục cha</Label>
                  <Select value={newParentId} onValueChange={setNewParentId}>
                    <SelectTrigger id="category-parent" className="w-full">
                      <SelectValue placeholder="Chọn danh mục cha" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Không có - danh mục gốc</SelectItem>
                      {parentOptions.map((category) => (
                        <SelectItem key={category.id} value={String(category.id)}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => handleAddDialogOpenChange(false)}>
                  Hủy
                </Button>
                <Button
                  className="bg-primary"
                  onClick={handleCreateCategory}
                  disabled={loading}
                >
                  {loading ? "Đang lưu..." : "Lưu"}
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
                <Input
                  placeholder="Tìm kiếm danh mục..."
                  className="pl-8"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value)
                    setCurrentPage(1)
                  }} />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tên danh mục</TableHead>
                  <TableHead>Danh mục cha</TableHead>
                  <TableHead>Loại</TableHead>
                  <TableHead>Mô tả</TableHead>
                  <TableHead className="text-right">Hành động</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedCategories.length > 0 ? (
                  paginatedCategories.map((category) => (
                    <TableRow key={category.id}>
                      <TableCell className="font-medium">{category.name}</TableCell>
                      <TableCell className="text-muted-foreground text-sm">{getParentName(category)}</TableCell>
                      <TableCell>
                        <Badge variant={category.parent_id ? "secondary" : "default"}>
                          {category.parent_id ? "Danh mục con" : "Nhóm cha"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">{category.description || "--"}</TableCell>
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
                                setEditingCategory(category)
                                setEditName(category.name)
                                setEditDescription(category.description || "")
                                setEditParentId(category.parent_id ? String(category.parent_id) : "none")
                                setIsEditDialogOpen(true)
                              }}
                            >
                              <Edit className="h-4 w-4 mr-2" />
                              Sửa
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600"
                              onClick={() => {
                                setDeletingCategory(category)
                                setIsDeleteDialogOpen(true)
                              }} >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Xóa
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground">
                      Không tìm thấy danh mục
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>

            <div className="flex items-center justify-between py-4 mt-2 border-t">
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <span>Dòng mỗi trang</span>
                  <Select
                    value={String(rowsPerPage)}
                    onValueChange={(v) => {
                      setRowsPerPage(Number(v))
                      setCurrentPage(1)
                    }}
                  >
                    <SelectTrigger className="h-8 w-[70px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="10">10</SelectItem>
                      <SelectItem value="25">25</SelectItem>
                      <SelectItem value="50">50</SelectItem>
                      <SelectItem value="100">100</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Pagination className="mx-0 w-auto">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <PaginationItem key={page}>
                      <PaginationLink
                        isActive={page === currentPage}
                        onClick={() => setCurrentPage(page)}
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  ))}

                  <PaginationItem>
                    <PaginationNext
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          </CardContent>
        </Card>

        <Dialog open={isEditDialogOpen} onOpenChange={handleEditDialogOpenChange}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Sửa danh mục</DialogTitle>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-category-name">Tên danh mục</Label>
                <Input
                  id="edit-category-name"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="Nhập tên danh mục..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-category-desc">Mô tả</Label>
                <Input
                  id="edit-category-desc"
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  placeholder="Mô tả ngắn về danh mục..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-category-parent">Danh mục cha</Label>
                <Select value={editParentId} onValueChange={setEditParentId}>
                  <SelectTrigger id="edit-category-parent" className="w-full">
                    <SelectValue placeholder="Chọn danh mục cha" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Không có - danh mục gốc</SelectItem>
                    {parentOptions
                      .filter((category) => String(category.id) !== String(editingCategory?.id))
                      .map((category) => (
                        <SelectItem key={category.id} value={String(category.id)}>
                          {category.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => handleEditDialogOpenChange(false)}>
                Hủy
              </Button>
              <Button
                className="bg-primary"
                onClick={handleUpdateCategory}
                disabled={loading}
              >
                {loading ? "Đang lưu..." : "Lưu"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <AlertDialog open={isDeleteDialogOpen} onOpenChange={handleDeleteDialogOpenChange}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Xác nhận xóa danh mục</AlertDialogTitle>
              <AlertDialogDescription>
                Bạn có chắc chắn muốn xóa danh mục{" "}
                <span className="font-semibold">
                  {deletingCategory?.name}
                </span>{" "}
                không? Hành động này không thể hoàn tác.
              </AlertDialogDescription>
            </AlertDialogHeader>

            <AlertDialogFooter>
              <AlertDialogCancel disabled={loading}>Hủy</AlertDialogCancel>
              <AlertDialogAction
                className="bg-destructive text-destructive-foreground"
                onClick={handleDeleteCategory}
                disabled={loading}
              >
                {loading ? "Đang xóa..." : "Xóa"}
              </AlertDialogAction>
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

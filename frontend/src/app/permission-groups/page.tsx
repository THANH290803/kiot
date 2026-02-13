"use client"

import React from "react"

import { HeaderNav } from "@/components/header-nav"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Plus,
  Search,
  MoreVertical,
  Edit,
  Trash2,
  Shield,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { usePermissionGroups } from "@/hooks/usePermissionGroups"

export default function PermissionGroupsPage() {
  const {
    /* data */
    paginatedGroups,
    groups,
    loading,

    /* pagination */
    page,
    setPage,
    rowsPerPage,
    setRowsPerPage,
    totalPages,

    /* dialog state */
    isAddDialogOpen,
    setIsAddDialogOpen,
    isEditDialogOpen,
    setIsEditDialogOpen,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    editingGroup,

    /* actions */
    openAddDialog,
    openEditDialog,
    openDeleteDialog,

    createGroup,
    updateGroup,
    deleteGroup,
  } = usePermissionGroups()

  /* ================= SUBMIT HANDLERS ================= */
  const handleAddGroup = async (e: React.FormEvent) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget as HTMLFormElement)

    await createGroup({
      name: formData.get("name") as string,
      description: formData.get("description") as string,
    })
  }

  const handleEditGroup = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingGroup) return

    const formData = new FormData(e.currentTarget as HTMLFormElement)

    await updateGroup(editingGroup.id, {
      name: formData.get("name") as string,
      description: formData.get("description") as string,
    })
  }

  return (
    <div className="min-h-screen bg-background">
      <HeaderNav />

      <main className="container mx-auto p-6 space-y-6">
        {/* ================= HEADER ================= */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Nhóm Quyền Hạn
            </h1>
            <p className="text-sm text-muted-foreground">
              Quản lý các nhóm quyền hạn cho hệ thống
            </p>
          </div>

          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button
                className="gap-2 bg-primary hover:bg-primary/90"
                onClick={openAddDialog}
              >
                <Plus className="h-4 w-4" />
                Thêm Nhóm Quyền Hạn
              </Button>
            </DialogTrigger>

            <DialogContent>
              <DialogHeader>
                <DialogTitle>Thêm Nhóm Quyền Hạn Mới</DialogTitle>
              </DialogHeader>

              <form onSubmit={handleAddGroup} className="space-y-4">
                <div className="space-y-2">
                  <Label>Tên nhóm quyền hạn</Label>
                  <Input name="name" placeholder="Nhập tên nhóm" required />
                </div>

                <div className="space-y-2">
                  <Label>Mô tả</Label>
                  <Input name="description" placeholder="Mô tả tên nhóm" />
                </div>

                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsAddDialogOpen(false)}
                  >
                    Hủy
                  </Button>
                  <Button type="submit">Thêm</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* ================= TABLE ================= */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Danh sách nhóm quyền hạn
              </CardTitle>

              <div className="relative w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Tìm kiếm nhóm quyền hạn..."
                  className="pl-8"
                />
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tên nhóm</TableHead>
                  <TableHead className="w-[320px]">Mô tả</TableHead>
                  <TableHead className="text-right">
                    Số quyền hạn
                  </TableHead>
                  <TableHead className="text-right">
                    Hành động
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="text-center text-sm text-muted-foreground py-6"
                    >
                      Đang tải dữ liệu...
                    </TableCell>
                  </TableRow>
                ) : paginatedGroups.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="text-center text-sm text-muted-foreground py-6"
                    >
                      Không có group
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedGroups.map((group) => (
                    <TableRow key={group.id}>
                      <TableCell className="font-medium">
                        {group.name}
                      </TableCell>

                      <TableCell className="text-muted-foreground text-sm max-w-[320px] whitespace-normal break-words">
                        {group.description}
                      </TableCell>

                      <TableCell className="text-right">
                        {group.permission_count ?? 0}
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
                              onClick={() => openEditDialog(group)}
                            >
                              <Edit className="h-4 w-4 mr-2" />
                              Sửa
                            </DropdownMenuItem>

                            <DropdownMenuItem
                              className="text-red-600"
                              onClick={() => openDeleteDialog(group)}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Xóa
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>

            {/* ================= PAGINATION ================= */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-t pt-4">
              <div className="flex items-center gap-2">
                <span className="text-sm">Hiển thị</span>
                <Select
                  value={rowsPerPage.toString()}
                  onValueChange={(val) => {
                    setRowsPerPage(parseInt(val))
                    setPage(1)
                  }}
                >
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
                <span className="text-sm text-muted-foreground">
                  Tổng số: {groups.length}
                </span>
              </div>

              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page === 1}
                  onClick={() => setPage(page - 1)}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>

                {/* ✅ HIỂN THỊ: trang hiện tại / tổng trang */}
                <span className="text-sm font-medium">
                  {page} / {totalPages}
                </span>

                <Button
                  variant="outline"
                  size="sm"
                  disabled={page === totalPages}
                  onClick={() => setPage(page + 1)}
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* ================= EDIT ================= */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Sửa Nhóm Quyền Hạn</DialogTitle>
          </DialogHeader>

          {editingGroup && (
            <form onSubmit={handleEditGroup} className="space-y-4">
              <div className="space-y-2">
                <Label>Tên nhóm quyền hạn</Label>
                <Input name="name" defaultValue={editingGroup.name} placeholder="Nhập tên nhóm" />
              </div>

              <div className="space-y-2">
                <Label>Mô tả</Label>
                <Input
                  name="description"
                  defaultValue={editingGroup.description}
                  placeholder="Mô tả tên nhóm"
                />
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsEditDialogOpen(false)}
                >
                  Hủy
                </Button>
                <Button type="submit">Lưu</Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* ================= DELETE ================= */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xóa Nhóm Quyền Hạn</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa nhóm quyền hạn "
              {editingGroup?.name}"? Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteGroup(editingGroup!.id)}
              className="bg-red-600 hover:bg-red-700"
            >
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

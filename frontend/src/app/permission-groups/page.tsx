"use client"

import React from "react"

import { HeaderNav } from "@/components/header-nav"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Search, MoreVertical, Edit, Trash2, Shield, ChevronLeft, ChevronRight } from "lucide-react"
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function PermissionGroupsPage() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [editingGroup, setEditingGroup] = useState<any>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  const [permissionGroups, setPermissionGroups] = useState([
    { id: 1, name: "Quản lý người dùng", description: "Các quyền liên quan đến quản lý người dùng", permissionCount: 8 },
    { id: 2, name: "Quản lý sản phẩm", description: "Các quyền liên quan đến quản lý sản phẩm và danh mục", permissionCount: 12 },
    { id: 3, name: "Quản lý bán hàng", description: "Các quyền liên quan đến bán hàng và đơn hàng", permissionCount: 10 },
    { id: 4, name: "Quản lý báo cáo", description: "Các quyền liên quan đến xem và xuất báo cáo", permissionCount: 6 },
    { id: 5, name: "Quản lý cửa hàng", description: "Các quyền liên quan đến thiết lập cửa hàng", permissionCount: 9 },
  ])

  const totalPages = Math.ceil(permissionGroups.length / rowsPerPage)
  const startIdx = (currentPage - 1) * rowsPerPage
  const displayedGroups = permissionGroups.slice(startIdx, startIdx + rowsPerPage)

  const handleAddGroup = (e: React.FormEvent) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget as HTMLFormElement)
    const newGroup = {
      id: Math.max(...permissionGroups.map(g => g.id), 0) + 1,
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      permissionCount: 0,
    }
    setPermissionGroups([...permissionGroups, newGroup])
    setIsAddDialogOpen(false)
  }

  const handleEditGroup = (e: React.FormEvent) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget as HTMLFormElement)
    setPermissionGroups(
      permissionGroups.map(g =>
        g.id === editingGroup.id
          ? {
              ...g,
              name: formData.get("name") as string,
              description: formData.get("description") as string,
            }
          : g
      )
    )
    setIsEditDialogOpen(false)
    setEditingGroup(null)
  }

  const handleDeleteGroup = () => {
    setPermissionGroups(permissionGroups.filter(g => g.id !== editingGroup.id))
    setIsDeleteDialogOpen(false)
    setEditingGroup(null)
  }

  return (
    <div className="min-h-screen bg-background">
      <HeaderNav />
      <main className="container mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Nhóm Quyền Hạn</h1>
            <p className="text-sm text-muted-foreground">Quản lý các nhóm quyền hạn cho hệ thống</p>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2 bg-primary hover:bg-primary/90">
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
                  <Label htmlFor="name">Tên nhóm quyền hạn</Label>
                  <Input id="name" name="name" placeholder="Nhập tên nhóm..." required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Mô tả</Label>
                  <Input id="description" name="description" placeholder="Mô tả nhóm quyền hạn..." />
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Hủy
                  </Button>
                  <Button type="submit" className="bg-primary hover:bg-primary/90">
                    Thêm
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Danh sách nhóm quyền hạn
              </CardTitle>
              <div className="relative w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Tìm kiếm nhóm quyền hạn..." className="pl-8" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tên nhóm</TableHead>
                  <TableHead>Mô tả</TableHead>
                  <TableHead className="text-right">Số quyền hạn</TableHead>
                  <TableHead className="text-right">Hành động</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {displayedGroups.map(group => (
                  <TableRow key={group.id}>
                    <TableCell className="font-medium">{group.name}</TableCell>
                    <TableCell className="text-muted-foreground text-sm">{group.description}</TableCell>
                    <TableCell className="text-right">{group.permissionCount}</TableCell>
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
                              setEditingGroup(group)
                              setIsEditDialogOpen(true)
                            }}
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Sửa
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => {
                              setEditingGroup(group)
                              setIsDeleteDialogOpen(true)
                            }}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Xóa
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
                <Select value={rowsPerPage.toString()} onValueChange={val => {
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
                <span className="text-sm text-muted-foreground">Tổng số: {permissionGroups.length}</span>
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
      </main>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Sửa Nhóm Quyền Hạn</DialogTitle>
          </DialogHeader>
          {editingGroup && (
            <form onSubmit={handleEditGroup} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Tên nhóm quyền hạn</Label>
                <Input id="edit-name" name="name" defaultValue={editingGroup.name} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-description">Mô tả</Label>
                <Input id="edit-description" name="description" defaultValue={editingGroup.description} />
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Hủy
                </Button>
                <Button type="submit" className="bg-primary hover:bg-primary/90">
                  Lưu
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xóa Nhóm Quyền Hạn</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa nhóm quyền hạn "{editingGroup?.name}"? Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteGroup} className="bg-red-600 hover:bg-red-700">
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

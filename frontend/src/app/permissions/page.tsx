"use client"

import React from "react"

import { HeaderNav } from "@/components/header-nav"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Search, MoreVertical, Edit, Trash2, Lock, ChevronLeft, ChevronRight, Check } from "lucide-react"
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
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
import { Badge } from "@/components/ui/badge"

export default function PermissionsPage() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [editingPermission, setEditingPermission] = useState<any>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [selectedPermissions, setSelectedPermissions] = useState<number[]>([])
  const [isAssignGroupDialogOpen, setIsAssignGroupDialogOpen] = useState(false)
  const [selectedGroup, setSelectedGroup] = useState("")

  const [permissions, setPermissions] = useState([
    { id: 1, code: "create_user", name: "Tạo người dùng", description: "Có quyền tạo người dùng mới", group: "Quản lý người dùng" },
    { id: 2, code: "edit_user", name: "Sửa người dùng", description: "Có quyền chỉnh sửa thông tin người dùng", group: "Quản lý người dùng" },
    { id: 3, code: "delete_user", name: "Xóa người dùng", description: "Có quyền xóa người dùng", group: "Quản lý người dùng" },
    { id: 4, code: "view_user", name: "Xem người dùng", description: "Có quyền xem danh sách và chi tiết người dùng", group: "Quản lý người dùng" },
    { id: 5, code: "create_product", name: "Tạo sản phẩm", description: "Có quyền tạo sản phẩm mới", group: "Quản lý sản phẩm" },
    { id: 6, code: "edit_product", name: "Sửa sản phẩm", description: "Có quyền chỉnh sửa sản phẩm", group: "Quản lý sản phẩm" },
    { id: 7, code: "delete_product", name: "Xóa sản phẩm", description: "Có quyền xóa sản phẩm", group: "Quản lý sản phẩm" },
    { id: 8, code: "create_order", name: "Tạo đơn hàng", description: "Có quyền tạo đơn hàng mới", group: "Quản lý bán hàng" },
  ])

  const totalPages = Math.ceil(permissions.length / rowsPerPage)
  const startIdx = (currentPage - 1) * rowsPerPage
  const displayedPermissions = permissions.slice(startIdx, startIdx + rowsPerPage)

  const handleAddPermission = (e: React.FormEvent) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget as HTMLFormElement)
    const newPermission = {
      id: Math.max(...permissions.map(p => p.id), 0) + 1,
      code: (formData.get("code") as string).toLowerCase(),
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      group: formData.get("group") as string,
    }
    setPermissions([...permissions, newPermission])
    setIsAddDialogOpen(false)
  }

  const handleEditPermission = (e: React.FormEvent) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget as HTMLFormElement)
    setPermissions(
      permissions.map(p =>
        p.id === editingPermission.id
          ? {
              ...p,
              code: (formData.get("code") as string).toLowerCase(),
              name: formData.get("name") as string,
              description: formData.get("description") as string,
              group: formData.get("group") as string,
            }
          : p
      )
    )
    setIsEditDialogOpen(false)
    setEditingPermission(null)
  }

  const handleDeletePermission = () => {
    setPermissions(permissions.filter(p => p.id !== editingPermission.id))
    setIsDeleteDialogOpen(false)
    setEditingPermission(null)
  }

  const togglePermissionSelection = (id: number) => {
    setSelectedPermissions(prev =>
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    )
  }

  const toggleSelectAll = () => {
    if (selectedPermissions.length === displayedPermissions.length) {
      setSelectedPermissions([])
    } else {
      setSelectedPermissions(displayedPermissions.map(p => p.id))
    }
  }

  const handleAssignGroupToSelected = () => {
    if (selectedGroup && selectedPermissions.length > 0) {
      setPermissions(
        permissions.map(p =>
          selectedPermissions.includes(p.id) ? { ...p, group: selectedGroup } : p
        )
      )
      setSelectedPermissions([])
      setSelectedGroup("")
      setIsAssignGroupDialogOpen(false)
    }
  }

  const groupColors: Record<string, string> = {
    "Quản lý người dùng": "bg-blue-100 text-blue-700",
    "Quản lý sản phẩm": "bg-purple-100 text-purple-700",
    "Quản lý bán hàng": "bg-green-100 text-green-700",
    "Quản lý báo cáo": "bg-orange-100 text-orange-700",
    "Quản lý cửa hàng": "bg-red-100 text-red-700",
  }

  return (
    <div className="min-h-screen bg-background">
      <HeaderNav />
      <main className="container mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Quyền Hạn</h1>
            <p className="text-sm text-muted-foreground">Quản lý các quyền hạn của hệ thống</p>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2 bg-primary hover:bg-primary/90">
                <Plus className="h-4 w-4" />
                Thêm Quyền Hạn
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Thêm Quyền Hạn Mới</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAddPermission} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="code">Mã quyền hạn</Label>
                  <Input id="code" name="code" placeholder="create_user" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="name">Tên quyền hạn</Label>
                  <Input id="name" name="name" placeholder="Tạo người dùng" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Mô tả</Label>
                  <Input id="description" name="description" placeholder="Mô tả quyền hạn..." />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="group">Nhóm quyền hạn</Label>
                  <Select name="group" defaultValue="Quản lý người dùng">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Quản lý người dùng">Quản lý người dùng</SelectItem>
                      <SelectItem value="Quản lý sản phẩm">Quản lý sản phẩm</SelectItem>
                      <SelectItem value="Quản lý bán hàng">Quản lý bán hàng</SelectItem>
                      <SelectItem value="Quản lý báo cáo">Quản lý báo cáo</SelectItem>
                      <SelectItem value="Quản lý cửa hàng">Quản lý cửa hàng</SelectItem>
                    </SelectContent>
                  </Select>
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
                <Lock className="h-5 w-5" />
                Danh sách quyền hạn
              </CardTitle>
              <div className="relative w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Tìm kiếm quyền hạn..." className="pl-8" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {selectedPermissions.length > 0 && (
              <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-between">
                <span className="text-sm font-medium text-blue-700">
                  Đã chọn {selectedPermissions.length} quyền hạn
                </span>
                <Dialog open={isAssignGroupDialogOpen} onOpenChange={setIsAssignGroupDialogOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm" className="bg-primary hover:bg-primary/90">
                      Gán Nhóm
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Gán Nhóm cho Quyền Hạn</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="group-select">Chọn nhóm quyền hạn</Label>
                        <Select value={selectedGroup} onValueChange={setSelectedGroup}>
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn nhóm..." />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Quản lý người dùng">Quản lý người dùng</SelectItem>
                            <SelectItem value="Quản lý sản phẩm">Quản lý sản phẩm</SelectItem>
                            <SelectItem value="Quản lý bán hàng">Quản lý bán hàng</SelectItem>
                            <SelectItem value="Quản lý báo cáo">Quản lý báo cáo</SelectItem>
                            <SelectItem value="Quản lý cửa hàng">Quản lý cửa hàng</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsAssignGroupDialogOpen(false)}>
                        Hủy
                      </Button>
                      <Button
                        onClick={handleAssignGroupToSelected}
                        disabled={!selectedGroup}
                        className="bg-primary hover:bg-primary/90"
                      >
                        Gán
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            )}
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={selectedPermissions.length === displayedPermissions.length && displayedPermissions.length > 0}
                      onCheckedChange={toggleSelectAll}
                    />
                  </TableHead>
                  <TableHead>Mã</TableHead>
                  <TableHead>Tên quyền hạn</TableHead>
                  <TableHead>Mô tả</TableHead>
                  <TableHead>Nhóm</TableHead>
                  <TableHead className="text-right">Hành động</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {displayedPermissions.map(permission => (
                  <TableRow
                    key={permission.id}
                    className={selectedPermissions.includes(permission.id) ? "bg-blue-50" : ""}
                  >
                    <TableCell>
                      <Checkbox
                        checked={selectedPermissions.includes(permission.id)}
                        onCheckedChange={() => togglePermissionSelection(permission.id)}
                      />
                    </TableCell>
                    <TableCell className="font-mono font-medium text-sm">{permission.code}</TableCell>
                    <TableCell className="font-medium">{permission.name}</TableCell>
                    <TableCell className="text-muted-foreground text-sm">{permission.description}</TableCell>
                    <TableCell>
                      <Badge className={groupColors[permission.group]}>
                        {permission.group}
                      </Badge>
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
                              setEditingPermission(permission)
                              setIsEditDialogOpen(true)
                            }}
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Sửa
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => {
                              setEditingPermission(permission)
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
                <span className="text-sm text-muted-foreground">Tổng số: {permissions.length}</span>
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
            <DialogTitle>Sửa Quyền Hạn</DialogTitle>
          </DialogHeader>
          {editingPermission && (
            <form onSubmit={handleEditPermission} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-code">Mã quyền hạn</Label>
                <Input id="edit-code" name="code" defaultValue={editingPermission.code} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-name">Tên quyền hạn</Label>
                <Input id="edit-name" name="name" defaultValue={editingPermission.name} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-description">Mô tả</Label>
                <Input id="edit-description" name="description" defaultValue={editingPermission.description} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-group">Nhóm quyền hạn</Label>
                <Select name="group" defaultValue={editingPermission.group}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Quản lý người dùng">Quản lý người dùng</SelectItem>
                    <SelectItem value="Quản lý sản phẩm">Quản lý sản phẩm</SelectItem>
                    <SelectItem value="Quản lý bán hàng">Quản lý bán hàng</SelectItem>
                    <SelectItem value="Quản lý báo cáo">Quản lý báo cáo</SelectItem>
                    <SelectItem value="Quản lý cửa hàng">Quản lý cửa hàng</SelectItem>
                  </SelectContent>
                </Select>
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
            <AlertDialogTitle>Xóa Quyền Hạn</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa quyền hạn "{editingPermission?.name}"? Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeletePermission} className="bg-red-600 hover:bg-red-700">
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

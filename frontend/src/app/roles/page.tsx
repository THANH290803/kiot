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
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"

const AVAILABLE_PERMISSIONS = [
  { id: 1, code: "create_user", name: "Tạo người dùng", group: "Quản lý người dùng" },
  { id: 2, code: "edit_user", name: "Sửa người dùng", group: "Quản lý người dùng" },
  { id: 3, code: "delete_user", name: "Xóa người dùng", group: "Quản lý người dùng" },
  { id: 4, code: "view_user", name: "Xem người dùng", group: "Quản lý người dùng" },
  { id: 5, code: "create_product", name: "Tạo sản phẩm", group: "Quản lý sản phẩm" },
  { id: 6, code: "edit_product", name: "Sửa sản phẩm", group: "Quản lý sản phẩm" },
  { id: 7, code: "delete_product", name: "Xóa sản phẩm", group: "Quản lý sản phẩm" },
  { id: 8, code: "create_order", name: "Tạo đơn hàng", group: "Quản lý bán hàng" },
  { id: 9, code: "edit_order", name: "Sửa đơn hàng", group: "Quản lý bán hàng" },
  { id: 10, code: "view_report", name: "Xem báo cáo", group: "Quản lý báo cáo" },
]

export default function RolesPage() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isPermissionsDialogOpen, setIsPermissionsDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [editingRole, setEditingRole] = useState<any>(null)
  const [selectedPermissions, setSelectedPermissions] = useState<number[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  const [roles, setRoles] = useState([
    {
      id: 1,
      code: "admin",
      name: "Quản lý cao cấp",
      description: "Có toàn quyền truy cập tất cả chức năng",
      permissionCount: 10,
      permissions: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    },
    {
      id: 2,
      code: "manager",
      name: "Quản lý",
      description: "Quản lý cửa hàng và nhân viên",
      permissionCount: 7,
      permissions: [2, 4, 6, 8, 9, 10],
    },
    {
      id: 3,
      code: "sales",
      name: "Nhân viên bán hàng",
      description: "Bán hàng và xem báo cáo",
      permissionCount: 3,
      permissions: [8, 9, 10],
    },
  ])

  const totalPages = Math.ceil(roles.length / rowsPerPage)
  const startIdx = (currentPage - 1) * rowsPerPage
  const displayedRoles = roles.slice(startIdx, startIdx + rowsPerPage)

  const handleAddRole = (e: React.FormEvent) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget as HTMLFormElement)
    const newRole = {
      id: Math.max(...roles.map(r => r.id), 0) + 1,
      code: (formData.get("code") as string).toLowerCase(),
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      permissionCount: 0,
      permissions: [] as number[],
    }
    setRoles([...roles, newRole])
    setIsAddDialogOpen(false)
  }

  const handleEditRole = (e: React.FormEvent) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget as HTMLFormElement)
    setRoles(
      roles.map(r =>
        r.id === editingRole.id
          ? {
              ...r,
              code: (formData.get("code") as string).toLowerCase(),
              name: formData.get("name") as string,
              description: formData.get("description") as string,
            }
          : r
      )
    )
    setIsEditDialogOpen(false)
    setEditingRole(null)
  }

  const handleDeleteRole = () => {
    setRoles(roles.filter(r => r.id !== editingRole.id))
    setIsDeleteDialogOpen(false)
    setEditingRole(null)
  }

  const handlePermissionsChange = (permissionId: number, checked: boolean) => {
    if (checked) {
      setSelectedPermissions([...selectedPermissions, permissionId])
    } else {
      setSelectedPermissions(selectedPermissions.filter(id => id !== permissionId))
    }
  }

  const handleSavePermissions = () => {
    setRoles(
      roles.map(r =>
        r.id === editingRole.id
          ? {
              ...r,
              permissions: selectedPermissions,
              permissionCount: selectedPermissions.length,
            }
          : r
      )
    )
    setIsPermissionsDialogOpen(false)
    setEditingRole(null)
    setSelectedPermissions([])
  }

  const openPermissionsDialog = (role: any) => {
    setEditingRole(role)
    setSelectedPermissions(role.permissions || [])
    setIsPermissionsDialogOpen(true)
  }

  return (
    <div className="min-h-screen bg-background">
      <HeaderNav />
      <main className="container mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Vai Trò</h1>
            <p className="text-sm text-muted-foreground">Quản lý vai trò và quyền hạn của người dùng</p>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2 bg-primary hover:bg-primary/90">
                <Plus className="h-4 w-4" />
                Thêm Vai Trò
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Thêm Vai Trò Mới</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAddRole} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="code">Mã vai trò</Label>
                  <Input id="code" name="code" placeholder="manager" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="name">Tên vai trò</Label>
                  <Input id="name" name="name" placeholder="Quản lý" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Mô tả</Label>
                  <Input id="description" name="description" placeholder="Mô tả vai trò..." />
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
                Danh sách vai trò
              </CardTitle>
              <div className="relative w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Tìm kiếm vai trò..." className="pl-8" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tên vai trò</TableHead>
                  <TableHead>Mô tả</TableHead>
                  <TableHead className="text-right">Số quyền hạn</TableHead>
                  <TableHead className="text-right">Hành động</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {displayedRoles.map(role => (
                  <TableRow key={role.id}>
                    <TableCell className="font-medium">{role.name}</TableCell>
                    <TableCell className="text-muted-foreground text-sm">{role.description}</TableCell>
                    <TableCell className="text-right">
                      <Badge variant="outline">{role.permissionCount}</Badge>
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
                            onClick={() => openPermissionsDialog(role)}
                          >
                            <Shield className="h-4 w-4 mr-2" />
                            Quản lý quyền hạn
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              setEditingRole(role)
                              setIsEditDialogOpen(true)
                            }}
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Sửa
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => {
                              setEditingRole(role)
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
                <span className="text-sm text-muted-foreground">Tổng số: {roles.length}</span>
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
            <DialogTitle>Sửa Vai Trò</DialogTitle>
          </DialogHeader>
          {editingRole && (
            <form onSubmit={handleEditRole} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-code">Mã vai trò</Label>
                <Input id="edit-code" name="code" defaultValue={editingRole.code} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-name">Tên vai trò</Label>
                <Input id="edit-name" name="name" defaultValue={editingRole.name} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-description">Mô tả</Label>
                <Input id="edit-description" name="description" defaultValue={editingRole.description} />
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

      <Dialog open={isPermissionsDialogOpen} onOpenChange={setIsPermissionsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-96 flex flex-col">
          <DialogHeader>
            <DialogTitle>Quản lý quyền hạn - {editingRole?.name}</DialogTitle>
          </DialogHeader>
          <ScrollArea className="flex-1 pr-4">
            <div className="space-y-4">
              {["Quản lý người dùng", "Quản lý sản phẩm", "Quản lý bán hàng", "Quản lý báo cáo"].map(group => (
                <div key={group} className="space-y-2">
                  <p className="font-semibold text-sm">{group}</p>
                  <div className="space-y-2 pl-4">
                    {AVAILABLE_PERMISSIONS.filter(p => p.group === group).map(permission => (
                      <div key={permission.id} className="flex items-center gap-2">
                        <Checkbox
                          id={`perm-${permission.id}`}
                          checked={selectedPermissions.includes(permission.id)}
                          onCheckedChange={(checked) => handlePermissionsChange(permission.id, checked as boolean)}
                        />
                        <label
                          htmlFor={`perm-${permission.id}`}
                          className="text-sm cursor-pointer flex-1"
                        >
                          {permission.name}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
          <DialogFooter className="pt-4 border-t">
            <Button variant="outline" onClick={() => setIsPermissionsDialogOpen(false)}>
              Hủy
            </Button>
            <Button className="bg-primary hover:bg-primary/90" onClick={handleSavePermissions}>
              Lưu Quyền Hạn
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xóa Vai Trò</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa vai trò "{editingRole?.name}"? Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteRole} className="bg-red-600 hover:bg-red-700">
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

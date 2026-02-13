"use client"

import React from "react"
import api from "@/lib/api"

import { HeaderNav } from "@/components/header-nav"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Search, MoreVertical, Edit, Trash2, Shield, ChevronLeft, ChevronRight, Users, Package, ShoppingCart, BarChart3 } from "lucide-react"
import { useEffect, useState } from "react"
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
import { useRoles } from "@/hooks/useRoles"


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
    const {
        roles,
        paginatedRoles,
        page,
        setPage,
        rowsPerPage,
        setRowsPerPage,
        totalPages,

        createRole,
        updateRole,
        deleteRole,
        updateRolePermissions,
    } = useRoles()

    const [editingRole, setEditingRole] = useState<any>(null)
    const [selectedPermissions, setSelectedPermissions] = useState<number[]>([])

    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
    const [isPermissionsDialogOpen, setIsPermissionsDialogOpen] = useState(false)
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

    const openEditDialog = (role: any) => {
        setEditingRole(role)
        setIsEditDialogOpen(true)
    }

    const handleAddRole = async (e: React.FormEvent) => {
        e.preventDefault()
        const fd = new FormData(e.currentTarget as HTMLFormElement)

        await createRole({
            name: fd.get("name") as string,
            description: fd.get("description") as string,
        })

        setIsAddDialogOpen(false)
    }

    const handleEditRole = async (e: React.FormEvent) => {
        e.preventDefault()
        const fd = new FormData(e.currentTarget as HTMLFormElement)

        await updateRole(editingRole.id, {
            name: fd.get("name") as string,
            description: fd.get("description") as string,
        })

        setIsEditDialogOpen(false)
        setEditingRole(null)
    }

    const handleDeleteRole = async () => {
        await deleteRole(editingRole.id)
        setIsDeleteDialogOpen(false)
        setEditingRole(null)
    }

    // const handleSavePermissions = async () => {
    //     await updateRolePermissions(editingRole.id, selectedPermissions)
    //     setIsPermissionsDialogOpen(false)
    //     setEditingRole(null)
    //     setSelectedPermissions([])
    // }

    const openPermissionsDialog = (role: any) => {
        setEditingRole(role)
        setSelectedPermissions(role.permissions || [])
        setIsPermissionsDialogOpen(true)
    }

    const handlePermissionsChange = (
        permissionId: number,
        checked: boolean
    ) => {
        setSelectedPermissions((prev) => {
            if (checked) {
                if (prev.includes(permissionId)) return prev
                return [...prev, permissionId]
            }
            return prev.filter((id) => id !== permissionId)
        })
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
                                {paginatedRoles.map(role => (
                                    <TableRow key={role.id}>
                                        <TableCell className="font-medium">{role.name}</TableCell>
                                        <TableCell className="text-muted-foreground text-sm w-[250px] break-words">
                                            {role.description || "-"}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Badge variant="outline">{role.permission_count}</Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon">
                                                        <MoreVertical className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    {/* <DropdownMenuItem
                                                        onClick={() => openPermissionsDialog(role)}
                                                    >
                                                        <Shield className="h-4 w-4 mr-2" />
                                                        Quản lý quyền hạn
                                                    </DropdownMenuItem> */}
                                                    <DropdownMenuItem
                                                        onClick={() => openEditDialog(role)}
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
                                <span className="text-sm">bản ghi</span>
                                <span className="text-sm text-muted-foreground">Tổng số: {roles.length}</span>
                            </div>
                            <div className="flex items-center gap-4">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setPage(Math.max(1, page - 1))}
                                    disabled={page === 1}
                                >
                                    <ChevronLeft className="h-4 w-4" />
                                    Previous
                                </Button>

                                <span className="text-sm font-medium">{page}</span>

                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setPage(Math.min(totalPages, page + 1))}
                                    disabled={page === totalPages}
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
                                <Label htmlFor="edit-name">Tên vai trò</Label>
                                <Input id="edit-name" name="name" defaultValue={editingRole.name} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="edit-description">Mô tả</Label>
                                <Input id="edit-description" name="description" defaultValue={editingRole.description} />
                            </div>
                            <DialogFooter>
                                <Button variant="outline"
                                    onClick={() => {
                                        setIsEditDialogOpen(false)
                                        setEditingRole(null)
                                    }}
                                >
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

            {/* <Dialog open={isPermissionsDialogOpen} onOpenChange={setIsPermissionsDialogOpen}>
                <DialogContent
                    className="max-w-2xl h-[80vh] flex flex-col p-0 overflow-hidden"
                > */}
                    {/* ===== HEADER (FIXED) ===== */}
                    {/* <DialogHeader className="px-6 py-5 border-b flex-shrink-0 bg-gradient-to-r from-slate-50 to-white">
                        <DialogTitle className="text-lg font-bold text-slate-900">
                            Quản lý quyền hạn
                        </DialogTitle>
                        <p className="text-sm text-slate-500 mt-1">
                            Vai trò:
                            <span className="ml-1 font-semibold text-slate-700">
                                {editingRole?.name}
                            </span>
                        </p>
                    </DialogHeader> */}

                    {/* ===== BODY (SCROLL) ===== */}
                    {/* <div className="flex-1 overflow-hidden">
                        <ScrollArea className="h-full">
                            <div className="px-6 py-5 space-y-6">
                                {[
                                    { group: "Quản lý người dùng", icon: Users, color: "bg-blue-50 border-blue-200" },
                                    { group: "Quản lý sản phẩm", icon: Package, color: "bg-green-50 border-green-200" },
                                    { group: "Quản lý bán hàng", icon: ShoppingCart, color: "bg-orange-50 border-orange-200" },
                                    { group: "Quản lý báo cáo", icon: BarChart3, color: "bg-purple-50 border-purple-200" },
                                ].map(({ group, icon: Icon, color }) => (
                                    <div key={group} className={`border rounded-lg p-4 ${color}`}>
                                        <div className="flex items-center gap-2 mb-4">
                                            <Icon className="h-5 w-5 text-slate-700" />
                                            <p className="font-semibold text-slate-900">{group}</p>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            {AVAILABLE_PERMISSIONS
                                                .filter(p => p.group === group)
                                                .map(permission => (
                                                    <div
                                                        key={permission.id}
                                                        className="flex items-center gap-3 p-2 rounded hover:bg-white/60"
                                                    >
                                                        <Checkbox
                                                            id={`perm-${permission.id}`}
                                                            checked={selectedPermissions.includes(permission.id)}
                                                            onCheckedChange={(checked) =>
                                                                handlePermissionsChange(permission.id, checked as boolean)
                                                            }
                                                        />
                                                        <label
                                                            htmlFor={`perm-${permission.id}`}
                                                            className="text-sm font-medium text-slate-700 cursor-pointer select-none"
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
                    </div> */}

                    {/* ===== FOOTER (FIXED) ===== */}
                    {/* <DialogFooter className="px-6 py-4 border-t bg-slate-50 flex-shrink-0">
                        <Button
                            variant="outline"
                            onClick={() => setIsPermissionsDialogOpen(false)}
                        >
                            Hủy
                        </Button>
                        <Button
                            className="bg-blue-600 hover:bg-blue-700"
                            onClick={handleSavePermissions}
                        >
                            Lưu Quyền Hạn
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog> */}

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

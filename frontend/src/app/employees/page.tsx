"use client"

import { HeaderNav } from "@/components/header-nav"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Search, FileDown, Filter, MoreHorizontal, Edit, Trash2, Eye, ShieldCheck, Lock, ChevronDown, Check } from "lucide-react"
import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"
// import { ALL_PERMISSIONS, ROLE_PERMISSIONS, type UserRole } from "@/lib/permissions"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import { usePermissions } from "@/hooks/usePermissions"
import { usePermissionGroups } from "@/hooks/usePermissionGroups"
import { useRoles } from "@/hooks/useRoles"

const normalizeRoleName = (name?: string) => {
  return name
    ?.toLowerCase()
    .replace(/[_-]/g, " ")   // _ hoặc - → space
    .replace(/\s+/g, " ")    // nhiều space → 1 space
    .trim()
}

export default function EmployeesPage() {
  const { permissions } = usePermissions()
  const { groups } = usePermissionGroups()
  const { roles, updateRolePermissions, getRolePermissions } = useRoles()

  const [employees, setEmployees] = useState([
    {
      id: 1,
      code: "NV001",
      name: "Nguyễn Văn A",
      email: "nguyenvana@kiotv0.com",
      phone: "0901234567",
      role: "admin",
      branch: "Chi nhánh trung tâm",
      status: "active",
      joinDate: "01/01/2025",
    },
    {
      id: 2,
      code: "NV002",
      name: "Trần Thị B",
      email: "tranthib@kiotv0.com",
      phone: "0987654321",
      role: "manager",
      branch: "Chi nhánh trung tâm",
      status: "active",
      joinDate: "05/01/2025",
    },
    {
      id: 3,
      code: "NV003",
      name: "Lê Văn C",
      email: "levanc@kiotv0.com",
      phone: "0912345678",
      role: "sales",
      branch: "Chi nhánh trung tâm",
      status: "active",
      joinDate: "10/01/2025",
    },
    {
      id: 4,
      code: "NV004",
      name: "Phạm Thị D",
      email: "phamthid@kiotv0.com",
      phone: "0923456789",
      role: "warehouse",
      branch: "Chi nhánh trung tâm",
      status: "active",
      joinDate: "15/01/2025",
    },
    {
      id: 5,
      code: "NV005",
      name: "Hoàng Văn E",
      email: "hoangvane@kiotv0.com",
      phone: "0934567890",
      role: "sales",
      branch: "Chi nhánh trung tâm",
      status: "inactive",
      joinDate: "20/01/2025",
    },
  ])

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isPermissionsDialogOpen, setIsPermissionsDialogOpen] = useState(false)
  const [editingEmployee, setEditingEmployee] = useState<any>(null)
  const [deletingEmployeeId, setDeletingEmployeeId] = useState<number | null>(null)
  const [selectedRoleForPermissions, setSelectedRoleForPermissions] = useState<number | null>(null)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [statusChangeId, setStatusChangeId] = useState<number | null>(null)
  const [tempStatus, setTempStatus] = useState<string>("")
  const [openStatusPopoverId, setOpenStatusPopoverId] = useState<number | null>(null)
  const [selectedPermissions, setSelectedPermissions] = useState<number[]>([])
  const [alert, setAlert] = useState<{
    type: "success" | "error"
    message: string
  } | null>(null)

  useEffect(() => {
    if (!alert) return

    const timer = setTimeout(() => {
      setAlert(null)
    }, 5000) // 👈 5 giây

    return () => clearTimeout(timer)
  }, [alert])


  const handleEdit = (employee: any) => {
    setEditingEmployee(employee)
    setIsDialogOpen(true)
  }

  const handleDelete = (id: number) => {
    setEmployees(employees.filter((e) => e.id !== id))
    setIsDeleteDialogOpen(false)
    setDeletingEmployeeId(null)
  }

  const handleSave = () => {
    setIsDialogOpen(false)
    setEditingEmployee(null)
  }

  const getRoleLabel = (roleName: string) => {
    return roleName
  }

  const getRoleColor = (roleName: string) => {
    switch (roleName.toLowerCase()) {
      case "Master Admin":
        return "bg-red-100 text-red-700"
      case "manager":
        return "bg-blue-100 text-blue-700"
      case "sales":
        return "bg-green-100 text-green-700"
      case "warehouse":
        return "bg-yellow-100 text-yellow-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  const roleList = roles

  useEffect(() => {
    if (roleList.length && selectedRoleForPermissions === null) {
      setSelectedRoleForPermissions(roleList[0].id)
    }
  }, [roleList, selectedRoleForPermissions])

  useEffect(() => {
    if (!selectedRoleForPermissions) return

    const rolePermIds = permissions
      .filter(p => p.roles?.includes(String(selectedRoleForPermissions)))
      .map(p => p.id)

    setSelectedPermissions(rolePermIds)
  }, [selectedRoleForPermissions, permissions])

  useEffect(() => {
    if (!selectedRoleForPermissions) return

    const loadPermissions = async () => {
      try {
        const permissionIds = await getRolePermissions(
          selectedRoleForPermissions
        )
        setSelectedPermissions(permissionIds)
      } catch (err) {
        console.error("Load role permissions failed", err)
      }
    }

    loadPermissions()
  }, [selectedRoleForPermissions])



  const handleStatusChange = (employeeId: number, currentStatus: string) => {
    setStatusChangeId(employeeId)
    setTempStatus(currentStatus)
  }

  const applyStatusChange = () => {
    if (statusChangeId !== null) {
      setEmployees(
        employees.map((e) => (e.id === statusChangeId ? { ...e, status: tempStatus } : e))
      )
      setStatusChangeId(null)
      setTempStatus("")
      setOpenStatusPopoverId(null)
    }
  }

  const cancelStatusChange = () => {
    setStatusChangeId(null)
    setTempStatus("")
    setOpenStatusPopoverId(null)
  }

  const isMasterAdmin = (roleId: number | null) => {
    const role = roleList.find(r => r.id === roleId)
    return normalizeRoleName(role?.name) === "master admin"
  }

  return (
    <div className="min-h-screen bg-background">
      <HeaderNav />
      <main className="container mx-auto p-6 space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <h1 className="text-2xl font-bold">Quản lý nhân viên</h1>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => setIsPermissionsDialogOpen(true)}>
              <ShieldCheck className="h-4 w-4 mr-2" /> Phân quyền
            </Button>
            <Button variant="outline">
              <FileDown className="h-4 w-4 mr-2" /> Xuất file
            </Button>
            <Button
              className="bg-primary hover:bg-primary/90"
              onClick={() => {
                setEditingEmployee(null)
                setIsDialogOpen(true)
              }}
            >
              <Plus className="h-4 w-4 mr-2" /> Thêm nhân viên
            </Button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Tìm kiếm theo mã, tên, email..." className="pl-9" />
          </div>
          <Select defaultValue="all">
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Vai trò" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả vai trò</SelectItem>
              <SelectItem value="admin">Quản lý cao cấp</SelectItem>
              <SelectItem value="manager">Quản lý</SelectItem>
              <SelectItem value="sales">Nhân viên bán hàng</SelectItem>
              <SelectItem value="warehouse">Nhân viên kho</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="all">
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả trạng thái</SelectItem>
              <SelectItem value="active">Đang hoạt động</SelectItem>
              <SelectItem value="inactive">Ngừng hoạt động</SelectItem>
            </SelectContent>
          </Select>
          {/* <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" /> Bộ lọc
          </Button> */}
        </div>

        <div className="border rounded-lg bg-white overflow-hidden">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead className="w-[120px]">Mã nhân viên</TableHead>
                <TableHead>Tên</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Số điện thoại</TableHead>
                <TableHead>Vai trò</TableHead>
                {/* <TableHead>Chi nhánh</TableHead> */}
                <TableHead>Trạng thái</TableHead>
                <TableHead className="w-[80px] text-center">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {employees.map((employee) => (
                <TableRow key={employee.id} className="hover:bg-muted/30">
                  <TableCell className="font-medium text-primary">{employee.code}</TableCell>
                  <TableCell>
                    <div>
                      <div className="font-bold">{employee.name}</div>
                      <div className="text-xs text-muted-foreground">Username: {employee.joinDate}</div>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">{employee.email}</TableCell>
                  <TableCell className="text-sm">{employee.phone}</TableCell>
                  <TableCell>
                    <Badge className={getRoleColor(employee.role)} variant="secondary">
                      {getRoleLabel(employee.role)}
                    </Badge>
                  </TableCell>
                  {/* <TableCell className="text-sm">{employee.branch}</TableCell> */}
                  <TableCell>
                    <Popover
                      open={openStatusPopoverId === employee.id}
                      onOpenChange={(open) => {
                        if (open) {
                          setOpenStatusPopoverId(employee.id)
                          setStatusChangeId(employee.id)
                          setTempStatus(employee.status)
                        } else {
                          cancelStatusChange()
                        }
                      }}
                    >
                      <PopoverTrigger asChild>
                        <div className="flex items-center gap-2 cursor-pointer group w-fit px-3 py-1 rounded-md hover:bg-muted transition-colors">
                          <Badge variant={employee.status === "active" ? "default" : "outline"}>
                            {employee.status === "active" ? "Đang hoạt động" : "Ngừng hoạt động"}
                          </Badge>
                          <ChevronDown className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      </PopoverTrigger>
                      <PopoverContent align="start" className="w-60 p-0 shadow-lg border border-border/50">
                        <div className="p-4 space-y-3">
                          <div>
                            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3">
                              Chọn trạng thái
                            </p>
                          </div>
                          <div className="space-y-1.5">
                            <button
                              onClick={() => {
                                setTempStatus("active")
                                setStatusChangeId(employee.id)
                              }}
                              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-all text-sm font-medium ${tempStatus === "active" && statusChangeId === employee.id
                                ? "bg-green-50 text-green-700 border border-green-200"
                                : "hover:bg-muted/60 text-foreground border border-transparent"
                                }`}
                            >
                              <span className="flex items-center gap-2">
                                <div
                                  className={`w-2 h-2 rounded-full ${tempStatus === "active" && statusChangeId === employee.id
                                    ? "bg-green-600"
                                    : "bg-muted-foreground/30"
                                    }`}
                                />
                                Đang hoạt động
                              </span>
                              {tempStatus === "active" && statusChangeId === employee.id && (
                                <Check className="h-4 w-4 text-green-600 font-bold" />
                              )}
                            </button>
                            <button
                              onClick={() => {
                                setTempStatus("inactive")
                                setStatusChangeId(employee.id)
                              }}
                              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-all text-sm font-medium ${tempStatus === "inactive" && statusChangeId === employee.id
                                ? "bg-red-50 text-red-700 border border-red-200"
                                : "hover:bg-muted/60 text-foreground border border-transparent"
                                }`}
                            >
                              <span className="flex items-center gap-2">
                                <div
                                  className={`w-2 h-2 rounded-full ${tempStatus === "inactive" && statusChangeId === employee.id
                                    ? "bg-red-600"
                                    : "bg-muted-foreground/30"
                                    }`}
                                />
                                Ngừng hoạt động
                              </span>
                              {tempStatus === "inactive" && statusChangeId === employee.id && (
                                <Check className="h-4 w-4 text-red-600 font-bold" />
                              )}
                            </button>
                          </div>
                          <div className="border-t pt-3 flex gap-2">
                            <Button
                              size="sm"
                              className="flex-1 h-8 text-xs bg-primary hover:bg-primary/90 font-medium"
                              onClick={applyStatusChange}
                            >
                              Áp dụng
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="flex-1 h-8 text-xs font-medium bg-transparent"
                              onClick={cancelStatusChange}
                            >
                              Hủy
                            </Button>
                          </div>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </TableCell>
                  <TableCell className="text-center">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/employees/${employee.id}`} className="flex items-center cursor-pointer">
                            <Eye className="h-4 w-4 mr-2" /> Xem chi tiết
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEdit(employee)} className="cursor-pointer">
                          <Edit className="h-4 w-4 mr-2" /> Sửa
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            setDeletingEmployeeId(employee.id)
                            setIsDeleteDialogOpen(true)
                          }}
                          className="cursor-pointer text-destructive focus:text-destructive"
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

          <div className="flex items-center justify-between px-4 py-4 bg-muted/20 border-t">
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <span>Hiển thị</span>
                <Select value={String(rowsPerPage)} onValueChange={(v) => setRowsPerPage(Number(v))}>
                  <SelectTrigger className="h-8 w-[70px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="20">20</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                  </SelectContent>
                </Select>
                <span>bản ghi</span>
              </div>
              <span>Tổng số: {employees.length}</span>
            </div>
            <Pagination className="mx-0 w-auto">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious href="#" onClick={(e) => e.preventDefault()} />
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#" isActive>
                    1
                  </PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext href="#" onClick={(e) => e.preventDefault()} />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </div>
      </main>

      {/* Permission Management Dialog */}
      <Dialog open={isPermissionsDialogOpen} onOpenChange={setIsPermissionsDialogOpen}>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] flex flex-col p-0">
          <DialogHeader className="p-6 pb-0">
            <DialogTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5 text-primary" /> Thiết lập quyền theo vai trò
            </DialogTitle>
          </DialogHeader>

          <div className="p-6 flex-1 overflow-hidden flex flex-col gap-6">
            {alert && (
              <Alert
                className={
                  alert.type === "success"
                    ? "border-green-500 text-green-700"
                    : "border-red-500 text-red-700"
                }
              >
                <AlertTitle>
                  {alert.type === "success" ? "Thành công" : "Lỗi"}
                </AlertTitle>
                <AlertDescription>{alert.message}</AlertDescription>
              </Alert>
            )}
            <Tabs
              value={String(selectedRoleForPermissions)}
              onValueChange={v => setSelectedRoleForPermissions(Number(v))}
            >
              <TabsList
                className="grid w-full h-12"
                style={{
                  gridTemplateColumns: `repeat(${roleList.length}, minmax(0, 1fr))`,
                }}
              >
                {roleList.map(role => (
                  <TabsTrigger
                    key={role.id}
                    value={String(role.id)}
                  >
                    {role.name}
                  </TabsTrigger>
                ))}
              </TabsList>

              <ScrollArea className="h-[400px] mt-6 border rounded-lg p-4">
                <div className="space-y-10">
                  {groups.map(group => {
                    const groupPermissions = permissions.filter(
                      p => p.group_id === group.id
                    )

                    if (groupPermissions.length === 0) return null

                    return (
                      <div key={group.id} className="space-y-4">
                        {/* GROUP TITLE */}
                        <h4 className="font-bold text-sm uppercase tracking-wider text-muted-foreground border-b pb-2">
                          {group.name}
                        </h4>

                        {/* PERMISSIONS */}
                        <div className="grid grid-cols-2 gap-4">
                          {groupPermissions.map(permission => {
                            const isMaster = isMasterAdmin(selectedRoleForPermissions)

                            const checked = isMaster
                              ? true
                              : selectedPermissions.includes(permission.id)

                            return (
                              <div
                                key={permission.id}
                                role="button"
                                tabIndex={0}
                                className={`flex items-start space-x-3 p-3 rounded-md cursor-pointer
    hover:bg-muted/50
    ${isMaster ? "cursor-not-allowed opacity-60" : ""}`}
                                onClick={() => {
                                  if (isMaster) return

                                  setSelectedPermissions(prev =>
                                    prev.includes(permission.id)
                                      ? prev.filter(id => id !== permission.id)
                                      : [...prev, permission.id]
                                  )
                                }}
                                onKeyDown={(e) => {
                                  if (isMaster) return
                                  if (e.key === "Enter" || e.key === " ") {
                                    e.preventDefault()
                                    setSelectedPermissions(prev =>
                                      prev.includes(permission.id)
                                        ? prev.filter(id => id !== permission.id)
                                        : [...prev, permission.id]
                                    )
                                  }
                                }}
                              >
                                <Checkbox
                                  checked={checked}
                                  disabled={isMaster}
                                  onCheckedChange={(val) => {
                                    if (isMaster) return

                                    setSelectedPermissions(prev =>
                                      val
                                        ? [...prev, permission.id]
                                        : prev.filter(id => id !== permission.id)
                                    )
                                  }}
                                />

                                <div className="grid gap-1 leading-none">
                                  <label className="text-sm font-medium select-none">
                                    {permission.name}
                                    <span className="ml-2 text-xs text-muted-foreground font-mono">
                                      ({permission.code})
                                    </span>
                                  </label>

                                  {permission.description && (
                                    <p className="text-xs text-muted-foreground">
                                      {permission.description}
                                    </p>
                                  )}
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </ScrollArea>
            </Tabs>
          </div>

          <DialogFooter className="p-6 pt-0 gap-2">
            <Button
              variant="outline"
              onClick={() => setIsPermissionsDialogOpen(false)}
            >
              Huỷ
            </Button>

            <Button
              className="bg-primary"
              disabled={
                selectedRoleForPermissions === null ||
                isMasterAdmin(selectedRoleForPermissions)
              }
              onClick={async () => {
                if (!selectedRoleForPermissions) return

                try {
                  await updateRolePermissions(
                    selectedRoleForPermissions,
                    {
                      permission_ids: selectedPermissions,
                    }
                  )

                  setAlert({
                    type: "success",
                    message: "Cập nhật quyền thành công",
                  })
                } catch (err) {
                  setAlert({
                    type: "error",
                    message: "Cập nhật thất bại, vui lòng thử lại",
                  })
                }
              }}
            >
              Lưu thay đổi
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Employee Form Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{editingEmployee ? "Sửa thông tin nhân viên" : "Thêm nhân viên mới"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Tên
              </Label>
              <Input id="name" defaultValue={editingEmployee?.name} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input id="email" type="email" defaultValue={editingEmployee?.email} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="phone" className="text-right">
                Số điện thoại
              </Label>
              <Input id="phone" defaultValue={editingEmployee?.phone} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="role" className="text-right">
                Vai trò
              </Label>
              <Select defaultValue={editingEmployee?.role || "sales"}>
                <SelectTrigger className="col-span-3">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Quản lý cao cấp</SelectItem>
                  <SelectItem value="manager">Quản lý</SelectItem>
                  <SelectItem value="sales">Nhân viên bán hàng</SelectItem>
                  <SelectItem value="warehouse">Nhân viên kho</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">
                Trạng thái
              </Label>
              <Select defaultValue={editingEmployee?.status || "active"}>
                <SelectTrigger className="col-span-3">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Đang hoạt động</SelectItem>
                  <SelectItem value="inactive">Ngừng hoạt động</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Hủy
            </Button>
            <Button onClick={handleSave} className="bg-primary">
              {editingEmployee ? "Cập nhật" : "Thêm mới"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Alert */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa nhân viên</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa nhân viên này không? Thao tác này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deletingEmployeeId && handleDelete(deletingEmployeeId)}
              className="bg-destructive hover:bg-destructive/90"
            >
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

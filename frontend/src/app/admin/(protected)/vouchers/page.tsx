"use client"

import { Label } from "@/components/ui/label"
import { Suspense, useEffect, useState } from "react"
import { HeaderNav } from "@/features/admin/components/header-nav"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Search, MoreVertical, Edit, Trash2, Ticket, RefreshCw, Users } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
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
import { useVouchers, type Voucher } from "@/features/admin/hooks/useVouchers"
import { useCustomerVouchers } from "@/features/admin/hooks/useCustomerVouchers"
import { AssignVoucherDialog } from "@/features/admin/components/assign-voucher-dialog"
import { useCustomers } from "@/features/admin/hooks/useCustomers"

interface VoucherFormState {
  code: string
  description: string
  discount_type: "percent" | "fixed"
  discount_value: string
  max_use: string
  status: "active" | "inactive"
  start_date: string
  end_date: string
}

const defaultVoucherForm: VoucherFormState = {
  code: "",
  description: "",
  discount_type: "percent",
  discount_value: "",
  max_use: "",
  status: "active",
  start_date: "",
  end_date: "",
}

const VOUCHER_CODE_CHARSET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"
const VOUCHER_CODE_LENGTH = 8
const VOUCHER_CODE_PREFIX = "VC"

function generateVoucherCode() {
  const randomLength = Math.max(1, VOUCHER_CODE_LENGTH - VOUCHER_CODE_PREFIX.length)
  let randomPart = ""

  for (let index = 0; index < randomLength; index += 1) {
    const randomIndex = Math.floor(Math.random() * VOUCHER_CODE_CHARSET.length)
    randomPart += VOUCHER_CODE_CHARSET[randomIndex]
  }

  return `${VOUCHER_CODE_PREFIX}${randomPart}`
}

function VouchersPageContent() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false)
  const [isBulkAssignDialogOpen, setIsBulkAssignDialogOpen] = useState(false)
  const [editingVoucher, setEditingVoucher] = useState<Voucher | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [statusFilter, setStatusFilter] = useState("all")
  const [searchKeyword, setSearchKeyword] = useState("")
  const [selectedVouchers, setSelectedVouchers] = useState<number[]>([])
  const [bulkAssignCustomerId, setBulkAssignCustomerId] = useState("")
  const [bulkAssignExpiredAt, setBulkAssignExpiredAt] = useState("")
  const [assignToAllCustomers, setAssignToAllCustomers] = useState(false)
  const [assignError, setAssignError] = useState<string | null>(null)
  const [isAssigning, setIsAssigning] = useState(false)
  const [form, setForm] = useState<VoucherFormState>(defaultVoucherForm)
  const [formError, setFormError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { vouchers, loading, pagination, createVoucher, updateVoucher, deleteVoucher } = useVouchers({
    keyword: searchKeyword,
    status: statusFilter,
    page: currentPage,
    limit: rowsPerPage,
  })
  const { assignVoucher, assignVoucherBulk } = useCustomerVouchers()
  const { customers, setLimit: setCustomerLimit } = useCustomers()

  const totalPages = Math.max(1, pagination.totalPages || 1)

  useEffect(() => {
    setCurrentPage(1)
  }, [statusFilter, rowsPerPage, searchKeyword])

  useEffect(() => {
    setCustomerLimit(200)
  }, [setCustomerLimit])

  useEffect(() => {
    setSelectedVouchers((prev) => prev.filter((voucherId) => vouchers.some((voucher) => voucher.id === voucherId)))
  }, [vouchers])

  const resetForm = () => {
    setForm({
      ...defaultVoucherForm,
      code: generateVoucherCode(),
    })
    setFormError(null)
  }

  const syncFormFromVoucher = (voucher: Voucher) => {
    setForm({
      code: voucher.code,
      description: voucher.description || "",
      discount_type: voucher.discount_type,
      discount_value: String(voucher.discount_value),
      max_use: String(voucher.max_use),
      status: voucher.status,
      start_date: voucher.start_date,
      end_date: voucher.end_date,
    })
    setFormError(null)
  }

  const buildPayload = () => {
    const payload = {
      code: form.code.trim(),
      description: form.description.trim(),
      discount_type: form.discount_type,
      discount_value: Number(form.discount_value),
      max_use: Number(form.max_use),
      status: form.status,
      start_date: form.start_date,
      end_date: form.end_date,
    }

    if (!payload.code) {
      return { error: "Vui lòng nhập mã voucher" }
    }
    if (!payload.discount_value || payload.discount_value <= 0) {
      return { error: "Giá trị giảm phải lớn hơn 0" }
    }
    if (!Number.isInteger(payload.max_use) || payload.max_use < 0) {
      return { error: "Số lần sử dụng tối đa không hợp lệ" }
    }
    if (!payload.start_date || !payload.end_date) {
      return { error: "Vui lòng chọn ngày bắt đầu và ngày kết thúc" }
    }

    return { payload }
  }

  const handleAddVoucher = async () => {
    const { payload, error } = buildPayload()
    if (error || !payload) {
      setFormError(error || "Dữ liệu không hợp lệ")
      return
    }

    try {
      setIsSubmitting(true)
      await createVoucher(payload)
      setIsAddDialogOpen(false)
      resetForm()
    } catch (error: any) {
      setFormError(error?.response?.data?.message || "Không thể tạo voucher")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEditVoucher = async () => {
    if (!editingVoucher) {
      return
    }

    const { payload, error } = buildPayload()
    if (error || !payload) {
      setFormError(error || "Dữ liệu không hợp lệ")
      return
    }

    try {
      setIsSubmitting(true)
      await updateVoucher(editingVoucher.id, payload)
      setIsEditDialogOpen(false)
      setEditingVoucher(null)
      resetForm()
    } catch (error: any) {
      setFormError(error?.response?.data?.message || "Không thể cập nhật voucher")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteVoucher = async () => {
    if (!editingVoucher) {
      return
    }

    try {
      setIsSubmitting(true)
      await deleteVoucher(editingVoucher.id)
      setIsDeleteDialogOpen(false)
      setEditingVoucher(null)
    } finally {
      setIsSubmitting(false)
    }
  }

  const toggleVoucher = (voucherId: number) => {
    setSelectedVouchers((prev) =>
      prev.includes(voucherId) ? prev.filter((id) => id !== voucherId) : [...prev, voucherId]
    )
  }

  const toggleAllVouchers = () => {
    if (selectedVouchers.length === vouchers.length && vouchers.length > 0) {
      setSelectedVouchers([])
      return
    }

    setSelectedVouchers(vouchers.map((voucher) => voucher.id))
  }

  const handleAssignVoucher = async (voucherId: number, customerId: number) => {
    await assignVoucher(voucherId, customerId)
  }

  const handleBulkAssign = async () => {
    if (selectedVouchers.length === 0) {
      return
    }

    const targetCustomerIds = assignToAllCustomers
      ? customers.map((customer) => customer.id)
      : bulkAssignCustomerId
        ? [Number(bulkAssignCustomerId)]
        : []

    if (targetCustomerIds.length === 0) {
      setAssignError("Vui lòng chọn khách hàng để gán voucher")
      return
    }

    try {
      setIsAssigning(true)
      setAssignError(null)
      await assignVoucherBulk(selectedVouchers, targetCustomerIds, bulkAssignExpiredAt || undefined)

      setSelectedVouchers([])
      setBulkAssignCustomerId("")
      setBulkAssignExpiredAt("")
      setAssignToAllCustomers(false)
      setIsBulkAssignDialogOpen(false)
    } catch (error: any) {
      setAssignError(error?.response?.data?.message || "Không thể gán voucher")
    } finally {
      setIsAssigning(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <HeaderNav />
      <main className="container mx-auto px-6 py-8 space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Quản lý voucher</h1>
            <p className="text-sm text-muted-foreground">Tạo và quản lý mã giảm giá, khuyến mãi cho khách hàng</p>
          </div>
          <div className="flex gap-2">
            <Button
              variant={selectedVouchers.length > 0 ? "default" : "outline"}
              onClick={() => {
                setAssignError(null)
                setIsBulkAssignDialogOpen(true)
              }}
              disabled={selectedVouchers.length === 0}
              className={selectedVouchers.length > 0 ? "bg-primary" : ""}
            >
              Gán voucher ({selectedVouchers.length})
            </Button>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-primary" onClick={resetForm}>
                  <Plus className="h-4 w-4 mr-2" /> Thêm voucher
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Thêm voucher mới</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  {formError ? <p className="text-sm text-destructive">{formError}</p> : null}
                  <div className="space-y-2">
                    <Label htmlFor="voucher-code">Mã voucher</Label>
                    <div className="flex gap-2">
                      <Input id="voucher-code" placeholder="VD: VC8K2M9QX" value={form.code} readOnly className="bg-muted" />
                      <Button type="button" variant="outline" onClick={() => setForm((prev) => ({ ...prev, code: generateVoucherCode() }))}>
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Đổi mã
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Mã tự sinh 8 ký tự, IN HOA, dùng A-Z và 0-9 đã loại ký tự dễ nhầm.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="voucher-desc">Mô tả</Label>
                    <Input id="voucher-desc" placeholder="Mô tả chi tiết về voucher..." value={form.description} onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="discount-type">Loại giảm giá</Label>
                      <Select value={form.discount_type} onValueChange={(value: "percent" | "fixed") => setForm((prev) => ({ ...prev, discount_type: value }))}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Chọn loại" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="percent">Phần trăm (%)</SelectItem>
                          <SelectItem value="fixed">Số tiền cố định</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="discount-value">Giá trị</Label>
                      <Input id="discount-value" type="number" placeholder="0" value={form.discount_value} onChange={(e) => setForm((prev) => ({ ...prev, discount_value: e.target.value }))} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="voucher-status">Trạng thái</Label>
                    <Select value={form.status} onValueChange={(value: "active" | "inactive") => setForm((prev) => ({ ...prev, status: value }))}>
                      <SelectTrigger id="voucher-status" className="w-full">
                        <SelectValue placeholder="Chọn trạng thái" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Hoạt động</SelectItem>
                        <SelectItem value="inactive">Ngừng hoạt động</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="start-date">Ngày bắt đầu</Label>
                      <Input id="start-date" type="date" value={form.start_date} onChange={(e) => setForm((prev) => ({ ...prev, start_date: e.target.value }))} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="end-date">Ngày kết thúc</Label>
                      <Input id="end-date" type="date" value={form.end_date} onChange={(e) => setForm((prev) => ({ ...prev, end_date: e.target.value }))} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="max-use">Số lần sử dụng tối đa</Label>
                    <Input id="max-use" type="number" placeholder="Ví dụ: 100" value={form.max_use} onChange={(e) => setForm((prev) => ({ ...prev, max_use: e.target.value }))} />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Hủy
                  </Button>
                  <Button className="bg-primary" onClick={handleAddVoucher} disabled={isSubmitting}>
                    {isSubmitting ? "Đang lưu..." : "Lưu"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <CardTitle className="flex items-center gap-2">
                <Ticket className="h-5 w-5 text-primary" />
                Danh sách voucher
              </CardTitle>
              <div className="flex w-full flex-col gap-3 md:w-auto md:flex-row md:items-center">
                <div className="relative w-full md:w-64">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Tìm kiếm mã voucher..." className="pl-8" value={searchKeyword} onChange={(e) => setSearchKeyword(e.target.value)} />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full md:w-44">
                    <SelectValue placeholder="Lọc trạng thái" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả trạng thái</SelectItem>
                    <SelectItem value="active">Hoạt động</SelectItem>
                    <SelectItem value="inactive">Ngừng hoạt động</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={selectedVouchers.length === vouchers.length && vouchers.length > 0}
                      onCheckedChange={toggleAllVouchers}
                    />
                  </TableHead>
                  <TableHead>Mã voucher</TableHead>
                  <TableHead>Mô tả</TableHead>
                  <TableHead>Loại giảm giá</TableHead>
                  <TableHead>Giá trị</TableHead>
                  <TableHead>Lượt sử dụng</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead className="text-right">Hành động</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="py-6 text-center text-muted-foreground">
                      Đang tải dữ liệu...
                    </TableCell>
                  </TableRow>
                ) : vouchers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="py-6 text-center text-muted-foreground">
                      Không có voucher nào
                    </TableCell>
                  </TableRow>
                ) : vouchers.map((voucher) => (
                  <TableRow key={voucher.id}>
                    <TableCell className="w-12">
                      <Checkbox
                        checked={selectedVouchers.includes(voucher.id)}
                        onCheckedChange={() => toggleVoucher(voucher.id)}
                      />
                    </TableCell>
                    <TableCell className="font-mono font-medium">{voucher.code}</TableCell>
                    <TableCell className="text-muted-foreground text-sm">{voucher.description || "Không có mô tả"}</TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {voucher.discount_type === "percent" ? "Phần trăm" : "Cố định"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {voucher.discount_type === "percent" ? `${voucher.discount_value}%` : `${voucher.discount_value.toLocaleString()}đ`}
                    </TableCell>
                    <TableCell className="text-sm">
                      {voucher.used_count} / {voucher.max_use}
                      <div className="w-12 h-1 bg-gray-200 rounded mt-1">
                        <div
                          className="h-full bg-primary rounded"
                          style={{ width: `${voucher.max_use > 0 ? (voucher.used_count / voucher.max_use) * 100 : 0}%` }}
                        />
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={voucher.status === "active" ? "default" : "outline"}>
                        {voucher.status === "active" ? "Hoạt động" : "Ngừng hoạt động"}
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
                              setEditingVoucher(voucher)
                              setAssignError(null)
                              setIsAssignDialogOpen(true)
                            }}
                          >
                            <Users className="h-4 w-4 mr-2" />
                            Gán cho khách hàng
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              setEditingVoucher(voucher)
                              syncFormFromVoucher(voucher)
                              setIsEditDialogOpen(true)
                            }}
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Sửa
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => {
                              setEditingVoucher(voucher)
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

            <div className="mt-6 flex flex-wrap items-center gap-4 border-t pt-4 md:flex-nowrap">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Hiển thị trên một trang:</span>
                <Select value={rowsPerPage.toString()} onValueChange={(val) => setRowsPerPage(Number(val))}>
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
              </div>

              <div className="flex flex-1 justify-end">
                <Pagination className="w-auto !mx-0">
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        href="#"
                        onClick={(e) => {
                          e.preventDefault()
                          setCurrentPage(Math.max(1, currentPage - 1))
                        }}
                      />
                    </PaginationItem>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <PaginationItem key={page}>
                        <PaginationLink
                          href="#"
                          isActive={page === currentPage}
                          onClick={(e) => {
                            e.preventDefault()
                            setCurrentPage(page)
                          }}
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    <PaginationItem>
                      <PaginationNext
                        href="#"
                        onClick={(e) => {
                          e.preventDefault()
                          setCurrentPage(Math.min(totalPages, currentPage + 1))
                        }}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            </div>
          </CardContent>
        </Card>

        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Sửa voucher</DialogTitle>
            </DialogHeader>
            {editingVoucher && (
              <div className="space-y-4 py-4">
                {formError ? <p className="text-sm text-destructive">{formError}</p> : null}
                <div className="space-y-2">
                  <Label htmlFor="edit-voucher-code">Mã voucher</Label>
                  <Input id="edit-voucher-code" value={form.code} readOnly disabled className="bg-muted" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-voucher-desc">Mô tả</Label>
                  <Input id="edit-voucher-desc" value={form.description} onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-discount-type">Loại giảm giá</Label>
                    <Select value={form.discount_type} onValueChange={(value: "percent" | "fixed") => setForm((prev) => ({ ...prev, discount_type: value }))}>
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="w-full">
                        <SelectItem value="percent">Phần trăm (%)</SelectItem>
                        <SelectItem value="fixed">Số tiền cố định</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-discount-value">Giá trị</Label>
                    <Input id="edit-discount-value" type="number" value={form.discount_value} onChange={(e) => setForm((prev) => ({ ...prev, discount_value: e.target.value }))} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-voucher-status">Trạng thái</Label>
                  <Select value={form.status} onValueChange={(value: "active" | "inactive") => setForm((prev) => ({ ...prev, status: value }))}>
                    <SelectTrigger id="edit-voucher-status" className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="w-full">
                      <SelectItem value="active">Hoạt động</SelectItem>
                      <SelectItem value="inactive">Ngừng hoạt động</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-start-date">Ngày bắt đầu</Label>
                    <Input id="edit-start-date" type="date" value={form.start_date} onChange={(e) => setForm((prev) => ({ ...prev, start_date: e.target.value }))} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-end-date">Ngày kết thúc</Label>
                    <Input id="edit-end-date" type="date" value={form.end_date} onChange={(e) => setForm((prev) => ({ ...prev, end_date: e.target.value }))} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-max-use">Số lần sử dụng tối đa</Label>
                  <Input id="edit-max-use" type="number" value={form.max_use} onChange={(e) => setForm((prev) => ({ ...prev, max_use: e.target.value }))} />
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => {
                setIsEditDialogOpen(false)
                setEditingVoucher(null)
                resetForm()
              }}>
                Hủy
              </Button>
              <Button className="bg-primary" onClick={handleEditVoucher} disabled={isSubmitting}>
                {isSubmitting ? "Đang lưu..." : "Lưu"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Xóa voucher</AlertDialogTitle>
              <AlertDialogDescription>
                Bạn có chắc chắn muốn xóa voucher "{editingVoucher?.code}"? Hành động này không thể hoàn tác.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Hủy</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteVoucher} className="bg-red-600 hover:bg-red-700" disabled={isSubmitting}>
                {isSubmitting ? "Đang xóa..." : "Xóa"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <AssignVoucherDialog
          open={isAssignDialogOpen}
          onOpenChange={setIsAssignDialogOpen}
          mode="voucher"
          selectedItem={editingVoucher || undefined}
          vouchers={vouchers}
          customers={customers}
          voucherAssignments={[]}
          onAssign={handleAssignVoucher}
        />

        <Dialog open={isBulkAssignDialogOpen} onOpenChange={setIsBulkAssignDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Gán {selectedVouchers.length} voucher cho khách hàng</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              {assignError ? <p className="text-sm text-destructive">{assignError}</p> : null}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Vouchers được chọn</Label>
                <div className="max-h-32 overflow-y-auto rounded-lg bg-muted p-3">
                  <div className="space-y-1">
                    {selectedVouchers.map((voucherId) => {
                      const voucher = vouchers.find((item) => item.id === voucherId)
                      return (
                        <div key={voucherId} className="text-sm">
                          <span className="font-mono font-medium">{voucher?.code}</span>
                          <span className="ml-2 text-muted-foreground">- {voucher?.description || "Không có mô tả"}</span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Checkbox
                  id="assign-all"
                  checked={assignToAllCustomers}
                  onCheckedChange={(checked) => {
                    setAssignToAllCustomers(Boolean(checked))
                    if (checked) {
                      setBulkAssignCustomerId("")
                    }
                  }}
                />
                <Label htmlFor="assign-all" className="cursor-pointer font-normal">
                  Gán cho tất cả khách hàng ({customers.length})
                </Label>
              </div>

              {!assignToAllCustomers ? (
                <div className="space-y-2">
                  <Label htmlFor="bulk-customer">Chọn khách hàng</Label>
                  <Select value={bulkAssignCustomerId} onValueChange={setBulkAssignCustomerId}>
                    <SelectTrigger id="bulk-customer">
                      <SelectValue placeholder="Chọn khách hàng..." />
                    </SelectTrigger>
                    <SelectContent>
                      {customers.map((customer) => (
                        <SelectItem key={customer.id} value={String(customer.id)}>
                          {customer.name} - {customer.phone_number}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ) : null}

              <div className="space-y-2">
                <Label htmlFor="bulk-expired-at">Ngày hết hạn</Label>
                <Input
                  id="bulk-expired-at"
                  type="date"
                  value={bulkAssignExpiredAt}
                  onChange={(e) => setBulkAssignExpiredAt(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsBulkAssignDialogOpen(false)}>
                Hủy
              </Button>
              <Button
                className="bg-primary"
                onClick={handleBulkAssign}
                disabled={isAssigning || (!assignToAllCustomers && !bulkAssignCustomerId)}
              >
                {isAssigning ? "Đang gán..." : `Gán ${selectedVouchers.length} voucher`}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  )
}

export default function VouchersPage() {
  return (
    <Suspense fallback={null}>
      <VouchersPageContent />
    </Suspense>
  )
}

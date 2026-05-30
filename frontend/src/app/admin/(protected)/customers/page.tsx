"use client"

import { HeaderNav } from "@/features/admin/components/header-nav"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Mail, Phone, MapPin, MoreVertical, Ticket, Plus } from "lucide-react"
import { Suspense, useEffect, useState } from "react"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useCustomers } from "@/features/admin/hooks/useCustomers"
import { useVouchers, type Voucher } from "@/features/admin/hooks/useVouchers"
import { useCustomerVouchers, type CustomerVoucherRecord } from "@/features/admin/hooks/useCustomerVouchers"
import { AssignVoucherDialog } from "@/features/admin/components/assign-voucher-dialog"

function CustomersContent() {
  const {
    customers,
    keyword,
    setKeyword,
    page,
    setPage,
    limit,
    setLimit,
    totalPages,
    total,
    loading,
  } = useCustomers()
  const { vouchers } = useVouchers({
    keyword: "",
    status: "all",
    page: 1,
    limit: 200,
  })
  const { fetchAssignments, assignVoucher, buildCustomerVoucherCounts } = useCustomerVouchers()
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false)
  const [isVouchersDialogOpen, setIsVouchersDialogOpen] = useState(false)
  const [selectedCustomer, setSelectedCustomer] = useState<(typeof customers)[number] | null>(null)
  const [customerVouchers, setCustomerVouchers] = useState<CustomerVoucherRecord[]>([])
  const [voucherCounts, setVoucherCounts] = useState<Record<number, number>>({})
  const [isLoadingVouchers, setIsLoadingVouchers] = useState(false)

  useEffect(() => {
    let ignore = false

    const loadVoucherCounts = async () => {
      try {
        const assignments = await fetchAssignments({
          page: 1,
          limit: 500,
        })

        if (ignore) {
          return
        }

        setVoucherCounts(buildCustomerVoucherCounts(assignments))
      } catch (error) {
        if (!ignore) {
          setVoucherCounts({})
        }
      }
    }

    loadVoucherCounts()

    return () => {
      ignore = true
    }
  }, [buildCustomerVoucherCounts, customers, fetchAssignments])

  const handleAssignVoucher = async (voucherId: number, customerId: number) => {
    await assignVoucher(voucherId, customerId)

    setVoucherCounts((prev) => ({
      ...prev,
      [customerId]: (prev[customerId] || 0) + 1,
    }))
  }

  const handleViewVouchers = async (customer: (typeof customers)[number]) => {
    setSelectedCustomer(customer)
    setIsVouchersDialogOpen(true)
    setIsLoadingVouchers(true)

    try {
      const assignments = await fetchAssignments({
        customer_id: customer.id,
        page: 1,
        limit: 200,
      })

      setCustomerVouchers(assignments)
    } catch (error) {
      setCustomerVouchers([])
    } finally {
      setIsLoadingVouchers(false)
    }
  }

  const handleOpenAssignDialog = (customer: (typeof customers)[number]) => {
    setSelectedCustomer(customer)
    setIsAssignDialogOpen(true)
  }

  return (
    <main className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Quản lý đối tác</h1>
        {/*<Button className="bg-primary hover:bg-primary/90">*/}
        {/*  <Plus className="h-4 w-4 mr-2" /> Thêm khách hàng*/}
        {/*</Button>*/}
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
            placeholder="Tìm theo tên hoặc email khách hàng..."
            className="pl-9"
            value={keyword}
            onChange={(e) => {
              setPage(1)
              setKeyword(e.target.value)
            }}
        />
      </div>

      <div className="border rounded-lg bg-white overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead>Tên khách hàng</TableHead>
              <TableHead>Điện thoại</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Địa chỉ</TableHead>
              <TableHead>Vouchers</TableHead>
              <TableHead className="text-right">Tổng chi tiêu</TableHead>
              <TableHead className="text-right">Hành động</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {customers.length === 0 ? (
                <TableRow>
                  <TableCell
                      colSpan={7}
                      className="text-center py-10 text-muted-foreground"
                  >
                    Không có khách hàng
                  </TableCell>
                </TableRow>
            ) : (
                customers.map((c) => (
                    <TableRow key={c.id}>
                      <TableCell className="font-medium text-primary">
                        {c.name}
                      </TableCell>
                      <TableCell className="flex items-center gap-2">
                        <Phone className="h-3 w-3 text-muted-foreground" />
                        {c.phone_number || "—"}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Mail className="h-3 w-3 text-muted-foreground" />
                          {c.email}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-3 w-3 text-muted-foreground" />
                          {c.address || "—"}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="cursor-pointer" onClick={() => handleViewVouchers(c)}>
                          <Ticket className="h-3 w-3 mr-1" /> {voucherCounts[c.id] || 0} voucher
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-bold">
                        {c.total_spending.toLocaleString("vi-VN")} đ
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleViewVouchers(c)}>
                              <Ticket className="h-4 w-4 mr-2" />
                              Xem vouchers
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleOpenAssignDialog(c)}>
                              <Plus className="h-4 w-4 mr-2" />
                              Gán voucher
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                ))
            )}
          </TableBody>
        </Table>

        {/* FOOTER */}
        <div className="flex items-center justify-between px-4 py-4 bg-muted/20 border-t">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <span>Hiển thị</span>
              <Select
                  value={String(limit)}
                  onValueChange={(v) => {
                    setPage(1)
                    setLimit(Number(v))
                  }}
              >
                <SelectTrigger className="h-8 w-[70px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">25</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                  <SelectItem value="100">100</SelectItem>
                </SelectContent>
              </Select>
              <span>bản ghi</span>
            </div>

            <span>
                -
            </span>

            {/* Tổng số bản ghi */}
            <span>
                Tổng: {total} khách hàng
            </span>
          </div>

          <Pagination className="mx-0 w-auto">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                    href="#"
                    onClick={(e) => {
                      e.preventDefault()
                      if (page > 1) setPage(page - 1)
                    }}
                />
              </PaginationItem>

              {Array.from({ length: totalPages }).map((_, i) => (
                  <PaginationItem key={i}>
                    <PaginationLink
                        href="#"
                        isActive={page === i + 1}
                        onClick={(e) => {
                          e.preventDefault()
                          setPage(i + 1)
                        }}
                    >
                      {i + 1}
                    </PaginationLink>
                  </PaginationItem>
              ))}

              <PaginationItem>
                <PaginationNext
                    href="#"
                    onClick={(e) => {
                      e.preventDefault()
                      if (page < totalPages) setPage(page + 1)
                    }}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>

      <Dialog open={isVouchersDialogOpen} onOpenChange={setIsVouchersDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Vouchers của {selectedCustomer?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-4">
            {isLoadingVouchers ? (
              <p className="py-4 text-center text-muted-foreground">Đang tải vouchers...</p>
            ) : customerVouchers.length > 0 ? (
              customerVouchers.map((assignment) => (
                <div key={assignment.id} className="rounded-lg border p-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-mono font-medium">{assignment.voucher?.code}</p>
                      <p className="text-sm text-muted-foreground">{assignment.voucher?.description || "Không có mô tả"}</p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        Trạng thái: {assignment.status === "available" ? "Khả dụng" : assignment.status === "used" ? "Đã dùng" : "Hết hạn"}
                      </p>
                    </div>
                    <Badge variant="outline">
                      {assignment.voucher?.discount_type === "percent"
                        ? `${assignment.voucher.discount_value}%`
                        : `${assignment.voucher?.discount_value?.toLocaleString()}đ`}
                    </Badge>
                  </div>
                </div>
              ))
            ) : (
              <p className="py-4 text-center text-muted-foreground">Chưa có voucher nào được gán</p>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <AssignVoucherDialog
        open={isAssignDialogOpen}
        onOpenChange={setIsAssignDialogOpen}
        mode="customer"
        selectedItem={selectedCustomer || undefined}
        vouchers={vouchers}
        customers={customers}
        voucherAssignments={[]}
        onAssign={handleAssignVoucher}
      />
    </main>
  )
}

export default function CustomersPage() {
  return (
    <div className="min-h-screen bg-background">
      <HeaderNav />
      <Suspense fallback={null}>
        <CustomersContent />
      </Suspense>
    </div>
  )
}

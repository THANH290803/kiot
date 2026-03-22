"use client"

import Link from "next/link"
import { Calendar, Eye, FileDown, Filter, MoreHorizontal, Search } from "lucide-react"
import { HeaderNav } from "@/features/admin/components/header-nav"
import { getOrderStatusClassName, getOrderStatusLabel, useOrdersPage } from "@/features/admin/hooks/use-orders-page"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
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

export default function OrdersPage() {
  const {
    orders,
    isLoading,
    error,
    keyword,
    setKeyword,
    selectedStatus,
    setSelectedStatus,
    rowsPerPage,
    setRowsPerPage,
    setCurrentPage,
    pagination,
    totalPages,
    resetFilters,
  } = useOrdersPage()

  return (
    <div className="min-h-screen bg-background">
      <HeaderNav />
      <main className="container mx-auto p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Hóa đơn giao dịch</h1>
          <div className="flex gap-2">
            <Button variant="outline">
              <FileDown className="h-4 w-4 mr-2" /> Xuất file
            </Button>
            <Button variant="outline">
              <Calendar className="h-4 w-4 mr-2" /> Hôm nay
            </Button>
          </div>
        </div>

        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              value={keyword}
              onChange={(event) => {
                setCurrentPage(1)
                setKeyword(event.target.value)
              }}
              placeholder="Tìm mã hóa đơn, tên khách hàng..."
              className="pl-9"
            />
          </div>
          <Select
            value={selectedStatus}
            onValueChange={(value) => {
              setCurrentPage(1)
              setSelectedStatus(value)
            }}
          >
            <SelectTrigger className="w-[220px]">
              <SelectValue placeholder="Chọn trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả trạng thái</SelectItem>
              <SelectItem value="pending">Chờ xác nhận</SelectItem>
              <SelectItem value="confirmed">Đã xác nhận</SelectItem>
              <SelectItem value="shipping">Đang giao</SelectItem>
              <SelectItem value="delivered">Đã giao</SelectItem>
              <SelectItem value="completed">Hoàn thành</SelectItem>
              <SelectItem value="cancelled">Đã hủy</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={resetFilters}>
            <Filter className="h-4 w-4 mr-2" /> Lọc
          </Button>
        </div>

        {error ? <div className="rounded-lg border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">{error}</div> : null}

        <div className="border rounded-lg bg-white overflow-hidden">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead>Mã hóa đơn</TableHead>
                <TableHead>Thời gian</TableHead>
                <TableHead>Khách hàng</TableHead>
                <TableHead>HT thanh toán</TableHead>
                <TableHead className="text-right">Tổng tiền</TableHead>
                <TableHead className="text-right">Trạng thái</TableHead>
                <TableHead className="w-[80px] text-center">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="py-10 text-center text-muted-foreground">
                    Đang tải danh sách giao dịch...
                  </TableCell>
                </TableRow>
              ) : orders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="py-10 text-center text-muted-foreground">
                    Không tìm thấy giao dịch phù hợp.
                  </TableCell>
                </TableRow>
              ) : (
                orders.map((order) => (
                  <TableRow key={order.id} className="hover:bg-muted/30">
                    <TableCell className="font-bold text-primary">{order.code}</TableCell>
                    <TableCell className="text-sm">{order.time}</TableCell>
                    <TableCell>{order.customer}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="font-normal">
                        {order.payment}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-bold">{order.total.toLocaleString("vi-VN")} đ</TableCell>
                    <TableCell className="text-right">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getOrderStatusClassName(order.status)}`}>
                        {getOrderStatusLabel(order.status)}
                      </span>
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
                            <Link href={`/admin/orders/${order.id}`} className="flex items-center cursor-pointer">
                              <Eye className="h-4 w-4 mr-2" /> Chi tiết
                            </Link>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          <div className="flex items-center justify-between px-4 py-4 bg-muted/20 border-t">
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <span>Hiển thị</span>
                <Select
                  value={String(rowsPerPage)}
                  onValueChange={(value) => {
                    setCurrentPage(1)
                    setRowsPerPage(Number(value))
                  }}
                >
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
              <span>
                Hiển thị trang {pagination.page}/{totalPages}
              </span>
              <span>Tổng số giao dịch: {pagination.total}</span>
            </div>
            <Pagination className="mx-0 w-auto">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    aria-disabled={pagination.page <= 1}
                    className={pagination.page <= 1 ? "pointer-events-none opacity-50" : undefined}
                    onClick={(event) => {
                      event.preventDefault()
                      setCurrentPage((prevPage) => Math.max(1, prevPage - 1))
                    }}
                  />
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#" isActive onClick={(event) => event.preventDefault()}>
                    {pagination.page}
                  </PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext
                    href="#"
                    aria-disabled={pagination.page >= totalPages}
                    className={pagination.page >= totalPages ? "pointer-events-none opacity-50" : undefined}
                    onClick={(event) => {
                      event.preventDefault()
                      setCurrentPage((prevPage) => Math.min(totalPages, prevPage + 1))
                    }}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </div>
      </main>
    </div>
  )
}

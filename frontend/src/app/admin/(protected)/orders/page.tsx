"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Calendar, FileDown, Filter, Search } from "lucide-react"
import { HeaderNav } from "@/features/admin/components/header-nav"
import {
  getNextOrderStatuses,
  getOrderChannelClassName,
  getOrderChannelLabel,
  getOrderStatusClassName,
  getOrderStatusLabel,
  useOrdersPage,
} from "@/features/admin/hooks/use-orders-page"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

const ORDER_STATUS_SEQUENCE = ["pending", "confirmed", "shipping", "delivered", "completed", "cancelled"] as const
const ORDER_STATUS_OPTIONS = [
  { value: "all", label: "Tất cả trạng thái" },
  { value: "pending", label: "Chờ xác nhận" },
  { value: "confirmed", label: "Đã xác nhận" },
  { value: "shipping", label: "Đang giao" },
  { value: "delivered", label: "Đã giao" },
  { value: "completed", label: "Hoàn thành" },
  { value: "cancelled", label: "Đã hủy" },
] as const

export default function OrdersPage() {
  const router = useRouter()
  const [openStatusOrderId, setOpenStatusOrderId] = useState<number | null>(null)
  const [pendingStatus, setPendingStatus] = useState<string>("")
  const [showStatusFilter, setShowStatusFilter] = useState(false)
  const {
    orders,
    isLoading,
    isUpdatingStatus,
    error,
    keyword,
    setKeyword,
    selectedStatus,
    setSelectedStatus,
    selectedChannel,
    setSelectedChannel,
    rowsPerPage,
    setRowsPerPage,
    setCurrentPage,
    pagination,
    totalPages,
    updateOrderStatus,
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

        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <Tabs
              value={selectedChannel}
              onValueChange={(value) => {
                setCurrentPage(1)
                setSelectedChannel(value)
              }}
              className="shrink-0"
            >
              <TabsList className="grid h-[72px] w-full max-w-3xl grid-cols-2 items-stretch overflow-hidden rounded-[10px] border border-slate-200 bg-slate-100 p-0">
                <TabsTrigger
                  value="in_store"
                  className="h-full w-full rounded-none rounded-l-[10px] px-8 py-0 text-[14px] leading-none font-semibold text-slate-600 transition-colors duration-200 data-[state=active]:bg-white data-[state=active]:text-slate-900"
                >
                  Tại cửa hàng
                </TabsTrigger>
                <TabsTrigger
                  value="online"
                  className="h-full w-full rounded-none rounded-r-[10px] px-8 py-0 text-[14px] leading-none font-semibold text-slate-600 transition-colors duration-200 data-[state=active]:bg-white data-[state=active]:text-slate-900"
                >
                  Online
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="ml-auto flex items-center gap-3">
              <div className="relative w-[320px] max-w-full">
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

              <Button
                variant={showStatusFilter || selectedStatus !== "all" ? "default" : "outline"}
                onClick={() => setShowStatusFilter((prev) => !prev)}
              >
                <Filter className="h-4 w-4 mr-2" /> Lọc
              </Button>
            </div>
          </div>

          {showStatusFilter ? (
            <div className="ml-auto flex w-fit items-center gap-2">
              <Select
                value={selectedStatus}
                onValueChange={(value) => {
                  setCurrentPage(1)
                  setSelectedStatus(value)
                }}
              >
                <SelectTrigger className="w-[260px]">
                  <SelectValue placeholder="Chọn trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  {ORDER_STATUS_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setCurrentPage(1)
                  setSelectedStatus("all")
                }}
              >
                Xóa lọc
              </Button>
            </div>
          ) : null}
        </div>

        {error ? <div className="rounded-lg border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">{error}</div> : null}

        <div className="border rounded-lg bg-white overflow-hidden">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead>Mã hóa đơn</TableHead>
                <TableHead>Thời gian</TableHead>
                <TableHead>Khách hàng</TableHead>
                <TableHead>Nguồn đơn</TableHead>
                <TableHead>HT thanh toán</TableHead>
                <TableHead className="text-right">Tổng tiền</TableHead>
                <TableHead className="text-right">Trạng thái</TableHead>
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
                  <TableRow
                    key={order.id}
                    className="cursor-pointer hover:bg-muted/30"
                    onClick={() => router.push(`/admin/orders/${order.id}`)}
                  >
                    <TableCell className="font-bold text-primary">{order.code}</TableCell>
                    <TableCell className="text-sm">{order.time}</TableCell>
                    <TableCell>{order.customer}</TableCell>
                    <TableCell>
                      <Badge className={getOrderChannelClassName(order.channel)}>
                        {getOrderChannelLabel(order.channel)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="font-normal">
                        {order.payment}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-bold">{order.total.toLocaleString("vi-VN")} đ</TableCell>
                    <TableCell className="text-right" onClick={(event) => event.stopPropagation()}>
                      <Popover
                        open={openStatusOrderId === order.id}
                        onOpenChange={(nextOpen) => {
                          setOpenStatusOrderId(nextOpen ? order.id : null)
                          setPendingStatus(nextOpen ? order.status : "")
                        }}
                      >
                        <PopoverTrigger asChild>
                          <button
                            type="button"
                            className={`px-2 py-1 rounded-full text-xs font-medium ${getOrderStatusClassName(order.status)}`}
                          >
                            {getOrderStatusLabel(order.status)}
                          </button>
                        </PopoverTrigger>
                        <PopoverContent align="end" className="w-72 p-0">
                          <div className="border-b px-4 py-3">
                            <p className="text-sm font-semibold">Cập nhật trạng thái</p>
                            <p className="mt-1 text-xs text-muted-foreground">
                              Chỉ được chuyển theo đúng luồng xử lý đơn hàng.
                            </p>
                          </div>
                          <div className="space-y-2 px-4 py-3">
                            {ORDER_STATUS_SEQUENCE.map((status) => {
                              const enabledStatuses = getNextOrderStatuses(order.status)
                              const isDisabled = !enabledStatuses.includes(status)

                              return (
                                <button
                                  key={status}
                                  type="button"
                                  disabled={isDisabled}
                                  onClick={() => setPendingStatus(status)}
                                  className={`w-full rounded-lg border px-3 py-2 text-left text-sm transition-colors ${
                                    pendingStatus === status
                                      ? "border-primary bg-primary/10 text-primary"
                                      : "border-border"
                                  } ${
                                    isDisabled
                                      ? "cursor-not-allowed opacity-45"
                                      : "hover:bg-muted"
                                  }`}
                                >
                                  {getOrderStatusLabel(status)}
                                </button>
                              )
                            })}
                          </div>
                          <div className="flex justify-end gap-2 border-t bg-muted/20 px-4 py-3">
                            <Button
                              variant="outline"
                              onClick={() => {
                                setOpenStatusOrderId(null)
                                setPendingStatus("")
                              }}
                            >
                              Hủy bỏ
                            </Button>
                            <Button
                              disabled={
                                isUpdatingStatus ||
                                !pendingStatus ||
                                !getNextOrderStatuses(order.status).includes(pendingStatus)
                              }
                              onClick={async () => {
                                await updateOrderStatus(order.id, pendingStatus)
                                setOpenStatusOrderId(null)
                                setPendingStatus("")
                              }}
                            >
                              Áp dụng
                            </Button>
                          </div>
                        </PopoverContent>
                      </Popover>
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

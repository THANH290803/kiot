"use client"

import { HeaderNav } from "@/components/header-nav"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Search, Calendar, Filter, Eye, FileDown, MoreHorizontal } from "lucide-react"
import { Suspense, useState } from "react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

function OrdersContent() {
  const [orders] = useState([
    {
      id: 1,
      code: "HD0001",
      time: "31/12/2025 14:35",
      customer: "Nguyễn Văn A",
      total: 1250000,
      status: "completed",
      payment: "Tiền mặt",
    },
    {
      id: 2,
      code: "HD0002",
      time: "31/12/2025 15:10",
      customer: "Khách lẻ",
      total: 450000,
      status: "completed",
      payment: "Chuyển khoản",
    },
    {
      id: 3,
      code: "HD0003",
      time: "31/12/2025 16:20",
      customer: "Trần Thị B",
      total: 850000,
      status: "completed",
      payment: "Chuyển khoản",
    },
    {
      id: 4,
      code: "HD0004",
      time: "31/12/2025 16:45",
      customer: "Nguyễn Văn A",
      total: 320000,
      status: "completed",
      payment: "Tiền mặt",
    },
  ])

  const [rowsPerPage, setRowsPerPage] = useState(10)

  return (
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
          <Input placeholder="Tìm mã hóa đơn, tên khách hàng..." className="pl-9" />
        </div>
        <Button variant="outline">
          <Filter className="h-4 w-4 mr-2" /> Lọc
        </Button>
      </div>

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
            {orders.map((order) => (
              <TableRow key={order.id} className="hover:bg-muted/30">
                <TableCell className="font-bold text-primary">{order.code}</TableCell>
                <TableCell className="text-sm">{order.time}</TableCell>
                <TableCell>{order.customer}</TableCell>
                <TableCell>
                  <Badge variant="secondary" className="font-normal">
                    {order.payment}
                  </Badge>
                </TableCell>
                <TableCell className="text-right font-bold">{order.total.toLocaleString()} đ</TableCell>
                <TableCell className="text-right">
                  <span className="px-2 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-medium">
                    Hoàn thành
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
                        <Link href={`/orders/${order.id}`} className="flex items-center cursor-pointer">
                          <Eye className="h-4 w-4 mr-2" /> Chi tiết
                        </Link>
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
            <span>Tổng số: {orders.length}</span>
          </div>
          <Pagination className="mx-0 w-auto">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious href="#" />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#" isActive>
                  1
                </PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationNext href="#" />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </main>
  )
}

export default function OrdersPage() {
  return (
    <div className="min-h-screen bg-background">
      <HeaderNav />
      <Suspense fallback={null}>
        <OrdersContent />
      </Suspense>
    </div>
  )
}

"use client"

import { HeaderNav } from "@/components/header-nav"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Search, Mail, Phone, MapPin } from "lucide-react"
import { Suspense, useState } from "react"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

function CustomersContent() {
  const [rowsPerPage, setRowsPerPage] = useState(10)

  return (
    <main className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Quản lý đối tác</h1>
        <Button className="bg-primary hover:bg-primary/90">
          <Plus className="h-4 w-4 mr-2" /> Thêm khách hàng
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Tìm tên, số điện thoại, email khách hàng..." className="pl-9" />
      </div>

      <div className="border rounded-lg bg-white overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead>Tên khách hàng</TableHead>
              <TableHead>Điện thoại</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Địa chỉ</TableHead>
              <TableHead className="text-right">Tổng chi tiêu</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[1, 2, 3, 4].map((i) => (
              <TableRow key={i}>
                <TableCell className="font-medium text-primary">Nguyễn Văn {String.fromCharCode(64 + i)}</TableCell>
                <TableCell className="flex items-center gap-2">
                  <Phone className="h-3 w-3 text-muted-foreground" /> 090123456{i}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Mail className="h-3 w-3 text-muted-foreground" /> customer{i}@example.com
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-3 w-3 text-muted-foreground" /> Quận {i}, TP. HCM
                  </div>
                </TableCell>
                <TableCell className="text-right font-bold">{(5000000 * i).toLocaleString()} đ</TableCell>
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
                </SelectContent>
              </Select>
              <span>bản ghi</span>
            </div>
          </div>
          <Pagination className="mx-0 w-auto">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious href="#"/>
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

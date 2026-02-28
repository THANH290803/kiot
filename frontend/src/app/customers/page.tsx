"use client"

import { HeaderNav } from "@/components/header-nav"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Search, Mail, Phone, MapPin } from "lucide-react"
import {Suspense, useState, useEffect} from "react"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

import { useCustomers } from "@/hooks/useCustomers"

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
              <TableHead className="text-right">Tổng chi tiêu</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {customers.length === 0 ? (
                <TableRow>
                  <TableCell
                      colSpan={5}
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
                      <TableCell className="text-right font-bold">
                        {c.total_spending.toLocaleString("vi-VN")} đ
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

"use client"

import { HeaderNav } from "@/components/header-nav"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Search, FileDown, Filter, MoreHorizontal, Edit, Trash2, Eye } from "lucide-react"
import { useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
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
import { ChevronDown, ChevronRight } from "lucide-react"
import React from "react"
import { ProductFormDialog } from "@/components/product-form-dialog"
import { ProductVariantsDisplay } from "@/components/product-variants-display"
import { ImageZoom } from "@/components/image-zoom"

export default function ProductsPage() {
  const [products, setProducts] = useState([
    {
      id: 1,
      code: "HH0001",
      name: "Áo thun Cotton Premium",
      category: "Thời trang",
      brand: "Nike",
      basePrice: 250000,
      totalStock: 45,
      status: "active",
      images: [
        { id: 1, url: "/white-shirt.jpg", color: "Trắng", isAvatar: true },
        { id: 2, url: "/black-shirt.jpg", color: "Đen", isAvatar: true },
        { id: 3, url: "/white-shirt-side.jpg", color: "Trắng", isAvatar: false },
      ],
      variants: [
        {
          id: 101,
          sku: "HH0001-T-L",
          color: "Trắng",
          size: "L",
          stock: 15,
          price: 250000,
        },
        {
          id: 102,
          sku: "HH0001-T-M",
          color: "Trắng",
          size: "M",
          stock: 10,
          price: 250000,
        },
        {
          id: 103,
          sku: "HH0001-D-L",
          color: "Đen",
          size: "L",
          stock: 20,
          price: 260000,
        },
      ],
    },
    {
      id: 2,
      code: "HH0002",
      name: "Quần Jean Slim Fit",
      category: "Thời trang",
      brand: "Levi's",
      basePrice: 450000,
      totalStock: 8,
      status: "active",
      images: [],
      variants: [{ id: 201, sku: "HH0002-X-32", color: "Xanh", size: "32", stock: 8, price: 450000 }],
    },
    {
      id: 3,
      code: "HH0003",
      name: "Giày Sneaker White",
      category: "Giày dép",
      brand: "Adidas",
      basePrice: 850000,
      totalStock: 12,
      status: "active",
      images: [],
      variants: [{ id: 301, sku: "HH0003-T-42", color: "Trắng", size: "42", stock: 12, price: 850000 }],
    },
    {
      id: 4,
      code: "HH0004",
      name: "Mũ bảo hiểm 3/4",
      category: "Phụ kiện",
      brand: "Royal",
      basePrice: 320000,
      totalStock: 20,
      status: "active",
      images: [],
      variants: [{ id: 401, sku: "HH0004-D-M", color: "Đỏ", size: "M", stock: 20, price: 320000 }],
    },
    {
      id: 5,
      code: "HH0005",
      name: "Ví da bò thật",
      category: "Phụ kiện",
      brand: "Gucci",
      basePrice: 180000,
      totalStock: 5,
      status: "active",
      images: [],
      variants: [{ id: 501, sku: "HH0005-N-L", color: "Nâu", size: "L", stock: 5, price: 180000 }],
    },
  ])

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<any>(null)
  const [deletingProductId, setDeletingProductId] = useState<number | null>(null)
  const [expandedRows, setExpandedRows] = useState<number[]>([])
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [currentPage, setCurrentPage] = useState(1)
  const [zoomImage, setZoomImage] = useState<string | null>(null)

  const handleEditProduct = (product: any) => {
    setEditingProduct(product)
    setIsDialogOpen(true)
  }

  const handleDelete = (id: number) => {
    setProducts(products.filter((p) => p.id !== id))
    setIsDeleteDialogOpen(false)
    setDeletingProductId(null)
  }

  const handleSaveProduct = (productData: any) => {
    if (editingProduct) {
      // Update existing product
      setProducts(products.map((p) => (p.id === editingProduct.id ? { ...p, ...productData } : p)))
    } else {
      // Add new product
      const newProduct = {
        id: Math.max(...products.map((p) => p.id), 0) + 1,
        code: `HH${String(Math.max(...products.map((p) => p.id), 0) + 1).padStart(4, "0")}`,
        ...productData,
        totalStock: productData.variants?.reduce((sum: number, v: any) => sum + v.stock, 0) || 0,
      }
      setProducts([...products, newProduct])
    }
    setEditingProduct(null)
    setIsDialogOpen(false)
  }

  const toggleRow = (id: number) => {
    setExpandedRows((prev) => (prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]))
  }

  const handleVariantEdit = (variant: any) => {
    // Open the product form with the variant selected for editing
    setEditingProduct({
      ...products.find((p) => p.variants.some((v) => v.id === variant.id)),
      editingVariantId: variant.id,
    })
    setIsDialogOpen(true)
  }

  const handleVariantDelete = (variant: any) => {
    setProducts(
      products.map((p) => ({
        ...p,
        variants: p.variants.filter((v) => v.id !== variant.id),
        totalStock: p.variants.filter((v) => v.id !== variant.id).reduce((sum, v) => sum + v.stock, 0),
      })),
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <HeaderNav />
      <main className="container mx-auto p-6 space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <h1 className="text-2xl font-bold">Quản lý hàng hóa</h1>
          <div className="flex items-center gap-2">
            <Button variant="outline">
              <FileDown className="h-4 w-4 mr-2" /> Xuất file
            </Button>
            <Button
              className="bg-primary hover:bg-primary/90"
              onClick={() => {
                setEditingProduct(null)
                setIsDialogOpen(true)
              }}
            >
              <Plus className="h-4 w-4 mr-2" /> Thêm hàng hóa
            </Button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Tìm kiếm theo mã, tên hàng..." className="pl-9" />
          </div>
          <Select defaultValue="all">
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Danh mục" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả danh mục</SelectItem>
              <SelectItem value="fashion">Thời trang</SelectItem>
              <SelectItem value="shoes">Giày dép</SelectItem>
              <SelectItem value="accessory">Phụ kiện</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="all">
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Thương hiệu" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả thương hiệu</SelectItem>
              <SelectItem value="nike">Nike</SelectItem>
              <SelectItem value="adidas">Adidas</SelectItem>
              <SelectItem value="levis">Levi's</SelectItem>
              <SelectItem value="gucci">Gucci</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" /> Bộ lọc
          </Button>
        </div>

        <div className="border rounded-lg bg-white overflow-hidden">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead className="w-[40px]"></TableHead>
                <TableHead className="w-[80px]">Ảnh</TableHead>
                <TableHead className="w-[120px]">Mã hàng</TableHead>
                <TableHead>Tên hàng</TableHead>
                <TableHead>Thương hiệu</TableHead>
                <TableHead>Danh mục</TableHead>
                <TableHead className="text-right">Giá cơ bản</TableHead>
                <TableHead className="text-right">Tồn kho</TableHead>
                <TableHead className="text-right">Trạng thái</TableHead>
                <TableHead className="w-[80px] text-center">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <React.Fragment key={product.id}>
                  <TableRow className="hover:bg-muted/30 cursor-pointer" onClick={() => toggleRow(product.id)}>
                    <TableCell>
                      {product.variants.length > 0 && (
                        <>
                          {expandedRows.includes(product.id) ? (
                            <ChevronDown className="h-4 w-4 text-muted-foreground" />
                          ) : (
                            <ChevronRight className="h-4 w-4 text-muted-foreground" />
                          )}
                        </>
                      )}
                    </TableCell>
                    <TableCell>
                      <div
                        className="w-10 h-10 rounded border bg-muted overflow-hidden hover:ring-2 hover:ring-primary transition-all cursor-zoom-in"
                        onClick={(e) => {
                          e.stopPropagation()
                          const avatar = product.images?.find((img) => img.isAvatar)?.url
                          if (avatar) setZoomImage(avatar)
                        }}
                      >
                        {product.images?.find((img) => img.isAvatar)?.url ? (
                          <img
                            src={product.images.find((img) => img.isAvatar)?.url || "/placeholder.svg"}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[10px] text-muted-foreground">
                            No Image
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium text-primary">{product.code}</TableCell>
                    <TableCell>
                      <div>
                        <div className="font-bold">{product.name}</div>
                        <div className="text-xs text-muted-foreground">{product.variants.length} biến thể</div>
                      </div>
                    </TableCell>
                    <TableCell>{product.brand}</TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell className="text-right font-bold">{product.basePrice.toLocaleString()} đ</TableCell>
                    <TableCell className="text-right font-bold text-primary">{product.totalStock}</TableCell>
                    <TableCell className="text-right">
                      <Badge variant={product.status === "active" ? "default" : "secondary"}>
                        {product.status === "active"
                          ? "Đang kinh doanh"
                          : product.status === "inactive"
                            ? "Ngừng kinh doanh"
                            : "Không còn hàng"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center" onClick={(e) => e.stopPropagation()}>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link href={`/products/${product.id}`} className="flex items-center cursor-pointer">
                              <Eye className="h-4 w-4 mr-2" /> Xem chi tiết
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEditProduct(product)} className="cursor-pointer">
                            <Edit className="h-4 w-4 mr-2" /> Sửa
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              setDeletingProductId(product.id)
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
                  {expandedRows.includes(product.id) && (
                    <TableRow className="bg-white">
                      <TableCell colSpan={10} className="p-6">
                        <ProductVariantsDisplay
                          variants={product.variants}
                          images={product.images}
                          onEdit={handleVariantEdit}
                          onDelete={handleVariantDelete}
                        />
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
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
              <span>Tổng số: {products.length}</span>
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

      <ImageZoom src={zoomImage || "/placeholder.svg"} isOpen={!!zoomImage} onClose={() => setZoomImage(null)} />

      <ProductFormDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        product={editingProduct}
        onSave={handleSaveProduct}
      />

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa hàng hóa</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa hàng hóa này không? Thao tác này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deletingProductId && handleDelete(deletingProductId)}
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

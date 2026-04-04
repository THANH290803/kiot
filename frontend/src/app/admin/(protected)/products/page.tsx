"use client"

import { FileDown, Filter, Loader2, Plus, Search } from "lucide-react"
import { HeaderNav } from "@/features/admin/components/header-nav"
import { ProductFormDialog } from "@/features/admin/components/product-form-dialog"
import { ProductTableRows } from "@/features/admin/components/product-table-rows"
import { ImageZoom } from "@/features/admin/components/image-zoom"
import { useProductsPage } from "@/features/admin/hooks/use-products-page"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
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
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

export default function ProductsPage() {
  const {
    products,
    categories,
    brands,
    isLoading,
    error,
    searchName,
    setSearchName,
    selectedCategoryId,
    setSelectedCategoryId,
    selectedBrandId,
    setSelectedBrandId,
    selectedStatus,
    setSelectedStatus,
    isDialogOpen,
    setIsDialogOpen,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    editingProduct,
    setEditingProduct,
    deletingProductId,
    expandedRows,
    rowsPerPage,
    setRowsPerPage,
    pagination,
    totalPages,
    isExporting,
    setCurrentPage,
    zoomImage,
    setZoomImage,
    handleEditProduct,
    handleRequestDeleteProduct,
    handleDelete,
    handleSaveProduct,
    handleChangeProductStatus,
    toggleRow,
    handleVariantEdit,
    handleVariantDelete,
    resetFilters,
    handleExportProducts,
  } = useProductsPage()

  return (
    <div className="min-h-screen bg-background">
      <HeaderNav />
      <main className="container mx-auto p-6 space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <h1 className="text-2xl font-bold">Quản lý hàng hóa</h1>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => void handleExportProducts()} disabled={isExporting}>
              {isExporting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FileDown className="mr-2 h-4 w-4" />}
              Xuất file
            </Button>
            <Button
              className="bg-primary hover:bg-primary/90"
              onClick={() => {
                setEditingProduct(null)
                setIsDialogOpen(true)
              }}
            >
              <Plus className="mr-2 h-4 w-4" /> Thêm hàng hóa
            </Button>
          </div>
        </div>

        <div className="flex flex-col gap-4 md:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              value={searchName}
              onChange={(event) => {
                setCurrentPage(1)
                setSearchName(event.target.value)
              }}
              placeholder="Nhập tên hàng hóa cần tìm"
              className="pl-9"
            />
          </div>

          <Select
            value={selectedCategoryId}
            onValueChange={(value) => {
              setCurrentPage(1)
              setSelectedCategoryId(value)
            }}
          >
            <SelectTrigger className="w-full md:w-[220px]">
              <SelectValue placeholder="Chọn danh mục" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả danh mục</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.id} value={String(category.id)}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={selectedBrandId}
            onValueChange={(value) => {
              setCurrentPage(1)
              setSelectedBrandId(value)
            }}
          >
            <SelectTrigger className="w-full md:w-[220px]">
              <SelectValue placeholder="Chọn thương hiệu" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả thương hiệu</SelectItem>
              {brands.map((brand) => (
                <SelectItem key={brand.id} value={String(brand.id)}>
                  {brand.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={selectedStatus}
            onValueChange={(value) => {
              setCurrentPage(1)
              setSelectedStatus(value)
            }}
          >
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Chọn trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả trạng thái</SelectItem>
              <SelectItem value="1">Đang kinh doanh</SelectItem>
              <SelectItem value="2">Không còn hàng</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" onClick={resetFilters}>
            <Filter className="mr-2 h-4 w-4" /> Đặt lại bộ lọc
          </Button>
        </div>

        {error ? <div className="rounded-lg border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">{error}</div> : null}

        <div className="overflow-hidden rounded-lg border bg-white">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead className="w-[40px]" />
                <TableHead className="w-[80px]">Ảnh</TableHead>
                <TableHead className="w-[140px]">SKU</TableHead>
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
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={10} className="py-10 text-center text-muted-foreground">
                    Đang tải danh sách hàng hóa...
                  </TableCell>
                </TableRow>
              ) : products.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={10} className="py-10 text-center text-muted-foreground">
                    Không tìm thấy hàng hóa phù hợp.
                  </TableCell>
                </TableRow>
              ) : (
                products.map((product) => (
                  <ProductTableRows
                    key={product.id}
                    product={product}
                    expanded={expandedRows.includes(product.id)}
                    onToggleRow={toggleRow}
                    onZoomImage={setZoomImage}
                    onEditProduct={handleEditProduct}
                    onDeleteProduct={handleRequestDeleteProduct}
                    onEditVariant={handleVariantEdit}
                    onDeleteVariant={handleVariantDelete}
                    onChangeProductStatus={handleChangeProductStatus}
                  />
                ))
              )}
            </TableBody>
          </Table>

          <div className="flex items-center justify-between border-t bg-muted/20 px-4 py-4">
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
              <span>Tổng số sản phẩm: {pagination.total}</span>
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

      <ImageZoom src={zoomImage || "/placeholder.svg"} isOpen={!!zoomImage} onClose={() => setZoomImage(null)} />

      <ProductFormDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        product={editingProduct}
        categories={categories}
        brands={brands}
        onSave={handleSaveProduct}
      />

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa hàng hóa</AlertDialogTitle>
            <AlertDialogDescription>Bạn có chắc chắn muốn xóa hàng hóa này không? Thao tác này không thể hoàn tác.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={async () => deletingProductId && await handleDelete(deletingProductId)} className="bg-destructive hover:bg-destructive/90">
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

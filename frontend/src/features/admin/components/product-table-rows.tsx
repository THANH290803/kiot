"use client"

import Link from "next/link"
import { useState } from "react"
import { Check, ChevronDown, ChevronRight, Edit, Eye, Loader2, MoreHorizontal, Trash2 } from "lucide-react"
import { ProductVariantsDisplay } from "@/features/admin/components/product-variants-display"
import { Button } from "@/components/ui/button"
import { TableCell, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import type { ProductVariantView, ProductView } from "@/features/admin/types/products-page"

interface ProductTableRowsProps {
  product: ProductView
  expanded: boolean
  onToggleRow: (id: number) => void
  onZoomImage: (src: string | null) => void
  onEditProduct: (product: ProductView) => void
  onDeleteProduct: (productId: number) => void
  onEditVariant: (variant: ProductVariantView) => void
  onDeleteVariant: (variant: ProductVariantView) => void
  onChangeProductStatus: (productId: number, status: ProductView["status"]) => Promise<void>
}

const statusOptions: Array<{ value: ProductView["status"]; label: string }> = [
  { value: "active", label: "Đang kinh doanh" },
  { value: "out_of_stock", label: "Không còn hàng" },
  { value: "inactive", label: "Ngừng kinh doanh" },
]

const statusDescriptions: Record<ProductView["status"], string> = {
  active: "Hiển thị và tiếp tục bán bình thường.",
  out_of_stock: "Giữ sản phẩm nhưng báo hết hàng.",
  inactive: "Tạm ẩn khỏi luồng kinh doanh hiện tại.",
}

function getStatusLabel(status: ProductView["status"]) {
  return statusOptions.find((option) => option.value === status)?.label || "Không xác định"
}

export function ProductTableRows({
  product,
  expanded,
  onToggleRow,
  onZoomImage,
  onEditProduct,
  onDeleteProduct,
  onEditVariant,
  onDeleteVariant,
  onChangeProductStatus,
}: ProductTableRowsProps) {
  const avatar = product.avatar || product.images.find((image) => image.isAvatar)?.url || product.images[0]?.url
  const [statusPopoverOpen, setStatusPopoverOpen] = useState(false)
  const [pendingStatus, setPendingStatus] = useState<ProductView["status"]>(product.status)
  const [isApplyingStatus, setIsApplyingStatus] = useState(false)

  const handleOpenChange = (open: boolean) => {
    setStatusPopoverOpen(open)
    if (open) {
      setPendingStatus(product.status)
    }
  }

  const handleApplyStatus = async () => {
    if (pendingStatus === product.status) {
      setStatusPopoverOpen(false)
      return
    }

    try {
      setIsApplyingStatus(true)
      await onChangeProductStatus(product.id, pendingStatus)
      setStatusPopoverOpen(false)
    } finally {
      setIsApplyingStatus(false)
    }
  }

  return (
    <>
      <TableRow className="cursor-pointer hover:bg-muted/30" onClick={() => onToggleRow(product.id)}>
        <TableCell>
          {product.variants.length > 0 ? (
            expanded ? (
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            ) : (
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            )
          ) : null}
        </TableCell>
        <TableCell>
          <div
            className="flex h-10 w-10 cursor-zoom-in items-center justify-center overflow-hidden rounded border bg-muted transition-all hover:ring-2 hover:ring-primary"
            onClick={(event) => {
              event.stopPropagation()
              if (avatar) {
                onZoomImage(avatar)
              }
            }}
          >
            {avatar ? (
              <img src={avatar} alt={product.name} className="h-full w-full object-cover" />
            ) : (
              <div className="text-[10px] text-muted-foreground">No Image</div>
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
        <TableCell className="text-right" onClick={(event) => event.stopPropagation()}>
            <Popover open={statusPopoverOpen} onOpenChange={handleOpenChange}>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  className="inline-flex items-center gap-2 rounded-full border border-transparent transition-all hover:border-border hover:bg-muted/40"
                >
                  <Badge variant={product.status === "active" ? "default" : "secondary"}>
                    {getStatusLabel(product.status)}
                  </Badge>
                </button>
              </PopoverTrigger>
            <PopoverContent align="end" className="w-80 rounded-2xl border-slate-200 p-0 shadow-xl">
              <div className="border-b bg-slate-50/80 px-4 py-3">
                <p className="text-sm font-semibold text-slate-900">Chuyển trạng thái hàng hóa</p>
                <p className="mt-1 text-xs text-slate-500">Chọn trạng thái mới rồi bấm Apply để cập nhật.</p>
              </div>
              <div className="space-y-2 px-3 py-3">
                <div className="grid gap-2">
                  {statusOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      className={`flex items-start justify-between gap-3 rounded-xl border px-3 py-3 text-left transition-all ${
                        pendingStatus === option.value
                          ? "border-primary bg-primary/5 text-primary shadow-sm"
                          : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                      }`}
                      onClick={() => setPendingStatus(option.value)}
                    >
                      <div>
                        <div className="text-sm font-medium">{option.label}</div>
                        <div className="mt-1 text-xs text-slate-500">{statusDescriptions[option.value]}</div>
                      </div>
                      <div
                        className={`mt-0.5 flex h-5 w-5 items-center justify-center rounded-full border ${
                          pendingStatus === option.value
                            ? "border-primary bg-primary text-white"
                            : "border-slate-300 bg-white text-transparent"
                        }`}
                      >
                        <Check className="h-3 w-3" />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex justify-end gap-2 border-t bg-slate-50/60 px-3 py-3">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setPendingStatus(product.status)
                    setStatusPopoverOpen(false)
                  }}
                >
                  Cancel
                </Button>
                <Button type="button" size="sm" onClick={() => void handleApplyStatus()} disabled={isApplyingStatus}>
                  {isApplyingStatus ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  Apply
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </TableCell>
        <TableCell className="text-center" onClick={(event) => event.stopPropagation()}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href={`/admin/products/${product.id}`} className="flex cursor-pointer items-center">
                  <Eye className="mr-2 h-4 w-4" /> Xem chi tiết
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onEditProduct(product)} className="cursor-pointer">
                <Edit className="mr-2 h-4 w-4" /> Sửa
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onDeleteProduct(product.id)}
                className="cursor-pointer text-destructive focus:text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" /> Xóa
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </TableCell>
      </TableRow>

      {expanded ? (
        <TableRow className="bg-white">
          <TableCell colSpan={10} className="p-6">
            <ProductVariantsDisplay variants={product.variants} images={product.images} onEdit={onEditVariant} onDelete={onDeleteVariant} />
          </TableCell>
        </TableRow>
      ) : null}
    </>
  )
}

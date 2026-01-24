"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Trash2, Edit } from "lucide-react"
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
import { useState } from "react"
import { ImageZoom } from "./image-zoom"

interface ProductVariant {
  id: number
  sku: string
  color: string
  size: string
  stock: number
  price: number
  variantAvatar?: string // added variantAvatar to interface
}

interface ProductImage {
  id: string | number
  url: string
  color: string | null
  isAvatar: boolean
}

interface ProductVariantsDisplayProps {
  variants: ProductVariant[]
  images?: ProductImage[]
  onEdit?: (variant: ProductVariant) => void
  onDelete?: (variant: ProductVariant) => void
}

export function ProductVariantsDisplay({ variants, images = [], onEdit, onDelete }: ProductVariantsDisplayProps) {
  const [deleteConfirm, setDeleteConfirm] = useState<ProductVariant | null>(null)
  const [zoomImage, setZoomImage] = useState<string | null>(null)

  const groupedByColor = variants.reduce(
    (acc, variant) => {
      const color = variant.color
      if (!acc[color]) {
        acc[color] = []
      }
      acc[color].push(variant)
      return acc
    },
    {} as Record<string, ProductVariant[]>,
  )

  return (
    <div className="space-y-4">
      {Object.entries(groupedByColor).map(([color, colorVariants]) => (
        <div key={color} className="border rounded-lg overflow-hidden bg-white">
          <div className="flex items-center gap-3 p-3 bg-muted/30 border-b">
            <div
              className="w-8 h-8 rounded border overflow-hidden bg-background cursor-zoom-in hover:ring-2 hover:ring-primary transition-all"
              onClick={() => {
                const avatar = images.find((img) => img.color === color && img.isAvatar)?.url
                if (avatar) setZoomImage(avatar)
              }}
            >
              {images.find((img) => img.color === color && img.isAvatar) ? (
                <img
                  src={images.find((img) => img.color === color && img.isAvatar)?.url}
                  alt={color}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-muted" />
              )}
            </div>
            <h3 className="font-semibold text-base">{color}</h3>
            <span className="text-xs text-muted-foreground ml-auto">{colorVariants.length} kích cỡ</span>
          </div>

          <div className="p-3">
            <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
              {images
                .filter((img) => img.color === color)
                .map((img) => (
                  <div
                    key={img.id}
                    className={`relative w-16 h-16 rounded border shrink-0 cursor-zoom-in hover:opacity-80 transition-all ${img.isAvatar ? "ring-2 ring-primary border-primary" : ""}`}
                    onClick={() => setZoomImage(img.url)}
                  >
                    <img src={img.url || "/placeholder.svg"} className="w-full h-full object-cover rounded" alt="" />
                    {img.isAvatar && (
                      <div className="absolute top-0 right-0 bg-primary text-[8px] text-white px-1 rounded-bl">
                        Chính
                      </div>
                    )}
                  </div>
                ))}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
              {colorVariants.map((variant) => (
                <div key={variant.id} className="border rounded-md p-3 hover:bg-muted/30 transition-colors space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <div
                      className="w-10 h-10 rounded border overflow-hidden bg-muted cursor-zoom-in shrink-0"
                      onClick={() => variant.variantAvatar && setZoomImage(variant.variantAvatar)}
                    >
                      {variant.variantAvatar ? (
                        <img
                          src={variant.variantAvatar || "/placeholder.svg"}
                          className="w-full h-full object-cover"
                          alt=""
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[10px] text-muted-foreground">
                          N/A
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-muted-foreground">Size</p>
                      <p className="text-sm font-bold">{variant.size}</p>
                    </div>
                    <Badge variant={variant.stock > 0 ? "default" : "secondary"} className="text-xs whitespace-nowrap">
                      {variant.stock > 0 ? variant.stock : "Hết"}
                    </Badge>
                  </div>

                  <div className="space-y-1 border-t pt-2">
                    <p className="text-xs text-muted-foreground">SKU</p>
                    <code className="text-xs font-mono bg-muted px-1.5 py-0.5 rounded block w-fit">{variant.sku}</code>
                  </div>

                  <p className="text-sm font-semibold text-primary">{variant.price.toLocaleString()} đ</p>

                  <div className="flex gap-1 pt-2 border-t">
                    {onEdit && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => onEdit(variant)}
                        title="Sửa"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    )}
                    {onDelete && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={() => setDeleteConfirm(variant)}
                        title="Xóa"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}

      <ImageZoom src={zoomImage || "/placeholder.svg"} isOpen={!!zoomImage} onClose={() => setZoomImage(null)} />

      <AlertDialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa biến thể</AlertDialogTitle>
            <AlertDialogDescription>
              Xóa {deleteConfirm?.color} - Size {deleteConfirm?.size} ({deleteConfirm?.sku})
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (deleteConfirm && onDelete) {
                  onDelete(deleteConfirm)
                  setDeleteConfirm(null)
                }
              }}
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

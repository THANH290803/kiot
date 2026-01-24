"use client"

import type React from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { X, Upload, Plus, Star, ImageIcon } from "lucide-react"
import { useState, useEffect } from "react"
import { ImageZoom } from "@/components/image-zoom"
import { RichTextEditor } from "@/components/rich-text-editor"
import { ScrollArea } from "@/components/ui/scroll-area"

interface ProductImage {
  id: string | number
  name: string
  url: string
  color: string | null
  size?: string // New: link image to size if needed
  isAvatar: boolean
}

interface ProductVariant {
  id: number
  color: string
  size: string
  price: string | number
  stock: number
  variantAvatar?: string
  variantImages?: string[] // New: multiple images per variant
}

interface ProductFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  product?: any
  onSave: (productData: any) => void
}

export function ProductFormDialog({ open, onOpenChange, product, onSave }: ProductFormDialogProps) {
  const [formData, setFormData] = useState({
    name: "",
    category: "fashion",
    brand: "nike",
    status: "active",
    description: "",
  })

  const [selectedColor, setSelectedColor] = useState<string>("")
  const [selectedSize, setSelectedSize] = useState<string>("")
  const [variants, setVariants] = useState<any[]>([])
  const [zoomImage, setZoomImage] = useState<string | null>(null)

  const isEditing = !!product
  const isEditingVariant = product?.editingVariantId !== undefined
  const isEditingMainProduct = isEditing && !isEditingVariant

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || "",
        category: product.category || "fashion",
        brand: product.brand || "nike",
        status: product.status || "active",
        description: product.description || "",
      })
      setVariants(product.variants || [])
    } else {
      setFormData({
        name: "",
        category: "fashion",
        brand: "nike",
        status: "active",
        description: "",
      })
      setVariants([])
    }
  }, [product, open])

  const handleAddVariant = () => {
    if (selectedColor && selectedSize) {
      const exists = variants.find((v) => v.color === selectedColor && v.size === selectedSize)
      if (exists) return

      // Find existing images for this color to sync
      const existingColorVariant = variants.find((v) => v.color === selectedColor)

      const newVariant = {
        id: Math.random(),
        color: selectedColor,
        size: selectedSize,
        stock: 0,
        price: Number(formData.basePrice) || 0,
        variantImages: existingColorVariant?.variantImages || [],
        variantAvatar: existingColorVariant?.variantAvatar || null,
      }
      setVariants([...variants, newVariant])
    }
  }

  const handleRemoveVariant = (id: number) => {
    setVariants(variants.filter((v) => v.id !== id))
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, variantId?: number) => {
    if (e.target.files) {
      const newImages = Array.from(e.target.files).map((file) => URL.createObjectURL(file))

      if (variantId) {
        // Edit flow for a specific variant
        setVariants(
          variants.map((v) =>
            v.id === variantId
              ? {
                  ...v,
                  variantImages: [...(v.variantImages || []), ...newImages],
                  // If no avatar exists, set the first new image as avatar
                  variantAvatar: v.variantAvatar || newImages[0],
                }
              : v,
          ),
        )
      } else if (selectedColor) {
        // Add flow - group images by color
        const firstUpload = !variants.find((v) => v.color === selectedColor)?.variantImages?.length
        setVariants(
          variants.map((v) =>
            v.color === selectedColor
              ? {
                  ...v,
                  variantImages: [...(v.variantImages || []), ...newImages],
                  variantAvatar: firstUpload ? newImages[0] : v.variantAvatar,
                }
              : v,
          ),
        )
      }
    }
  }

  const updateVariantAvatar = (variantId: number, imageUrl: string) => {
    setVariants(
      variants.map((v) =>
        v.id === variantId
          ? { ...v, variantAvatar: imageUrl }
          : v.color === variants.find((ev) => ev.id === variantId)?.color
            ? { ...v, variantAvatar: imageUrl } // Sync avatar for all sizes of same color in Add flow
            : v,
      ),
    )
  }

  const handleRemoveImage = (id: string | number) => {
    const imageToRemove = variants.find((v) => v.id === id)
    const filteredVariants = variants.filter((v) => v.id !== id)

    if (imageToRemove?.variantAvatar) {
      const nextVariantImage = filteredVariants.find((v) => v.color === imageToRemove.color)
      if (nextVariantImage) {
        nextVariantImage.variantAvatar = nextVariantImage.variantImages?.[0] || null
      }
    }
    setVariants(filteredVariants)
  }

  const handleSave = () => {
    onSave({ ...formData, variants })
    onOpenChange(false)
  }

  const COLORS = [
    { name: "Trắng", value: "white", hex: "#FFFFFF" },
    { name: "Đen", value: "black", hex: "#000000" },
    { name: "Đỏ", value: "red", hex: "#EF4444" },
    { name: "Xanh", value: "blue", hex: "#3B82F6" },
    { name: "Nâu", value: "brown", hex: "#92400E" },
    { name: "Xám", value: "gray", hex: "#6B7280" },
    { name: "Hồng", value: "pink", hex: "#EC4899" },
    { name: "Xanh lá", value: "green", hex: "#10B981" },
  ]

  const SIZES = [
    { name: "XS", value: "xs" },
    { name: "S", value: "s" },
    { name: "M", value: "m" },
    { name: "L", value: "l" },
    { name: "XL", value: "xl" },
    { name: "XXL", value: "xxl" },
    { name: "32", value: "32" },
    { name: "34", value: "34" },
    { name: "36", value: "36" },
    { name: "38", value: "38" },
    { name: "40", value: "40" },
    { name: "42", value: "42" },
  ]

  const STATUSES = [
    { name: "Đang kinh doanh", value: "active" },
    { name: "Ngừng kinh doanh", value: "inactive" },
    { name: "Không còn hàng", value: "out_of_stock" },
  ]

  const editingVariant = isEditingVariant ? variants.find((v) => v.id === product?.editingVariantId) : null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col p-0">
        <DialogHeader className="p-6 border-b">
          <DialogTitle>
            {isEditingVariant ? "Sửa biến thể" : isEditing ? "Sửa hàng hóa" : "Thêm hàng hóa mới"}
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="flex-1 p-6">
          <div className="grid gap-6">
            {(!isEditing || isEditingMainProduct) && (
              <div className="space-y-4">
                <h3 className="font-semibold text-sm">Thông tin cơ bản</h3>
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Tên hàng hóa</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Nhập tên hàng hóa"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="category">Danh mục</Label>
                      <Select
                        value={formData.category}
                        onValueChange={(v) => setFormData({ ...formData, category: v })}
                      >
                        <SelectTrigger id="category">
                          <SelectValue placeholder="Chọn danh mục" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="fashion">Thời trang</SelectItem>
                          <SelectItem value="shoes">Giày dép</SelectItem>
                          <SelectItem value="accessory">Phụ kiện</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="brand">Thương hiệu</Label>
                      <Select value={formData.brand} onValueChange={(v) => setFormData({ ...formData, brand: v })}>
                        <SelectTrigger id="brand">
                          <SelectValue placeholder="Chọn thương hiệu" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="nike">Nike</SelectItem>
                          <SelectItem value="adidas">Adidas</SelectItem>
                          <SelectItem value="levis">Levi's</SelectItem>
                          <SelectItem value="gucci">Gucci</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {!isEditingVariant && product && (
                      <div className="col-span-2 py-2 px-3 bg-muted/50 rounded text-xs text-muted-foreground italic">
                        Giá và hình ảnh được quản lý theo từng biến thể (màu sắc/kích cỡ).
                      </div>
                    )}

                    {(!product || isEditingVariant) && (
                      <div className="space-y-2">
                        <Label htmlFor="price">Giá bán</Label>
                        <Input
                          id="price"
                          type="number"
                          value={formData.basePrice || ""}
                          onChange={(e) => setFormData({ ...formData, basePrice: e.target.value })}
                          placeholder="0"
                        />
                      </div>
                    )}

                    <div className="space-y-2">
                      <Label htmlFor="status">Trạng thái</Label>
                      <Select value={formData.status} onValueChange={(v) => setFormData({ ...formData, status: v })}>
                        <SelectTrigger id="status">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {STATUSES.map((status) => (
                            <SelectItem key={status.value} value={status.value}>
                              {status.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Mô tả sản phẩm</Label>
                    <RichTextEditor
                      value={formData.description}
                      onChange={(v) => setFormData({ ...formData, description: v })}
                      placeholder="Nhập mô tả sản phẩm (định dạng như Word)..."
                    />
                  </div>
                </div>
              </div>
            )}

            {isEditingVariant && editingVariant && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Phân loại</Label>
                    <div className="p-2 border rounded bg-muted/50 font-medium">
                      {editingVariant.color} - Size {editingVariant.size}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Giá bán biến thể</Label>
                    <Input
                      type="number"
                      value={editingVariant.price}
                      onChange={(e) => {
                        setVariants(
                          variants.map((v) =>
                            v.id === editingVariant.id ? { ...v, price: Number(e.target.value) } : v,
                          ),
                        )
                      }}
                    />
                  </div>
                </div>

                <div className="space-y-4 border-t pt-4">
                  <h3 className="font-semibold text-sm flex items-center gap-2">
                    <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                    Ảnh đại diện (Duy nhất 1 ảnh)
                  </h3>
                  <div className="flex items-center gap-4">
                    <div className="relative w-32 h-32 rounded-lg border overflow-hidden bg-muted flex items-center justify-center">
                      {editingVariant.variantAvatar ? (
                        <img
                          src={editingVariant.variantAvatar || "/placeholder.svg"}
                          className="w-full h-full object-cover cursor-zoom-in"
                          onClick={() => setZoomImage(editingVariant.variantAvatar)}
                        />
                      ) : (
                        <span className="text-xs text-muted-foreground text-center px-2">Chưa có ảnh đại diện</span>
                      )}
                    </div>
                    <div className="flex-1 space-y-2">
                      <Label className="text-xs text-muted-foreground uppercase font-bold">Tải ảnh đại diện</Label>
                      <label className="flex items-center justify-center w-full h-12 border-2 border-dashed rounded-md cursor-pointer hover:bg-muted/50 transition-colors">
                        <Upload className="h-4 w-4 mr-2" />
                        <span className="text-sm">Chọn ảnh đại diện mới</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            if (e.target.files?.[0]) {
                              const url = URL.createObjectURL(e.target.files[0])
                              updateVariantAvatar(editingVariant.id, url)
                            }
                          }}
                        />
                      </label>
                      <p className="text-[10px] text-muted-foreground italic">
                        * Ảnh này sẽ làm đại diện chính cho biến thể này.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 border-t pt-4">
                  <h3 className="font-semibold text-sm flex items-center gap-2">
                    <ImageIcon className="h-4 w-4 text-primary" />
                    Hình ảnh chi tiết (Tải lên nhiều ảnh)
                  </h3>
                  <div className="grid gap-3">
                    <label className="flex flex-col items-center gap-2 p-6 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
                      <Upload className="h-6 w-6 text-muted-foreground" />
                      <p className="text-sm font-medium">Nhấp để tải nhiều ảnh chi tiết</p>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleImageUpload(e, editingVariant.id)}
                      />
                    </label>

                    {editingVariant.variantImages && editingVariant.variantImages.length > 0 && (
                      <div className="grid grid-cols-5 gap-2">
                        {editingVariant.variantImages.map((img, idx) => (
                          <div
                            key={idx}
                            className={`relative aspect-square rounded border overflow-hidden group ${img === editingVariant.variantAvatar ? "ring-2 ring-amber-500" : ""}`}
                          >
                            <img src={img || "/placeholder.svg"} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                              <button
                                className="bg-amber-500 text-white p-1 rounded"
                                onClick={() => updateVariantAvatar(editingVariant.id, img)}
                                title="Đặt làm đại diện"
                              >
                                <Star className="h-3 w-3 fill-current" />
                              </button>
                              <button
                                className="bg-destructive text-white p-1 rounded"
                                onClick={() => {
                                  setVariants(
                                    variants.map((v) =>
                                      v.id === editingVariant.id
                                        ? {
                                            ...v,
                                            variantImages: v.variantImages?.filter((_, i) => i !== idx),
                                            variantAvatar:
                                              v.variantAvatar === img
                                                ? v.variantImages?.[idx === 0 ? 1 : 0]
                                                : v.variantAvatar,
                                          }
                                        : v,
                                    ),
                                  )
                                }}
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {!isEditing && (
              <div className="space-y-6 border-t pt-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-sm">Thiết lập biến thể & Hình ảnh</h3>
                </div>

                <div className="grid gap-4 bg-muted/20 p-4 rounded-lg">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Màu sắc</Label>
                      <Select value={selectedColor} onValueChange={setSelectedColor}>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn màu sắc" />
                        </SelectTrigger>
                        <SelectContent>
                          {COLORS.map((c) => (
                            <SelectItem key={c.value} value={c.value}>
                              {c.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Kích thước</Label>
                      <Select value={selectedSize} onValueChange={setSelectedSize}>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn kích thước" />
                        </SelectTrigger>
                        <SelectContent>
                          {SIZES.map((s) => (
                            <SelectItem key={s.value} value={s.value}>
                              {s.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full bg-transparent"
                    onClick={handleAddVariant}
                    disabled={!selectedColor || !selectedSize}
                  >
                    <Plus className="h-4 w-4 mr-2" /> Thêm biến thể này
                  </Button>
                </div>

                {selectedColor && (
                  <div className="space-y-4 p-4 border rounded-lg bg-white shadow-sm">
                    <h4 className="text-sm font-medium flex items-center gap-2">
                      <ImageIcon className="h-4 w-4 text-primary" />
                      Hình ảnh cho màu:{" "}
                      <span className="font-bold text-primary">
                        {COLORS.find((c) => c.value === selectedColor)?.name}
                      </span>
                    </h4>

                    <label className="flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
                      <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                      <span className="text-sm font-medium text-center">
                        Tải nhiều ảnh cho màu {COLORS.find((c) => c.value === selectedColor)?.name}
                      </span>
                      <p className="text-xs text-muted-foreground mt-1">Ảnh đầu tiên sẽ được chọn làm Avatar</p>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleImageUpload(e)}
                      />
                    </label>

                    {variants.find((v) => v.color === selectedColor)?.variantImages?.length ? (
                      <div className="grid grid-cols-6 gap-2">
                        {variants
                          .find((v) => v.color === selectedColor)
                          ?.variantImages?.map((img, idx) => (
                            <div
                              key={idx}
                              className={`relative aspect-square rounded border overflow-hidden ${img === variants.find((v) => v.color === selectedColor)?.variantAvatar ? "ring-2 ring-amber-500" : ""}`}
                            >
                              <img src={img || "/placeholder.svg"} className="w-full h-full object-cover" />
                              {img === variants.find((v) => v.color === selectedColor)?.variantAvatar && (
                                <div className="absolute top-0 right-0 bg-amber-500 text-[8px] text-white px-1 font-bold">
                                  AVATAR
                                </div>
                              )}
                            </div>
                          ))}
                      </div>
                    ) : null}
                  </div>
                )}

                {/* Danh sách biến thể */}
                {variants.length > 0 && (
                  <div className="space-y-3">
                    <Label className="text-xs font-bold uppercase text-muted-foreground">
                      Danh sách biến thể đã tạo ({variants.length})
                    </Label>
                    <div className="grid gap-2">
                      {variants.map((variant) => (
                        <div key={variant.id} className="flex items-center gap-3 p-2 border rounded-md bg-white">
                          <div className="w-10 h-10 rounded border overflow-hidden bg-muted">
                            {variant.variantAvatar ? (
                              <img
                                src={variant.variantAvatar || "/placeholder.svg"}
                                className="w-full h-full object-cover"
                              />
                            ) : null}
                          </div>
                          <div className="flex-1 text-sm">
                            <span className="font-bold">{variant.color}</span> - Size{" "}
                            <span className="font-bold">{variant.size}</span>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive"
                            onClick={() => handleRemoveVariant(variant.id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </ScrollArea>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Hủy
          </Button>
          <Button onClick={handleSave} className="bg-primary hover:bg-primary/90">
            Lưu
          </Button>
        </DialogFooter>
      </DialogContent>

      <ImageZoom src={zoomImage || "/placeholder.svg"} isOpen={!!zoomImage} onClose={() => setZoomImage(null)} />
    </Dialog>
  )
}

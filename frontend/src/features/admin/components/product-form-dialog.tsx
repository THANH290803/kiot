"use client"

import { ImageIcon, Loader2, Plus, Star, Upload, X } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useProductFormDialog } from "@/features/admin/hooks/use-product-form-dialog"
import type { ProductFormDialogProps } from "@/features/admin/types/product-form-dialog"
import { ImageZoom } from "./image-zoom"
import { RichTextEditor } from "./rich-text-editor"

export function ProductFormDialog({
  open,
  onOpenChange,
  product,
  categories,
  brands,
  onSave,
}: ProductFormDialogProps) {
  const {
    colors,
    sizes,
    isSubmitting,
    submitError,
    createForm,
    setCreateForm,
    avatarPreview,
    draftVariant,
    setDraftVariant,
    editForm,
    setEditForm,
    setEditableVariants,
    zoomImage,
    setZoomImage,
    isEditing,
    isEditingVariant,
    isSelectingVariantForImages,
    isEditingMainProduct,
    createVariantSummary,
    editingVariant,
    handleClose,
    handleAvatarChange,
    clearAvatar,
    handleAddCreateVariant,
    handleCreateVariantImagesChange,
    handleRemoveCreateVariant,
    handleRemoveCreateVariantImage,
    handleEditVariantImagesChange,
    removeVariantImage,
    handleSaveEditProduct,
    handleSaveEditVariant,
    handleCreate,
    updateEditableVariant,
  } = useProductFormDialog({
    open,
    product,
    categories,
    brands,
    onOpenChange,
    onSave,
  })

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="!max-w-4xl max-h-[90vh] flex flex-col gap-0 p-0">
        <DialogHeader className="px-6 py-4 border-b flex-shrink-0">
          <DialogTitle className="text-lg">
            {isSelectingVariantForImages ? "Quản lý hình ảnh biến thể" : isEditingVariant ? "Sửa biến thể" : isEditing ? "Sửa hàng hóa" : "Thêm hàng hóa mới"}
          </DialogTitle>
          <DialogDescription className="sr-only">
            {isSelectingVariantForImages ? "Form để quản lý hình ảnh cho biến thể sản phẩm" : isEditingVariant ? "Form để sửa thông tin biến thể sản phẩm" : isEditing ? "Form để sửa thông tin hàng hóa" : "Form để thêm hàng hóa mới vào hệ thống"}
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 min-h-0 overflow-y-auto">
          <div className="grid gap-6 px-6 py-4">
            {(!isEditing || isEditingMainProduct) ? (
              <div className="space-y-5">
                <div className="p-1">
                  <div className="mb-4">
                    <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Thông tin cơ bản</h3>
                    <p className="mt-1 text-sm text-muted-foreground">Cập nhật thông tin hiển thị chính của hàng hóa.</p>
                  </div>
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Tên hàng hóa</Label>
                    <Input
                      id="name"
                      value={isEditing ? editForm.name : createForm.name}
                      onChange={(event) =>
                        isEditing
                          ? setEditForm((current) => ({ ...current, name: event.target.value }))
                          : setCreateForm((current) => ({ ...current, name: event.target.value }))
                      }
                      placeholder="Nhập tên hàng hóa"
                    />
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="avatar" className="text-sm font-medium">Hình ảnh Avatar</Label>
                    <div className="grid gap-4 lg:grid-cols-[1fr_140px]">
                      <div className="flex-1">
                        <label className="flex min-h-36 flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-white p-8 cursor-pointer hover:bg-slate-50/50 hover:border-primary transition-all">
                          <Upload className="h-8 w-8 text-slate-400 mb-2" />
                          <span className="text-sm font-medium text-slate-700">Chọn ảnh Avatar</span>
                          <p className="text-xs text-slate-500 mt-1">JPG, PNG hoặc WEBP. Tối đa 5MB.</p>
                          <Input
                            id="avatar"
                            type="file"
                            accept="image/*"
                            onChange={(event) => void handleAvatarChange(event.target.files?.[0] || null)}
                            className="hidden"
                          />
                        </label>
                      </div>
                      {(isEditing ? editForm.avatar : avatarPreview) ? (
                        <div className="flex flex-col items-center gap-3 rounded-2xl border bg-white p-3">
                          <div className="h-28 w-28 rounded-xl border-2 border-primary overflow-hidden bg-slate-50 shadow-lg ring-1 ring-primary/20">
                            <img src={isEditing ? editForm.avatar : avatarPreview} alt="Avatar preview" className="w-full h-full object-cover" />
                          </div>
                          <button
                            type="button"
                            onClick={clearAvatar}
                            className="text-xs text-red-500 hover:text-red-600 font-medium hover:underline transition-colors"
                          >
                            Xóa ảnh
                          </button>
                        </div>
                      ) : (
                        <div className="flex min-h-36 items-center justify-center rounded-2xl border border-dashed bg-slate-50 text-xs text-muted-foreground">
                          Chưa có ảnh
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="space-y-2">
                      <Label htmlFor="category">Danh mục</Label>
                      <Select
                        value={isEditing ? editForm.category : createForm.categoryId}
                        onValueChange={(value) =>
                          isEditing
                            ? setEditForm((current) => ({ ...current, category: value }))
                            : setCreateForm((current) => ({ ...current, categoryId: value }))
                        }
                      >
                        <SelectTrigger id="category" className="w-full">
                          <SelectValue placeholder="Chọn danh mục" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category.id} value={isEditing ? category.name : String(category.id)}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="brand">Thương hiệu</Label>
                      <Select
                        value={isEditing ? editForm.brand : createForm.brandId}
                        onValueChange={(value) =>
                          isEditing
                            ? setEditForm((current) => ({ ...current, brand: value }))
                            : setCreateForm((current) => ({ ...current, brandId: value }))
                        }
                      >
                        <SelectTrigger id="brand" className="w-full">
                          <SelectValue placeholder="Chọn thương hiệu" />
                        </SelectTrigger>
                        <SelectContent>
                          {brands.map((brand) => (
                            <SelectItem key={brand.id} value={isEditing ? brand.name : String(brand.id)}>
                              {brand.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="status">Trạng thái</Label>
                      <Select value={isEditing ? editForm.status : "active"} onValueChange={(value) => setEditForm((current) => ({ ...current, status: value as "active" | "inactive" | "out_of_stock" }))}>
                        <SelectTrigger id="status" className="w-full">
                          <SelectValue placeholder="Chọn trạng thái" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">Đang kinh doanh</SelectItem>
                          <SelectItem value="inactive">Ngừng kinh doanh</SelectItem>
                          <SelectItem value="out_of_stock">Không còn hàng</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {isEditing && (
                    <div className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-700">
                      Giá và hình ảnh biến thể được chỉnh trong popup sửa biến thể.
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="description">Mô tả sản phẩm</Label>
                    <RichTextEditor
                      value={isEditing ? editForm.description : createForm.description}
                      onChange={(value) =>
                        isEditing
                          ? setEditForm((current) => ({ ...current, description: value }))
                          : setCreateForm((current) => ({ ...current, description: value }))
                      }
                      placeholder="Nhập mô tả sản phẩm"
                    />
                  </div>
                </div>
                </div>
              </div>
            ) : null}

            {(isEditingVariant || isSelectingVariantForImages) && editingVariant ? (
              <div className="space-y-5">
                <div className="rounded-2xl border bg-gradient-to-br from-white to-slate-50 p-5 shadow-sm">
                  <div className="mb-4 flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
                        {isSelectingVariantForImages ? "Hình ảnh biến thể" : "Thông tin biến thể"}
                      </h3>
                      <p className="mt-1 text-sm text-muted-foreground">Điều chỉnh giá, tồn kho và thư viện ảnh cho biến thể đã chọn.</p>
                    </div>
                    <div className="rounded-full border bg-white px-4 py-2 text-sm font-medium shadow-sm">
                      {editingVariant.color} - Size {editingVariant.size}
                    </div>
                  </div>

                  {isEditingVariant ? (
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label>Giá bán biến thể</Label>
                        <Input
                          type="number"
                          value={editingVariant.price}
                          onChange={(event) => {
                            const nextPrice = Number(event.target.value)
                            setEditableVariants((currentVariants) =>
                              updateEditableVariant(currentVariants, editingVariant.id, (variant) => ({
                                ...variant,
                                price: nextPrice,
                              })),
                            )
                          }}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Số lượng</Label>
                        <Input
                          type="number"
                          value={editingVariant.stock}
                          onChange={(event) => {
                            const nextStock = Number(event.target.value)
                            setEditableVariants((currentVariants) =>
                              updateEditableVariant(currentVariants, editingVariant.id, (variant) => ({
                                ...variant,
                                stock: nextStock,
                              })),
                            )
                          }}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Màu sắc</Label>
                        <Select
                            value={editingVariant.color}
                            onValueChange={(value) => {
                              setEditableVariants((currentVariants) =>
                                  updateEditableVariant(currentVariants, editingVariant.id, (variant) => ({
                                    ...variant,
                                    color: value,
                                  })),
                              )
                            }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn màu sắc" />
                          </SelectTrigger>
                          <SelectContent>
                            {colors.map((color) => (
                                <SelectItem key={color.id} value={color.name}>
                                  {color.name}
                                </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Kích thước</Label>
                        <Select
                            value={editingVariant.size}
                            onValueChange={(value) => {
                              setEditableVariants((currentVariants) =>
                                  updateEditableVariant(currentVariants, editingVariant.id, (variant) => ({
                                    ...variant,
                                    size: value,
                                  })),
                              )
                            }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn kích thước" />
                          </SelectTrigger>
                          <SelectContent>
                            {sizes.map((size) => (
                                <SelectItem key={size.id} value={size.name}>
                                  {size.name}
                                </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  ) : null}
                </div>

                <div className="rounded-2xl border bg-white p-5 shadow-sm">
                  <h3 className="font-semibold text-sm flex items-center gap-2 mb-4">
                    <ImageIcon className="h-4 w-4 text-primary" />
                    Hình ảnh chi tiết
                  </h3>
                  <div className="grid gap-3">
                    <label className="flex flex-col items-center gap-2 rounded-2xl border-2 border-dashed p-6 cursor-pointer hover:bg-muted/50 transition-colors">
                      <Upload className="h-6 w-6 text-muted-foreground" />
                      <p className="text-sm font-medium">Chọn nhiều ảnh chi tiết</p>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        className="hidden"
                        onChange={(event) => handleEditVariantImagesChange(editingVariant.id, event.target.files)}
                      />
                    </label>

                    {editingVariant.variantImages && editingVariant.variantImages.length > 0 ? (
                      <div className="grid grid-cols-5 gap-2">
                        {editingVariant.variantImages.map((image, index) => (
                          <div
                            key={`${editingVariant.id}-${index}`}
                            className={`relative aspect-square rounded-xl border overflow-hidden group ${image === editingVariant.variantAvatar ? "ring-2 ring-amber-500 border-amber-400" : ""}`}
                          >
                            <img src={image} alt={`Ảnh chi tiết ${editingVariant.color} ${editingVariant.size} ${index + 1}`} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                              <button
                                className="bg-amber-500 text-white p-1 rounded"
                                onClick={() => {
                                  setEditableVariants((currentVariants) =>
                                    updateEditableVariant(currentVariants, editingVariant.id, (variant) => ({
                                      ...variant,
                                      variantAvatar: image,
                                    })),
                                  )
                                }}
                                title="Đặt làm đại diện"
                              >
                                <Star className="h-3 w-3 fill-current" />
                              </button>
                              <button className="bg-destructive text-white p-1 rounded" onClick={() => removeVariantImage(editingVariant.id, index)}>
                                <X className="h-3 w-3" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="rounded-2xl border border-dashed px-4 py-8 text-center text-sm text-muted-foreground bg-slate-50">
                        Chưa có ảnh chi tiết cho biến thể này.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : null}

            {!isEditing ? (
              <div className="space-y-6 border-t pt-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-sm">Thiết lập biến thể & Hình ảnh</h3>
                </div>

                <div className="grid gap-4 bg-muted/20 p-4 rounded-lg">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Màu sắc</Label>
                      <Select value={draftVariant.colorId} onValueChange={(value) => setDraftVariant((current) => ({ ...current, colorId: value }))}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Chọn màu sắc" />
                        </SelectTrigger>
                        <SelectContent>
                          {colors.map((color) => (
                            <SelectItem key={color.id} value={String(color.id)}>
                              {color.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Kích thước</Label>
                      <Select value={draftVariant.sizeId} onValueChange={(value) => setDraftVariant((current) => ({ ...current, sizeId: value }))}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Chọn kích thước" />
                        </SelectTrigger>
                        <SelectContent>
                          {sizes.map((size) => (
                            <SelectItem key={size.id} value={String(size.id)}>
                              {size.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="variant-price">Giá bán</Label>
                      <Input
                        id="variant-price"
                        type="number"
                        value={draftVariant.price}
                        onChange={(event) => setDraftVariant((current) => ({ ...current, price: event.target.value }))}
                        placeholder="Nhập giá bán"
                        min="0"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="variant-stock">Số lượng</Label>
                      <Input
                        id="variant-stock"
                        type="number"
                        value={draftVariant.quantity}
                        onChange={(event) => setDraftVariant((current) => ({ ...current, quantity: event.target.value }))}
                        placeholder="Nhập số lượng"
                        min="0"
                      />
                    </div>
                  </div>
                  <Button type="button" variant="outline" className="w-full bg-transparent" onClick={handleAddCreateVariant} disabled={!draftVariant.colorId || !draftVariant.sizeId || !draftVariant.price || !draftVariant.quantity}>
                    <Plus className="h-4 w-4 mr-2" /> Thêm biến thể này
                  </Button>
                </div>

                {createVariantSummary.length > 0 ? (
                  <div className="space-y-3">
                    <Label className="text-xs font-bold uppercase text-muted-foreground">
                      Danh sách biến thể đã tạo ({createVariantSummary.length})
                    </Label>
                    <div className="grid gap-2">
                      {createVariantSummary.map((variant) => (
                        <div key={variant.localId} className="border rounded-md p-3 bg-white">
                          <div className="flex items-center gap-3">
                            <div className="flex-1 min-w-0">
                              <div className="text-sm">
                                <span className="font-semibold">{variant.colorName}</span> - Size <span className="font-semibold">{variant.sizeName}</span>
                              </div>
                              <div className="text-xs text-slate-500 mt-1 space-y-0.5">
                                <div>Giá: <span className="font-semibold text-slate-700">{Number(variant.price).toLocaleString("vi-VN")}₫</span></div>
                                <div>Số lượng: <span className="font-semibold text-slate-700">{variant.quantity}</span></div>
                                <div>{variant.previewUrls.length} ảnh đã chọn</div>
                              </div>
                            </div>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive flex-shrink-0" onClick={() => handleRemoveCreateVariant(variant.localId)}>
                              <X className="h-4 w-4" />
                            </Button>
                          </div>

                          <div className="mt-3 space-y-3">
                            <label className="flex flex-col items-center gap-2 p-4 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
                              <Upload className="h-6 w-6 text-muted-foreground" />
                              <p className="text-sm font-medium">Chọn ảnh cho biến thể này</p>
                              <input type="file" multiple accept="image/*" className="hidden" onChange={(event) => handleCreateVariantImagesChange(variant.localId, event.target.files)} />
                            </label>

                            {variant.previewUrls.length > 0 ? (
                              <div className="grid grid-cols-5 gap-2">
                                {variant.previewUrls.map((image, index) => (
                                  <div key={`${variant.localId}-${index}`} className="relative aspect-square rounded border overflow-hidden">
                                    <img src={image} alt={`Ảnh biến thể ${variant.colorName} ${variant.sizeName} ${index + 1}`} className="w-full h-full object-cover" />
                                    <button className="absolute top-2 right-2 bg-destructive text-white p-1 rounded" onClick={() => handleRemoveCreateVariantImage(variant.localId, index)}>
                                      <X className="h-3 w-3" />
                                    </button>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className="rounded-lg border border-dashed px-4 py-6 text-center text-sm text-muted-foreground">
                                Chưa có ảnh cho biến thể này.
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>
            ) : null}

            {submitError ? <div className="rounded-lg border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">{submitError}</div> : null}
          </div>
        </div>

        <DialogFooter className="px-6 py-4 border-t flex-shrink-0">
          <Button variant="outline" onClick={handleClose} disabled={isSubmitting}>
            Hủy
          </Button>
          <Button
            onClick={isEditingVariant || isSelectingVariantForImages ? handleSaveEditVariant : isEditing ? handleSaveEditProduct : handleCreate}
            className="bg-primary hover:bg-primary/90"
            disabled={isSubmitting}
          >
            {isSubmitting ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
            Lưu
          </Button>
        </DialogFooter>

        <ImageZoom src={zoomImage || "/placeholder.svg"} isOpen={!!zoomImage} onClose={() => setZoomImage(null)} />
      </DialogContent>
    </Dialog>
  )
}

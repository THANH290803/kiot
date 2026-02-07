"use client"

import { Suspense, useState } from "react"
import { HeaderNav } from "@/components/header-nav"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Search, MoreVertical, Edit, Trash2, Palette, Ruler, ChevronLeft, ChevronRight } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useSizes, Size } from "@/hooks/useSizes"

import { useColors, Color } from "@/hooks/useColors"


function AttributesPageContent() {
  // =================== Size ===========================
  const {
    sizes,
    paginatedSizes,
    totalPages,
    page,
    setPage,
    rowsPerPage,
    setRowsPerPage,
    createSize,
    updateSize,
    deleteSize,
  } = useSizes()


  const [isAddSizeOpen, setIsAddSizeOpen] = useState(false)
  const [isEditSizeOpen, setIsEditSizeOpen] = useState(false)
  const [isDeleteSizeOpen, setIsDeleteSizeOpen] = useState(false)

  const [editingSize, setEditingSize] = useState<Size | null>(null)
  const [sizeName, setSizeName] = useState("")
  const [sizeDescription, setSizeDescription] = useState("")

  /* ===== handlers ===== */
  const openEditSize = (size: Size) => {
    setEditingSize(size)
    setSizeName(size.name)
    setSizeDescription(size.description || "")
    setIsEditSizeOpen(true)
  }

  const openDeleteSize = (size: Size) => {
    setEditingSize(size)
    setIsDeleteSizeOpen(true)
  }

  const handleCreateSize = async () => {
    await createSize({ name: sizeName, description: sizeDescription })
    setIsAddSizeOpen(false)
    setSizeName("")
    setSizeDescription("")
  }

  const handleUpdateSize = async () => {
    if (!editingSize) return
    await updateSize(editingSize.id, {
      name: sizeName,
      description: sizeDescription,
    })
    setIsEditSizeOpen(false)
  }

  const handleDeleteSize = async () => {
    if (!editingSize) return
    await deleteSize(editingSize.id)
    setIsDeleteSizeOpen(false)
  }


  // ============================== Color =====================================
  const {
    paginatedColors: colors,
    totalItems: colorTotalItems,
    totalPages: colorTotalPages,
    page: colorPage,
    setPage: setColorPage,
    rowsPerPage: colorRowsPerPage,
    setRowsPerPage: setColorRowsPerPage,
    createColor,
    updateColor,
    deleteColor,
  } = useColors()


  const [isAddColorOpen, setIsAddColorOpen] = useState(false)
  const [isEditColorOpen, setIsEditColorOpen] = useState(false)
  const [isDeleteColorOpen, setIsDeleteColorOpen] = useState(false)

  const [editingColor, setEditingColor] = useState<Color | null>(null)
  const [colorName, setColorName] = useState("")
  const [colorCode, setColorCode] = useState("#000000")

  const openEditColor = (color: Color) => {
    setEditingColor(color)
    setColorName(color.name)
    setColorCode(color.code)
    setIsEditColorOpen(true)
  }

  const openDeleteColor = (color: Color) => {
    setEditingColor(color)
    setIsDeleteColorOpen(true)
  }

  const handleCreateColor = async () => {
    await createColor({ name: colorName, code: colorCode })
    setIsAddColorOpen(false)
    setColorName("")
    setColorCode("#000000")
  }

  const handleUpdateColor = async () => {
    if (!editingColor) return
    await updateColor(editingColor.id, {
      name: colorName,
      code: colorCode,
    })
    setIsEditColorOpen(false)
  }

  const handleDeleteColor = async () => {
    if (!editingColor) return
    await deleteColor(editingColor.id)
    setIsDeleteColorOpen(false)
  }


  return (
    <div className="min-h-screen bg-background">
      <HeaderNav />
      <main className="container mx-auto p-6 space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Quản lý thuộc tính sản phẩm</h1>
            <p className="text-sm text-muted-foreground">Quản lý màu sắc, kích cỡ và các thuộc tính khác</p>
          </div>
        </div>

        <Tabs defaultValue="colors" className="w-full">
          <TabsList>
            <TabsTrigger value="colors">Màu sắc</TabsTrigger>
            <TabsTrigger value="sizes">Kích cỡ</TabsTrigger>
          </TabsList>

          <TabsContent value="colors" className="mt-6">
            <Card>
              <CardHeader>
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Palette className="h-5 w-5 text-primary" />
                    Danh sách màu sắc
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <div className="relative w-full md:w-64">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input placeholder="Tìm kiếm màu..." className="pl-8" />
                    </div>
                    <Dialog open={isAddColorOpen} onOpenChange={setIsAddColorOpen}>
                      <DialogTrigger asChild>
                        <Button className="bg-primary">
                          <Plus className="h-4 w-4" /> Thêm màu sắc {/* mr2 */}
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Thêm màu sắc mới</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <div className="space-y-2">
                            <Label htmlFor="color-name">Tên màu</Label>
                            <Input id="color-name" placeholder="Nhập tên màu..." value={colorName} onChange={(e) => setColorName(e.target.value)} />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="color-code">Mã màu (Hex)</Label>
                            <div className="flex gap-2">
                              <Input id="color-code" type="color" className="w-16 h-10" defaultValue="#000000" value={colorCode} onChange={(e) => setColorCode(e.target.value)} />
                              <Input placeholder="#000000" className="flex-1" value={colorCode}
                                onChange={(e) => setColorCode(e.target.value)} />
                            </div>
                          </div>
                        </div>
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setIsAddColorOpen(false)}>
                            Hủy
                          </Button>
                          <Button className="bg-primary" onClick={handleCreateColor}>
                            Lưu
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Màu sắc</TableHead>
                      <TableHead>Tên màu</TableHead>
                      <TableHead>Mã màu</TableHead>
                      <TableHead className="text-right">Thao tác</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {colors.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center text-muted-foreground py-6">
                          Không có màu sắc
                        </TableCell>
                      </TableRow>
                    ) : (
                      colors.map((color) => (
                        <TableRow key={color.id}>
                          <TableCell>
                            <div
                              className="w-10 h-10 rounded border-2 border-border"
                              style={{ backgroundColor: color.code }}
                            />
                          </TableCell>
                          <TableCell className="font-medium">{color.name}</TableCell>
                          <TableCell className="text-muted-foreground font-mono">{color.code}</TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => openEditColor(color)}>
                                  <Edit className="h-4 w-4 mr-2" />
                                  Sửa
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  className="text-red-600"
                                  onClick={() => openDeleteColor(color)}
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Xóa
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Hiển thị</span>
                    <Select value={colorRowsPerPage.toString()} onValueChange={(val) => {
                      setColorRowsPerPage(parseInt(val))
                      setColorPage(1)
                    }}>
                      <SelectTrigger className="w-20">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="10">10</SelectItem>
                        <SelectItem value="25">25</SelectItem>
                        <SelectItem value="50">50</SelectItem>
                        <SelectItem value="100">100</SelectItem>
                      </SelectContent>
                    </Select>
                    <span className="text-sm">bản ghi</span>
                    <span className="text-sm text-muted-foreground">Tổng số: {colorTotalItems}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setColorPage(Math.max(1, colorPage - 1))}
                      disabled={colorPage === 1}
                      className="gap-1"
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Previous
                    </Button>
                    <span className="text-sm font-medium">{colorPage}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setColorPage(Math.min(colorTotalPages, colorPage + 1))}
                      disabled={colorPage === colorTotalPages}
                      className="gap-1"
                    >
                      Next
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sizes" className="mt-6">
            <Card>
              <CardHeader>
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Ruler className="h-5 w-5 text-primary" />
                    Danh sách kích cỡ
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <div className="relative w-full md:w-64">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input placeholder="Tìm kiếm kích cỡ..." className="pl-8" />
                    </div>
                    <Dialog open={isAddSizeOpen} onOpenChange={setIsAddSizeOpen}>
                      <DialogTrigger asChild>
                        <Button className="bg-primary">
                          <Plus className="h-4 w-4" /> Thêm kích cỡ
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Thêm kích cỡ mới</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <div className="space-y-2">
                            <Label htmlFor="size-name">Tên kích cỡ</Label>
                            <Input id="size-name"
                              placeholder="VD: S, M, L, XL..."
                              value={sizeName}
                              onChange={(e) => setSizeName(e.target.value)}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="size-desc">Mô tả</Label>
                            <Input id="size-desc"
                              placeholder="VD: Small, Medium..."
                              value={sizeDescription}
                              onChange={(e) => setSizeDescription(e.target.value)}
                            />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button variant="outline" onClick={() => {
                            setIsAddSizeOpen(false)
                            setSizeName("")
                            setSizeDescription("")
                          }} >
                            Hủy
                          </Button>
                          <Button className="bg-primary"
                            onClick={handleCreateSize}
                            disabled={!sizeName.trim()}
                          >
                            Lưu
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tên kích cỡ</TableHead>
                      <TableHead>Mô tả</TableHead>
                      <TableHead className="text-right">Thao tác</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedSizes.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={3} className="text-center text-muted-foreground py-6">
                          Không có kích cỡ
                        </TableCell>
                      </TableRow>
                    ) : (
                      paginatedSizes.map((size) => (
                        <TableRow key={size.id}>
                          <TableCell className="font-bold text-lg">{size.name}</TableCell>
                          <TableCell className="text-muted-foreground">
                            {size.description || "--"}
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => openEditSize(size)}>
                                  <Edit className="h-4 w-4 mr-2" /> Sửa
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  className="text-destructive"
                                  onClick={() => openDeleteSize(size)}
                                >
                                  <Trash2 className="h-4 w-4 mr-2" /> Xóa
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Hiển thị</span>
                    <Select
                      value={rowsPerPage.toString()}
                      onValueChange={(val) => {
                        setRowsPerPage(parseInt(val))
                        setPage(1)
                      }}
                    >
                      <SelectTrigger className="w-20">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="10">10</SelectItem>
                        <SelectItem value="25">25</SelectItem>
                        <SelectItem value="50">50</SelectItem>
                        <SelectItem value="100">100</SelectItem>
                      </SelectContent>
                    </Select>
                    <span className="text-sm">bản ghi</span>
                    <span className="text-sm text-muted-foreground">Tổng số: {sizes.length}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage(Math.max(1, page - 1))}
                      disabled={page === 1}
                      className="gap-1"
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Previous
                    </Button>
                    <span className="text-sm font-medium">{page}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage(Math.min(totalPages, page + 1))}
                      disabled={page === totalPages}
                      className="gap-1"
                    >
                      Next
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Dialog open={isEditColorOpen} onOpenChange={setIsEditColorOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Sửa màu sắc</DialogTitle>
            </DialogHeader>
            {editingColor && (
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-color-name">Tên màu</Label>
                  <Input id="edit-color-name" defaultValue={editingColor.name} placeholder="Nhập tên màu..." value={colorName} onChange={(e) => setColorName(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-color-code">Mã màu</Label>
                  <Input id="edit-color-code" defaultValue={editingColor.code} placeholder="#000000" value={colorCode} onChange={(e) => setColorCode(e.target.value)} />
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditColorOpen(false)}>
                Hủy
              </Button>
              <Button className="bg-primary" onClick={handleUpdateColor}>
                Lưu
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={isEditSizeOpen} onOpenChange={setIsEditSizeOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Sửa kích cỡ</DialogTitle>
            </DialogHeader>
            {editingSize && (
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-size-name">Tên kích cỡ</Label>
                  <Input id="edit-size-name" defaultValue={editingSize.name} placeholder="Nhập tên kích cỡ..." value={sizeName} onChange={(e) => setSizeName(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-size-desc">Mô tả</Label>
                  <Input id="edit-size-desc" defaultValue={editingSize.description} placeholder="Mô tả kích cỡ..."
                    value={sizeDescription}
                    onChange={(e) => setSizeDescription(e.target.value)}
                  />
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditSizeOpen(false)}>
                Hủy
              </Button>
              <Button className="bg-primary" onClick={handleUpdateSize}>
                Lưu
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <AlertDialog open={isDeleteColorOpen} onOpenChange={setIsDeleteColorOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Xóa màu sắc</AlertDialogTitle>
              <AlertDialogDescription>
                Bạn có chắc chắn muốn xóa màu này?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Hủy</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteColor}>
                Xóa
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <AlertDialog open={isDeleteSizeOpen} onOpenChange={setIsDeleteSizeOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Xóa kích cỡ</AlertDialogTitle>
              <AlertDialogDescription>
                Bạn có chắc chắn muốn xóa kích cỡ này?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Hủy</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteSize}>
                Xóa
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </main>
    </div>
  )
}

export default function AttributesPage() {
  return (
    <Suspense fallback={null}>
      <AttributesPageContent />
    </Suspense>
  )
}

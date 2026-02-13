"use client"

import React from "react"

import { HeaderNav } from "@/components/header-nav"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Search, MoreVertical, Edit, Trash2, Lock, ChevronLeft, ChevronRight, Check, ChevronsUpDown } from "lucide-react"
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

import { usePermissionGroups } from "@/hooks/usePermissionGroups"
import { usePermissions } from "@/hooks/usePermissions"


function GroupSelector({
  name,
  defaultValue,
  groups,
}: {
  name: string
  defaultValue?: number
  groups: { id: number; name: string }[]
}) {
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState<number | undefined>(defaultValue)

  return (
    <>
      <input type="hidden" name={name} value={value ?? ""} />

      <Popover open={open} onOpenChange={setOpen} modal={false}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-full justify-between">
            {groups.find(g => g.id === value)?.name || "Chọn nhóm..."}
            <ChevronsUpDown className="h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>

        <PopoverContent
          className="w-[var(--radix-popover-trigger-width)] p-0"
          sideOffset={4}
          onWheelCapture={e => e.stopPropagation()}
        >
          <Command>
            <CommandInput placeholder="Tìm kiếm nhóm..." />

            <CommandList className="max-h-60 overflow-y-auto no-scrollbar">
              <CommandGroup>
                {groups.map(group => (
                  <CommandItem
                    key={group.id}
                    onSelect={() => {
                      setValue(group.id)
                      setOpen(false)
                    }}
                  >
                    {group.name}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </>
  )
}

export default function PermissionsPage() {
  const {
    permissions,
    paginatedPermissions,

    page,
    setPage,
    rowsPerPage,
    setRowsPerPage,
    totalPages,

    selectedIds,
    toggleSelect,
    toggleSelectAll,

    createPermission,
    updatePermission,
    deletePermission,
    assignGroupToSelected,
    clearSelection,
  } = usePermissions()

  const { groups } = usePermissionGroups()

  const [isAddOpen, setIsAddOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [editingPermission, setEditingPermission] = useState<any>(null)
  const [isAssignGroupDialogOpen, setIsAssignGroupDialogOpen] = useState(false)
  const [selectedGroup, setSelectedGroup] = useState<number | null>(null)


  /* ================= HANDLERS ================= */
  const handleAdd = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = new FormData(e.currentTarget)

    await createPermission({
      code: form.get("code") as string,
      name: form.get("name") as string,
      description: form.get("description") as string,
      group_id: Number(form.get("group_id")),
    })

    setIsAddOpen(false)
  }

  const handleEdit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = new FormData(e.currentTarget)

    await updatePermission(editingPermission.id, {
      code: form.get("code") as string,
      name: form.get("name") as string,
      description: form.get("description") as string,
      group_id: Number(form.get("group_id")),
    })

    setIsEditOpen(false)
    setEditingPermission(null)
  }

  const handleDelete = async () => {
    await deletePermission(editingPermission.id)
    setIsDeleteOpen(false)
    setEditingPermission(null)
  }

  const handleAssignGroupToSelected = async () => {
    if (!selectedGroup) return

    await assignGroupToSelected(selectedGroup)

    setSelectedGroup(null)
    setIsAssignGroupDialogOpen(false)
  }


  return (
    <div className="min-h-screen bg-background">
      <HeaderNav />
      <main className="container mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Quyền Hạn</h1>
            <p className="text-muted-foreground mt-1">Quản lý các quyền hạn của hệ thống</p>
          </div>
          <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2 bg-primary hover:bg-primary/90">
                <Plus className="h-4 w-4" />
                Thêm Quyền Hạn
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Thêm Quyền Hạn Mới</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAdd} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="code">Mã quyền hạn</Label>
                  <Input id="code" name="code" placeholder="create_user" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="name">Tên quyền hạn</Label>
                  <Input id="name" name="name" placeholder="Tạo người dùng" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Mô tả</Label>
                  <Input id="description" name="description" placeholder="Mô tả quyền hạn..." />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="group">Nhóm quyền hạn</Label>
                  <GroupSelector
                    name="group_id"
                    groups={groups}
                  />
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddOpen(false)}>
                    Hủy
                  </Button>
                  <Button type="submit" className="bg-primary hover:bg-primary/90">
                    Thêm
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5" />
                Danh sách quyền hạn
              </CardTitle>
              <div className="relative w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Tìm kiếm quyền hạn..." className="pl-8" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {selectedIds.length > 0 && (
              <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-between">
                <span className="text-sm font-medium text-blue-700">
                  Đã chọn {selectedIds.length} quyền hạn
                </span>

                <Dialog
                  open={isAssignGroupDialogOpen}
                  onOpenChange={setIsAssignGroupDialogOpen}
                >
                  <DialogTrigger asChild>
                    <Button size="sm" className="bg-primary hover:bg-primary/90">
                      Gán Nhóm
                    </Button>
                  </DialogTrigger>

                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Gán Nhóm cho Quyền Hạn</DialogTitle>
                    </DialogHeader>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Chọn nhóm quyền hạn</Label>

                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              role="combobox"
                              className="w-full justify-between"
                            >
                              {groups.find(g => g.id === selectedGroup)?.name ||
                                "Chọn nhóm..."}
                              <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                            </Button>
                          </PopoverTrigger>

                          <PopoverContent
                            className="w-[var(--radix-popover-trigger-width)] p-0"
                            side="bottom"
                            align="start"
                          >
                            <Command>
                              <CommandInput placeholder="Tìm kiếm nhóm..." />
                              <CommandEmpty>Không tìm thấy nhóm.</CommandEmpty>

                              {/* ✅ SCROLL CHUẨN MAC */}
                              <ScrollArea className="h-60">
                                <CommandList>
                                  <CommandGroup>
                                    {groups.map(group => (
                                      <CommandItem
                                        key={group.id}
                                        value={group.name}
                                        onSelect={() => setSelectedGroup(group.id)}
                                      >
                                        <Check
                                          className={cn(
                                            "mr-2 h-4 w-4",
                                            selectedGroup === group.id
                                              ? "opacity-100"
                                              : "opacity-0"
                                          )}
                                        />
                                        {group.name}
                                      </CommandItem>
                                    ))}
                                  </CommandGroup>
                                </CommandList>
                              </ScrollArea>
                            </Command>
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>

                    <DialogFooter>
                      <Button
                        variant="outline"
                        onClick={() => setIsAssignGroupDialogOpen(false)}
                      >
                        Hủy
                      </Button>
                      <Button
                        onClick={handleAssignGroupToSelected}
                        disabled={!selectedGroup}
                        className="bg-primary hover:bg-primary/90"
                      >
                        Gán
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            )}
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={
                        selectedIds.length === paginatedPermissions.length &&
                        paginatedPermissions.length > 0
                      }
                      onCheckedChange={toggleSelectAll}
                    />
                  </TableHead>
                  <TableHead>Mã</TableHead>
                  <TableHead>Tên quyền hạn</TableHead>
                  <TableHead>Mô tả</TableHead>
                  <TableHead>Nhóm</TableHead>
                  <TableHead className="text-right">Hành động</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedPermissions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                      Không có quyền hạn
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedPermissions.map(p => (
                    <TableRow key={p.id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedIds.includes(p.id)}
                          onCheckedChange={() => toggleSelect(p.id)}
                        />
                      </TableCell>
                      <TableCell className="font-mono font-medium text-sm">{p.code}</TableCell>

                      <TableCell className="font-medium">{p.name}</TableCell>

                      <TableCell className="text-muted-foreground max-w-[320px] break-words">
                        {p.description || "-"}
                      </TableCell>

                      <TableCell>
                        {p.group?.name ? (
                          <Badge variant="outline">{p.group.name}</Badge>
                        ) : (
                          "-"
                        )}
                      </TableCell>

                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>

                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => {
                                setEditingPermission(p)
                                setIsEditOpen(true)
                              }}
                            >
                              <Edit className="h-4 w-4 mr-2" />
                              Sửa
                            </DropdownMenuItem>

                            <DropdownMenuItem
                              className="text-red-600"
                              onClick={() => {
                                setEditingPermission(p)
                                setIsDeleteOpen(true)
                              }}
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

            <div className="flex items-center justify-between border-t pt-4">
              <div className="flex items-center gap-2 text-sm">
                Hiển thị
                <Select
                  value={rowsPerPage.toString()}
                  onValueChange={v => {
                    setRowsPerPage(Number(v))
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
                    <SelectItem value="50">100</SelectItem>
                  </SelectContent>
                </Select>
                bản ghi <span>Tổng số: {permissions.length}</span>
              </div>


              <div className="flex items-center gap-4">
                <Button
                  size="sm"
                  variant="outline"
                  disabled={page === 1}
                  onClick={() => setPage(page - 1)}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>

                <span className="text-sm font-medium">
                  {page} / {totalPages}
                </span>

                <Button
                  size="sm"
                  variant="outline"
                  disabled={page === totalPages}
                  onClick={() => setPage(page + 1)}
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Sửa quyền hạn</DialogTitle>
          </DialogHeader>

          {editingPermission && (
            <form onSubmit={handleEdit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-code">Mã quyền hạn</Label>
                <Input id="edit-code" name="code" defaultValue={editingPermission.code} readOnly />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-name">Tên quyền hạn</Label>
                <Input id="edit-name" name="name" defaultValue={editingPermission.name} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-description">Mô tả</Label>
                <Input id="edit-description" name="description" defaultValue={editingPermission.description} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-group">Nhóm quyền hạn</Label>
                <GroupSelector
                  name="group_id"
                  defaultValue={editingPermission.group_id}
                  groups={groups}
                />
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setIsEditOpen(false)}>
                  Hủy
                </Button>
                <Button type="submit">Lưu</Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xóa quyền hạn</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa quyền này?
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700"
              onClick={handleDelete}
            >
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

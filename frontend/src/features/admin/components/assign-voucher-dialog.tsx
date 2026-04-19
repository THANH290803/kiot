"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"

interface Voucher {
    id: number
    code: string
    description?: string | null
    discount_type: "percent" | "fixed"
    discount_value: number
}

interface Customer {
    id: number
    name: string
    phone_number: string
    email: string
}

interface AssignVoucherDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    mode: "voucher" | "customer"
    selectedItem?: Voucher | Customer
    vouchers: Voucher[]
    customers: Customer[]
    voucherAssignments: Array<{ voucherId: number; customerId: number; assignedDate: string }>
    onAssign: (voucherId: number, customerId: number) => void | Promise<void>
}

export function AssignVoucherDialog({
                                        open,
                                        onOpenChange,
                                        mode,
                                        selectedItem,
                                        vouchers,
                                        customers,
                                        voucherAssignments,
                                        onAssign,
                                    }: AssignVoucherDialogProps) {
    const [selectedVoucherId, setSelectedVoucherId] = useState<string>("")
    const [selectedCustomerId, setSelectedCustomerId] = useState<string>("")
    const [selectedVouchers, setSelectedVouchers] = useState<number[]>([])
    const [selectedCustomers, setSelectedCustomers] = useState<number[]>([])
    const [isBulkMode, setIsBulkMode] = useState(false)

    const toggleVoucher = (voucherId: number) => {
        setSelectedVouchers(prev =>
            prev.includes(voucherId) ? prev.filter(id => id !== voucherId) : [...prev, voucherId]
        )
    }

    const toggleCustomer = (customerId: number) => {
        setSelectedCustomers(prev =>
            prev.includes(customerId) ? prev.filter(id => id !== customerId) : [...prev, customerId]
        )
    }

    const handleAssign = async () => {
        if (isBulkMode) {
            // Bulk assign mode
            if (selectedVouchers.length > 0 && selectedCustomers.length > 0) {
                for (const voucherId of selectedVouchers) {
                    for (const customerId of selectedCustomers) {
                        await onAssign(voucherId, customerId)
                    }
                }
                resetForm()
                onOpenChange(false)
            }
        } else if (mode === "voucher" && selectedItem && "code" in selectedItem) {
            // Single assign from voucher page
            if (selectedCustomerId) {
                await onAssign(selectedItem.id, Number(selectedCustomerId))
                resetForm()
                onOpenChange(false)
            }
        } else if (mode === "customer" && selectedItem && !("code" in selectedItem)) {
            // Single assign from customer page
            if (selectedVoucherId) {
                await onAssign(Number(selectedVoucherId), selectedItem.id)
                resetForm()
                onOpenChange(false)
            }
        }
    }

    const resetForm = () => {
        setSelectedVoucherId("")
        setSelectedCustomerId("")
        setSelectedVouchers([])
        setSelectedCustomers([])
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>
                        {isBulkMode ? "Gán hàng loạt vouchers cho khách hàng" : "Gán voucher cho khách hàng"}
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    {/* Toggle Bulk Mode */}
                    <div className="flex items-center gap-2">
                        <Checkbox
                            id="bulk-mode"
                            checked={isBulkMode}
                            onCheckedChange={(checked) => {
                                setIsBulkMode(checked as boolean)
                                setSelectedVoucherId("")
                                setSelectedCustomerId("")
                                setSelectedVouchers([])
                                setSelectedCustomers([])
                            }}
                        />
                        <Label htmlFor="bulk-mode" className="font-normal cursor-pointer">
                            Gán hàng loạt (chọn nhiều vouchers + khách hàng)
                        </Label>
                    </div>

                    {/* Bulk Mode - Multiple Selection */}
                    {isBulkMode ? (
                        <>
                            {/* Vouchers Selection */}
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <Label>Chọn vouchers ({selectedVouchers.length})</Label>
                                    {selectedVouchers.length > 0 && (
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            onClick={() => setSelectedVouchers([])}
                                            className="text-xs"
                                        >
                                            Xóa chọn
                                        </Button>
                                    )}
                                </div>
                                <ScrollArea className="h-[150px] border rounded-lg p-3">
                                    <div className="space-y-2">
                                        {vouchers.map((voucher) => (
                                            <div key={voucher.id} className="flex items-center gap-2">
                                                <Checkbox
                                                    id={`voucher-${voucher.id}`}
                                                    checked={selectedVouchers.includes(voucher.id)}
                                                    onCheckedChange={() => toggleVoucher(voucher.id)}
                                                />
                                                <Label
                                                    htmlFor={`voucher-${voucher.id}`}
                                                    className="font-normal cursor-pointer text-sm flex-1"
                                                >
                                                    <span className="font-mono font-medium">{voucher.code}</span>
                                                    <span className="text-muted-foreground text-xs ml-2">
                            ({voucher.discount_type === "percent"
                                                        ? `${voucher.discount_value}%`
                                                        : `${voucher.discount_value.toLocaleString()}đ`})
                          </span>
                                                </Label>
                                            </div>
                                        ))}
                                    </div>
                                </ScrollArea>
                                {selectedVouchers.length > 0 && (
                                    <div className="flex gap-1 flex-wrap">
                                        {selectedVouchers.map(id => {
                                            const voucher = vouchers.find(v => v.id === id)
                                            return (
                                                <Badge key={id} variant="secondary" className="text-xs">
                                                    {voucher?.code}
                                                </Badge>
                                            )
                                        })}
                                    </div>
                                )}
                            </div>

                            {/* Customers Selection */}
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <Label>Chọn khách hàng ({selectedCustomers.length})</Label>
                                    {selectedCustomers.length > 0 && (
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            onClick={() => setSelectedCustomers([])}
                                            className="text-xs"
                                        >
                                            Xóa chọn
                                        </Button>
                                    )}
                                </div>
                                <ScrollArea className="h-[150px] border rounded-lg p-3">
                                    <div className="space-y-2">
                                        {customers.map((customer) => (
                                            <div key={customer.id} className="flex items-center gap-2">
                                                <Checkbox
                                                    id={`customer-${customer.id}`}
                                                    checked={selectedCustomers.includes(customer.id)}
                                                    onCheckedChange={() => toggleCustomer(customer.id)}
                                                />
                                                <Label
                                                    htmlFor={`customer-${customer.id}`}
                                                    className="font-normal cursor-pointer text-sm flex-1"
                                                >
                                                    <span className="font-medium">{customer.name}</span>
                                                    <span className="text-muted-foreground text-xs ml-2">
                            {customer.phone_number}
                          </span>
                                                </Label>
                                            </div>
                                        ))}
                                    </div>
                                </ScrollArea>
                                {selectedCustomers.length > 0 && (
                                    <div className="flex gap-1 flex-wrap">
                                        {selectedCustomers.map(id => {
                                            const customer = customers.find(c => c.id === id)
                                            return (
                                                <Badge key={id} variant="secondary" className="text-xs">
                                                    {customer?.name}
                                                </Badge>
                                            )
                                        })}
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        // Single Mode
                        <>
                            {mode === "voucher" && selectedItem && "code" in selectedItem && (
                                <>
                                    <div className="space-y-2">
                                        <Label>Voucher đã chọn</Label>
                                        <div className="p-3 bg-muted rounded-lg">
                                            <p className="font-mono font-medium">{selectedItem.code}</p>
                                            <p className="text-sm text-muted-foreground">{selectedItem.description}</p>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="customer-select">Chọn khách hàng</Label>
                                        <Select value={selectedCustomerId} onValueChange={setSelectedCustomerId}>
                                            <SelectTrigger id="customer-select">
                                                <SelectValue placeholder="Chọn khách hàng..." />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {customers.map((customer) => (
                                                    <SelectItem key={customer.id} value={String(customer.id)}>
                                                        {customer.name} ({customer.phone_number})
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </>
                            )}

                            {mode === "customer" && selectedItem && !("code" in selectedItem) && (
                                <>
                                    <div className="space-y-2">
                                        <Label>Khách hàng đã chọn</Label>
                                        <div className="p-3 bg-muted rounded-lg">
                                            <p className="font-medium">{selectedItem.name}</p>
                                            <p className="text-sm text-muted-foreground">{selectedItem.email}</p>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="voucher-select">Chọn voucher</Label>
                                        <Select value={selectedVoucherId} onValueChange={setSelectedVoucherId}>
                                            <SelectTrigger id="voucher-select">
                                                <SelectValue placeholder="Chọn voucher..." />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {vouchers.map((voucher) => (
                                                    <SelectItem key={voucher.id} value={String(voucher.id)}>
                                                        {voucher.code} -{" "}
                                                        {voucher.discount_type === "percent"
                                                            ? `${voucher.discount_value}%`
                                                            : `${voucher.discount_value.toLocaleString()}đ`}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </>
                            )}
                        </>
                    )}
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => {
                        onOpenChange(false)
                        resetForm()
                    }}>
                        Hủy
                    </Button>
                    <Button
                        className="bg-primary"
                        onClick={handleAssign}
                        disabled={
                            isBulkMode
                                ? selectedVouchers.length === 0 || selectedCustomers.length === 0
                                : mode === "voucher"
                                    ? !selectedCustomerId
                                    : !selectedVoucherId
                        }
                    >
                        {isBulkMode
                            ? `Gán ${selectedVouchers.length * selectedCustomers.length} cặp`
                            : "Gán voucher"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

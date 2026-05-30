'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Command, CommandEmpty, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Header } from '@/features/user/components/header'
import { Footer } from '@/features/user/components/footer'
import { Check, ChevronsUpDown } from 'lucide-react'
import { SelectOption, useCheckoutPage } from '@/features/user/hooks/use-checkout-page'

interface SearchableSelectProps {
    label: string
    placeholder: string
    searchPlaceholder: string
    options: SelectOption[]
    value: string
    disabled?: boolean
    emptyText?: string
    onValueChange: (value: string) => void
}

function SearchableSelect({
    label,
    placeholder,
    searchPlaceholder,
    options,
    value,
    disabled,
    emptyText,
    onValueChange,
}: SearchableSelectProps) {
    const [open, setOpen] = useState(false)
    const selectedOption = options.find((option) => option.id === value)

    return (
        <div>
            <label className="block text-sm font-medium text-foreground mb-2">{label}</label>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        type="button"
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        disabled={disabled}
                        className="w-full justify-between font-normal"
                    >
                        <span className="truncate">{selectedOption?.name || placeholder}</span>
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
                    <Command>
                        <CommandInput placeholder={searchPlaceholder} />
                        <CommandList>
                            <CommandEmpty>{emptyText || 'Không có dữ liệu'}</CommandEmpty>
                            {options.map((option) => (
                                <CommandItem
                                    key={option.id}
                                    value={`${option.id} ${option.name}`}
                                    onSelect={() => {
                                        onValueChange(option.id)
                                        setOpen(false)
                                    }}
                                >
                                    <Check className={`mr-2 h-4 w-4 ${value === option.id ? 'opacity-100' : 'opacity-0'}`} />
                                    {option.name}
                                </CommandItem>
                            ))}
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
        </div>
    )
}

export default function CheckoutPage() {
    const {
        user,
        items,
        formData,
        isProcessing,
        orderPlaced,
        selectedProvinceId,
        selectedDistrictId,
        selectedWardId,
        provinceOptions,
        districtOptions,
        wardOptions,
        handleInputChange,
        handleProvinceChange,
        handleDistrictChange,
        handleWardChange,
        handleSubmit,
        formatPrice,
        getTotalPrice,
    } = useCheckoutPage()

    if (!user) {
        return (
            <>
                <Header />
                <div className="min-h-screen bg-background flex items-center justify-center px-4">
                    <Card className="p-8 max-w-md w-full text-center">
                        <h1 className="text-2xl font-bold text-foreground mb-4">
                            Vui lòng đăng nhập
                        </h1>
                        <p className="text-muted-foreground mb-6">
                            Bạn cần đăng nhập để tiếp tục thanh toán
                        </p>
                        <Link href="/user/login">
                            <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 mb-3">
                                Đăng nhập
                            </Button>
                        </Link>
                        <Link href="/user/signup">
                            <Button variant="outline" className="w-full">
                                Đăng ký tài khoản mới
                            </Button>
                        </Link>
                    </Card>
                </div>
                <Footer />
            </>
        )
    }

    if (orderPlaced) {
        return (
            <>
                <Header />
                <div className="min-h-screen bg-background flex items-center justify-center px-4">
                    <Card className="p-8 max-w-md w-full text-center">
                        <div className="mb-4 text-4xl">✓</div>
                        <h1 className="text-2xl font-bold text-foreground mb-4">
                            Đặt hàng thành công!
                        </h1>
                        <p className="text-muted-foreground mb-6">
                            Cảm ơn bạn đã mua hàng. Bạn sẽ được chuyển đến trang profile của mình.
                        </p>
                        <p className="text-sm text-muted-foreground">
                            Đang chuyển hướng...
                        </p>
                    </Card>
                </div>
                <Footer />
            </>
        )
    }

    return (
        <>
            <Header />
            <div className="min-h-screen bg-background">
                <div className="container mx-auto px-4 py-12">
                    <h1 className="text-4xl font-bold text-foreground mb-12">Thanh toán</h1>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Checkout Form */}
                        <div className="lg:col-span-2">
                            <Card className="p-6 mb-6">
                                <h2 className="text-2xl font-bold text-foreground mb-6">
                                    Thông tin giao hàng
                                </h2>

                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div>
                                        <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                                            Tên đầy đủ
                                        </label>
                                        <Input
                                            id="name"
                                            name="name"
                                            type="text"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                                                Email
                                            </label>
                                            <Input
                                                id="email"
                                                name="email"
                                                type="email"
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                required
                                                className="w-full"
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="phone" className="block text-sm font-medium text-foreground mb-2">
                                                Số điện thoại
                                            </label>
                                            <Input
                                                id="phone"
                                                name="phone"
                                                type="tel"
                                                value={formData.phone}
                                                onChange={handleInputChange}
                                                required
                                                className="w-full"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-3 gap-4">
                                        <SearchableSelect
                                            label="Thành phố/Tỉnh"
                                            placeholder="Chọn Tỉnh/Thành"
                                            searchPlaceholder="Tìm tỉnh/thành..."
                                            options={provinceOptions}
                                            value={selectedProvinceId}
                                            onValueChange={handleProvinceChange}
                                        />
                                        <SearchableSelect
                                            label="Quận/Huyện"
                                            placeholder="Chọn Quận/Huyện"
                                            searchPlaceholder="Tìm quận/huyện..."
                                            options={districtOptions}
                                            value={selectedDistrictId}
                                            disabled={!selectedProvinceId}
                                            emptyText="Không có quận/huyện"
                                            onValueChange={handleDistrictChange}
                                        />
                                        <SearchableSelect
                                            label="Phường/Xã"
                                            placeholder="Chọn Phường/Xã"
                                            searchPlaceholder="Tìm phường/xã..."
                                            options={wardOptions}
                                            value={selectedWardId}
                                            disabled={!selectedDistrictId}
                                            emptyText="Không có phường/xã"
                                            onValueChange={handleWardChange}
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="address" className="block text-sm font-medium text-foreground mb-2">
                                            Địa chỉ giao hàng chi tiết
                                        </label>
                                        <textarea
                                            id="address"
                                            name="address"
                                            value={formData.address}
                                            onChange={handleInputChange}
                                            required
                                            rows={2}
                                            className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                                            placeholder="Nhập số nhà, tên đường..."
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="notes" className="block text-sm font-medium text-foreground mb-2">
                                            Ghi chú đơn hàng (tuỳ chọn)
                                        </label>
                                        <textarea
                                            id="notes"
                                            name="notes"
                                            value={formData.notes}
                                            onChange={handleInputChange}
                                            rows={2}
                                            className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                                            placeholder="Ghi chú bổ sung cho người giao hàng (ví dụ: giao vào buổi sáng, để ở bảo vệ, v.v.)"
                                        />
                                    </div>

                                    <div className="border-t border-border pt-6">
                                        <h3 className="text-lg font-semibold text-foreground mb-4">Phương thức thanh toán</h3>
                                        <div className="space-y-3">
                                            <label className="flex items-center p-3 border border-border rounded-lg cursor-pointer hover:bg-secondary transition-colors">
                                                <input
                                                    type="radio"
                                                    name="paymentMethod"
                                                    value="cod"
                                                    checked={formData.paymentMethod === 'cod'}
                                                    onChange={handleInputChange}
                                                    className="mr-3"
                                                />
                                                <div>
                                                    <p className="font-medium text-foreground">Thanh toán khi nhận hàng (COD)</p>
                                                    <p className="text-sm text-muted-foreground">Bạn sẽ thanh toán khi nhận được đơn hàng</p>
                                                </div>
                                            </label>

                                            <label className="flex items-center p-3 border border-border rounded-lg cursor-pointer hover:bg-secondary transition-colors opacity-50">
                                                <input
                                                    type="radio"
                                                    name="paymentMethod"
                                                    value="bank"
                                                    disabled
                                                    className="mr-3"
                                                />
                                                <div>
                                                    <p className="font-medium text-foreground">Chuyển khoản ngân hàng</p>
                                                    <p className="text-sm text-muted-foreground">Sớm ra mắt</p>
                                                </div>
                                            </label>

                                            <label className="flex items-center p-3 border border-border rounded-lg cursor-pointer hover:bg-secondary transition-colors opacity-50">
                                                <input
                                                    type="radio"
                                                    name="paymentMethod"
                                                    value="ewallet"
                                                    disabled
                                                    className="mr-3"
                                                />
                                                <div>
                                                    <p className="font-medium text-foreground">Ví điện tử (Momo, ZaloPay)</p>
                                                    <p className="text-sm text-muted-foreground">Sớm ra mắt</p>
                                                </div>
                                            </label>
                                        </div>
                                    </div>

                                    <Button
                                        type="submit"
                                        disabled={isProcessing}
                                        className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                                    >
                                        {isProcessing ? 'Đang xử lý...' : 'Hoàn tất đơn hàng'}
                                    </Button>
                                </form>
                            </Card>

                            <Link href="/user/cart">
                                <Button variant="outline" className="w-full">
                                    Quay lại giỏ hàng
                                </Button>
                            </Link>
                        </div>

                        {/* Order Summary */}
                        <div className="lg:col-span-1">
                            <Card className="p-6 sticky top-4">
                                <h2 className="text-xl font-bold text-foreground mb-6">
                                    Tóm tắt đơn hàng
                                </h2>

                                <div className="space-y-3 mb-6 border-b border-border pb-6">
                                    {items.map((item, index) => (
                                        <div key={index} className="flex justify-between text-sm text-foreground">
                    <span>
                      {item.name} x {item.quantity}
                    </span>
                                            <span>{formatPrice(item.price * item.quantity)}</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="space-y-3 mb-6">
                                    <div className="flex justify-between text-foreground">
                                        <span>Subtotal:</span>
                                        <span>{formatPrice(getTotalPrice())}</span>
                                    </div>
                                    <div className="flex justify-between text-foreground">
                                        <span>Phí vận chuyển:</span>
                                        <span>Miễn phí</span>
                                    </div>
                                    <div className="border-t border-border pt-3 flex justify-between text-lg font-bold text-primary">
                                        <span>Tổng cộng:</span>
                                        <span>{formatPrice(getTotalPrice())}</span>
                                    </div>
                                </div>

                                <div className="bg-secondary/50 p-4 rounded-lg text-xs text-muted-foreground">
                                    <p className="mb-2 font-medium">
                                        Lưu ý: Đây là demo, không có thanh toán thực tế
                                    </p>
                                    <p>
                                        Nhấp vào &quot;Hoàn tất đơn hàng&quot; để tạo một đơn hàng giả lập
                                    </p>
                                </div>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    )
}

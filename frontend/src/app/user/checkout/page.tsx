'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCart } from '@/features/user/lib/cart-context'
import { useAuth } from '@/features/user/lib/auth-context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Header } from '@/features/user/components/header'
import { Footer } from '@/features/user/components/footer'

export default function CheckoutPage() {
    const router = useRouter()
    const { items, getTotalPrice, clearCart } = useCart()
    const { user } = useAuth()
    const [isProcessing, setIsProcessing] = useState(false)
    const [orderPlaced, setOrderPlaced] = useState(false)

    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || '',
        address: user?.address || '',
        city: '',
        district: '',
        ward: '',
        notes: '',
        paymentMethod: 'cod',
    })

    useEffect(() => {
        if (items.length === 0 && !orderPlaced) {
            router.push('/user/cart')
        }
    }, [items, router, orderPlaced])

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

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsProcessing(true)

        // Simulate payment processing
        await new Promise(resolve => setTimeout(resolve, 2000))

        // Create new order and store in localStorage
        const newOrder = {
            id: `ORD-${Date.now()}`,
            userId: user?.id || '',
            items: items,
            total: getTotalPrice(),
            status: 'processing' as const,
            createdAt: new Date().toISOString().split('T')[0],
            deliveryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        }

        // Get existing orders from localStorage
        const existingOrders = JSON.parse(localStorage.getItem('user_orders') || '[]')
        existingOrders.push(newOrder)
        localStorage.setItem('user_orders', JSON.stringify(existingOrders))

        // Clear cart and show success message
        clearCart()
        setOrderPlaced(true)

        // Redirect to profile
        setTimeout(() => {
            router.push('/user/profile')
        }, 2000)
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

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
            maximumFractionDigits: 0
        }).format(price)
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
                                        <div>
                                            <label htmlFor="city" className="block text-sm font-medium text-foreground mb-2">
                                                Thành phố/Tỉnh
                                            </label>
                                            <Input
                                                id="city"
                                                name="city"
                                                value={formData.city}
                                                onChange={handleInputChange}
                                                required
                                                placeholder="TP.HCM"
                                                className="w-full"
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="district" className="block text-sm font-medium text-foreground mb-2">
                                                Quận/Huyện
                                            </label>
                                            <Input
                                                id="district"
                                                name="district"
                                                value={formData.district}
                                                onChange={handleInputChange}
                                                required
                                                placeholder="Quận 1"
                                                className="w-full"
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="ward" className="block text-sm font-medium text-foreground mb-2">
                                                Phường/Xã
                                            </label>
                                            <Input
                                                id="ward"
                                                name="ward"
                                                value={formData.ward}
                                                onChange={handleInputChange}
                                                required
                                                placeholder="Phường 1"
                                                className="w-full"
                                            />
                                        </div>
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

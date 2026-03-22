'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useCart } from '@/features/user/lib/cart-context'
import { useAuth } from '@/features/user/lib/auth-context'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Header } from '@/features/user/components/header'
import { Footer } from '@/features/user/components/footer'
import { Trash2 } from 'lucide-react'

const DISCOUNT_CODES = {
    'WELCOME10': 0.1,
    'SAVE20': 0.2,
    'SUMMER15': 0.15,
}

export default function CartPage() {
    const { items, removeItem, updateQuantity, getTotalPrice } = useCart()
    const { user } = useAuth()
    const router = useRouter()
    const [discountCode, setDiscountCode] = useState('')
    const [appliedDiscount, setAppliedDiscount] = useState<{ code: string; percent: number } | null>(null)
    const [discountError, setDiscountError] = useState('')

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
            maximumFractionDigits: 0
        }).format(price)
    }

    const handleApplyDiscount = () => {
        const code = discountCode.toUpperCase().trim()
        if (!code) {
            setDiscountError('Vui lòng nhập mã giảm giá')
            return
        }

        if (code in DISCOUNT_CODES) {
            setAppliedDiscount({
                code,
                percent: DISCOUNT_CODES[code as keyof typeof DISCOUNT_CODES]
            })
            setDiscountError('')
        } else {
            setDiscountError('Mã giảm giá không hợp lệ')
            setAppliedDiscount(null)
        }
    }

    const subtotal = getTotalPrice()
    const discountAmount = appliedDiscount ? subtotal * appliedDiscount.percent : 0
    const total = subtotal - discountAmount

    const handleCheckout = () => {
        if (!user) {
            router.push('/user/login')
            return
        }
        router.push('/user/checkout')
    }

    if (items.length === 0) {
        return (
            <>
                <Header />
                <div className="min-h-screen bg-background">
                    <div className="container mx-auto px-4 py-12">
                        <h1 className="text-4xl font-bold text-foreground mb-12">Giỏ hàng của bạn</h1>

                        <Card className="p-12 text-center">
                            <p className="text-lg text-muted-foreground mb-6">
                                Giỏ hàng của bạn hiện đang trống
                            </p>
                            <Link href="/user/shop">
                                <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                                    Tiếp tục mua sắm
                                </Button>
                            </Link>
                        </Card>
                    </div>
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
                    <h1 className="text-4xl font-bold text-foreground mb-12">Giỏ hàng của bạn</h1>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Cart Items */}
                        <div className="lg:col-span-2">
                            <Card className="p-6 space-y-4">
                                {items.map(item => (
                                    <div key={`${item.productId}-${item.size}-${item.color}`} className="flex gap-4 pb-4 border-b border-border last:border-b-0">
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className="w-24 h-24 object-cover rounded"
                                        />
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-foreground">{item.name}</h3>
                                            <p className="text-sm text-muted-foreground">
                                                {item.color} | Size: {item.size}
                                            </p>
                                            <p className="font-semibold text-accent mt-2">{formatPrice(item.price)}</p>
                                        </div>
                                        <div className="flex flex-col items-end justify-between">
                                            <button
                                                onClick={() => removeItem(item.productId, item.size, item.color)}
                                                className="text-destructive hover:text-destructive/80"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => updateQuantity(item.productId, item.size, item.color, Math.max(1, item.quantity - 1))}
                                                    className="px-2 py-1 border border-border rounded hover:bg-secondary"
                                                >
                                                    -
                                                </button>
                                                <span className="w-8 text-center">{item.quantity}</span>
                                                <button
                                                    onClick={() => updateQuantity(item.productId, item.size, item.color, item.quantity + 1)}
                                                    className="px-2 py-1 border border-border rounded hover:bg-secondary"
                                                >
                                                    +
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </Card>
                        </div>

                        {/* Sidebar */}
                        <div className="lg:col-span-1">
                            {/* Discount Code */}
                            <Card className="p-4 mb-4 bg-secondary">
                                <h3 className="font-semibold text-foreground mb-3">Mã giảm giá</h3>
                                <div className="space-y-2">
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            placeholder="Nhập mã"
                                            value={discountCode}
                                            onChange={(e) => {
                                                setDiscountCode(e.target.value)
                                                setDiscountError('')
                                            }}
                                            className="flex-1 px-3 py-2 border border-border rounded text-sm bg-background text-foreground"
                                        />
                                        <button
                                            onClick={handleApplyDiscount}
                                            className="px-3 py-2 bg-primary text-primary-foreground rounded text-sm hover:bg-primary/90"
                                        >
                                            Áp dụng
                                        </button>
                                    </div>
                                    {discountError && (
                                        <p className="text-destructive text-xs">{discountError}</p>
                                    )}
                                    {appliedDiscount && (
                                        <p className="text-green-600 text-xs">✓ {appliedDiscount.code} ({Math.round(appliedDiscount.percent * 100)}%)</p>
                                    )}
                                </div>
                            </Card>

                            {/* Summary */}
                            <Card className="p-6 space-y-4">
                                <h2 className="text-xl font-bold text-foreground">Tóm tắt</h2>
                                <div className="space-y-3 border-t border-b border-border py-4">
                                    <div className="flex justify-between text-foreground">
                                        <span>Tạm tính:</span>
                                        <span>{formatPrice(subtotal)}</span>
                                    </div>
                                    {appliedDiscount && (
                                        <div className="flex justify-between text-green-600 text-sm">
                                            <span>Giảm ({Math.round(appliedDiscount.percent * 100)}%):</span>
                                            <span>-{formatPrice(discountAmount)}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between text-foreground">
                                        <span>Vận chuyển:</span>
                                        <span>Miễn phí</span>
                                    </div>
                                </div>
                                <div className="flex justify-between font-bold text-lg">
                                    <span>Tổng:</span>
                                    <span className="text-accent">{formatPrice(total)}</span>
                                </div>

                                <button
                                    onClick={handleCheckout}
                                    className="w-full py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 font-semibold transition-colors"
                                >
                                    Tiến hành thanh toán
                                </button>

                                <Link href="/user/shop" className="block">
                                    <Button variant="outline" className="w-full">
                                        Tiếp tục mua sắm
                                    </Button>
                                </Link>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    )
}

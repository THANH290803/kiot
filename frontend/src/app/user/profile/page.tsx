'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/features/user/lib/auth-context'
import type { CartItem, Order } from '@/features/user/lib/mock-data'
import { mockOrders } from '@/features/user/lib/mock-data'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Header } from '@/features/user/components/header'
import { Footer } from '@/features/user/components/footer'
import { X, Eye } from 'lucide-react'

const ORDERS_PER_PAGE = 5

function getOrdersForUser(userId?: string) {
    if (!userId) {
        return []
    }

    const savedOrders =
        typeof window !== 'undefined'
            ? ((JSON.parse(localStorage.getItem('user_orders') || '[]') as Order[]).filter((order) => order.userId === userId))
            : []

    const mockUserOrders = mockOrders.filter((order) => order.userId === userId)

    return [...mockUserOrders, ...savedOrders]
}

export default function ProfilePage() {
    const { user, logout } = useAuth()
    const router = useRouter()
    const [userOrders, setUserOrders] = useState<Order[]>(() => getOrdersForUser(user?.id))
    const [currentPage, setCurrentPage] = useState(1)
    const [filterStatus, setFilterStatus] = useState<string>('all')
    const [editMode, setEditMode] = useState(false)
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || '',
        address: user?.address || '',
    })
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)

    useEffect(() => {
        if (!user) {
            router.push('/user/login')
        }
    }, [user, router])

    const filteredOrders = filterStatus === 'all'
        ? userOrders
        : userOrders.filter(order => order.status === filterStatus)

    const totalPages = Math.ceil(filteredOrders.length / ORDERS_PER_PAGE)
    const startIndex = (currentPage - 1) * ORDERS_PER_PAGE
    const endIndex = startIndex + ORDERS_PER_PAGE
    const displayedOrders = filteredOrders.slice(startIndex, endIndex)

    const getStatusLabel = (status: string) => {
        const labels: Record<string, string> = {
            pending: 'Chờ xác nhận',
            processing: 'Đang chuẩn bị',
            shipped: 'Đang giao hàng',
            delivered: 'Đã giao hàng',
            cancelled: 'Đã hủy'
        }
        return labels[status] || status
    }

    const getStatusColor = (status: string) => {
        const colors: Record<string, string> = {
            pending: 'bg-yellow-100 text-yellow-800',
            processing: 'bg-blue-100 text-blue-800',
            shipped: 'bg-purple-100 text-purple-800',
            delivered: 'bg-green-100 text-green-800',
            cancelled: 'bg-red-100 text-red-800'
        }
        return colors[status] || 'bg-gray-100 text-gray-800'
    }

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
            maximumFractionDigits: 0
        }).format(price)
    }

    const handleUpdateProfile = () => {
        localStorage.setItem('user_profile', JSON.stringify(formData))
        setEditMode(false)
        alert('Cập nhật thông tin thành công!')
    }

    const handleCancelOrder = (orderId: string) => {
        setUserOrders(userOrders.map(order =>
            order.id === orderId ? { ...order, status: 'cancelled' } : order
        ))
        localStorage.setItem('user_orders', JSON.stringify(userOrders.map(order =>
            order.id === orderId ? { ...order, status: 'cancelled' } : order
        )))
    }

    return (
        <>
            <Header />
            <div className="min-h-screen bg-background">
                <div className="container mx-auto px-4 py-12">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-8">
                        <h1 className="text-4xl font-bold text-foreground">Tài Khoản Của Tôi</h1>
                        <Button
                            variant="outline"
                            onClick={() => {
                                logout()
                                router.push('/user/home')
                            }}
                        >
                            Đăng xuất
                        </Button>
                    </div>

                    {/* Profile Info */}
                    <Card className="mb-8 p-6">
                        <div className="flex justify-between items-start mb-6">
                            <h2 className="text-xl font-semibold text-foreground">Thông tin cá nhân</h2>
                            <Button
                                variant={editMode ? "default" : "outline"}
                                onClick={() => {
                                    if (editMode) {
                                        handleUpdateProfile()
                                    } else {
                                        setEditMode(true)
                                    }
                                }}
                            >
                                {editMode ? 'Lưu' : 'Chỉnh sửa'}
                            </Button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm text-muted-foreground mb-2">Tên</label>
                                {editMode ? (
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
                                    />
                                ) : (
                                    <p className="text-lg font-medium text-foreground">{formData.name}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm text-muted-foreground mb-2">Email</label>
                                {editMode ? (
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
                                    />
                                ) : (
                                    <p className="text-lg font-medium text-foreground">{formData.email}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm text-muted-foreground mb-2">Số điện thoại</label>
                                {editMode ? (
                                    <input
                                        type="text"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
                                    />
                                ) : (
                                    <p className="text-lg font-medium text-foreground">{formData.phone || 'Chưa cập nhật'}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm text-muted-foreground mb-2">Địa chỉ</label>
                                {editMode ? (
                                    <input
                                        type="text"
                                        value={formData.address}
                                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                        className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
                                    />
                                ) : (
                                    <p className="text-lg font-medium text-foreground">{formData.address || 'Chưa cập nhật'}</p>
                                )}
                            </div>
                        </div>

                        {editMode && (
                            <div className="mt-4 flex gap-2">
                                <Button onClick={() => setEditMode(false)} variant="outline">
                                    Hủy
                                </Button>
                            </div>
                        )}
                    </Card>

                    {/* Order History */}
                    <div>
                        <div className="mb-6">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-2xl font-bold text-foreground">
                                    Lịch sử đơn hàng ({filteredOrders.length})
                                </h2>
                            </div>

                            {/* Status Filter */}
                            <div className="flex gap-2 flex-wrap">
                                <button
                                    onClick={() => {
                                        setFilterStatus('all')
                                        setCurrentPage(1)
                                    }}
                                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                                        filterStatus === 'all'
                                            ? 'bg-primary text-primary-foreground'
                                            : 'border border-border text-foreground hover:bg-secondary'
                                    }`}
                                >
                                    Tất cả
                                </button>
                                <button
                                    onClick={() => {
                                        setFilterStatus('pending')
                                        setCurrentPage(1)
                                    }}
                                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                                        filterStatus === 'pending'
                                            ? 'bg-yellow-500 text-white'
                                            : 'border border-border text-foreground hover:bg-secondary'
                                    }`}
                                >
                                    Chờ xác nhận
                                </button>
                                <button
                                    onClick={() => {
                                        setFilterStatus('processing')
                                        setCurrentPage(1)
                                    }}
                                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                                        filterStatus === 'processing'
                                            ? 'bg-blue-500 text-white'
                                            : 'border border-border text-foreground hover:bg-secondary'
                                    }`}
                                >
                                    Đang chuẩn bị
                                </button>
                                <button
                                    onClick={() => {
                                        setFilterStatus('shipped')
                                        setCurrentPage(1)
                                    }}
                                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                                        filterStatus === 'shipped'
                                            ? 'bg-purple-500 text-white'
                                            : 'border border-border text-foreground hover:bg-secondary'
                                    }`}
                                >
                                    Đang giao
                                </button>
                                <button
                                    onClick={() => {
                                        setFilterStatus('delivered')
                                        setCurrentPage(1)
                                    }}
                                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                                        filterStatus === 'delivered'
                                            ? 'bg-green-500 text-white'
                                            : 'border border-border text-foreground hover:bg-secondary'
                                    }`}
                                >
                                    Đã giao
                                </button>
                            </div>
                        </div>

                        {filteredOrders.length === 0 ? (
                            <Card className="p-8 text-center">
                                <p className="text-muted-foreground mb-4">
                                    {filterStatus === 'all' ? 'Bạn chưa có đơn hàng nào' : 'Không có đơn hàng nào với trạng thái này'}
                                </p>
                                {filterStatus !== 'all' && (
                                    <Button onClick={() => setFilterStatus('all')} variant="outline" className="mb-4">
                                        Xem tất cả đơn hàng
                                    </Button>
                                )}
                                <Link href="/user/shop">
                                    <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                                        Tiếp tục mua sắm
                                    </Button>
                                </Link>
                            </Card>
                        ) : (
                            <>
                                <div className="space-y-4">
                                    {displayedOrders.map(order => (
                                        <Card key={order.id} className="p-6">
                                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
                                                <div>
                                                    <p className="text-sm text-muted-foreground">Mã đơn hàng</p>
                                                    <p className="text-lg font-semibold text-foreground">{order.id}</p>
                                                </div>
                                                <div className="flex flex-col md:flex-row gap-4 md:items-center">
                                                    <div>
                                                        <p className="text-sm text-muted-foreground">Ngày đặt</p>
                                                        <p className="text-foreground font-medium">
                                                            {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                                                        </p>
                                                    </div>
                                                    <span className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                            {getStatusLabel(order.status)}
                          </span>
                                                </div>
                                            </div>

                                            {/* Order Items Summary */}
                                            <div className="border-t border-b border-border py-4 mb-4">
                                                <p className="text-sm text-muted-foreground mb-3">
                                                    {order.items.length} sản phẩm
                                                </p>
                                                <div className="space-y-2">
                                                    {order.items.slice(0, 2).map((item, index) => (
                                                        <div key={index} className="flex justify-between text-sm">
                                                            <span className="text-foreground">{item.name} x{item.quantity}</span>
                                                            <span className="text-foreground font-medium">{formatPrice(item.price * item.quantity)}</span>
                                                        </div>
                                                    ))}
                                                    {order.items.length > 2 && (
                                                        <p className="text-sm text-muted-foreground">+{order.items.length - 2} sản phẩm khác</p>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Order Footer */}
                                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                                <div>
                                                    <p className="text-sm text-muted-foreground mb-1">Tổng cộng</p>
                                                    <p className="text-lg font-bold text-primary">{formatPrice(order.total)}</p>
                                                    {order.deliveryDate && (
                                                        <p className="text-xs text-muted-foreground mt-2">
                                                            Dự kiến giao: {new Date(order.deliveryDate).toLocaleDateString('vi-VN')}
                                                        </p>
                                                    )}
                                                </div>

                                                <div className="flex gap-2">
                                                    <Button
                                                        onClick={() => setSelectedOrder(order)}
                                                        variant="outline"
                                                        size="sm"
                                                        className="flex items-center gap-2"
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                        Chi tiết
                                                    </Button>

                                                    {order.status === 'pending' && (
                                                        <Button
                                                            onClick={() => {
                                                                if (confirm('Bạn có chắc chắn muốn hủy đơn hàng này?')) {
                                                                    handleCancelOrder(order.id)
                                                                }
                                                            }}
                                                            variant="outline"
                                                            size="sm"
                                                            className="text-destructive hover:text-destructive"
                                                        >
                                                            <X className="w-4 h-4" />
                                                            Hủy
                                                        </Button>
                                                    )}
                                                </div>
                                            </div>
                                        </Card>
                                    ))}
                                </div>

                                {/* Pagination */}
                                {totalPages > 1 && (
                                    <div className="flex justify-center items-center gap-2 mt-8">
                                        <Button
                                            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                            disabled={currentPage === 1}
                                            variant="outline"
                                        >
                                            Trước
                                        </Button>

                                        <div className="flex gap-1">
                                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                                <button
                                                    key={page}
                                                    onClick={() => setCurrentPage(page)}
                                                    className={`px-3 py-2 rounded transition-colors ${
                                                        currentPage === page
                                                            ? 'bg-primary text-primary-foreground'
                                                            : 'border border-border text-foreground hover:bg-secondary'
                                                    }`}
                                                >
                                                    {page}
                                                </button>
                                            ))}
                                        </div>

                                        <Button
                                            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                            disabled={currentPage === totalPages}
                                            variant="outline"
                                        >
                                            Tiếp
                                        </Button>
                                    </div>
                                )}
                            </>
                        )}
                    </div>

                    <div className="mt-8">
                        <Link href="/user/shop">
                            <Button variant="outline">
                                Quay lại cửa hàng
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Order Details Modal */}
            {selectedOrder && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h2 className="text-2xl font-bold text-foreground mb-2">Chi tiết đơn hàng</h2>
                                    <p className="text-muted-foreground">{selectedOrder.id}</p>
                                </div>
                                <button
                                    onClick={() => setSelectedOrder(null)}
                                    className="text-muted-foreground hover:text-foreground"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            {/* Order Info */}
                            <div className="bg-secondary p-4 rounded-lg mb-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-muted-foreground">Ngày đặt</p>
                                        <p className="font-medium text-foreground">
                                            {new Date(selectedOrder.createdAt).toLocaleDateString('vi-VN')}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Trạng thái</p>
                                        <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedOrder.status)}`}>
                      {getStatusLabel(selectedOrder.status)}
                    </span>
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Dự kiến giao</p>
                                        <p className="font-medium text-foreground">
                                            {new Date(selectedOrder.deliveryDate).toLocaleDateString('vi-VN')}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Items */}
                            <h3 className="font-semibold text-foreground mb-4">Sản phẩm</h3>
                            <div className="space-y-4 mb-6 border-b border-border pb-6">
                                {selectedOrder.items.map((item: CartItem, index: number) => (
                                    <div key={index} className="flex gap-4">
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className="w-20 h-20 object-cover rounded"
                                        />
                                        <div className="flex-1">
                                            <p className="font-medium text-foreground">{item.name}</p>
                                            <p className="text-sm text-muted-foreground">
                                                {item.color} | Size: {item.size}
                                            </p>
                                            <p className="text-sm text-muted-foreground mt-1">
                                                {item.quantity} x {formatPrice(item.price)}
                                            </p>
                                        </div>
                                        <p className="font-semibold text-foreground">
                                            {formatPrice(item.price * item.quantity)}
                                        </p>
                                    </div>
                                ))}
                            </div>

                            {/* Total */}
                            <div className="flex justify-end mb-6">
                                <div className="text-right">
                                    <p className="text-muted-foreground mb-2">Tổng cộng:</p>
                                    <p className="text-2xl font-bold text-primary">
                                        {formatPrice(selectedOrder.total)}
                                    </p>
                                </div>
                            </div>

                            <Button onClick={() => setSelectedOrder(null)} className="w-full">
                                Đóng
                            </Button>
                        </div>
                    </Card>
                </div>
            )}

            <Footer />
        </>
    )
}

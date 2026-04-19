'use client'

export interface Product {
    id: string
    name: string
    category: string
    price: number
    originalPrice: number
    image: string
    rating: number
    reviews: number
    sizes: string[]
    colors: string[]
    description: string
}

export interface User {
    id: string
    name: string
    email: string
    password?: string
    phone?: string
    address?: string
}

export interface Order {
    id: string
    userId: string
    items: CartItem[]
    total: number
    status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
    createdAt: string
    deliveryDate?: string
}

export interface CartItem {
    productId: string
    productVariantId?: number
    name: string
    price: number
    quantity: number
    size: string
    color: string
    image: string
}

export const mockProducts: Product[] = [
    {
        id: '1',
        name: 'Áo sơ mi linen sang trọng',
        category: 'tops',
        price: 890000,
        originalPrice: 1290000,
        image: 'https://images.unsplash.com/photo-1596216877369-f200520a406e?w=500&h=500&fit=crop',
        rating: 4.8,
        reviews: 245,
        sizes: ['XS', 'S', 'M', 'L', 'XL'],
        colors: ['Trắng', 'Xanh', 'Hồng'],
        description: 'Áo sơ mi linen cao cấp với chất liệu thoáng mát, phù hợp cho mùa hè.'
    },
    {
        id: '2',
        name: 'Váy maxi đen thanh lịch',
        category: 'dresses',
        price: 1290000,
        originalPrice: 1790000,
        image: 'https://images.unsplash.com/photo-1595777707802-221b3bed3a5b?w=500&h=500&fit=crop',
        rating: 4.9,
        reviews: 312,
        sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
        colors: ['Đen', 'Trắng', 'Nâu'],
        description: 'Váy maxi dài với thiết kế thanh lịch, phù hợp cho các sự kiện quan trọng.'
    },
    {
        id: '3',
        name: 'Quần jeans ôm bó',
        category: 'bottoms',
        price: 790000,
        originalPrice: 1090000,
        image: 'https://images.unsplash.com/photo-1542272604-787c62d465d1?w=500&h=500&fit=crop',
        rating: 4.7,
        reviews: 189,
        sizes: ['XS', 'S', 'M', 'L', 'XL'],
        colors: ['Xanh đậm', 'Xanh nhạt', 'Đen'],
        description: 'Quần jeans cao cấp với kiểu dáng ôm bó, thoải mái khi mặc.'
    },
    {
        id: '4',
        name: 'Blazer dáng suông',
        category: 'tops',
        price: 1590000,
        originalPrice: 2290000,
        image: 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=500&h=500&fit=crop',
        rating: 4.9,
        reviews: 267,
        sizes: ['XS', 'S', 'M', 'L', 'XL'],
        colors: ['Đen', 'Trắng', 'Nâu'],
        description: 'Blazer dáng suông với thiết kế hiện đại, lý tưởng cho văn phòng hoặc sự kiện.'
    },
    {
        id: '5',
        name: 'Áo thun oversize trắng',
        category: 'tops',
        price: 390000,
        originalPrice: 590000,
        image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&h=500&fit=crop',
        rating: 4.6,
        reviews: 156,
        sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
        colors: ['Trắng', 'Đen', 'Xám'],
        description: 'Áo thun oversize thoải mái, phù hợp cho những ngày lười lao động.'
    },
    {
        id: '6',
        name: 'Quần shorts hot pants',
        category: 'bottoms',
        price: 490000,
        originalPrice: 790000,
        image: 'https://images.unsplash.com/photo-1506629082632-47f5ef8f1b0c?w=500&h=500&fit=crop',
        rating: 4.5,
        reviews: 112,
        sizes: ['XS', 'S', 'M', 'L'],
        colors: ['Hồng', 'Xanh', 'Đen'],
        description: 'Quần shorts hot pants thời trang, hoàn hảo cho mùa hè.'
    },
    {
        id: '7',
        name: 'Áo khoác denim cổ điển',
        category: 'outerwear',
        price: 890000,
        originalPrice: 1290000,
        image: 'https://images.unsplash.com/photo-1551028719-00167b16ebc5?w=500&h=500&fit=crop',
        rating: 4.8,
        reviews: 234,
        sizes: ['XS', 'S', 'M', 'L', 'XL'],
        colors: ['Xanh đậm', 'Xanh nhạt', 'Đen'],
        description: 'Áo khoác denim cổ điển, một chiếc áo cơ bản mà không bao giờ lỗi mốt.'
    },
    {
        id: '8',
        name: 'Chân váy midi xếp ly',
        category: 'bottoms',
        price: 690000,
        originalPrice: 990000,
        image: 'https://images.unsplash.com/photo-1612336307429-8a88e8d08dbb?w=500&h=500&fit=crop',
        rating: 4.7,
        reviews: 178,
        sizes: ['XS', 'S', 'M', 'L', 'XL'],
        colors: ['Trắng', 'Nâu', 'Xanh'],
        description: 'Chân váy midi với chi tiết xếp ly, tạo điểm nhấn sang trọng cho trang phục.'
    },
]

export const mockUsers: User[] = [
    {
        id: 'user1',
        name: 'Nguyễn Thị An',
        email: 'an@example.com',
        password: 'password123',
        phone: '0901234567',
        address: '123 Đường Lê Lợi, Quận 1, TP HCM'
    },
    {
        id: 'user2',
        name: 'Trần Văn Bình',
        email: 'binh@example.com',
        password: 'password456',
        phone: '0912345678',
        address: '456 Đường Nguyễn Huệ, Quận 1, TP HCM'
    },
]

export const mockOrders: Order[] = [
    {
        id: 'order1',
        userId: 'user1',
        items: [
            {
                productId: '1',
                name: 'Áo sơ mi linen sang trọng',
                price: 890000,
                quantity: 1,
                size: 'M',
                color: 'Trắng',
                image: 'https://images.unsplash.com/photo-1596216877369-f200520a406e?w=500&h=500&fit=crop'
            }
        ],
        total: 890000,
        status: 'delivered',
        createdAt: '2024-01-15',
        deliveryDate: '2024-01-20'
    },
    {
        id: 'order2',
        userId: 'user1',
        items: [
            {
                productId: '2',
                name: 'Váy maxi đen thanh lịch',
                price: 1290000,
                quantity: 1,
                size: 'S',
                color: 'Đen',
                image: 'https://images.unsplash.com/photo-1595777707802-221b3bed3a5b?w=500&h=500&fit=crop'
            },
            {
                productId: '5',
                name: 'Áo thun oversize trắng',
                price: 390000,
                quantity: 2,
                size: 'M',
                color: 'Trắng',
                image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&h=500&fit=crop'
            }
        ],
        total: 2070000,
        status: 'shipped',
        createdAt: '2024-02-01',
        deliveryDate: '2024-02-10'
    }
]

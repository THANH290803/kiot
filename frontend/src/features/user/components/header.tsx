'use client'

import { Heart, ShoppingCart, Menu, X, LogOut, User } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/features/user/lib/auth-context'
import { useCart } from '@/features/user/lib/cart-context'
import { usePathname, useRouter } from 'next/navigation'
import { api } from '@/lib/api'

interface Category {
    id: number
    name: string
}

export function Header() {
    const [isOpen, setIsOpen] = useState(false)
    const [categories, setCategories] = useState<Category[]>([])
    const { user, logout } = useAuth()
    const { items } = useCart()
    const router = useRouter()
    const pathname = usePathname()

    const cartCount = items.reduce((sum, item) => sum + item.quantity, 0)

    useEffect(() => {
        let isMounted = true

        const fetchCategories = async () => {
            try {
                const response = await api.get<Category[]>('/api/categories')
                if (!isMounted) return
                const sortedCategories = [...(response.data ?? [])].sort((a, b) => a.id - b.id)
                setCategories(sortedCategories.slice(0, 4))
            } catch {
                if (!isMounted) return
                setCategories([])
            }
        }

        fetchCategories()

        return () => {
            isMounted = false
        }
    }, [])

    useEffect(() => {
        setIsOpen(false)
    }, [pathname])

    const navLinks = useMemo(() => {
        const base = [{ label: 'Cửa hàng', href: '/user/shop' }]
        const dynamic = categories.map((category) => ({
            label: category.name,
            href: `/user/shop?category_id=${category.id}`,
        }))
        const about = [{ label: 'Giới thiệu', href: '/user/home#about' }]

        return [...base, ...dynamic, ...about]
    }, [categories])

    const handleLogout = () => {
        logout()
        router.push('/user/home')
    }

    return (
        <header className="sticky top-0 z-50 bg-white border-b border-border">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    {/* Logo */}
                    <Link href="/user/home" className="flex-shrink-0">
                        <h1 className="text-2xl font-bold text-primary font-serif">ELEGANCE</h1>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center space-x-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`transition-colors ${
                                    pathname === '/user/shop' && link.href === '/user/shop'
                                        ? 'text-primary font-medium'
                                        : 'text-foreground hover:text-accent'
                                }`}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </nav>

                    {/* Right Icons */}
                    <div className="flex items-center space-x-4">
                        <button className="p-2 hover:bg-secondary rounded-lg transition-colors">
                            <Heart className="w-5 h-5 text-foreground" />
                        </button>
                        <Link href="/user/cart" className="p-2 hover:bg-secondary rounded-lg transition-colors relative">
                            <ShoppingCart className="w-5 h-5 text-foreground" />
                            {cartCount > 0 && (
                                <span className="absolute top-1 right-1 w-4 h-4 bg-accent text-white text-xs rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
                            )}
                        </Link>

                        {user ? (
                            <div className="hidden md:flex items-center space-x-3">
                                <Link href="/user/profile" className="p-2 hover:bg-secondary rounded-lg transition-colors">
                                    <User className="w-5 h-5 text-foreground" />
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="p-2 hover:bg-secondary rounded-lg transition-colors"
                                    title="Đăng xuất"
                                >
                                    <LogOut className="w-5 h-5 text-foreground" />
                                </button>
                            </div>
                        ) : (
                            <div className="hidden md:flex items-center space-x-2">
                                <Link href="/user/login" className="px-4 py-2 text-foreground hover:bg-secondary rounded-lg transition-colors">
                                    Đăng nhập
                                </Link>
                                <Link href="/user/signup" className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
                                    Đăng ký
                                </Link>
                            </div>
                        )}

                        <button
                            className="md:hidden p-2 hover:bg-secondary rounded-lg transition-colors"
                            onClick={() => setIsOpen(!isOpen)}
                        >
                            {isOpen ? (
                                <X className="w-5 h-5" />
                            ) : (
                                <Menu className="w-5 h-5" />
                            )}
                        </button>
                    </div>
                </div>

                {/* Mobile Navigation */}
                {isOpen && (
                    <nav className="md:hidden pb-4 space-y-2">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`block px-4 py-2 rounded-lg transition-colors ${
                                    pathname === '/user/shop' && link.href === '/user/shop'
                                        ? 'bg-secondary text-primary font-medium'
                                        : 'text-foreground hover:bg-secondary'
                                }`}
                            >
                                {link.label}
                            </Link>
                        ))}
                        {user && (
                            <>
                                <Link href="/user/profile" className="block px-4 py-2 text-foreground hover:bg-secondary rounded-lg transition-colors">
                                    Tài khoản của tôi
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="w-full text-left px-4 py-2 text-foreground hover:bg-secondary rounded-lg transition-colors"
                                >
                                    Đăng xuất
                                </button>
                            </>
                        )}
                        {!user && (
                            <>
                                <Link href="/user/login" className="block px-4 py-2 text-foreground hover:bg-secondary rounded-lg transition-colors">
                                    Đăng nhập
                                </Link>
                                <Link href="/user/signup" className="block px-4 py-2 bg-primary text-primary-foreground rounded-lg transition-colors">
                                    Đăng ký
                                </Link>
                            </>
                        )}
                    </nav>
                )}
            </div>
        </header>
    )
}

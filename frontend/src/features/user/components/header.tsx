'use client'

import { ArrowUpRight, ChevronDown, Heart, Layers2, LogOut, Menu, ShoppingCart, User, X } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/features/user/lib/auth-context'
import { useCart } from '@/features/user/lib/cart-context'
import { usePathname, useRouter } from 'next/navigation'
import { api } from '@/lib/api'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface Category {
    id: number
    name: string
    parent_id?: number | null
    parent?: {
        id: number
        name: string
    } | null
}

interface CategoryNode extends Category {
    children: CategoryNode[]
}

function getCategoryTree(categories: Category[]): CategoryNode[] {
    const sortedCategories = [...categories].sort((a, b) => a.id - b.id)
    const nodeById = new Map<number, CategoryNode>(
        sortedCategories.map((category) => [category.id, { ...category, children: [] }]),
    )
    const syntheticRootById = new Map<number, CategoryNode>()
    const roots: CategoryNode[] = []

    sortedCategories.forEach((category) => {
        const node = nodeById.get(category.id)
        if (!node) return

        if (!category.parent_id) {
            roots.push(node)
            return
        }

        const parentNode = nodeById.get(category.parent_id)
        if (parentNode) {
            parentNode.children.push(node)
            return
        }

        const syntheticRoot =
            syntheticRootById.get(category.parent_id) ??
            {
                id: category.parent_id,
                name: category.parent?.name || 'Danh mục',
                parent_id: null,
                children: [],
            }

        syntheticRoot.children.push(node)
        syntheticRootById.set(category.parent_id, syntheticRoot)
    })

    return [...roots, ...Array.from(syntheticRootById.values())]
}

function countNestedCategories(category: CategoryNode): number {
    return category.children.reduce((total, child) => total + 1 + countNestedCategories(child), 0)
}

function CategoryNestedLinks({
    nodes,
    onNavigate,
    level = 0,
}: {
    nodes: CategoryNode[]
    onNavigate?: () => void
    level?: number
}) {
    if (nodes.length === 0) {
        return null
    }

    return (
        <div className={level === 0 ? 'mt-2 space-y-1 pl-3' : 'mt-1 space-y-1 pl-4'}>
            {nodes.map((node) => {
                const hasChildren = node.children.length > 0

                return (
                    <div key={node.id}>
                        <DropdownMenuItem asChild className="cursor-pointer rounded-lg p-0">
                            <Link
                                href={`/user/shop?category_id=${node.id}`}
                                onClick={onNavigate}
                                className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors ${
                                    level === 0
                                        ? 'text-foreground hover:text-primary'
                                        : 'text-muted-foreground hover:text-primary'
                                }`}
                            >
                                <span className="min-w-0 truncate">{node.name}</span>
                                {hasChildren ? <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" /> : <ArrowUpRight className="h-3.5 w-3.5" />}
                            </Link>
                        </DropdownMenuItem>
                        <CategoryNestedLinks nodes={node.children} onNavigate={onNavigate} level={level + 1} />
                    </div>
                )
            })}
        </div>
    )
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
                setCategories([...(response.data ?? [])].sort((a, b) => a.id - b.id))
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

    const categoryGroups = useMemo(() => getCategoryTree(categories), [categories])

    const handleLogout = () => {
        logout()
        router.push('/user/home')
    }

    return (
        <header className="sticky top-0 z-50 border-b border-border bg-white">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-20 items-center justify-between">
                    <Link href="/user/home" className="flex-shrink-0">
                        <h1 className="font-serif text-2xl font-bold text-primary">ELEGANCE</h1>
                    </Link>

                    <nav className="hidden items-center space-x-8 md:flex">
                        <Link
                            href="/user/shop"
                            className={`transition-colors ${
                                pathname === '/user/shop'
                                    ? 'font-medium text-primary'
                                    : 'text-foreground hover:text-accent'
                            }`}
                        >
                            Cửa hàng
                        </Link>

                        {categoryGroups.map((group) =>
                            group.children.length > 0 ? (
                                <DropdownMenu key={group.id}>
                                    <DropdownMenuTrigger asChild>
                                        <button className="group inline-flex h-10 items-center gap-2 px-3 text-sm font-semibold text-foreground transition-colors hover:text-primary">
                                            {group.name}
                                            <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform group-data-[state=open]:rotate-180" />
                                        </button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="start" className="w-[min(760px,calc(100vw-2rem))] border-0 p-0 shadow-xl">
                                        <div className="grid overflow-hidden rounded-xl md:grid-cols-[220px_1fr]">
                                            <div className="m-3 rounded-xl border border-border bg-secondary/60 p-4">
                                                <span className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                                    <Layers2 className="h-5 w-5" />
                                                </span>
                                                <p className="text-base font-bold text-foreground">{group.name}</p>
                                                <p className="mt-1 text-sm text-muted-foreground">
                                                    {countNestedCategories(group)} danh mục bên trong
                                                </p>
                                                <Link
                                                    href="/user/shop"
                                                    className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary/80"
                                                >
                                                    Xem cửa hàng
                                                    <ArrowUpRight className="h-4 w-4" />
                                                </Link>
                                            </div>

                                            <div className="grid max-h-[420px] gap-4 overflow-y-auto p-4 sm:grid-cols-2 lg:grid-cols-3">
                                                {group.children.map((child) => (
                                                    <div key={child.id} className="min-w-0 p-3">
                                                        <DropdownMenuItem asChild className="cursor-pointer rounded-lg p-0">
                                                            <Link
                                                                href={`/user/shop?category_id=${child.id}`}
                                                                className="flex items-center justify-between px-3 py-2 text-sm font-bold text-foreground hover:text-primary"
                                                            >
                                                                <span className="min-w-0 truncate">{child.name}</span>
                                                                {child.children.length > 0 ? <ChevronDown className="h-4 w-4 text-muted-foreground" /> : <ArrowUpRight className="h-4 w-4 text-muted-foreground" />}
                                                            </Link>
                                                        </DropdownMenuItem>
                                                        <CategoryNestedLinks nodes={child.children} />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            ) : (
                                <Link
                                    key={group.id}
                                    href={`/user/shop?category_id=${group.id}`}
                                    className="inline-flex h-10 items-center px-3 text-sm font-semibold text-foreground transition-colors hover:text-primary"
                                >
                                    {group.name}
                                </Link>
                            )
                        )}

                        <Link href="/user/home#about" className="text-foreground transition-colors hover:text-accent">
                            Giới thiệu
                        </Link>
                    </nav>

                    <div className="flex items-center space-x-4">
                        <button className="rounded-lg p-2 transition-colors hover:bg-secondary">
                            <Heart className="h-5 w-5 text-foreground" />
                        </button>
                        <Link href="/user/cart" className="relative rounded-lg p-2 transition-colors hover:bg-secondary">
                            <ShoppingCart className="h-5 w-5 text-foreground" />
                            {cartCount > 0 && (
                                <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-xs text-white">
                                    {cartCount}
                                </span>
                            )}
                        </Link>

                        {user ? (
                            <div className="hidden items-center space-x-3 md:flex">
                                <Link href="/user/profile" className="rounded-lg p-2 transition-colors hover:bg-secondary">
                                    <User className="h-5 w-5 text-foreground" />
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="rounded-lg p-2 transition-colors hover:bg-secondary"
                                    title="Đăng xuất"
                                >
                                    <LogOut className="h-5 w-5 text-foreground" />
                                </button>
                            </div>
                        ) : (
                            <div className="hidden items-center space-x-2 md:flex">
                                <Link href="/user/login" className="rounded-lg px-4 py-2 text-foreground transition-colors hover:bg-secondary">
                                    Đăng nhập
                                </Link>
                                <Link href="/user/signup" className="rounded-lg bg-primary px-4 py-2 text-primary-foreground transition-colors hover:bg-primary/90">
                                    Đăng ký
                                </Link>
                            </div>
                        )}

                        <button
                            className="rounded-lg p-2 transition-colors hover:bg-secondary md:hidden"
                            onClick={() => setIsOpen((current) => !current)}
                        >
                            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                        </button>
                    </div>
                </div>

                {isOpen && (
                    <nav className="space-y-2 pb-4 md:hidden">
                        <Link
                            href="/user/shop"
                            onClick={() => setIsOpen(false)}
                            className={`block rounded-lg px-4 py-2 transition-colors ${
                                pathname === '/user/shop'
                                    ? 'bg-secondary font-medium text-primary'
                                    : 'text-foreground hover:bg-secondary'
                            }`}
                        >
                            Cửa hàng
                        </Link>

                        {categoryGroups.map((group) =>
                            group.children.length > 0 ? (
                                <DropdownMenu key={group.id}>
                                    <DropdownMenuTrigger asChild>
                                        <button className="flex w-full items-center justify-between px-4 py-3 text-foreground transition-colors hover:text-primary">
                                            <span className="font-semibold">{group.name}</span>
                                            <ChevronDown className="h-4 w-4 text-muted-foreground" />
                                        </button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="start" className="max-h-[70vh] w-[calc(100vw-2rem)] overflow-y-auto border-0 p-2">
                                        <div className="px-3 py-2">
                                            <p className="text-sm font-bold text-foreground">{group.name}</p>
                                            <p className="text-xs text-muted-foreground">Chọn danh mục con hoặc cấp sâu hơn</p>
                                        </div>
                                        <CategoryNestedLinks nodes={group.children} onNavigate={() => setIsOpen(false)} />
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            ) : (
                                <Link
                                    key={group.id}
                                    href={`/user/shop?category_id=${group.id}`}
                                    onClick={() => setIsOpen(false)}
                                    className="block px-4 py-2 text-foreground transition-colors hover:text-primary"
                                >
                                    {group.name}
                                </Link>
                            )
                        )}

                        <Link
                            href="/user/home#about"
                            onClick={() => setIsOpen(false)}
                            className="block rounded-lg px-4 py-2 text-foreground transition-colors hover:bg-secondary"
                        >
                            Giới thiệu
                        </Link>
                        {user ? (
                            <>
                                <Link href="/user/profile" onClick={() => setIsOpen(false)} className="block rounded-lg px-4 py-2 text-foreground transition-colors hover:bg-secondary">
                                    Tài khoản của tôi
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="w-full rounded-lg px-4 py-2 text-left text-foreground transition-colors hover:bg-secondary"
                                >
                                    Đăng xuất
                                </button>
                            </>
                        ) : (
                            <>
                                <Link href="/user/login" onClick={() => setIsOpen(false)} className="block rounded-lg px-4 py-2 text-foreground transition-colors hover:bg-secondary">
                                    Đăng nhập
                                </Link>
                                <Link href="/user/signup" onClick={() => setIsOpen(false)} className="block rounded-lg bg-primary px-4 py-2 text-primary-foreground transition-colors">
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

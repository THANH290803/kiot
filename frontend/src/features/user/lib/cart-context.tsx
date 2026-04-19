'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { CartItem } from './mock-data'
import { api } from '@/lib/api'
import { useAuth } from './auth-context'

interface CartContextType {
    items: CartItem[]
    addItem: (item: CartItem) => void
    removeItem: (productId: string, size: string, color: string) => void
    updateQuantity: (productId: string, size: string, color: string, quantity: number) => void
    clearCart: () => void
    getTotalPrice: () => number
}

const CartContext = createContext<CartContextType | undefined>(undefined)
const SESSION_CART_KEY = 'session_cart'

interface ApiCartItem {
    id: number
    product_variant_id: number
    quantity: number
    unit_price?: number
    product?: {
        id?: number
        name?: string
    }
    variant?: {
        color?: { name?: string } | string
        size?: { name?: string } | string
        image?: string | null
    }
}

interface ApiCartResponse {
    items?: ApiCartItem[]
}

interface ApiVariant {
    id: number
    quantity?: number
    color?: { name?: string }
    size?: { name?: string }
}

interface ApiProductDetail {
    variants?: ApiVariant[]
}

const readSessionCart = () => {
    if (typeof window === 'undefined') {
        return [] as CartItem[]
    }

    const raw = sessionStorage.getItem(SESSION_CART_KEY)
    return raw ? (JSON.parse(raw) as CartItem[]) : []
}

const writeSessionCart = (items: CartItem[]) => {
    if (typeof window === 'undefined') {
        return
    }

    sessionStorage.setItem(SESSION_CART_KEY, JSON.stringify(items))
}

const clearSessionCart = () => {
    if (typeof window === 'undefined') {
        return
    }

    sessionStorage.removeItem(SESSION_CART_KEY)
}

const getOptionName = (option?: { name?: string } | string) => {
    if (!option) {
        return ''
    }

    return typeof option === 'string' ? option : option.name || ''
}

const normalizeApiCart = (response: ApiCartResponse): CartItem[] => {
    return (response.items || []).map((item) => ({
        productId: String(item.product?.id || item.product_variant_id || ''),
        productVariantId: item.product_variant_id,
        name: item.product?.name || '',
        price: Number(item.unit_price || 0),
        quantity: Number(item.quantity || 0),
        size: getOptionName(item.variant?.size),
        color: getOptionName(item.variant?.color),
        image: item.variant?.image || '',
    }))
}

export function CartProvider({ children }: { children: ReactNode }) {
    const { user } = useAuth()
    const userId = user?.id
    const [items, setItems] = useState<CartItem[]>(() => readSessionCart())

    useEffect(() => {
        if (user) {
            return
        }

        writeSessionCart(items)
    }, [items, user])

    const fetchApiCart = async () => {
        const response = await api.get<ApiCartResponse>('/api/cart')
        const normalizedItems = normalizeApiCart(response.data)
        setItems(normalizedItems)
        return response.data
    }

    const resolveVariantId = async (item: CartItem) => {
        const itemWithVariant = item as CartItem & { productVariantId?: number | string }
        if (itemWithVariant.productVariantId) {
            return Number(itemWithVariant.productVariantId)
        }

        if (!item.productId) {
            return null
        }

        const productDetail = await api.get<ApiProductDetail>(`/api/products/get-details-with-variants/${item.productId}`)
        const matchedVariant = (productDetail.data?.variants || []).find(
            (variant) => variant.size?.name === item.size && variant.color?.name === item.color,
        )

        if (matchedVariant?.id) {
            return matchedVariant.id
        }

        const fallbackVariant = (productDetail.data?.variants || []).find(
            (variant) => Number(variant.quantity || 0) > 0,
        )
        return fallbackVariant?.id || productDetail.data?.variants?.[0]?.id || null
    }

    const findApiItemIdByComposite = async (productId: string, size: string, color: string) => {
        const response = await api.get<ApiCartResponse>('/api/cart')
        const matched = (response.data.items || []).find(
            (item) =>
                String(item.product?.id || item.product_variant_id || '') === productId &&
                getOptionName(item.variant?.size) === size &&
                getOptionName(item.variant?.color) === color,
        )
        return matched?.id
    }

    const addItem = (newItem: CartItem) => {
        if (!user) {
            setItems((prevItems) => {
                const existingItem = prevItems.find(
                    (item) =>
                        item.productId === newItem.productId &&
                        item.size === newItem.size &&
                        item.color === newItem.color,
                )

                if (existingItem) {
                    return prevItems.map((item) =>
                        item === existingItem ? { ...item, quantity: item.quantity + newItem.quantity } : item,
                    )
                }

                return [...prevItems, newItem]
            })
            return
        }

        void (async () => {
            try {
                const variantId = await resolveVariantId(newItem)
                if (!variantId) {
                    return
                }

                await api.post('/api/cart/items', {
                    product_variant_id: variantId,
                    quantity: newItem.quantity,
                })
                await fetchApiCart()
            } catch (error) {
                console.error('addItem failed', error)
            }
        })()
    }

    const removeItem = (productId: string, size: string, color: string) => {
        if (!user) {
            setItems((prevItems) =>
                prevItems.filter((item) => !(item.productId === productId && item.size === size && item.color === color)),
            )
            return
        }

        void (async () => {
            try {
                const itemId = await findApiItemIdByComposite(productId, size, color)
                if (!itemId) {
                    return
                }

                await api.delete(`/api/cart/items/${itemId}`)
                await fetchApiCart()
            } catch (error) {
                console.error('removeItem failed', error)
            }
        })()
    }

    const updateQuantity = (productId: string, size: string, color: string, quantity: number) => {
        if (quantity <= 0) {
            removeItem(productId, size, color)
            return
        }

        if (!user) {
            setItems((prevItems) =>
                prevItems.map((item) =>
                    item.productId === productId && item.size === size && item.color === color
                        ? { ...item, quantity }
                        : item,
                ),
            )
            return
        }

        void (async () => {
            try {
                const itemId = await findApiItemIdByComposite(productId, size, color)
                if (!itemId) {
                    return
                }

                await api.patch(`/api/cart/items/${itemId}`, { quantity })
                await fetchApiCart()
            } catch (error) {
                console.error('updateQuantity failed', error)
            }
        })()
    }

    const clearCart = () => {
        if (!user) {
            setItems([])
            return
        }

        void (async () => {
            try {
                await api.delete('/api/cart/clear')
                await fetchApiCart()
            } catch (error) {
                console.error('clearCart failed', error)
            }
        })()
    }

    useEffect(() => {
        let mounted = true

        const syncCartSource = async () => {
            if (!userId) {
                if (mounted) {
                    setItems(readSessionCart())
                }
                return
            }

            const sessionItems = readSessionCart()
            if (sessionItems.length > 0) {
                for (const item of sessionItems) {
                    try {
                        const variantId = await resolveVariantId(item)
                        if (!variantId) {
                            continue
                        }

                        await api.post('/api/cart/items', {
                            product_variant_id: variantId,
                            quantity: item.quantity,
                        })
                    } catch (error) {
                        console.error('merge session cart failed', error)
                    }
                }
                clearSessionCart()
            }

            try {
                const response = await api.get<ApiCartResponse>('/api/cart')
                if (!mounted) {
                    return
                }
                setItems(normalizeApiCart(response.data))
            } catch (error) {
                console.error('fetch cart failed', error)
                if (mounted) {
                    setItems([])
                }
            }
        }

        void syncCartSource()

        return () => {
            mounted = false
        }
    }, [userId])

    const getTotalPrice = () => {
        return items.reduce((total, item) => total + item.price * item.quantity, 0)
    }

    return (
        <CartContext.Provider
            value={{ items, addItem, removeItem, updateQuantity, clearCart, getTotalPrice }}
        >
            {children}
        </CartContext.Provider>
    )
}

export function useCart() {
    const context = useContext(CartContext)
    if (context === undefined) {
        throw new Error('useCart must be used within CartProvider')
    }
    return context
}

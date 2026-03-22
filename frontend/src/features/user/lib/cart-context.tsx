'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { CartItem } from './mock-data'

interface CartContextType {
    items: CartItem[]
    addItem: (item: CartItem) => void
    removeItem: (productId: string, size: string, color: string) => void
    updateQuantity: (productId: string, size: string, color: string, quantity: number) => void
    clearCart: () => void
    getTotalPrice: () => number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
    const [items, setItems] = useState<CartItem[]>(() => {
        if (typeof window === 'undefined') {
            return []
        }

        const storedCart = localStorage.getItem('cart')
        return storedCart ? (JSON.parse(storedCart) as CartItem[]) : []
    })

    // Save cart to localStorage whenever items change
    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(items))
    }, [items])

    const addItem = (newItem: CartItem) => {
        setItems(prevItems => {
            const existingItem = prevItems.find(
                item =>
                    item.productId === newItem.productId &&
                    item.size === newItem.size &&
                    item.color === newItem.color
            )

            if (existingItem) {
                return prevItems.map(item =>
                    item === existingItem
                        ? { ...item, quantity: item.quantity + newItem.quantity }
                        : item
                )
            }

            return [...prevItems, newItem]
        })
    }

    const removeItem = (productId: string, size: string, color: string) => {
        setItems(prevItems =>
            prevItems.filter(
                item =>
                    !(item.productId === productId && item.size === size && item.color === color)
            )
        )
    }

    const updateQuantity = (productId: string, size: string, color: string, quantity: number) => {
        if (quantity <= 0) {
            removeItem(productId, size, color)
            return
        }

        setItems(prevItems =>
            prevItems.map(item =>
                item.productId === productId && item.size === size && item.color === color
                    ? { ...item, quantity }
                    : item
            )
        )
    }

    const clearCart = () => {
        setItems([])
    }

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

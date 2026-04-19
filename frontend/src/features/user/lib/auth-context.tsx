'use client'

import { createContext, useContext, useState, ReactNode } from 'react'
import { User } from './mock-data'
import { api } from '@/lib/api'

type AuthUser = Omit<User, 'password'>

interface AuthContextType {
    user: AuthUser | null
    isLoading: boolean
    login: (email: string, password: string) => Promise<void>
    signup: (name: string, email: string, password: string) => Promise<void>
    updateProfile: (payload: { name: string; email: string; phone?: string; address?: string }) => Promise<void>
    logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
    const [initialState] = useState(() => {
        if (typeof window === 'undefined') {
            return {
                user: null as AuthUser | null,
                isLoading: true,
            }
        }

        const storedUser = localStorage.getItem('currentUser')

        return {
            user: storedUser ? (JSON.parse(storedUser) as AuthUser) : null,
            isLoading: false,
        }
    })

    const [user, setUser] = useState<AuthUser | null>(initialState.user)
    const [isLoading, setIsLoading] = useState(initialState.isLoading)

    const login = async (email: string, password: string) => {
        try {
            const response = await api.post('/api/auth/customer-login', {
                email,
                password,
            })

            const loginUser = response.data?.user
            const token = response.data?.token

            const userWithoutPassword: AuthUser = {
                id: String(loginUser?.id ?? ''),
                name: loginUser?.name ?? '',
                email: loginUser?.email ?? email,
                phone: loginUser?.phone_number ?? '',
                address: loginUser?.address ?? '',
            }

            setUser(userWithoutPassword)
            localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword))
            if (token) {
                localStorage.setItem('token', token)
            }
            setIsLoading(false)
        } catch (error: unknown) {
            const err = error as { response?: { data?: { message?: string } } }
            throw new Error(err.response?.data?.message || 'Đăng nhập thất bại')
        }
    }

    const signup = async (name: string, email: string, password: string) => {
        try {
            const response = await api.post('/api/auth/register', {
                name,
                email,
                password,
            })

            const registeredUser = response.data?.user

            const userWithoutPassword: AuthUser = {
                id: String(registeredUser?.id ?? `user${Date.now()}`),
                name: registeredUser?.name ?? name,
                email: registeredUser?.email ?? email,
                phone: registeredUser?.phone_number ?? '',
                address: registeredUser?.address ?? '',
            }

            setUser(userWithoutPassword)
            localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword))
            setIsLoading(false)
        } catch (error: unknown) {
            const err = error as { response?: { data?: { message?: string } } }
            throw new Error(err.response?.data?.message || 'Đăng ký thất bại')
        }
    }

    const updateProfile = async (payload: { name: string; email: string; phone?: string; address?: string }) => {
        if (!user?.id) {
            throw new Error('Không tìm thấy tài khoản đăng nhập')
        }

        try {
            const response = await api.patch(`/api/customers/${user.id}`, {
                name: payload.name,
                email: payload.email,
                phone_number: payload.phone || null,
                address: payload.address || null,
            })

            const updated = response.data
            const nextUser: AuthUser = {
                id: String(updated?.id ?? user.id),
                name: updated?.name ?? payload.name,
                email: updated?.email ?? payload.email,
                phone: updated?.phone_number ?? payload.phone ?? '',
                address: updated?.address ?? payload.address ?? '',
            }

            setUser(nextUser)
            localStorage.setItem('currentUser', JSON.stringify(nextUser))
        } catch (error: unknown) {
            const err = error as { response?: { data?: { message?: string } } }
            throw new Error(err.response?.data?.message || 'Cập nhật hồ sơ thất bại')
        }
    }

    const logout = () => {
        setUser(null)
        localStorage.removeItem('currentUser')
        localStorage.removeItem('token')
    }

    return (
        <AuthContext.Provider value={{ user, isLoading, login, signup, updateProfile, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error('useAuth must be used within AuthProvider')
    }
    return context
}

'use client'

import { createContext, useContext, useState, ReactNode } from 'react'
import { User, mockUsers } from './mock-data'

type AuthUser = Omit<User, 'password'>

interface AuthContextType {
    user: AuthUser | null
    isLoading: boolean
    login: (email: string, password: string) => Promise<void>
    signup: (name: string, email: string, password: string) => Promise<void>
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
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500))

        const foundUser = mockUsers.find(
            u => u.email === email && u.password === password
        )

        if (!foundUser) {
            throw new Error('Email hoặc mật khẩu không chính xác')
        }

        const { password: foundUserPassword, ...userWithoutPassword } = foundUser
        void foundUserPassword
        setUser(userWithoutPassword)
        localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword))
        setIsLoading(false)
    }

    const signup = async (name: string, email: string, password: string) => {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500))

        const existingUser = mockUsers.find(u => u.email === email)
        if (existingUser) {
            throw new Error('Email đã được đăng ký')
        }

        const newUser: User = {
            id: `user${Date.now()}`,
            name,
            email,
            password,
        }

        mockUsers.push(newUser)
        const { password: createdPassword, ...userWithoutPassword } = newUser
        void createdPassword
        setUser(userWithoutPassword)
        localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword))
        setIsLoading(false)
    }

    const logout = () => {
        setUser(null)
        localStorage.removeItem('currentUser')
    }

    return (
        <AuthContext.Provider value={{ user, isLoading, login, signup, logout }}>
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

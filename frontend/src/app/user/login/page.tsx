'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/features/user/lib/auth-context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'

export default function LoginPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const { login } = useAuth()
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setIsLoading(true)

        try {
            await login(email, password)
            router.push('/user/profile')
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Đăng nhập thất bại')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-background flex items-center justify-center px-4 py-12">
            <Card className="w-full max-w-md">
                <div className="p-8">
                    <h1 className="text-3xl font-bold text-foreground mb-2 text-center">
                        Đăng Nhập
                    </h1>
                    <p className="text-muted-foreground text-center mb-8">
                        Chào mừng bạn quay lại ELEGANCE
                    </p>

                    {error && (
                        <div className="bg-destructive/10 border border-destructive/30 text-destructive px-4 py-3 rounded-lg mb-6">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                                Email
                            </label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="example@email.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full"
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-foreground mb-2">
                                Mật khẩu
                            </label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full"
                            />
                        </div>

                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                        >
                            {isLoading ? 'Đang đăng nhập...' : 'Đăng nhập'}
                        </Button>
                    </form>

                    <p className="text-center text-muted-foreground text-sm mt-6">
                        Chưa có tài khoản?{' '}
                        <Link href="/user/signup" className="text-primary hover:underline font-medium">
                            Đăng ký ngay
                        </Link>
                    </p>

                    <div className="mt-6 pt-6 border-t border-border">
                        <p className="text-center text-xs text-muted-foreground mb-3">
                            Tài khoản demo
                        </p>
                        <div className="bg-secondary/50 p-3 rounded-lg text-xs space-y-1">
                            <p><strong>Email:</strong> an@example.com</p>
                            <p><strong>Mật khẩu:</strong> password123</p>
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    )
}

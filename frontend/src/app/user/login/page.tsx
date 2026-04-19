'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { useLoginPage } from '@/features/user/hooks/use-login-page'

export default function LoginPage() {
    const { email, password, error, isLoading, setEmail, setPassword, handleSubmit } = useLoginPage()

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
                </div>
            </Card>
        </div>
    )
}

'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { useSignupPage } from '@/features/user/hooks/use-signup-page'

export default function SignupPage() {
    const {
        name,
        email,
        password,
        confirmPassword,
        error,
        isLoading,
        setName,
        setEmail,
        setPassword,
        setConfirmPassword,
        handleSubmit,
    } = useSignupPage()

    return (
        <div className="min-h-screen bg-background flex items-center justify-center px-4 py-12">
            <Card className="w-full max-w-md">
                <div className="p-8">
                    <h1 className="text-3xl font-bold text-foreground mb-2 text-center">
                        Đăng Ký
                    </h1>
                    <p className="text-muted-foreground text-center mb-8">
                        Tạo tài khoản mới tại ELEGANCE
                    </p>

                    {error && (
                        <div className="bg-destructive/10 border border-destructive/30 text-destructive px-4 py-3 rounded-lg mb-6">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                                Tên đầy đủ
                            </label>
                            <Input
                                id="name"
                                type="text"
                                placeholder="Nguyễn Văn A"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                className="w-full"
                            />
                        </div>

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

                        <div>
                            <label htmlFor="confirm-password" className="block text-sm font-medium text-foreground mb-2">
                                Xác nhận mật khẩu
                            </label>
                            <Input
                                id="confirm-password"
                                type="password"
                                placeholder="••••••••"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                className="w-full"
                            />
                        </div>

                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                        >
                            {isLoading ? 'Đang tạo tài khoản...' : 'Đăng ký'}
                        </Button>
                    </form>

                    <p className="text-center text-muted-foreground text-sm mt-6">
                        Đã có tài khoản?{' '}
                        <Link href="/user/login" className="text-primary hover:underline font-medium">
                            Đăng nhập
                        </Link>
                    </p>
                </div>
            </Card>
        </div>
    )
}

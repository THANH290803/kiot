"use client"

import Link from "next/link"
import {
  LogOut,
  Search,
  FolderOpen,
  Tag,
  Palette,
  User,
  ShieldCheck,
  Lock,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useAuth } from "@/app/auth-context"
import { usePathname, useRouter } from "next/navigation"
import { adminNavigation } from "@/features/admin/lib"
import { cn } from "@/lib/utils"

const categoryLinks = [
  { href: "/admin/categories", label: "Danh mục sản phẩm", icon: FolderOpen },
  { href: "/admin/brands", label: "Thương hiệu", icon: Tag },
  { href: "/admin/attributes", label: "Màu sắc & Kích cỡ", icon: Palette },
]

const permissionLinks = [
  { href: "/admin/roles", label: "Vai Trò", icon: ShieldCheck },
  { href: "/admin/permissions", label: "Quyền Hạn", icon: Lock },
  { href: "/admin/permission-groups", label: "Nhóm Quyền Hạn", icon: FolderOpen },
]

export function HeaderNav() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`)
  const isGroupActive = (links: { href: string }[]) => links.some((link) => isActive(link.href))

  const handleLogout = async () => {
    logout()
    router.push("/admin/login")
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-primary text-primary-foreground shadow-sm">
      <div className="w-full flex h-16 items-center justify-between px-3">
        <div className="flex items-center gap-4 min-w-0">
          <Link href="/admin/dashboard" className="flex items-center gap-1.5 font-bold text-lg flex-shrink-0">
            <div className="bg-white p-0.5 rounded text-primary text-sm">KV</div>
            <span className="hidden sm:inline">KiotV0</span>
          </Link>

          <nav className="hidden md:flex items-center gap-0.5 overflow-x-auto scrollbar-hide">
            {adminNavigation.map((item) => (
              <Button
                key={item.label}
                variant="ghost"
                asChild
                className={cn(
                  "text-white font-medium text-sm px-2 py-2 whitespace-nowrap flex-shrink-0 hover:bg-white/10",
                  isActive(item.href) && "bg-white/18 text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.2)]",
                )}
              >
                <Link href={item.href} className="flex items-center gap-1">
                  <item.icon className="h-4 w-4" />
                  <span className="hidden lg:inline">{item.label}</span>
                </Link>
              </Button>
            ))}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className={cn(
                    "text-white font-medium text-sm px-2 py-2 whitespace-nowrap flex-shrink-0 hover:bg-white/10",
                    isGroupActive(categoryLinks) && "bg-white/18 text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.2)]",
                  )}
                >
                  <FolderOpen className="h-4 w-4 mr-1" />
                  <span className="hidden lg:inline">Danh mục</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-48">
                {categoryLinks.map((link) => (
                  <DropdownMenuItem key={link.href} asChild className={cn(isActive(link.href) && "bg-accent text-accent-foreground")}>
                    <Link href={link.href} className="cursor-pointer">
                      <link.icon className="h-4 w-4 mr-2" />
                      {link.label}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className={cn(
                    "text-white font-medium text-sm px-2 py-2 whitespace-nowrap flex-shrink-0 hover:bg-white/10",
                    isGroupActive(permissionLinks) && "bg-white/18 text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.2)]",
                  )}
                >
                  <ShieldCheck className="h-4 w-4 mr-1" />
                  <span className="hidden lg:inline">Quyền & Vai Trò</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-48">
                {permissionLinks.map((link) => (
                  <DropdownMenuItem key={link.href} asChild className={cn(isActive(link.href) && "bg-accent text-accent-foreground")}>
                    <Link href={link.href} className="cursor-pointer">
                      <link.icon className="h-4 w-4 mr-2" />
                      {link.label}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>
        </div>

        <div className="flex items-center gap-2 ml-auto">
          <div className="relative hidden lg:block w-48">
            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-primary-foreground/60" />
            <Input
              type="search"
              placeholder="Tìm kiếm..."
              className="pl-7 pr-2 h-8 text-sm bg-white/10 border-white/20 text-white placeholder:text-white/60 focus-visible:ring-white"
            />
          </div>

          <div className="flex items-center gap-2 border-l border-white/20 pl-2">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-medium leading-none">{user?.name ?? user?.username ?? "User"}</p>
              <p className="text-xs text-primary-foreground/70">{user?.role?.name ?? "Administrator"}</p>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="h-7 w-7 border border-white/20 cursor-pointer hover:opacity-80 transition-opacity flex-shrink-0">
                  <AvatarImage src="/user-avatar.jpg" alt="User" />
                  <AvatarFallback>{(user?.name ?? user?.username ?? "U").charAt(0)}</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem asChild>
                  <Link href="/admin/profile" className="cursor-pointer">
                    <User className="h-4 w-4 mr-2" /> Hồ sơ cá nhân
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="text-destructive focus:text-destructive">
                  <LogOut className="h-4 w-4 mr-2" /> Đăng xuất
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  )
}

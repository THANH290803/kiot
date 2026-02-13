"use client"

import Link from "next/link"
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Users,
  ClipboardList,
  Settings,
  LogOut,
  Search,
  PieChart,
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
import { useRouter } from "next/navigation"

const navItems = [
  { label: "Tổng quan", icon: LayoutDashboard, href: "/" },
  { label: "Bán hàng (POS)", icon: ShoppingCart, href: "/pos" },
  { label: "Hàng hóa", icon: Package, href: "/products" },
  { label: "Giao dịch", icon: ClipboardList, href: "/orders" },
  { label: "Đối tác", icon: Users, href: "/customers" },
  { label: "Nhân viên & Quyền", icon: ShieldCheck, href: "/employees" }, // renamed and updated link to employees
  { label: "Báo cáo", icon: PieChart, href: "/reports" },
  { label: "Thiết lập", icon: Settings, href: "/settings" },
]

export function HeaderNav() {
  const { user, logout } = useAuth()
  const router = useRouter()

  const handleLogout = async () => {
    logout()
    router.push("/login")
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-primary text-primary-foreground shadow-sm">
      <div className="w-full flex h-16 items-center justify-between px-3">
        <div className="flex items-center gap-4 min-w-0">
          <Link href="/" className="flex items-center gap-1.5 font-bold text-lg flex-shrink-0">
            <div className="bg-white p-0.5 rounded text-primary text-sm">KV</div>
            <span className="hidden sm:inline">KiotV0</span>
          </Link>

          <nav className="hidden md:flex items-center gap-0.5 overflow-x-auto scrollbar-hide">
            {navItems.map((item) => (
              <Button key={item.label} variant="ghost" asChild className="hover:bg-white/10 text-white font-medium text-sm px-2 py-2 whitespace-nowrap flex-shrink-0">
                <Link href={item.href} className="flex items-center gap-1">
                  <item.icon className="h-4 w-4" />
                  <span className="hidden lg:inline">{item.label}</span>
                </Link>
              </Button>
            ))}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="hover:bg-white/10 text-white font-medium text-sm px-2 py-2 whitespace-nowrap flex-shrink-0">
                  <FolderOpen className="h-4 w-4 mr-1" />
                  <span className="hidden lg:inline">Danh mục</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-48">
                <DropdownMenuItem asChild>
                  <Link href="/categories" className="cursor-pointer">
                    <FolderOpen className="h-4 w-4 mr-2" />
                    Danh mục sản phẩm
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/brands" className="cursor-pointer">
                    <Tag className="h-4 w-4 mr-2" />
                    Thương hiệu
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/attributes" className="cursor-pointer">
                    <Palette className="h-4 w-4 mr-2" />
                    Màu sắc & Kích cỡ
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="hover:bg-white/10 text-white font-medium text-sm px-2 py-2 whitespace-nowrap flex-shrink-0">
                  <ShieldCheck className="h-4 w-4 mr-1" />
                  <span className="hidden lg:inline">Quyền & Vai Trò</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-48">
                <DropdownMenuItem asChild>
                  <Link href="/roles" className="cursor-pointer">
                    <ShieldCheck className="h-4 w-4 mr-2" />
                    Vai Trò
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/permissions" className="cursor-pointer">
                    <Lock className="h-4 w-4 mr-2" />
                    Quyền Hạn
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/permission-groups" className="cursor-pointer">
                    <FolderOpen className="h-4 w-4 mr-2" />
                    Nhóm Quyền Hạn
                  </Link>
                </DropdownMenuItem>
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
              <p className="text-xs font-medium leading-none">{user?.name}</p>
              <p className="text-xs text-primary-foreground/70">{user?.role?.name}</p>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="h-7 w-7 border border-white/20 cursor-pointer hover:opacity-80 transition-opacity flex-shrink-0">
                  <AvatarImage src="/user-avatar.jpg" alt="User" />
                  <AvatarFallback>{user?.name?.charAt(0) || "U"}</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="cursor-pointer">
                    <User className="h-4 w-4 mr-2" /> Hồ sơ cá nhân
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="text-destructive focus:text-destructive">
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


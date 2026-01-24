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
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

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
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-primary text-primary-foreground shadow-sm">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl">
            <div className="bg-white p-1 rounded text-primary">KV</div>
            <span>KiotV0</span>
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <Button key={item.label} variant="ghost" asChild className="hover:bg-white/10 text-white font-medium">
                <Link href={item.href} className="flex items-center gap-2">
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              </Button>
            ))}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="hover:bg-white/10 text-white font-medium">
                  <FolderOpen className="h-4 w-4 mr-2" />
                  Danh mục
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
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative hidden xl:block w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-primary-foreground/60" />
            <Input
              type="search"
              placeholder="Tìm kiếm mặt hàng..."
              className="pl-8 bg-white/10 border-white/20 text-white placeholder:text-white/60 focus-visible:ring-white"
            />
          </div>

          <div className="flex items-center gap-3 border-l border-white/20 pl-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium leading-none">Nguyễn Văn A</p>
              <p className="text-xs text-primary-foreground/70">Admin</p>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="h-8 w-8 border border-white/20 cursor-pointer hover:opacity-80 transition-opacity">
                  <AvatarImage src="/user-avatar.jpg" alt="User" />
                  <AvatarFallback>AD</AvatarFallback>
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

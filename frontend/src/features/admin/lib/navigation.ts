import { ClipboardList, LayoutDashboard, Package, PieChart, Settings, ShieldCheck, ShoppingCart, Users } from "lucide-react"

export const adminNavigation = [
  { label: "Tổng quan", href: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Bán hàng (POS)", href: "/admin/pos", icon: ShoppingCart },
  { label: "Hàng hóa", href: "/admin/products", icon: Package },
  { label: "Giao dịch", href: "/admin/orders", icon: ClipboardList },
  { label: "Đối tác", href: "/admin/customers", icon: Users },
  { label: "Nhân viên & Quyền", href: "/admin/employees", icon: ShieldCheck },
  { label: "Báo cáo", href: "/admin/reports", icon: PieChart },
  { label: "Thiết lập", href: "/admin/settings", icon: Settings },
] as const

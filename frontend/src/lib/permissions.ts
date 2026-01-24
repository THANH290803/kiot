export type UserRole = "admin" | "manager" | "sales" | "warehouse"

export interface Permission {
  id: string
  label: string
  description: string
  category: "products" | "orders" | "employees" | "reports" | "settings"
}

export interface RolePermissions {
  role: UserRole
  permissions: Permission[]
}

export const ALL_PERMISSIONS: Permission[] = [
  // Products Management
  { id: "products.view", label: "Xem sản phẩm", description: "Xem danh sách sản phẩm", category: "products" },
  { id: "products.create", label: "Thêm sản phẩm", description: "Tạo sản phẩm mới", category: "products" },
  { id: "products.edit", label: "Sửa sản phẩm", description: "Chỉnh sửa thông tin sản phẩm", category: "products" },
  { id: "products.delete", label: "Xóa sản phẩm", description: "Xóa sản phẩm khỏi hệ thống", category: "products" },
  {
    id: "products.manage_variants",
    label: "Quản lý biến thể",
    description: "Tạo/sửa/xóa biến thể sản phẩm",
    category: "products",
  },

  // Orders Management
  { id: "orders.view", label: "Xem hoá đơn", description: "Xem danh sách hoá đơn", category: "orders" },
  { id: "orders.create", label: "Tạo hoá đơn", description: "Tạo hoá đơn mới", category: "orders" },
  { id: "orders.edit", label: "Sửa hoá đơn", description: "Chỉnh sửa hoá đơn", category: "orders" },
  { id: "orders.delete", label: "Xóa hoá đơn", description: "Xóa hoá đơn", category: "orders" },

  // Employees Management
  { id: "employees.view", label: "Xem nhân viên", description: "Xem danh sách nhân viên", category: "employees" },
  { id: "employees.create", label: "Thêm nhân viên", description: "Tạo nhân viên mới", category: "employees" },
  { id: "employees.edit", label: "Sửa nhân viên", description: "Chỉnh sửa thông tin nhân viên", category: "employees" },
  { id: "employees.delete", label: "Xóa nhân viên", description: "Xóa nhân viên", category: "employees" },
  {
    id: "employees.manage_roles",
    label: "Quản lý vai trò",
    description: "Gán/thay đổi vai trò nhân viên",
    category: "employees",
  },

  // Reports
  { id: "reports.view", label: "Xem báo cáo", description: "Xem các báo cáo", category: "reports" },
  { id: "reports.export", label: "Xuất báo cáo", description: "Xuất báo cáo ra file", category: "reports" },

  // Settings
  { id: "settings.view", label: "Xem cấu hình", description: "Xem cấu hình hệ thống", category: "settings" },
  { id: "settings.edit", label: "Sửa cấu hình", description: "Chỉnh sửa cấu hình hệ thống", category: "settings" },
]

export const ROLE_PERMISSIONS: RolePermissions[] = [
  {
    role: "admin",
    permissions: ALL_PERMISSIONS,
  },
  {
    role: "manager",
    permissions: ALL_PERMISSIONS.filter(
      (p) => p.id !== "employees.manage_roles" && p.id !== "settings.edit" && p.id !== "settings.view",
    ),
  },
  {
    role: "sales",
    permissions: ALL_PERMISSIONS.filter(
      (p) => p.category === "orders" || p.id === "products.view" || p.id === "reports.view",
    ),
  },
  {
    role: "warehouse",
    permissions: ALL_PERMISSIONS.filter(
      (p) =>
        p.id === "products.view" ||
        p.id === "products.manage_variants" ||
        p.id === "orders.view" ||
        p.id === "reports.view",
    ),
  },
]

export const hasPermission = (role: UserRole, permissionId: string): boolean => {
  const rolePerms = ROLE_PERMISSIONS.find((rp) => rp.role === role)
  if (!rolePerms) return false
  return rolePerms.permissions.some((p) => p.id === permissionId)
}

export const getRolePermissions = (role: UserRole): Permission[] => {
  const rolePerms = ROLE_PERMISSIONS.find((rp) => rp.role === role)
  return rolePerms ? rolePerms.permissions : []
}

export const getPermissionsByCategory = (role: UserRole, category: string): Permission[] => {
  return getRolePermissions(role).filter((p) => p.category === category)
}

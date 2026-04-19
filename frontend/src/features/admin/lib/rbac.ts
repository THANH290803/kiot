export type PermissionRequirement = string | string[]

export interface AdminRouteRule {
  pattern: RegExp
  permissions: string[]
}

interface AdminRouteEntry {
  path: string
  permissions: string[]
}

const ADMIN_ROUTE_RULES: AdminRouteRule[] = [
  { pattern: /^\/admin\/dashboard(\/|$)/, permissions: ["dashboard.view"] },
  { pattern: /^\/admin\/pos(\/|$)/, permissions: ["access_pos", "orders.create", "orders.view", "sales.pos"] },
  { pattern: /^\/admin\/products(\/|$)/, permissions: ["products.view"] },
  { pattern: /^\/admin\/orders(\/|$)/, permissions: ["orders.view"] },
  { pattern: /^\/admin\/customers(\/|$)/, permissions: ["customers.view"] },
  { pattern: /^\/admin\/employees(\/|$)/, permissions: ["employees.view"] },
  { pattern: /^\/admin\/roles(\/|$)/, permissions: ["roles.view", "permissions.view"] },
  { pattern: /^\/admin\/permissions(\/|$)/, permissions: ["permissions.view"] },
  { pattern: /^\/admin\/permission-groups(\/|$)/, permissions: ["permission_groups.manage", "permissions.view"] },
  { pattern: /^\/admin\/reports(\/|$)/, permissions: ["reports.view"] },
  { pattern: /^\/admin\/settings(\/|$)/, permissions: ["settings.view"] },
  { pattern: /^\/admin\/categories(\/|$)/, permissions: ["categories.manage", "products.view"] },
  { pattern: /^\/admin\/brands(\/|$)/, permissions: ["brands.manage", "products.view"] },
  { pattern: /^\/admin\/attributes(\/|$)/, permissions: ["variants.view", "colors.manage", "sizes.manage"] },
]

const ADMIN_ROUTE_PRIORITY: AdminRouteEntry[] = [
  { path: "/admin/dashboard", permissions: ["dashboard.view"] },
  { path: "/admin/orders", permissions: ["orders.view"] },
  { path: "/admin/pos", permissions: ["access_pos", "orders.create", "orders.view", "sales.pos"] },
  { path: "/admin/products", permissions: ["products.view"] },
  { path: "/admin/customers", permissions: ["customers.view"] },
  { path: "/admin/employees", permissions: ["employees.view"] },
  { path: "/admin/roles", permissions: ["roles.view", "permissions.view"] },
  { path: "/admin/permissions", permissions: ["permissions.view"] },
  { path: "/admin/permission-groups", permissions: ["permission_groups.manage", "permissions.view"] },
  { path: "/admin/reports", permissions: ["reports.view"] },
  { path: "/admin/settings", permissions: ["settings.view"] },
  { path: "/admin/categories", permissions: ["categories.manage", "products.view"] },
  { path: "/admin/brands", permissions: ["brands.manage", "products.view"] },
  { path: "/admin/attributes", permissions: ["variants.view", "colors.manage", "sizes.manage"] },
]

const PERMISSION_ALIASES: Record<string, string[]> = {
  "products.update": ["products.edit"],
  "orders.update": ["orders.edit"],
  "employees.update": ["employees.edit"],
  "roles.update": ["roles.edit"],
  "permissions.update": ["permissions.edit"],
  "settings.update": ["settings.edit"],
  "orders.update_status": ["orders.manage_status"],
  "sales.pos": ["access_pos"],
  "access_pos": ["sales.pos"],
}

function normalizePermissionCode(code: string) {
  return code.trim().toLowerCase().replace(/\s+/g, "_")
}

export function expandPermissionCodes(code: string): string[] {
  const normalized = normalizePermissionCode(code)
  const aliases = PERMISSION_ALIASES[normalized] || []
  return [normalized, ...aliases.map(normalizePermissionCode)]
}

export function checkHasAnyPermission(
  grantedPermissions: Set<string>,
  required: PermissionRequirement,
) {
  const requiredList = Array.isArray(required) ? required : [required]

  for (const permission of requiredList) {
    const expanded = expandPermissionCodes(permission)
    if (expanded.some((candidate) => grantedPermissions.has(candidate))) {
      return true
    }
  }

  return false
}

export function resolveAdminRoutePermissions(pathname: string): string[] {
  const normalizedPath = pathname.split("?")[0].split("#")[0]

  for (const rule of ADMIN_ROUTE_RULES) {
    if (rule.pattern.test(normalizedPath)) {
      return rule.permissions
    }
  }

  return []
}

export function normalizePermissionSet(codes: string[]) {
  return new Set(codes.map(normalizePermissionCode))
}

export function resolveFirstAccessibleAdminPath(
  hasPermission: (required: PermissionRequirement) => boolean,
) {
  for (const route of ADMIN_ROUTE_PRIORITY) {
    if (hasPermission(route.permissions)) {
      return route.path
    }
  }

  return null
}

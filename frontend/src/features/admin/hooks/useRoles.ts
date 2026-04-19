// hooks/useRoles.ts
import { useEffect, useState, useCallback } from "react"
import api from "@/lib/api"
import { useAdminPermissions } from "@/features/admin/providers/admin-permission-provider"

export interface Role {
  id: number
  code: string
  name: string
  description?: string
  permissions?: number[]
  permission_count?: number
}

export interface RolePermission {
  id: number
  code: string
  name: string
  description?: string
  group_id: number
}


export function useRoles() {
  const { hasPermission } = useAdminPermissions()
  const [roles, setRoles] = useState<Role[]>([])
  const [loading, setLoading] = useState(false)

  const [page, setPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  /* ================= FETCH ================= */
  const fetchRoles = useCallback(async () => {
    try {
      setLoading(true)
      const res = await api.get("/api/roles")
      setRoles(
        res.data.map((r: Role) => ({
          ...r,
          permissionCount: r.permissions?.length || 0,
        }))
      )
    } catch (err) {
      console.error("Fetch roles error:", err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchRoles()
  }, [fetchRoles])

  /* ================= PAGINATION ================= */
  const totalPages = Math.ceil(roles.length / rowsPerPage)
  const startIndex = (page - 1) * rowsPerPage
  const paginatedRoles = roles.slice(startIndex, startIndex + rowsPerPage)

  /* ================= CRUD ================= */
  const createRole = async (payload: {
    name: string
    description?: string
  }) => {
    if (!hasPermission(["roles.create"])) {
      if (typeof window !== "undefined") {
        window.alert("Bạn không có quyền tạo vai trò.")
      }
      return
    }
    await api.post("/api/roles", payload)
    fetchRoles()
  }

  const updateRole = async (
    id: number,
    payload: { name: string; description?: string }
  ) => {
    if (!hasPermission(["roles.update", "roles.edit"])) {
      if (typeof window !== "undefined") {
        window.alert("Bạn không có quyền cập nhật vai trò.")
      }
      return
    }
    await api.patch(`/api/roles/${id}`, payload)
    fetchRoles()
  }

  const deleteRole = async (id: number) => {
    if (!hasPermission(["roles.delete"])) {
      if (typeof window !== "undefined") {
        window.alert("Bạn không có quyền xóa vai trò.")
      }
      return
    }
    await api.delete(`/api/roles/${id}`)
    fetchRoles()
  }

  const getRolePermissions = async (roleId: number): Promise<number[]> => {
    const res = await api.get<RolePermission[]>(
      `/api/roles/${roleId}/permissions`
    )

    return res.data.map(p => p.id)
  }

  const updateRolePermissions = async (
    roleId: number,
    payload: { permission_ids: number[] }
  ) => {
    if (!hasPermission(["roles.assign_permissions", "permission_groups.manage"])) {
      if (typeof window !== "undefined") {
        window.alert("Bạn không có quyền gán quyền cho vai trò.")
      }
      return
    }
    await api.patch(`/api/roles/${roleId}/permissions`, payload)
    await fetchRoles()
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("admin-permissions:refresh"))
    }
  }

  return {
    roles,
    paginatedRoles,
    loading,

    page,
    setPage,
    rowsPerPage,
    setRowsPerPage,
    totalPages,

    createRole,
    updateRole,
    deleteRole,
    updateRolePermissions,
    getRolePermissions,
    refetch: fetchRoles,
  }
}

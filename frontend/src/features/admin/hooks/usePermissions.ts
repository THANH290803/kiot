// hooks/usePermissions.ts
import { useEffect, useState, useCallback } from "react"
import api from "@/lib/api"
import { useAdminPermissions } from "@/features/admin/providers/admin-permission-provider"

/* ================= TYPES ================= */
export interface Permission {
    id: number
    code: string
    name: string
    description?: string
    group_id: number
    group?: {
        id: number
        name: string
    }
    roles?: string[]   // 👈 THÊM DÒNG NÀY (API trả về)
}


interface CreatePermissionPayload {
    name: string
    code: string
    description?: string
    group_id: number
}


interface UpdatePermissionPayload {
    code: string
    name: string
    description?: string
    group_id: number
}

export function usePermissions() {
    const { hasPermission } = useAdminPermissions()
    /* ================= STATE ================= */
    const [permissions, setPermissions] = useState<Permission[]>([])
    const [loading, setLoading] = useState(false)

    const [page, setPage] = useState(1)
    const [rowsPerPage, setRowsPerPage] = useState(10)

    const [selectedIds, setSelectedIds] = useState<number[]>([])

    /* ================= FETCH ================= */
    const fetchPermissions = useCallback(async () => {
        try {
            setLoading(true)
            const res = await api.get("/api/permissions")
            setPermissions(res.data)
        } catch (error) {
            console.error("Fetch permissions error:", error)
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchPermissions()
    }, [fetchPermissions])

    /* ================= PAGINATION ================= */
    const totalPages = Math.ceil(permissions.length / rowsPerPage)

    const startIndex = (page - 1) * rowsPerPage
    const paginatedPermissions = permissions.slice(
        startIndex,
        startIndex + rowsPerPage
    )

    /* ================= SELECTION ================= */
    const toggleSelect = (id: number) => {
        setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        )
    }

    const toggleSelectAll = () => {
        if (selectedIds.length === paginatedPermissions.length) {
            setSelectedIds([])
        } else {
            setSelectedIds(paginatedPermissions.map(p => p.id))
        }
    }

    const clearSelection = () => setSelectedIds([])

    /* ================= CRUD ================= */
    const createPermission = async (payload: CreatePermissionPayload) => {
        if (!hasPermission(["permissions.create"])) {
            if (typeof window !== "undefined") {
                window.alert("Bạn không có quyền thêm quyền hạn.")
            }
            return
        }
        await api.post("/api/permissions", payload)
        await fetchPermissions()
    }

    const updatePermission = async (
        id: number,
        payload: UpdatePermissionPayload
    ) => {
        if (!hasPermission(["permissions.update", "permissions.edit"])) {
            if (typeof window !== "undefined") {
                window.alert("Bạn không có quyền cập nhật quyền hạn.")
            }
            return
        }
        await api.patch(`/api/permissions/${id}`, payload)
        await fetchPermissions()
    }

    const deletePermission = async (id: number) => {
        if (!hasPermission(["permissions.delete"])) {
            if (typeof window !== "undefined") {
                window.alert("Bạn không có quyền xóa quyền hạn.")
            }
            return
        }
        await api.delete(`/api/permissions/${id}`)
        setSelectedIds(prev => prev.filter(i => i !== id))
        await fetchPermissions()
    }

    /* ================= BULK UPDATE GROUP ================= */
    const assignGroupToSelected = async (group_id: number) => {
        if (!hasPermission(["permission_groups.manage", "permissions.update", "permissions.edit"])) {
            if (typeof window !== "undefined") {
                window.alert("Bạn không có quyền gán nhóm quyền.")
            }
            return
        }
        await Promise.all(
            selectedIds.map(id =>
                api.patch(`/api/permissions/${id}`, { group_id })
            )
        )
        clearSelection()
        await fetchPermissions()
    }

    return {
        /* data */
        permissions,
        paginatedPermissions,
        loading,

        /* pagination */
        page,
        setPage,
        rowsPerPage,
        setRowsPerPage,
        totalPages,

        /* selection */
        selectedIds,
        toggleSelect,
        toggleSelectAll,
        clearSelection,

        /* actions */
        createPermission,
        updatePermission,
        deletePermission,
        assignGroupToSelected,

        refetch: fetchPermissions,
    }
}

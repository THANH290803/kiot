// hooks/usePermissionGroups.ts
import { useEffect, useState, useCallback } from "react"
import api from "@/lib/api"

export interface PermissionGroup {
    id: number
    name: string
    description?: string
    permission_count?: number
}

export function usePermissionGroups() {
    /* ================= STATE ================= */
    const [groups, setGroups] = useState<PermissionGroup[]>([])
    const [loading, setLoading] = useState(false)

    // dialog state
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
    const [editingGroup, setEditingGroup] =
        useState<PermissionGroup | null>(null)

    // pagination
    const [page, setPage] = useState(1)
    const [rowsPerPage, setRowsPerPage] = useState(10)

    /* ================= FETCH ================= */
    const fetchGroups = useCallback(async () => {
        try {
            setLoading(true)
            const res = await api.get("/api/permission-groups")

            // hỗ trợ cả 2 kiểu response
            const data = res.data.data ?? res.data

            setGroups(data || [])
        } catch (err) {
            console.error("Fetch permission groups error:", err)
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchGroups()
    }, [fetchGroups])

    /* ================= PAGINATION ================= */
    const totalPages = Math.ceil(groups.length / rowsPerPage)
    const startIndex = (page - 1) * rowsPerPage
    const paginatedGroups = groups.slice(
        startIndex,
        startIndex + rowsPerPage
    )

    /* ================= CRUD ================= */
    const createGroup = async (payload: {
        name: string
        description?: string
    }) => {
        await api.post("/api/permission-groups", payload)
        await fetchGroups()
        setIsAddDialogOpen(false)
    }

    const updateGroup = async (
        id: number,
        payload: { name: string; description?: string }
    ) => {
        await api.patch(`/api/permission-groups/${id}`, payload)
        await fetchGroups()
        setIsEditDialogOpen(false)
        setEditingGroup(null)
    }

    const deleteGroup = async (id: number) => {
        await api.delete(`/api/permission-groups/${id}`)
        await fetchGroups()
        setIsDeleteDialogOpen(false)
        setEditingGroup(null)
    }

    /* ================= OPEN HELPERS ================= */
    const openAddDialog = () => {
        setIsAddDialogOpen(true)
    }

    const openEditDialog = (group: PermissionGroup) => {
        setEditingGroup(group)
        setIsEditDialogOpen(true)
    }

    const openDeleteDialog = (group: PermissionGroup) => {
        setEditingGroup(group)
        setIsDeleteDialogOpen(true)
    }

    return {
        /* data */
        groups,
        paginatedGroups,
        loading,

        /* pagination */
        page,
        setPage,
        rowsPerPage,
        setRowsPerPage,
        totalPages,

        /* dialog state */
        isAddDialogOpen,
        setIsAddDialogOpen,
        isEditDialogOpen,
        setIsEditDialogOpen,
        isDeleteDialogOpen,
        setIsDeleteDialogOpen,
        editingGroup,

        /* actions */
        openAddDialog,
        openEditDialog,
        openDeleteDialog,

        createGroup,
        updateGroup,
        deleteGroup,

        refetch: fetchGroups,
    }
}

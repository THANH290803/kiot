"use client"

import { useEffect, useState } from "react"
import api from "@/lib/api"
import { usePermissions } from "@/hooks/usePermissions"
import { usePermissionGroups } from "@/hooks/usePermissionGroups"
import { useRoles } from "@/hooks/useRoles"

/* ================== TYPES ================== */
export type EmployeeStatus = 1 | 2

export type Role = {
    id: number
    name: string
}

export type Employee = {
    id: number
    code: string
    username: string
    name: string
    email: string
    phone: string
    address: string
    role: Role
    status: EmployeeStatus
    joinDate: string
}

/* ================== UTILS ================== */
const normalizeRoleName = (name?: string) =>
    name
        ?.toLowerCase()
        .replace(/[_-]/g, " ")
        .replace(/\s+/g, " ")
        .trim()

/* ================== HOOK ================== */
export function useEmployees() {
    /* ===== HOOK KHÁC ===== */
    const { permissions } = usePermissions()
    const { groups } = usePermissionGroups()
    const { roles, updateRolePermissions, getRolePermissions } = useRoles()

    /* ===== STATE ===== */
    const [employees, setEmployees] = useState<Employee[]>([])

    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
    const [isPermissionsDialogOpen, setIsPermissionsDialogOpen] = useState(false)

    const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null)
    const [deletingEmployeeId, setDeletingEmployeeId] = useState<number | null>(null)

    const [selectedRoleForPermissions, setSelectedRoleForPermissions] =
        useState<number | null>(null)

    const [openStatusPopoverId, setOpenStatusPopoverId] =
        useState<number | null>(null)
    const [tempStatus, setTempStatus] = useState<EmployeeStatus>(1)
    const [statusChangeId, setStatusChangeId] = useState<number | null>(null)

    const [selectedPermissions, setSelectedPermissions] = useState<number[]>([])
    const [filterRole, setFilterRole] = useState("all")
    const [search, setSearch] = useState("")
    const [statusFilter, setStatusFilter] = useState("all")

    const [page, setPage] = useState(1)
    const [limit, setLimit] = useState(10)
    const [totalPages, setTotalPages] = useState(1)
    const [total, setTotal] = useState(0)

    const [exporting, setExporting] = useState(false)

    const [formData, setFormData] = useState({
        username: "",
        name: "",
        email: "",
        phone_number: "",
        address: "",
        password: "",
        role_id: "1",
        status: "1",
    })

    const [alert, setAlert] = useState<{
        type: "success" | "error"
        message: string
    } | null>(null)

    /* ================== ALERT AUTO HIDE ================== */
    useEffect(() => {
        if (!alert) return
        const t = setTimeout(() => setAlert(null), 5000)
        return () => clearTimeout(t)
    }, [alert])

    /* ================== FETCH USERS ================== */
    const fetchUsers = async () => {
        const params: any = { page, limit }

        if (search.trim()) params.name = search.trim()
        if (filterRole !== "all") params.role_id = filterRole
        if (statusFilter !== "all") params.status = statusFilter

        const res = await api.get("/api/users", { params })

        setEmployees(
            res.data.users.map((u: any): Employee => ({
                id: u.id,
                code: u.employee_code,
                username: u.username,
                name: u.name,
                email: u.email,
                phone: u.phone_number,
                address: u.address,
                role: u.role,
                status: u.status,
                joinDate: u.created_at,
            }))
        )

        setTotal(res.data.pagination.total)
        setTotalPages(res.data.pagination.totalPages)
    }

    useEffect(() => {
        fetchUsers()
    }, [search, filterRole, statusFilter, page, limit])

    /* ================== ROLE OPTIONS (FOR SELECT) ================== */
    const roleOptions = [
        { value: "all", label: "Tất cả vai trò" },
        ...roles.map((r: Role) => ({
            value: String(r.id),
            label: r.name,
        })),
    ]

    /* ================== ROLE UI ================== */
    const getRoleLabel = (role?: Role) => role?.name ?? "—"

    const getRoleColor = (role?: Role) => {
        const name = normalizeRoleName(role?.name)

        switch (name) {
            case "master admin":
                return "bg-red-100 text-red-700"
            case "admin":
                return "bg-purple-100 text-purple-700"
            case "manager":
                return "bg-blue-100 text-blue-700"
            case "staff":
                return "bg-green-100 text-green-700"
            default:
                return "bg-gray-100 text-gray-700"
        }
    }

    /* ================== CRUD ================== */
    const handleEdit = (employee: Employee) => {
        setEditingEmployee(employee)
        setIsDialogOpen(true)
    }

    const handleDelete = async (id: number) => {
        try {
            await api.delete(`/api/users/${id}`)
            setEmployees(prev => prev.filter(e => e.id !== id))
            setAlert({ type: "success", message: "Xóa nhân viên thành công" })
        } catch {
            setAlert({ type: "error", message: "Xóa nhân viên thất bại" })
        } finally {
            setIsDeleteDialogOpen(false)
            setDeletingEmployeeId(null)
        }
    }

    const handleSave = async () => {
        const payload: any = {
            username: formData.username,
            name: formData.name,
            email: formData.email,
            role_id: Number(formData.role_id),
            status: Number(formData.status),
        }

        if (formData.phone_number.trim()) payload.phone_number = formData.phone_number
        if (formData.address.trim()) payload.address = formData.address
        if (!editingEmployee && formData.password)
            payload.password = formData.password

        if (editingEmployee) {
            await api.patch(`/api/users/${editingEmployee.id}`, payload)
        } else {
            await api.post("/api/users", payload)
        }

        setIsDialogOpen(false)
        fetchUsers()
    }

    /* ================== STATUS ================== */
    const applyStatusChange = async () => {
        if (!statusChangeId) return

        await api.patch(`/api/users/${statusChangeId}/status`, {
            status: tempStatus,
        })

        setEmployees(prev =>
            prev.map(e =>
                e.id === statusChangeId ? { ...e, status: tempStatus } : e
            )
        )

        cancelStatusChange()
    }

    const cancelStatusChange = () => {
        setOpenStatusPopoverId(null)
        setStatusChangeId(null)
        setTempStatus(1)
    }

    /* ================== PERMISSION ================== */
    useEffect(() => {
        if (roles.length && selectedRoleForPermissions === null) {
            setSelectedRoleForPermissions(roles[0].id)
        }
    }, [roles])

    useEffect(() => {
        if (!selectedRoleForPermissions) return
        getRolePermissions(selectedRoleForPermissions).then(setSelectedPermissions)
    }, [selectedRoleForPermissions])

    const isMasterAdmin = (roleId: number | null) => {
        const role = roles.find((r: Role) => r.id === roleId)
        return normalizeRoleName(role?.name) === "master admin"
    }

    /* ================== RETURN ================== */
    return {
        employees,
        roles,          // dùng cho Tabs
        roleOptions,    // dùng cho Select
        permissions,
        groups,

        isDialogOpen,
        setIsDialogOpen,
        isDeleteDialogOpen,
        setIsDeleteDialogOpen,
        isPermissionsDialogOpen,
        setIsPermissionsDialogOpen,

        editingEmployee,
        setEditingEmployee,
        deletingEmployeeId,
        setDeletingEmployeeId,

        selectedRoleForPermissions,
        setSelectedRoleForPermissions,
        selectedPermissions,
        setSelectedPermissions,

        filterRole,
        setFilterRole,
        search,
        setSearch,
        statusFilter,
        setStatusFilter,

        page,
        setPage,
        limit,
        setLimit,
        total,
        totalPages,

        formData,
        handleChange: (k: string, v: string) =>
            setFormData(prev => ({ ...prev, [k]: v })),

        alert,
        setAlert,
        exporting,

        handleEdit,
        handleDelete,
        handleSave,
        handleExportExcel: undefined,

        openStatusPopoverId,
        setOpenStatusPopoverId,
        tempStatus,
        setTempStatus,
        setStatusChangeId,
        statusChangeId,
        applyStatusChange,
        cancelStatusChange,

        getRoleColor,
        getRoleLabel,
        isMasterAdmin,
        updateRolePermissions,
    }
}
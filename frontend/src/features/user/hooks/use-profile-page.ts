'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/features/user/lib/auth-context'
import vietnamAdministrative from '@/features/user/lib/vietnam-administrative.json'
import { api } from '@/lib/api'

const ORDERS_PER_PAGE = 5

type Ward = {
  Id: string
  Name: string
}

type District = {
  Id: string
  Name: string
  Wards: Ward[]
}

type Province = {
  Id: string
  Name: string
  Districts: District[]
}

const provinces = vietnamAdministrative as Province[]

type UserOrderStatus = 'pending' | 'confirmed' | 'shipping' | 'delivered' | 'completed' | 'cancelled'

type CartItem = {
  productId: string
  productVariantId?: number
  name: string
  price: number
  quantity: number
  size: string
  color: string
  image: string
}

type UserOrder = {
  id: string
  orderDbId: number
  userId: string
  items: CartItem[]
  total: number
  status: UserOrderStatus
  createdAt: string
  deliveryDate?: string
}

interface ApiOrderItem {
  id: number
  product_id: number
  variant_id?: number | null
  quantity: number
  price: number
  product?: { id?: number; name?: string; avatar?: string }
  variant?: {
    id?: number
    color?: { id?: number; name?: string }
    size?: { id?: number; name?: string }
    image?: string
    product?: { id?: number; name?: string; avatar?: string }
  }
}

interface ApiOrder {
  id: number
  order_code?: string
  customer_id?: number | null
  user_id?: number | null
  total_amount?: number
  status?: string
  created_at?: string
  orderItems?: ApiOrderItem[]
}

interface ApiOrdersResponse {
  orders?: ApiOrder[]
}

function parseAddress(address?: string) {
  const raw = (address || '').trim()
  if (!raw) {
    return {
      detailedAddress: '',
      wardName: '',
      districtName: '',
      cityName: '',
    }
  }

  const parts = raw.split(',').map((part) => part.trim()).filter(Boolean)
  if (parts.length < 4) {
    return {
      detailedAddress: raw,
      wardName: '',
      districtName: '',
      cityName: '',
    }
  }

  return {
    detailedAddress: parts.slice(0, parts.length - 3).join(', '),
    wardName: parts[parts.length - 3],
    districtName: parts[parts.length - 2],
    cityName: parts[parts.length - 1],
  }
}

function normalizeStatus(status?: string): UserOrderStatus {
  if (status === 'processing') return 'confirmed'
  if (status === 'shipped') return 'shipping'

  if (
    status === 'pending' ||
    status === 'confirmed' ||
    status === 'shipping' ||
    status === 'delivered' ||
    status === 'completed' ||
    status === 'cancelled'
  ) {
    return status
  }

  return 'pending'
}

function buildAddressSelection(userAddress?: string) {
  const parsedAddress = parseAddress(userAddress)
  const city = provinces.find((item) => item.Name === parsedAddress.cityName)
  const district = city?.Districts.find((item) => item.Name === parsedAddress.districtName)
  const ward = district?.Wards.find((item) => item.Name === parsedAddress.wardName)

  return {
    cityId: city?.Id || '',
    districtId: district?.Id || '',
    wardId: ward?.Id || '',
    detailedAddress: parsedAddress.detailedAddress,
  }
}

export function useProfilePage() {
  const { user, logout, updateProfile } = useAuth()
  const router = useRouter()
  const [userOrders, setUserOrders] = useState<UserOrder[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [editMode, setEditMode] = useState(false)
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    cityId: '',
    districtId: '',
    wardId: '',
    detailedAddress: '',
  })
  const [isSavingProfile, setIsSavingProfile] = useState(false)
  const [profileMessage, setProfileMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)

  useEffect(() => {
    if (!user) {
      router.push('/user/login')
    }
  }, [router, user])

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user?.id) {
        setUserOrders([])
        return
      }

      try {
        const response = await api.get<ApiOrdersResponse>('/api/orders', {
          params: { page: 1, limit: 200 },
        })

        const normalizedOrders = (response.data?.orders || [])
          .filter((order) => Number(order.customer_id) === Number(user.id))
          .map((order) => {
            const items: CartItem[] = (order.orderItems || []).map((item) => ({
              productId: String(item.product?.id || item.product_id || ''),
              productVariantId: item.variant_id || item.variant?.id || undefined,
              name: item.product?.name || item.variant?.product?.name || 'Sản phẩm',
              price: Number(item.price || 0),
              quantity: Number(item.quantity || 0),
              size: item.variant?.size?.name || '',
              color: item.variant?.color?.name || '',
              image: item.variant?.image || item.product?.avatar || item.variant?.product?.avatar || '',
            }))

            return {
              id: order.order_code || `ORD-${order.id}`,
              orderDbId: Number(order.id),
              userId: String(user.id),
              items,
              total: Number(order.total_amount || 0),
              status: normalizeStatus(order.status),
              createdAt: order.created_at || new Date().toISOString(),
            } as UserOrder
          })

        setUserOrders(normalizedOrders)
      } catch (error) {
        console.error('fetch orders failed', error)
        setUserOrders([])
      }
    }

    void fetchOrders()
  }, [user?.id])

  useEffect(() => {
    const { cityId, districtId, wardId, detailedAddress } = buildAddressSelection(user?.address)

    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      cityId,
      districtId,
      wardId,
      detailedAddress,
    })
  }, [user])

  const selectedCity = useMemo(
    () => provinces.find((city) => city.Id === formData.cityId),
    [formData.cityId],
  )
  const districtOptions = selectedCity?.Districts || []
  const selectedDistrict = districtOptions.find((district) => district.Id === formData.districtId)
  const wardOptions = selectedDistrict?.Wards || []
  const selectedWard = wardOptions.find((ward) => ward.Id === formData.wardId)

  const filteredOrders = filterStatus === 'all'
    ? userOrders
    : userOrders.filter((order) => order.status === filterStatus)

  const totalPages = Math.ceil(filteredOrders.length / ORDERS_PER_PAGE)
  const startIndex = (currentPage - 1) * ORDERS_PER_PAGE
  const endIndex = startIndex + ORDERS_PER_PAGE
  const displayedOrders = filteredOrders.slice(startIndex, endIndex)

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      pending: 'Chờ xác nhận',
      confirmed: 'Đã xác nhận',
      shipping: 'Đang giao hàng',
      delivered: 'Đã giao hàng',
      completed: 'Hoàn thành',
      cancelled: 'Đã hủy',
    }
    return labels[status] || status
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      shipping: 'bg-purple-100 text-purple-800',
      delivered: 'bg-green-100 text-green-800',
      completed: 'bg-emerald-100 text-emerald-800',
      cancelled: 'bg-red-100 text-red-800',
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      maximumFractionDigits: 0,
    }).format(price)

  const handleUpdateProfile = async () => {
    try {
      setIsSavingProfile(true)
      setProfileMessage(null)

      const normalizedPhone = formData.phone.trim()
      if (normalizedPhone && !/^\d{10}$/.test(normalizedPhone)) {
        setProfileMessage({
          type: 'error',
          text: 'Số điện thoại phải đúng 10 chữ số',
        })
        return
      }

      if (!formData.cityId || !formData.districtId || !formData.wardId || !formData.detailedAddress.trim()) {
        setProfileMessage({
          type: 'error',
          text: 'Vui lòng nhập đầy đủ thành phố, quận, phường và địa chỉ chi tiết',
        })
        return
      }

      if (!selectedCity || !selectedDistrict || !selectedWard) {
        setProfileMessage({
          type: 'error',
          text: 'Thông tin địa chỉ không hợp lệ',
        })
        return
      }

      const fullAddress = [
        formData.detailedAddress.trim(),
        selectedWard.Name,
        selectedDistrict.Name,
        selectedCity.Name,
      ].join(', ')

      await updateProfile({
        name: formData.name,
        email: formData.email,
        phone: normalizedPhone,
        address: fullAddress,
      })

      setEditMode(false)
      setProfileMessage({ type: 'success', text: 'Cập nhật thông tin thành công' })
    } catch (error) {
      setProfileMessage({
        type: 'error',
        text: error instanceof Error ? error.message : 'Cập nhật thông tin thất bại',
      })
    } finally {
      setIsSavingProfile(false)
    }
  }

  const handleCancelOrder = (orderId: string) => {
    const targetOrder = userOrders.find((order) => order.id === orderId)
    if (!targetOrder) return

    void (async () => {
      try {
        await api.put(`/api/orders/${targetOrder.orderDbId}/status`, { status: 'cancelled' })
        setUserOrders((prev) =>
          prev.map((order) =>
            order.id === orderId ? { ...order, status: 'cancelled' } : order,
          ),
        )
      } catch (error) {
        console.error('cancel order failed', error)
      }
    })()
  }

  const handleCancelEditProfile = () => {
    setEditMode(false)
    setProfileMessage(null)

    const { cityId, districtId, wardId, detailedAddress } = buildAddressSelection(user?.address)
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      cityId,
      districtId,
      wardId,
      detailedAddress,
    })
  }

  const handleLogout = () => {
    logout()
    router.push('/user/home')
  }

  return {
    user,
    provinces,
    userOrders,
    currentPage,
    filterStatus,
    editMode,
    formData,
    isSavingProfile,
    profileMessage,
    selectedOrder,
    districtOptions,
    wardOptions,
    filteredOrders,
    totalPages,
    displayedOrders,
    setCurrentPage,
    setFilterStatus,
    setEditMode,
    setFormData,
    setProfileMessage,
    setSelectedOrder,
    getStatusLabel,
    getStatusColor,
    formatPrice,
    handleUpdateProfile,
    handleCancelOrder,
    handleCancelEditProfile,
    handleLogout,
  }
}

export type { CartItem, UserOrder as Order }

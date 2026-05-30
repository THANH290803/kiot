'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCart } from '@/features/user/lib/cart-context'
import { useAuth } from '@/features/user/lib/auth-context'
import vietnamAdministrative from '@/features/user/lib/vietnam-administrative.json'
import { api } from '@/lib/api'

interface AdministrativeWard {
  Id?: string
  Name?: string
}

interface AdministrativeDistrict {
  Id?: string
  Name?: string
  Wards?: AdministrativeWard[]
}

interface AdministrativeProvince {
  Id?: string
  Name?: string
  Districts?: AdministrativeDistrict[]
}

export interface SelectOption {
  id: string
  name: string
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

function resolveAddressSelection(
  provinces: AdministrativeProvince[],
  address?: string,
) {
  const parsed = parseAddress(address)
  const city = provinces.find((province) => province.Name === parsed.cityName)
  const district = city?.Districts?.find((item) => item.Name === parsed.districtName)
  const ward = district?.Wards?.find((item) => item.Name === parsed.wardName)

  return {
    parsed,
    cityId: city?.Id || '',
    districtId: district?.Id || '',
    wardId: ward?.Id || '',
    cityName: city?.Name || '',
    districtName: district?.Name || '',
    wardName: ward?.Name || '',
  }
}

export function useCheckoutPage() {
  const router = useRouter()
  const { items, getTotalPrice, clearCart } = useCart()
  const { user } = useAuth()
  const [isProcessing, setIsProcessing] = useState(false)
  const [orderPlaced, setOrderPlaced] = useState(false)
  const provinces = useMemo(() => vietnamAdministrative as AdministrativeProvince[], [])
  const addressSelection = resolveAddressSelection(provinces, user?.address)

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: addressSelection.parsed.detailedAddress,
    city: addressSelection.cityName,
    district: addressSelection.districtName,
    ward: addressSelection.wardName,
    notes: '',
    paymentMethod: 'cod',
  })

  const [selectedProvinceId, setSelectedProvinceId] = useState(addressSelection.cityId)
  const [selectedDistrictId, setSelectedDistrictId] = useState(addressSelection.districtId)
  const [selectedWardId, setSelectedWardId] = useState(addressSelection.wardId)
  const provinceOptions = useMemo(
    () =>
      provinces
        .filter((province) => Boolean(province.Id && province.Name))
        .map((province) => ({ id: province.Id as string, name: province.Name as string })),
    [provinces],
  )

  const selectedProvince = useMemo(
    () => provinces.find((province) => province.Id === selectedProvinceId),
    [provinces, selectedProvinceId],
  )

  const districts = useMemo(() => selectedProvince?.Districts || [], [selectedProvince])

  const districtOptions = useMemo(
    () =>
      districts
        .filter((district) => Boolean(district.Id && district.Name))
        .map((district) => ({ id: district.Id as string, name: district.Name as string })),
    [districts],
  )

  const selectedDistrict = useMemo(
    () => districts.find((district) => district.Id === selectedDistrictId),
    [districts, selectedDistrictId],
  )

  const wards = useMemo(
    () => (selectedDistrict?.Wards || []).filter((ward) => Boolean(ward?.Id && ward?.Name)),
    [selectedDistrict],
  )

  const wardOptions = useMemo(
    () => wards.map((ward) => ({ id: ward.Id as string, name: ward.Name as string })),
    [wards],
  )

  useEffect(() => {
    if (items.length === 0 && !orderPlaced) {
      router.push('/user/cart')
    }
  }, [items, orderPlaced, router])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleProvinceChange = (provinceId: string) => {
    const provinceName = provinces.find((province) => province.Id === provinceId)?.Name || ''
    setSelectedProvinceId(provinceId)
    setSelectedDistrictId('')
    setSelectedWardId('')
    setFormData((prev) => ({ ...prev, city: provinceName, district: '', ward: '' }))
  }

  const handleDistrictChange = (districtId: string) => {
    const districtName = districts.find((district) => district.Id === districtId)?.Name || ''
    setSelectedDistrictId(districtId)
    setSelectedWardId('')
    setFormData((prev) => ({ ...prev, district: districtName, ward: '' }))
  }

  const handleWardChange = (wardId: string) => {
    const wardName = wards.find((ward) => ward.Id === wardId)?.Name || ''
    setSelectedWardId(wardId)
    setFormData((prev) => ({ ...prev, ward: wardName }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedProvinceId || !selectedDistrictId || !selectedWardId) {
      alert('Vui lòng chọn đầy đủ Tỉnh/Thành, Quận/Huyện và Phường/Xã')
      return
    }

    if (!user?.id) {
      alert('Không tìm thấy thông tin người dùng')
      return
    }

    const orderItems = items
      .map((item) => {
        const productId = Number(item.productId)
        const variantId = Number(item.productVariantId || 0)

        if (!Number.isFinite(productId) || productId <= 0 || item.quantity <= 0) {
          return null
        }

        return {
          product_id: productId,
          variant_id: Number.isFinite(variantId) && variantId > 0 ? variantId : undefined,
          quantity: item.quantity,
          price: item.price,
        }
      })
      .filter(Boolean)

    if (orderItems.length === 0) {
      alert('Không có sản phẩm hợp lệ để tạo đơn hàng')
      return
    }

    const paymentMethodMap: Record<string, string> = {
      cod: 'cash',
      bank: 'bank_transfer',
      ewallet: 'momo',
    }

    const noteParts = [
      formData.notes?.trim() || '',
      `Nguoi nhan: ${formData.name}`,
      `Email: ${formData.email}`,
      `SDT: ${formData.phone}`,
      `Dia chi: ${formData.address}, ${formData.ward}, ${formData.district}, ${formData.city}`,
    ].filter(Boolean)

    setIsProcessing(true)
    try {
      await api.post('/api/orders', {
        customer_id: Number(user.id),
        channel: 'online',
        order_items: orderItems,
        payment_method: paymentMethodMap[formData.paymentMethod] || 'cash',
        status: 'pending',
        note: noteParts.join(' | '),
      })

      clearCart()
      setOrderPlaced(true)

      setTimeout(() => {
        router.push('/user/profile')
      }, 2000)
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } }
      alert(err.response?.data?.message || 'Tạo đơn hàng thất bại')
    } finally {
      setIsProcessing(false)
    }
  }

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      maximumFractionDigits: 0,
    }).format(price)

  return {
    user,
    items,
    formData,
    isProcessing,
    orderPlaced,
    selectedProvinceId,
    selectedDistrictId,
    selectedWardId,
    provinceOptions,
    districtOptions,
    wardOptions,
    setFormData,
    handleInputChange,
    handleProvinceChange,
    handleDistrictChange,
    handleWardChange,
    handleSubmit,
    formatPrice,
    getTotalPrice,
  }
}

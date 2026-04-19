"use client"

import { useState, useRef, useEffect, useMemo } from "react"
import type React from "react"
import {
  Search,
  ShoppingCart,
  UserPlus,
  Trash2,
  Calculator,
  QrCode,
  Copy,
  Banknote,
  User,
  X,
  Check,
  Printer,
  Plus,
  LogOut,
  TicketPercent,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { api } from "@/lib/api"
import { cn } from "@/lib/utils"
import { useAuth } from "@/app/auth-context"
import { useRouter } from "next/navigation"
import { useAdminPermissions } from "@/features/admin/providers/admin-permission-provider"
import { resolveAdminRoutePermissions } from "@/features/admin/lib/rbac"

interface PosCategory {
  id: number
  name: string
}

interface PosSuggestionProduct {
  id: number
  productId: number
  variantId: number
  code: string
  name: string
  price: number
  category: string
  image: string
  color: string
  size: string
}

interface PosCustomer {
  id?: number
  name: string
  phone: string
  email?: string
  address?: string
}

interface PosCartItem extends PosSuggestionProduct {
  quantity: number
}

interface PosReceiptSnapshot {
  orderCode: string
  customerName: string
  customerPhone?: string
  customerAddress?: string
  cashierName: string
  paymentMethod: "cash" | "transfer"
  items: PosCartItem[]
  total: number
  createdAt: string
}

interface PosBankQrPayload {
  order_id: number | null
  order_code: string
  amount: number
  bank_name: string
  bank_bin: string
  account_no: string
  account_name: string
  transfer_content: string
  qr_url: string
}

interface PosAppliedVoucher {
  customerVoucherId?: number
  code: string
  discountAmount: number
  discountType: "percent" | "fixed"
  discountValue: number
}

interface PosCustomerVoucherRecord {
  id: number
  customer_id: number
  voucher_id: number
  status: "available" | "used" | "expired"
  expired_at?: string | null
  voucher?: {
    id: number
    code: string
    description?: string | null
    discount_type: "percent" | "fixed"
    discount_value: number
    status: "active" | "inactive"
    start_date: string
    end_date: string
  }
}

interface PosApiImage {
  url: string
  is_primary?: boolean
  sort_order?: number
}

interface PosApiVariant {
  id: number
  sku: string
  price: number
  images?: PosApiImage[]
  color?: { name?: string | null } | null
  size?: { name?: string | null } | null
}

interface PosApiProduct {
  id: number
  name: string
  avatar?: string | null
  category?: { name?: string | null } | null
  category_id?: number
  variants?: PosApiVariant[]
}

export default function POSPage() {
  const router = useRouter()
  const { logout } = useAuth()
  const { hasPermission } = useAdminPermissions()
  const [cart, setCart] = useState<PosCartItem[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [suggestions, setSuggestions] = useState<PosSuggestionProduct[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [products, setProducts] = useState<PosSuggestionProduct[]>([])
  const [categories, setCategories] = useState<PosCategory[]>([])
  const [selectedCategoryId, setSelectedCategoryId] = useState("all")
  const [isLoadingProducts, setIsLoadingProducts] = useState(false)
  const [customer, setCustomer] = useState<PosCustomer | null>(null)
  const [isCustomerDialogOpen, setIsCustomerDialogOpen] = useState(false)
  const [customerType, setCustomerType] = useState<"existing" | "new">("existing")
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "transfer">("cash")
  const [isReceiptDialogOpen, setIsReceiptDialogOpen] = useState(false)
  const [isBankQrDialogOpen, setIsBankQrDialogOpen] = useState(false)
  const [bankQrPayload, setBankQrPayload] = useState<PosBankQrPayload | null>(null)
  const [isCreatingOrder, setIsCreatingOrder] = useState(false)
  const [checkoutError, setCheckoutError] = useState<string | null>(null)
  const [receiptSnapshot, setReceiptSnapshot] = useState<PosReceiptSnapshot | null>(null)
  const [newCustomerName, setNewCustomerName] = useState("")
  const [newCustomerPhone, setNewCustomerPhone] = useState("")
  const [customerSearch, setCustomerSearch] = useState("")
  const [customers, setCustomers] = useState<PosCustomer[]>([])
  const [isLoadingCustomers, setIsLoadingCustomers] = useState(false)
  const [quickNavigatePath, setQuickNavigatePath] = useState("/admin/pos")
  const [voucherCode, setVoucherCode] = useState("")
  const [appliedVoucher, setAppliedVoucher] = useState<PosAppliedVoucher | null>(null)
  const [voucherError, setVoucherError] = useState<string | null>(null)
  const [isApplyingVoucher, setIsApplyingVoucher] = useState(false)
  const [customerVouchers, setCustomerVouchers] = useState<PosCustomerVoucherRecord[]>([])
  const [isLoadingCustomerVouchers, setIsLoadingCustomerVouchers] = useState(false)
  const [isVoucherPickerOpen, setIsVoucherPickerOpen] = useState(false)
  const [voucherSearch, setVoucherSearch] = useState("")
  const [voucherPage, setVoucherPage] = useState(1)

  const searchRef = useRef<HTMLDivElement>(null)
  const receiptPrintRef = useRef<HTMLDivElement>(null)

  const categoryTabs = useMemo(
    () => [{ id: "all", label: "Tất cả" }, ...categories.map((category) => ({ id: String(category.id), label: category.name }))],
    [categories],
  )
  const quickNavigateOptions = useMemo(() => {
    const pages = [
      { path: "/admin/dashboard", label: "Tổng quan" },
      { path: "/admin/pos", label: "Bán hàng (POS)" },
      { path: "/admin/orders", label: "Đơn hàng" },
      { path: "/admin/products", label: "Sản phẩm" },
      { path: "/admin/customers", label: "Khách hàng" },
      { path: "/admin/reports", label: "Báo cáo" },
      { path: "/admin/settings", label: "Thiết lập" },
    ]

    return pages.filter((page) => {
      const required = resolveAdminRoutePermissions(page.path)
      if (required.length === 0) {
        return true
      }
      return hasPermission(required)
    })
  }, [hasPermission])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  useEffect(() => {
    let active = true

    const loadCategories = async () => {
      try {
        const response = await api.get("/api/categories")

        if (!active) {
          return
        }

        const rawCategories: PosCategory[] = Array.isArray(response.data?.data)
          ? response.data.data
          : Array.isArray(response.data)
            ? response.data
            : []

        setCategories(rawCategories)
      } catch (error) {
        if (active) {
          console.error("Load POS categories error:", error)
          setCategories([])
        }
      }
    }

    loadCategories()

    return () => {
      active = false
    }
  }, [])

  useEffect(() => {
    let active = true

    const loadProducts = async () => {
      try {
        setIsLoadingProducts(true)

        const response = await api.get("/api/products/get-all-with-variants", {
          params: {
            page: 1,
            limit: 30,
            status: 1,
            category_id: selectedCategoryId !== "all" ? Number(selectedCategoryId) : undefined,
          },
        })

        if (!active) {
          return
        }

        const rawProducts: PosApiProduct[] = Array.isArray(response.data?.data) ? response.data.data : []
        const mappedProducts = rawProducts.flatMap((product) =>
          (product.variants || []).map((variant) => {
            const sortedImages = [...(variant.images || [])].sort((left, right) => {
              if (left.is_primary !== right.is_primary) {
                return left.is_primary ? -1 : 1
              }

              return (left.sort_order || 0) - (right.sort_order || 0)
            })

            return {
              id: variant.id,
              productId: product.id,
              variantId: variant.id,
              code: variant.sku || `SP-${product.id}-${variant.id}`,
              name: product.name,
              price: Number(variant.price || 0),
              category: product.category?.name || "Chưa phân loại",
              image: product.avatar || sortedImages[0]?.url || "/placeholder.svg",
              color: variant.color?.name || "Chưa có màu",
              size: variant.size?.name || "Chưa có size",
            }
          }),
        )

        setProducts(mappedProducts)
      } catch (error) {
        if (active) {
          console.error("Load POS products error:", error)
          setProducts([])
        }
      } finally {
        if (active) {
          setIsLoadingProducts(false)
        }
      }
    }

    loadProducts()

    return () => {
      active = false
    }
  }, [selectedCategoryId])

  useEffect(() => {
    if (!isCustomerDialogOpen || customerType !== "existing") {
      return
    }

    let active = true
    const timer = window.setTimeout(async () => {
      try {
        setIsLoadingCustomers(true)

        const response = await api.get("/api/customers", {
          params: {
            keyword: customerSearch.trim() || undefined,
            page: 1,
            limit: 20,
          },
        })

        if (!active) {
          return
        }

        const rawCustomers = Array.isArray(response.data?.customers) ? response.data.customers : []
        const mappedCustomers: PosCustomer[] = rawCustomers.map((item: { id: number; name: string; phone_number?: string; email?: string }) => ({
          id: item.id,
          name: item.name,
          phone: item.phone_number || "Chưa có số điện thoại",
          email: item.email,
          address: (item as { address?: string }).address,
        }))

        setCustomers(mappedCustomers)
      } catch (error) {
        if (active) {
          console.error("Load POS customers error:", error)
          setCustomers([])
        }
      } finally {
        if (active) {
          setIsLoadingCustomers(false)
        }
      }
    }, 250)

    return () => {
      active = false
      window.clearTimeout(timer)
    }
  }, [isCustomerDialogOpen, customerType, customerSearch])

  useEffect(() => {
    if (!customer?.id) {
      setCustomerVouchers([])
      setAppliedVoucher(null)
      setVoucherCode("")
      setVoucherError(null)
      return
    }

    let active = true

    const loadCustomerVouchers = async () => {
      try {
        setIsLoadingCustomerVouchers(true)
        const response = await api.get("/api/customer-vouchers", {
          params: {
            customer_id: customer.id,
            status: "available",
            page: 1,
            limit: 100,
          },
        })

        if (!active) {
          return
        }

        setCustomerVouchers(response.data?.customer_vouchers ?? [])
      } catch (error) {
        if (active) {
          console.error("Load POS customer vouchers error:", error)
          setCustomerVouchers([])
        }
      } finally {
        if (active) {
          setIsLoadingCustomerVouchers(false)
        }
      }
    }

    loadCustomerVouchers()

    return () => {
      active = false
    }
  }, [customer?.id])

  useEffect(() => {
    if (!isVoucherPickerOpen) {
      setVoucherSearch("")
      setVoucherPage(1)
    }
  }, [isVoucherPickerOpen])

  useEffect(() => {
    setVoucherPage(1)
  }, [voucherSearch, customer?.id])

  useEffect(() => {
    if (!showSuggestions || searchQuery.trim().length === 0) {
      setSuggestions([])
      setIsSearching(false)
      return
    }

    let active = true
    const timer = window.setTimeout(async () => {
      try {
        setIsSearching(true)

        const response = await api.get("/api/products/get-all-with-variants", {
          params: {
            name: searchQuery.trim(),
            page: 1,
            limit: 5,
            status: 1,
            category_id: selectedCategoryId !== "all" ? Number(selectedCategoryId) : undefined,
          },
        })

        if (!active) {
          return
        }

        const rawProducts: PosApiProduct[] = Array.isArray(response.data?.data) ? response.data.data : []
        const mappedSuggestions = rawProducts.flatMap((product) =>
          (product.variants || []).map((variant) => {
            const sortedImages = [...(variant.images || [])].sort((left, right) => {
              if (left.is_primary !== right.is_primary) {
                return left.is_primary ? -1 : 1
              }

              return (left.sort_order || 0) - (right.sort_order || 0)
            })

            return {
              id: variant.id,
              productId: product.id,
              variantId: variant.id,
              code: variant.sku || `SP-${product.id}-${variant.id}`,
              name: product.name,
              price: Number(variant.price || 0),
              category: product.category?.name || "Chưa phân loại",
              image: product.avatar || sortedImages[0]?.url || "/placeholder.svg",
              color: variant.color?.name || "Chưa có màu",
              size: variant.size?.name || "Chưa có size",
            }
          }),
        )

        setSuggestions(mappedSuggestions.slice(0, 5))
      } catch (error) {
        if (active) {
          console.error("Search POS suggestions error:", error)
          setSuggestions([])
        }
      } finally {
        if (active) {
          setIsSearching(false)
        }
      }
    }, 250)

    return () => {
      active = false
      window.clearTimeout(timer)
    }
  }, [searchQuery, showSuggestions, selectedCategoryId])

  const addToCart = (product: PosSuggestionProduct) => {
    const existing = cart.find((item) => item.id === product.id)
    if (existing) {
      setCart(cart.map((item) => (item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item)))
    } else {
      setCart([...cart, { ...product, quantity: 1 }])
    }
    setShowSuggestions(false)
    setSearchQuery("")
  }

  const increaseCartItemQuantity = (productId: number) => {
    setCart((currentCart) =>
      currentCart.map((item) =>
        item.id === productId
          ? {
              ...item,
              quantity: item.quantity + 1,
            }
          : item,
      ),
    )
  }

  const decreaseCartItemQuantity = (productId: number) => {
    setCart((currentCart) =>
      currentCart.flatMap((item) => {
        if (item.id !== productId) {
          return item
        }

        if (item.quantity <= 1) {
          return []
        }

        return {
          ...item,
          quantity: item.quantity - 1,
        }
      }),
    )
  }

  const removeFromCart = (productId: number) => {
    setCart((currentCart) => currentCart.filter((item) => item.id !== productId))
  }

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const discountAmount = appliedVoucher?.discountAmount || 0
  const finalTotal = Math.max(0, total - discountAmount)
  const selectedCustomerVoucher =
    customerVouchers.find((assignment) => assignment.voucher?.code?.toUpperCase() === voucherCode.trim().toUpperCase()) || null
  const filteredCustomerVouchers = useMemo(() => {
    const normalizedSearch = voucherSearch.trim().toLowerCase()

    if (!normalizedSearch) {
      return customerVouchers
    }

    return customerVouchers.filter((assignment) => {
      const code = assignment.voucher?.code?.toLowerCase() || ""
      const description = assignment.voucher?.description?.toLowerCase() || ""
      const discountValue = String(assignment.voucher?.discount_value || "")

      return code.includes(normalizedSearch) || description.includes(normalizedSearch) || discountValue.includes(normalizedSearch)
    })
  }, [customerVouchers, voucherSearch])
  const voucherPageSize = 6
  const totalVoucherPages = Math.max(1, Math.ceil(filteredCustomerVouchers.length / voucherPageSize))
  const paginatedCustomerVouchers = filteredCustomerVouchers.slice((voucherPage - 1) * voucherPageSize, voucherPage * voucherPageSize)

  const formatVoucherDate = (value?: string | null) => {
    if (!value) {
      return "Không giới hạn riêng"
    }

    const normalized = value.includes("T") ? value.split("T")[0] : value
    const [year, month, day] = normalized.split("-")

    if (!year || !month || !day) {
      return normalized
    }

    return `${day}-${month}-${year}`
  }

  const handleApplyVoucher = async () => {
    const normalizedCode = voucherCode.trim().toUpperCase()
    if (!normalizedCode) {
      setVoucherError("Vui lòng nhập mã voucher.")
      return
    }

    if (!customer?.id) {
      setVoucherError("Vui lòng chọn khách hàng trước khi áp dụng voucher.")
      return
    }

    try {
      setIsApplyingVoucher(true)
      setVoucherError(null)

      const matchedCustomerVoucher = customerVouchers.find((assignment) =>
        assignment.voucher?.code?.toUpperCase() === normalizedCode
      )

      if (!matchedCustomerVoucher?.voucher) {
        setAppliedVoucher(null)
        setVoucherError("Khách hàng này không có voucher đó.")
        return
      }

      const matchedVoucher = matchedCustomerVoucher.voucher

      const today = new Date()
      const startDate = new Date(matchedVoucher.start_date)
      const endDate = new Date(matchedVoucher.end_date)

      if (startDate > today || endDate < today) {
        setAppliedVoucher(null)
        setVoucherError("Voucher đã hết hạn hoặc chưa đến thời gian áp dụng.")
        return
      }

      const computedDiscount =
        matchedVoucher.discount_type === "percent"
          ? Math.min(total, Math.round((total * matchedVoucher.discount_value) / 100))
          : Math.min(total, Number(matchedVoucher.discount_value || 0))

      setAppliedVoucher({
        customerVoucherId: matchedCustomerVoucher.id,
        code: matchedVoucher.code,
        discountAmount: computedDiscount,
        discountType: matchedVoucher.discount_type,
        discountValue: matchedVoucher.discount_value,
      })
      setVoucherCode(matchedVoucher.code)
    } catch (error) {
      console.error("Apply voucher error:", error)
      setAppliedVoucher(null)
      setVoucherError("Không thể kiểm tra voucher. Vui lòng thử lại.")
    } finally {
      setIsApplyingVoucher(false)
    }
  }

  const handleRemoveVoucher = () => {
    setAppliedVoucher(null)
    setVoucherCode("")
    setVoucherError(null)
  }

  const handleCheckout = async () => {
    if (cart.length === 0 || isCreatingOrder) {
      return
    }

    if (!customer?.id) {
      setCheckoutError("Vui lòng chọn khách hàng trước khi tạo đơn hàng.")
      return
    }

    try {
      setIsCreatingOrder(true)
      setCheckoutError(null)

      const savedUser = typeof window !== "undefined" ? localStorage.getItem("user") : null
      const parsedUser = savedUser ? JSON.parse(savedUser) as { id?: number; name?: string; username?: string } : null
      const userId = parsedUser?.id

      if (!userId) {
        setCheckoutError("Không tìm thấy người dùng đăng nhập để tạo đơn hàng.")
        return
      }

      const orderPayload = {
        customer_id: customer.id,
        customer_voucher_id: appliedVoucher?.customerVoucherId,
        user_id: userId,
        channel: "in_store",
        order_items: cart.map((item) => ({
          product_id: item.productId,
          variant_id: item.variantId,
          quantity: item.quantity,
          price: item.price,
        })),
        payment_method: paymentMethod === "cash" ? "cash" : "bank_transfer",
        status: paymentMethod === "cash" ? "completed" : "pending",
        note: "",
      } as const

      const receiptData = {
        orderCode: "",
        customerName: customer.name || "Khách lẻ",
        customerPhone: customer.phone,
        customerAddress: customer.address,
        cashierName: parsedUser?.name || parsedUser?.username || "Admin",
        paymentMethod,
        items: cart.map((item) => ({ ...item })),
        total,
        createdAt: new Date().toLocaleString(),
      } satisfies PosReceiptSnapshot

      const response = await api.post("/api/orders", orderPayload)

      if (paymentMethod === "transfer") {
        const paymentResponse = await api.post("/api/payments/bank-qr/create", {
          order_id: response.data?.id,
          amount: total,
          transferContent: `Thanh toan tai cua hang ${response.data?.order_code || ""}`,
        })

        const qrPayload = paymentResponse.data as PosBankQrPayload

        if (!qrPayload?.qr_url) {
          setCheckoutError("Không tạo được QR chuyển khoản ngân hàng.")
          return
        }

        setBankQrPayload(qrPayload)
        setReceiptSnapshot({
          ...receiptData,
          orderCode: qrPayload.order_code || response.data?.order_code || "",
        })
        setIsBankQrDialogOpen(true)
        setCart([])
        setSearchQuery("")
        setShowSuggestions(false)
        return
      }

      setReceiptSnapshot({
        orderCode: response.data?.order_code || "",
        customerName: receiptData.customerName,
        customerPhone: receiptData.customerPhone,
        customerAddress: receiptData.customerAddress,
        cashierName: parsedUser?.name || parsedUser?.username || "Admin",
        paymentMethod,
        items: cart.map((item) => ({ ...item })),
        total,
        createdAt: new Date().toLocaleString(),
      })
      setIsReceiptDialogOpen(true)
      setCart([])
      setSearchQuery("")
      setShowSuggestions(false)
    } catch (error) {
      console.error("Create POS order error:", error)
      const errorMessage =
        typeof error === "object" &&
        error !== null &&
        "response" in error &&
        typeof (error as { response?: { data?: { message?: string } } }).response?.data?.message === "string"
          ? (error as { response?: { data?: { message?: string } } }).response?.data?.message
          : "Tạo đơn hàng thất bại. Vui lòng thử lại."
      setCheckoutError(errorMessage)
    } finally {
      setIsCreatingOrder(false)
    }
  }

  const handleCreateNewCustomer = () => {
    if (!newCustomerName.trim() || !newCustomerPhone.trim()) {
      return
    }

    void (async () => {
      try {
        const response = await api.post("/api/customers", {
          name: newCustomerName.trim(),
          phone_number: newCustomerPhone.trim(),
        })

        const createdCustomer: PosCustomer = {
          id: response.data?.id,
          name: response.data?.name || newCustomerName.trim(),
          phone: response.data?.phone_number || newCustomerPhone.trim(),
          email: response.data?.email,
          address: response.data?.address,
        }

        setCustomer(createdCustomer)
        setCustomers((currentCustomers) => [createdCustomer, ...currentCustomers])
        setIsCustomerDialogOpen(false)
        setCustomerType("existing")
        setCustomerSearch("")
        setNewCustomerName("")
        setNewCustomerPhone("")
      } catch (error) {
        console.error("Create POS customer error:", error)
      }
    })()
  }

  const handlePrintReceipt = () => {
    if (!receiptPrintRef.current) {
      return
    }

    const printWindow = window.open("", "_blank", "width=480,height=720")

    if (!printWindow) {
      setCheckoutError("Không thể mở cửa sổ in hóa đơn. Vui lòng kiểm tra trình duyệt.")
      return
    }

    const receiptHtml = receiptPrintRef.current.innerHTML

    printWindow.document.write(`
      <!doctype html>
      <html>
        <head>
          <meta charset="utf-8" />
          <title>In hóa đơn</title>
          <style>
            body {
              font-family: "Times New Roman", Georgia, serif;
              background: #f0f0f0;
              padding: 14px;
              color: #111;
            }
            .receipt-root {
              max-width: 340px;
              margin: 0 auto;
              background: #fff;
              border: 1px solid #d8d8d8;
              padding: 16px;
              font-size: 13px;
              line-height: 1.35;
            }
            .receipt-separator {
              border-top: 1px dashed #7a7a7a;
              margin: 14px 0;
            }
            .receipt-header {
              display: flex;
              justify-content: space-between;
              gap: 10px;
            }
            .receipt-logo {
              font-family: Arial, sans-serif;
              font-size: 34px;
              line-height: 1;
              color: #2d8cff;
              margin-right: 8px;
            }
            .receipt-brand {
              display: flex;
              align-items: center;
              font-size: 22px;
              font-weight: 700;
              font-family: Arial, sans-serif;
              color: #11315d;
            }
            .receipt-store {
              text-align: right;
              font-size: 12px;
              font-family: Arial, sans-serif;
            }
            .receipt-title {
              text-align: center;
              margin-top: 2px;
            }
            .receipt-title h2 {
              margin: 0;
              font-size: 44px;
              font-weight: 700;
            }
            .receipt-code {
              margin-top: 2px;
              color: #1e88e5;
              font-size: 34px;
              font-weight: 700;
            }
            .receipt-info p {
              margin: 2px 0;
              font-size: 15px;
            }
            .receipt-table {
              width: 100%;
              border-collapse: collapse;
              font-size: 15px;
            }
            .receipt-table th,
            .receipt-table td {
              padding: 3px 0;
              vertical-align: top;
            }
            .receipt-table th:nth-child(2),
            .receipt-table td:nth-child(2) {
              width: 44px;
              text-align: center;
            }
            .receipt-table th:last-child,
            .receipt-table td:last-child {
              width: 110px;
              text-align: right;
            }
            .receipt-summary {
              margin-top: 8px;
              font-size: 16px;
            }
            .receipt-summary-row {
              display: flex;
              justify-content: space-between;
              margin: 2px 0;
            }
            .receipt-total {
              font-weight: 700;
              font-size: 17px;
            }
            .receipt-qr {
              margin-top: 14px;
              text-align: center;
            }
            .receipt-qr img {
              width: 140px;
              height: 140px;
              object-fit: contain;
              border: 1px solid #d6d6d6;
            }
          </style>
        </head>
        <body>
          <div class="receipt-root">${receiptHtml}</div>
        </body>
      </html>
    `)
    printWindow.document.close()
    printWindow.focus()
    window.setTimeout(() => {
      printWindow.print()
      printWindow.close()
    }, 250)
  }

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Danh sách sản phẩm (Bên trái) */}
      <div className="flex-1 min-w-0 min-h-0 flex flex-col border-r">
        <div className="bg-white border-b shadow-sm">
          <div className="flex items-center gap-4 px-4 py-3">
            <div className="relative flex-1" ref={searchRef}>
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm tên hoặc mã hàng (F3)"
                className="pl-9 h-10 border-primary/20 focus-visible:ring-primary shadow-inner"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  setShowSuggestions(true)
                }}
                onFocus={() => setShowSuggestions(true)}
              />
              {showSuggestions && searchQuery.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border rounded-md shadow-lg z-50 overflow-hidden">
                  {isSearching ? (
                    <div className="p-4 text-center text-sm text-muted-foreground">Đang tìm sản phẩm...</div>
                  ) : suggestions.length > 0 ? (
                    <div className="divide-y">
                      {suggestions.map((p) => (
                        <div
                          key={p.id}
                          className="p-3 hover:bg-primary/5 cursor-pointer flex items-center justify-between"
                          onClick={() => addToCart(p)}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded bg-muted overflow-hidden shrink-0">
                              <img
                                src={p.image || "/placeholder.svg"}
                                alt={p.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div>
                              <p className="text-sm font-medium">{p.name}</p>
                              <div className="flex items-center gap-2 mt-0.5">
                                <Badge variant="outline" className="text-[10px] px-1 h-4">
                                  {p.color}
                                </Badge>
                                <Badge variant="outline" className="text-[10px] px-1 h-4">
                                  {p.size}
                                </Badge>
                                <span className="text-xs text-muted-foreground">Mã: {p.code}</span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-bold text-primary">{p.price.toLocaleString()} đ</p>
                            <p className="text-xs text-muted-foreground">{p.category}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 text-center text-sm text-muted-foreground">Không tìm thấy sản phẩm</div>
                  )}
                </div>
              )}
            </div>
            <div className="ml-auto flex items-center gap-2">
              <Select
                value={quickNavigatePath}
                onValueChange={(value) => {
                  setQuickNavigatePath(value)
                  router.push(value)
                }}
              >
                <SelectTrigger className="w-[190px]">
                  <SelectValue placeholder="Đi đến trang..." />
                </SelectTrigger>
                <SelectContent>
                  {quickNavigateOptions.map((option) => (
                    <SelectItem key={option.path} value={option.path}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                onClick={() => {
                  logout()
                  router.push("/admin/login")
                }}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Đăng xuất
              </Button>
              <Button variant="ghost" size="icon" className="shrink-0 text-muted-foreground">
                <Plus className="h-5 w-5" />
              </Button>
            </div>
          </div>
          <ScrollArea className="w-full">
            <div className="px-4 pb-2">
              <Tabs value={selectedCategoryId} className="w-full">
                <TabsList className="bg-transparent h-auto p-0 gap-2 flex">
                  {categoryTabs.map((cat) => (
                    <TabsTrigger
                      key={cat.id}
                      value={cat.id}
                      onClick={() => setSelectedCategoryId(cat.id)}
                      className="whitespace-nowrap rounded-full border border-muted-foreground/20 px-4 py-1 data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:border-primary hover:bg-muted transition-all"
                    >
                      {cat.label}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>
            <ScrollBar orientation="horizontal" className="hidden" />
          </ScrollArea>
        </div>

        <ScrollArea className="flex-1 min-h-0">
          <div className="p-4">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {isLoadingProducts ? (
              <div className="col-span-full py-10 text-center text-sm text-muted-foreground">Đang tải sản phẩm...</div>
            ) : products.length === 0 ? (
              <div className="col-span-full py-10 text-center text-sm text-muted-foreground">Không có sản phẩm trong danh mục này.</div>
            ) : products.map((p) => (
              <Card
                key={p.id}
                className="overflow-hidden cursor-pointer hover:ring-2 hover:ring-primary/50 transition-all border-none shadow-sm"
                onClick={() => addToCart(p)}
              >
                <div className="aspect-square bg-muted relative">
                  <img src={p.image || "/placeholder.svg"} alt={p.name} className="w-full h-full object-cover" />
                  <Badge className="absolute top-2 right-2 bg-primary/90 text-[10px] px-1 h-4">25</Badge>
                </div>
                <CardContent className="p-2 space-y-1">
                  <p className="text-sm font-medium line-clamp-1">{p.name}</p>
                  <div className="flex gap-1">
                    <Badge variant="outline" className="text-[10px] px-1 py-0 h-3 font-normal opacity-70">
                      {p.color}
                    </Badge>
                    <Badge variant="outline" className="text-[10px] px-1 py-0 h-3 font-normal opacity-70">
                      {p.size}
                    </Badge>
                  </div>
                  <p className="text-sm font-bold text-primary">{p.price.toLocaleString()} đ</p>
                </CardContent>
              </Card>
            ))}
            </div>
          </div>
        </ScrollArea>
      </div>

      {/* Giỏ hàng & Thanh toán (Bên phải) */}
      <div className="w-[420px] min-h-0 flex flex-col bg-white shadow-xl">
        <div className="p-4 border-b flex items-center justify-between bg-primary/5">
          <div className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5 text-primary" />
            <span className="font-bold">Đơn hàng #12345</span>
          </div>
          {customer ? (
            <div className="flex items-center gap-2 bg-primary/10 px-2 py-1 rounded-md">
              <User className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">{customer.name}</span>
              <Button variant="ghost" size="icon" className="h-5 w-5 p-0" onClick={() => setCustomer(null)}>
                <X className="h-3 w-3" />
              </Button>
            </div>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              className="text-primary hover:text-primary hover:bg-primary/10"
              onClick={() => setIsCustomerDialogOpen(true)}
            >
              <UserPlus className="h-4 w-4 mr-2" /> Chọn khách hàng
            </Button>
          )}
        </div>

        <ScrollArea className="flex-1 min-h-0">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-muted-foreground p-8 text-center">
              <ShoppingCart className="h-12 w-12 mb-4 opacity-20" />
              <p>Chưa có sản phẩm nào trong giỏ hàng</p>
            </div>
          ) : (
            <div className="divide-y">
              {cart.map((item) => (
                <div key={item.id} className="p-4 flex gap-3 group">
                  <div className="w-12 h-12 rounded bg-muted overflow-hidden shrink-0">
                    <img
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{item.name}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[10px] font-mono text-muted-foreground">{item.code}</span>
                      <span className="text-[10px] text-muted-foreground">•</span>
                      <span className="text-[10px] font-medium">{item.color}</span>
                      <span className="text-[10px] text-muted-foreground">•</span>
                      <span className="text-[10px] font-medium">{item.size}</span>
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-6 w-6 bg-transparent"
                          onClick={() => decreaseCartItemQuantity(item.id)}
                        >
                          {" "}
                          -{" "}
                        </Button>
                        <span className="text-sm w-8 text-center font-medium">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-6 w-6 bg-transparent"
                          onClick={() => increaseCartItemQuantity(item.id)}
                        >
                          {" "}
                          +{" "}
                        </Button>
                      </div>
                      <p className="text-sm font-bold">{(item.price * item.quantity).toLocaleString()} đ</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100"
                    onClick={() => removeFromCart(item.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>

        <div className="p-4 bg-muted/30 space-y-3">
          {checkoutError ? <p className="text-sm text-destructive">{checkoutError}</p> : null}
          <div className="rounded-xl border border-dashed border-primary/25 bg-white p-3 space-y-3">
            <div className="flex items-center gap-2">
              <TicketPercent className="h-4 w-4 text-primary" />
              <span className="text-sm font-semibold text-foreground">Áp dụng voucher</span>
            </div>
            {customer ? (
              <div className="space-y-2">
                <div className="text-xs text-muted-foreground">
                  {isLoadingCustomerVouchers
                    ? "Đang tải voucher của khách hàng..."
                    : customerVouchers.length > 0
                      ? `Khách hàng này có ${customerVouchers.length} voucher khả dụng`
                      : "Khách hàng này chưa có voucher khả dụng"}
                </div>
                {customerVouchers.length > 0 ? (
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      className="h-10 flex-1 justify-between rounded-lg border-primary/20 bg-primary/5 px-3 text-left font-normal hover:bg-primary/10"
                      onClick={() => setIsVoucherPickerOpen(true)}
                    >
                      <div className="min-w-0">
                        <div className="truncate text-sm font-medium text-foreground">
                          {selectedCustomerVoucher?.voucher?.code || "Chọn voucher của khách hàng"}
                        </div>
                        <div className="truncate text-[11px] text-muted-foreground">
                          {selectedCustomerVoucher?.voucher?.description || "Mở popup để xem toàn bộ voucher khả dụng"}
                        </div>
                      </div>
                      <span className="ml-3 inline-flex h-8 shrink-0 items-center rounded-full border border-primary/15 bg-white px-3.5 text-sm font-medium leading-none whitespace-nowrap text-primary">
                        {customerVouchers.length} mã
                      </span>
                    </Button>
                  </div>
                ) : null}
              </div>
            ) : (
              <p className="text-xs text-muted-foreground">Chọn khách hàng để xem và áp dụng voucher khả dụng.</p>
            )}
            <div className="flex gap-2">
              <Input
                value={voucherCode}
                onChange={(event) => {
                  setVoucherCode(event.target.value.toUpperCase())
                  setVoucherError(null)
                }}
                placeholder="Nhập mã voucher"
                className="bg-background"
              />
              <Button type="button" variant="outline" onClick={() => void handleApplyVoucher()} disabled={isApplyingVoucher || total <= 0}>
                {isApplyingVoucher ? "Đang kiểm tra..." : "Áp dụng"}
              </Button>
            </div>
            {voucherError ? <p className="text-xs text-destructive">{voucherError}</p> : null}
            {appliedVoucher ? (
              <div className="flex items-center justify-between rounded-lg bg-primary/10 px-3 py-2">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="bg-primary text-primary-foreground hover:bg-primary">
                    {appliedVoucher.code}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    Tạm giảm {appliedVoucher.discountAmount.toLocaleString()} đ
                    {" · "}
                    {appliedVoucher.discountType === "percent"
                      ? `${appliedVoucher.discountValue}%`
                      : `${appliedVoucher.discountValue.toLocaleString()} đ`}
                  </span>
                </div>
                <Button type="button" variant="ghost" size="sm" className="h-7 px-2 text-muted-foreground" onClick={handleRemoveVoucher}>
                  Bỏ
                </Button>
              </div>
            ) : null}
          </div>
          <div className="flex justify-between text-sm">
            <span>Tổng số lượng ({cart.length}):</span>
            <span className="font-medium">{cart.reduce((s, i) => s + i.quantity, 0)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Tạm tính:</span>
            <span className="font-medium">{total.toLocaleString()} đ</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Giảm voucher:</span>
            <span className={cn("font-medium", discountAmount > 0 && "text-emerald-600")}>
              -{discountAmount.toLocaleString()} đ
            </span>
          </div>
          <div className="flex justify-between text-lg font-bold">
            <span>Tổng thanh toán:</span>
            <span className="text-primary">{finalTotal.toLocaleString()} đ</span>
          </div>

          <RadioGroup
            value={paymentMethod}
            onValueChange={(v) => setPaymentMethod(v as "cash" | "transfer")}
            className="grid grid-cols-2 gap-2 py-2"
          >
            <div>
              <RadioGroupItem value="cash" id="cash" className="sr-only" />
              <Label
                htmlFor="cash"
                className={cn(
                  "flex h-12 items-center justify-center rounded-md border-2 border-primary/20 bg-transparent px-4 font-medium cursor-pointer transition-all",
                  paymentMethod === "cash"
                    ? "border-primary bg-primary/10 text-primary shadow-sm"
                    : "hover:bg-primary/5",
                )}
              >
                <Banknote className="mr-2 h-4 w-4" /> Tiền mặt
                {paymentMethod === "cash" && <Check className="ml-2 h-3 w-3" />}
              </Label>
            </div>
            <div>
              <RadioGroupItem value="transfer" id="transfer" className="sr-only" />
              <Label
                htmlFor="transfer"
                className={cn(
                  "flex h-12 items-center justify-center rounded-md border-2 border-primary/20 bg-transparent px-4 font-medium cursor-pointer transition-all",
                  paymentMethod === "transfer"
                    ? "border-primary bg-primary/10 text-primary shadow-sm"
                    : "hover:bg-primary/5",
                )}
              >
                <QrCode className="mr-2 h-4 w-4" /> QR ngân hàng
                {paymentMethod === "transfer" && <Check className="ml-2 h-3 w-3" />}
              </Label>
            </div>
          </RadioGroup>

          <Button
            className="w-full h-14 text-lg font-bold bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20"
            onClick={handleCheckout}
            disabled={cart.length === 0 || isCreatingOrder}
          >
            <Calculator className="mr-2 h-5 w-5" /> {isCreatingOrder ? "ĐANG TẠO ĐƠN..." : "THANH TOÁN (F9)"}
          </Button>
        </div>
      </div>

        <Dialog open={isCustomerDialogOpen} onOpenChange={setIsCustomerDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Thông tin khách hàng</DialogTitle>
          </DialogHeader>
          <Tabs
            value={customerType}
            onValueChange={(v) => {
              setCustomerType(v as "existing" | "new")
              setCustomerSearch("")
              setNewCustomerName("")
              setNewCustomerPhone("")
            }}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="existing">Khách hàng cũ</TabsTrigger>
              <TabsTrigger value="new">Khách hàng mới</TabsTrigger>
            </TabsList>
            <div className="py-4 space-y-4">
              {customerType === "existing" ? (
                <div className="space-y-2">
                  <Label>Tìm theo số điện thoại</Label>
                  <Input
                    placeholder="Nhập tên hoặc số điện thoại..."
                    value={customerSearch}
                    onChange={(event) => setCustomerSearch(event.target.value)}
                  />
                  <div className="max-h-72 space-y-2 overflow-y-auto">
                      {isLoadingCustomers ? (
                        <div className="p-3 text-center text-sm text-muted-foreground">Đang tải khách hàng...</div>
                      ) : customers.length > 0 ? (
                        customers.map((c) => (
                          <div
                            key={c.id || c.phone}
                            className="p-3 border rounded-md hover:bg-primary/5 cursor-pointer flex justify-between items-center"
                            onClick={() => {
                              setCustomer(c)
                              setIsCustomerDialogOpen(false)
                            }}
                          >
                            <div>
                              <p className="font-medium">{c.name}</p>
                              <p className="text-xs text-muted-foreground">{c.phone}</p>
                            </div>
                            <Check className="h-4 w-4 text-emerald-500 opacity-0 group-hover:opacity-100" />
                          </div>
                        ))
                      ) : (
                        <div className="p-3 text-center text-sm text-muted-foreground">Không tìm thấy khách hàng.</div>
                      )}
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="space-y-1">
                    <Label htmlFor="new-name">Tên khách hàng</Label>
                    <Input
                      id="new-name"
                      placeholder="Nhập họ tên..."
                      value={newCustomerName}
                      onChange={(e) => setNewCustomerName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="new-phone">Số điện thoại</Label>
                    <Input
                      id="new-phone"
                      placeholder="Nhập số điện thoại..."
                      value={newCustomerPhone}
                      onChange={(e) => setNewCustomerPhone(e.target.value)}
                    />
                  </div>
                </div>
              )}
            </div>
          </Tabs>
          <DialogFooter>
            {customerType === "new" && (
              <Button
                className="w-full bg-primary"
                onClick={handleCreateNewCustomer}
                disabled={!newCustomerName.trim() || !newCustomerPhone.trim()}
              >
                Tạo mới và chọn
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
        </Dialog>

        <Dialog open={isVoucherPickerOpen} onOpenChange={setIsVoucherPickerOpen}>
          <DialogContent className="w-[min(92vw,960px)] !max-w-[960px] overflow-hidden border-primary/10 p-0">
            <DialogHeader className="border-b bg-muted/30 px-6 py-5">
              <DialogTitle className="flex items-center gap-2 text-base">
                <TicketPercent className="h-4 w-4 text-primary" />
                Chọn voucher của khách hàng
              </DialogTitle>
              <div className="text-sm text-muted-foreground">
                {customer?.name || "Khách hàng"} có {customerVouchers.length} voucher khả dụng
              </div>
            </DialogHeader>
            <div className="border-b bg-background px-5 py-4">
              <div className="flex items-center gap-3">
                <Input
                  value={voucherSearch}
                  onChange={(event) => setVoucherSearch(event.target.value)}
                  placeholder="Tìm theo mã voucher, mô tả hoặc giá trị giảm..."
                  className="h-10 flex-1 border-primary/15 bg-muted/20 shadow-sm"
                />
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                Có thể tìm theo mã như <span className="font-medium text-foreground">VC7XN3HT</span> hoặc nội dung giảm giá.
              </p>
            </div>
            <div className="bg-background p-4">
              {filteredCustomerVouchers.length === 0 ? (
                <div className="flex min-h-40 items-center justify-center rounded-xl border border-dashed text-sm text-muted-foreground">
                  Không tìm thấy voucher phù hợp.
                </div>
              ) : (
                <>
                  <div className="mb-4 flex items-center justify-between rounded-lg border border-dashed border-primary/15 bg-primary/5 px-3 py-2 text-sm">
                    <span className="text-muted-foreground">
                      Hiển thị{" "}
                      <span className="font-medium text-foreground">
                        {(voucherPage - 1) * voucherPageSize + 1}-{Math.min(voucherPage * voucherPageSize, filteredCustomerVouchers.length)}
                      </span>{" "}
                      trên{" "}
                      <span className="font-medium text-foreground">{filteredCustomerVouchers.length}</span> voucher
                    </span>
                    <span className="text-xs text-muted-foreground">Trang {voucherPage}/{totalVoucherPages}</span>
                  </div>
                  <div className="grid gap-3 md:grid-cols-2">
                    {paginatedCustomerVouchers.map((assignment) => (
                      <button
                        key={assignment.id}
                        type="button"
                        onClick={() => {
                          setVoucherCode(assignment.voucher?.code || "")
                          setVoucherError(null)
                          setIsVoucherPickerOpen(false)
                        }}
                        className={cn(
                          "flex items-start gap-3 rounded-xl border border-border/70 bg-white px-4 py-3 text-left shadow-sm transition-colors hover:border-primary/30 hover:bg-primary/5",
                          voucherCode.trim().toUpperCase() === assignment.voucher?.code?.toUpperCase() && "border-primary/40 bg-primary/5",
                        )}
                      >
                        <Check
                          className={cn(
                            "mt-1 h-4 w-4 text-primary",
                            voucherCode.trim().toUpperCase() === assignment.voucher?.code?.toUpperCase()
                              ? "opacity-100"
                              : "opacity-0",
                          )}
                        />
                        <div className="flex min-w-0 flex-1 items-start justify-between gap-3">
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <div className="font-mono text-sm font-semibold text-primary">
                                {assignment.voucher?.code}
                              </div>
                              <span className="inline-flex h-8 items-center rounded-full bg-primary/10 px-3.5 text-sm font-medium leading-none whitespace-nowrap text-primary">
                                {assignment.status === "available"
                                  ? "Khả dụng"
                                  : assignment.status === "used"
                                    ? "Đã dùng"
                                    : "Hết hạn"}
                              </span>
                            </div>
                            <div className="mt-1 truncate text-xs text-foreground">
                              {assignment.voucher?.description || "Không có mô tả"}
                            </div>
                            <div className="mt-2 text-[11px] text-muted-foreground">
                              HSD: {formatVoucherDate(assignment.expired_at || assignment.voucher?.end_date)}
                            </div>
                          </div>
                          <div className="shrink-0 text-right">
                            <div className="text-base font-semibold text-primary">
                              {assignment.voucher?.discount_type === "percent"
                                ? `${assignment.voucher?.discount_value}%`
                                : `${assignment.voucher?.discount_value?.toLocaleString()} đ`}
                            </div>
                            <div className="mt-1 text-[11px] text-muted-foreground">
                              {assignment.voucher?.discount_type === "percent" ? "Giảm theo phần trăm" : "Giảm theo số tiền"}
                            </div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                  {totalVoucherPages > 1 ? (
                    <div className="mt-4 flex items-center justify-between border-t pt-4">
                      <div className="text-sm text-muted-foreground">Điều hướng danh sách voucher</div>
                      <div className="flex items-center gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => setVoucherPage((current) => Math.max(1, current - 1))}
                          disabled={voucherPage === 1}
                        >
                          Trước
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => setVoucherPage((current) => Math.min(totalVoucherPages, current + 1))}
                          disabled={voucherPage === totalVoucherPages}
                        >
                          Sau
                        </Button>
                      </div>
                    </div>
                  ) : null}
                </>
              )}
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={isReceiptDialogOpen} onOpenChange={setIsReceiptDialogOpen}>
        <DialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-[760px]">
          <DialogHeader>
            <DialogTitle className="text-center">HÓA ĐƠN BÁN HÀNG</DialogTitle>
          </DialogHeader>
          <div
            ref={receiptPrintRef}
            className="receipt-root mx-auto w-full max-w-[560px] space-y-4 rounded-md border bg-neutral-50 p-6 text-[14px] leading-6 text-stone-800"
          >
            <div className="receipt-header flex items-start justify-between gap-4">
              <div className="receipt-brand flex items-center gap-1 text-3xl font-bold tracking-tight text-blue-900">
                <span className="receipt-logo text-blue-500">◖</span>
                <span>KiotViet</span>
              </div>
              <div className="receipt-store space-y-0.5 text-right text-xs text-stone-700">
                <p>1B Yết Kiêu, Hà Đông, Hà Nội</p>
                <p>+84 734623232</p>
                <p>kiotviet@gmail.com</p>
                <p>https://kiot-blush.vercel.app/</p>
              </div>
            </div>
            <div className="receipt-separator border-t border-dashed border-stone-500" />
            <div className="receipt-title text-center">
              <h2 className="text-5xl font-semibold leading-tight">Hóa đơn bán hàng</h2>
              <p className="receipt-code mt-1 text-4xl font-bold text-sky-500">{receiptSnapshot?.orderCode || "HD00000"}</p>
            </div>
            <div className="receipt-info mt-3 space-y-0.5 text-lg leading-8">
              <p>Khách hàng: {receiptSnapshot?.customerName || "Khách lẻ"}</p>
              <p>
                Số điện thoại:{" "}
                {receiptSnapshot?.customerPhone
                  ? `${"*".repeat(Math.max(0, receiptSnapshot.customerPhone.length - 3))}${receiptSnapshot.customerPhone.slice(-3)}`
                  : "Chưa cập nhật"}
              </p>
              <p>Địa chỉ: {receiptSnapshot?.customerAddress || "Chưa cập nhật"}</p>
              <p>Nhân viên bán hàng: {receiptSnapshot?.cashierName || "Admin"}</p>
              <p>Ngày bán: {receiptSnapshot?.createdAt || new Date().toLocaleString()}</p>
            </div>
            <div className="receipt-separator border-t border-dashed border-stone-500" />
            <table className="receipt-table w-full border-collapse text-lg leading-8">
              <thead>
                <tr>
                  <th className="py-1 text-left">Tên sản phẩm</th>
                  <th className="py-1 text-center">SL</th>
                  <th className="text-right">T.Tiền</th>
                </tr>
              </thead>
              <tbody>
                {(receiptSnapshot?.items || []).map((item) => (
                  <tr key={item.id} className="border-b border-dashed border-gray-300">
                    <td className="py-2">
                      <p className="font-semibold">{item.name}</p>
                      <p>
                        ({item.color} - {item.size})
                      </p>
                    </td>
                    <td className="text-center align-top py-2">{item.quantity}</td>
                    <td className="text-right align-top py-2">{(item.quantity * item.price).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="receipt-separator border-t border-dashed border-stone-500" />
            <div className="receipt-summary ml-auto w-[62%] text-xl leading-9">
              <div className="receipt-summary-row flex items-center justify-between">
                <span>Tổng tiền hàng:</span>
                <span>{(receiptSnapshot?.total || 0).toLocaleString()}</span>
              </div>
              <div className="receipt-summary-row flex items-center justify-between">
                <span>VAT:</span>
                <span>0</span>
              </div>
              <div className="receipt-summary-row flex items-center justify-between">
                <span>Chiết khấu:</span>
                <span>0</span>
              </div>
              <div className="receipt-separator my-2 border-t border-dashed border-stone-500" />
              <div className="receipt-summary-row receipt-total flex items-center justify-between text-2xl font-bold">
                <span>Tổng tiền:</span>
                <span>{(receiptSnapshot?.total || 0).toLocaleString()}</span>
              </div>
            </div>
            {bankQrPayload?.qr_url ? (
              <div className="receipt-qr flex justify-center pt-2">
                <img src={bankQrPayload.qr_url} alt="QR thanh toán" className="h-44 w-44 rounded-sm border bg-white p-1" />
              </div>
            ) : null}
            <div className="text-center pt-2 italic text-base">
              <p>Hình thức thanh toán: {receiptSnapshot?.paymentMethod === "cash" ? "Tiền mặt" : "Chuyển khoản QR"}</p>
            </div>
          </div>
          <DialogFooter className="grid grid-cols-2 gap-2">
            <Button variant="outline" onClick={() => setIsReceiptDialogOpen(false)}>
              Đóng
            </Button>
            <Button className="bg-primary" onClick={handlePrintReceipt}>
              <Printer className="mr-2 h-4 w-4" /> In hóa đơn
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isBankQrDialogOpen} onOpenChange={setIsBankQrDialogOpen}>
        <DialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-[560px]">
          <DialogHeader>
            <DialogTitle className="text-center">THANH TOÁN QR NGÂN HÀNG</DialogTitle>
          </DialogHeader>
          {bankQrPayload ? (
            <div className="space-y-4">
              <div className="rounded-lg border p-3 text-sm">
                <p>
                  Mã đơn: <span className="font-semibold">{bankQrPayload.order_code}</span>
                </p>
                <p>
                  Số tiền: <span className="font-semibold">{bankQrPayload.amount.toLocaleString()} đ</span>
                </p>
                <p>
                  Ngân hàng: <span className="font-semibold">{bankQrPayload.bank_name}</span>
                </p>
                <p>
                  STK: <span className="font-semibold">{bankQrPayload.account_no}</span>
                </p>
                <p>
                  Chủ TK: <span className="font-semibold">{bankQrPayload.account_name}</span>
                </p>
              </div>
              <div className="flex justify-center">
                <img
                  src={bankQrPayload.qr_url}
                  alt="Mã QR thanh toán ngân hàng"
                  className="h-72 w-72 rounded-lg border object-contain"
                />
              </div>
              <div className="rounded-lg border bg-muted/20 p-3 text-sm">
                <p className="mb-1 font-medium">Nội dung chuyển khoản</p>
                <div className="flex items-center justify-between gap-2">
                  <code className="truncate">{bankQrPayload.transfer_content}</code>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      void navigator.clipboard.writeText(bankQrPayload.transfer_content)
                    }}
                  >
                    <Copy className="mr-1 h-3.5 w-3.5" /> Copy
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Không có dữ liệu QR.</p>
          )}
          <DialogFooter className="grid grid-cols-2 gap-2">
            <Button variant="outline" onClick={() => setIsBankQrDialogOpen(false)}>
              Đóng
            </Button>
            <Button
              onClick={() => {
                setIsBankQrDialogOpen(false)
                setIsReceiptDialogOpen(true)
              }}
            >
              Xem hóa đơn
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

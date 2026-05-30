export interface CustomerSummary {
  id: number
  name: string
  email?: string
  phone_number?: string
}

export interface UserSummary {
  id: number
  name: string
  email?: string
}

export interface OrderItemSummary {
  id: number
  order_id: number
  product_id: number
  variant_id: number | null
  quantity: number
  price: number
  total: number
}

export interface OrderApiResponse {
  id: number
  order_code: string
  customer_id: number | null
  user_id: number | null
  total_quantity: number
  total_amount: number
  payment_method: string
  channel: "online" | "in_store" | string
  status: string
  note: string | null
  customer?: CustomerSummary | null
  user?: UserSummary | null
  orderItems?: OrderItemSummary[]
  created_at: string
  updated_at: string
}

export interface OrderView {
  id: number
  code: string
  time: string
  customer: string
  channel: "online" | "in_store" | string
  total: number
  status: string
  payment: string
  itemCount: number
}

export interface PaginationState {
  total: number
  page: number
  limit: number
  totalPages: number
}

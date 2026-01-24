// API Response types
export interface ApiResponse<T> {
  data?: T;
  users?: T;
  products?: T;
  orders?: T;
  message?: string;
  pagination?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// Common types
export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface SearchParams {
  search?: string;
  [key: string]: any;
}

// Auth types
export interface LoginForm {
  username: string;
  password: string;
}

export interface AuthUser {
  id: number;
  username: string;
  name: string;
  email: string;
  role?: {
    id: number;
    name: string;
  };
  status: number;
}

// Statistics types
export interface StatisticsResponse {
  period: string;
  dateRange: {
    current: { start: string; end: string };
    previous: { start: string; end: string };
  };
  statistics: {
    revenue: MetricData;
    orders: MetricData;
    newCustomers: MetricData;
    estimatedProfit: MetricData;
  };
  summary: {
    totalOrders: number;
    totalCustomers: number;
    totalRevenue: number;
    averageOrderValue: number;
  };
}

export interface MetricData {
  current: number;
  previous: number;
  change: number;
  trend: 'up' | 'down';
}

export interface ChartData {
  label: string;
  revenue: number;
  orders: number;
  date: string;
  revenuePercentage?: number;
  ordersPercentage?: number;
}

// Generic types for future use
export interface BaseEntity {
  id: number;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
}

export interface SelectOption {
  value: string | number;
  label: string;
}
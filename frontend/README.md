# Kiot Frontend - Next.js 16 + TypeScript + React 19

Hệ thống frontend cho Kiot POS được xây dựng với Next.js 16, TypeScript và React 19.

## ⚠️ Quan trọng: Cài đặt Dependencies

Trước khi chạy project, bạn cần cài đặt tất cả dependencies:

```bash
cd frontend
npm install
```

Nếu gặp lỗi dependency conflicts, sử dụng:

```bash
npm install --legacy-peer-deps
```

## 🚀 Chạy project

```bash
# 1. Cài đặt dependencies
npm install

# 2. Cấu hình environment (tạo file .env.local)
cp .env.local.example .env.local

# 3. Chạy development server
npm run dev
```

Truy cập [http://localhost:3000](http://localhost:3000) để xem kết quả.

## 🔧 Cấu hình Environment

Tạo file `.env.local` trong thư mục frontend:

```env
# Backend API URL - Thay đổi port nếu backend chạy trên port khác
NEXT_PUBLIC_API_URL=http://localhost:3001

# Application settings
NEXT_PUBLIC_APP_NAME=Kiot POS
NEXT_PUBLIC_APP_VERSION=1.0.0
```

**Lưu ý**: Đừng commit file `.env.local` vào git. Nó đã được thêm vào `.gitignore`.

## 📚 Thư viện đã setup

### Core
- **Next.js 16** - React framework với App Router
- **React 19** - React library mới nhất
- **TypeScript** - Type-safe JavaScript

### API & Data
- **Axios** - HTTP client cho API calls
- **@tanstack/react-query** - Data fetching và caching
- **React Hot Toast** - Toast notifications

### UI & Charts
- **Tailwind CSS v4** - Utility-first CSS framework
- **Recharts** - Chart library cho biểu đồ
- **Lucide React** - Icon library

### Development
- **ESLint** - Code linting
- **TypeScript** - Type checking

## 🔗 Kết nối Backend APIs

Frontend đã được cấu hình để proxy tất cả `/api/*` requests đến backend. Các API endpoints có sẵn:

### Authentication
- `POST /api/auth/login` - Đăng nhập
- `POST /api/auth/register` - Đăng ký

### Statistics (Riêng biệt)
- `GET /api/statistics/overview` - Thống kê tổng quan
- `GET /api/statistics/revenue-bar-chart` - Biểu đồ cột doanh thu
- `GET /api/statistics/category-revenue-pie` - Biểu đồ tròn danh mục

### Products
- `GET /api/products` - Lấy danh sách (có filter: category_id, brand_id, name, status)
- `POST /api/products` - Tạo sản phẩm mới

### Orders
- `POST /api/orders` - Tạo đơn hàng với items
- `GET /api/orders` - Lấy danh sách đơn hàng

### Users
- `GET /api/users` - Lấy danh sách (filter: role_id, status, name)

## 📁 Cấu trúc dự án

```
frontend/
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── layout.tsx      # Root layout
│   │   ├── page.tsx        # Home page
│   │   └── globals.css     # Global styles
│   ├── lib/                # Utilities & API client
│   │   ├── api.ts         # Axios API client
│   │   └── utils.ts       # Helper functions
│   └── types/              # TypeScript types
│       └── index.ts
├── public/                 # Static assets
├── next.config.js          # Next.js configuration
├── tsconfig.json           # TypeScript config
└── package.json
```

## 🎯 Hướng dẫn phát triển

### 1. API Client
Sử dụng API client đã được setup trong `src/lib/api.ts`:

```typescript
import api from '@/lib/api'

// GET request
const response = await api.get('/products')

// POST request
const newProduct = await api.post('/products', productData)
```

### 2. React Query
Sử dụng React Query cho data fetching:

```typescript
import { useQuery, useMutation } from '@tanstack/react-query'

function ProductsPage() {
  const { data: products, isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: () => api.get('/products').then(res => res.data)
  })

  // ... rest of component
}
```

### 3. TypeScript Types
Sử dụng types đã được định nghĩa trong `src/types/index.ts`:

```typescript
import type { ApiResponse, Product } from '@/types'

interface ProductsResponse extends ApiResponse<Product[]> {}
```

### 4. Utility Functions
Sử dụng helper functions từ `src/lib/utils.ts`:

```typescript
import { formatCurrency, formatDate, cn } from '@/lib/utils'

// Format currency
const price = formatCurrency(100000) // "₫100,000"

// Format date
const date = formatDate('2024-01-15') // "15/01/2024"

// CSS class merging
const classes = cn('btn', 'btn-primary', isActive && 'active')
```

## 🚀 Scripts

- `npm run dev` - Chạy development server
- `npm run build` - Build cho production
- `npm run start` - Chạy production server
- `npm run lint` - Chạy ESLint

## 📱 Cấu trúc Pages đề xuất

Dựa trên backend APIs, bạn có thể tạo các pages sau:

- `/` - Dashboard với thống kê
- `/login` - Đăng nhập
- `/products` - Quản lý sản phẩm
- `/orders` - Quản lý đơn hàng
- `/customers` - Quản lý khách hàng
- `/statistics` - Báo cáo và biểu đồ
- `/users` - Quản lý người dùng

## 🎨 Styling

Project sử dụng Tailwind CSS v4 với dark mode support. Bạn có thể:

- Sử dụng Tailwind classes trực tiếp
- Tạo custom components với class merging
- Sử dụng CSS variables cho theming

## 🔄 Development Workflow

1. **Tạo component**: Trong thư mục `src/components/`
2. **Tạo page**: Trong thư mục `src/app/`
3. **Tạo hook**: Trong thư mục `src/hooks/`
4. **Thêm type**: Trong `src/types/index.ts`
5. **Test API**: Sử dụng Swagger UI tại backend

---

**Backend API Documentation**: http://localhost:3001/api-docs

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

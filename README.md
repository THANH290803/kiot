# Kiot - Point of Sale System

Hệ thống quản lý điểm bán hàng với kiến trúc monorepo (backend + frontend).

## 🏗️ Cấu trúc dự án

```
kiot-monorepo/
├── backend/                    # Node.js + Express API
│   ├── src/                   # Source code
│   ├── migrations/            # Database migrations
│   ├── config/                # Configuration files
│   ├── package.json
│   └── Dockerfile
├── frontend/                  # Next.js + TypeScript (bạn tự setup)
│   └── package.json          # Basic package.json để bắt đầu
├── docker-compose.yml         # Docker orchestration
├── package.json              # Root package.json
└── README.md
```

## 🚀 Cài đặt và chạy

### Cách 1: Sử dụng Docker (Khuyến nghị)

```bash
# 1. Clone repository
git clone <your-repo-url>
cd kiot

# 2. Tạo file .env cho backend
cp backend/.env.example backend/.env

# 3. Chạy tất cả services
docker-compose up --build

# Services sẽ chạy trên:
# - Frontend: http://localhost:3000
# - Backend API: http://localhost:3001
# - Database: localhost:3306
# - phpMyAdmin: http://localhost:8080
```

### Cách 2: Chạy local

```bash
# 1. Cài đặt dependencies
npm run install:all

# 2. Setup database (MySQL)
# Tạo database 'kiot' và chạy migrations

# 3. Chạy backend
cd backend
npm run migrate
npm run dev

# 4. Setup frontend (bạn tự làm)
cd frontend
npm install
# Sau đó tạo cấu trúc Next.js + TypeScript theo ý muốn
npm run dev
```

## 📋 API Documentation

Backend cung cấp API documentation tại: `http://localhost:3001/api-docs`

### Các API chính:

#### 🔐 Authentication
- `POST /api/auth/login` - Đăng nhập
- `POST /api/auth/register` - Đăng ký

#### 📊 Statistics (Riêng biệt)
- `GET /api/statistics/overview` - Thống kê tổng quan
- `GET /api/statistics/revenue-bar-chart` - Biểu đồ cột doanh thu
- `GET /api/statistics/category-revenue-pie` - Biểu đồ tròn danh mục

#### 📦 Products
- `GET /api/products` - Lấy danh sách sản phẩm (có filter)
- `POST /api/products` - Tạo sản phẩm mới

#### 🛒 Orders
- `POST /api/orders` - Tạo đơn hàng với items
- `GET /api/orders` - Lấy danh sách đơn hàng

#### 👥 Users
- `GET /api/users` - Lấy danh sách user (có filter role/status)

## 🔧 Cấu hình

### Backend (.env)
```env
NODE_ENV=development
APP_PORT=3001
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=password
DB_NAME=kiot
JWT_SECRET=your-super-secret-jwt-key
CLOUDINARY_URL=cloudinary://api_key:api_secret@cloud_name
```

### Frontend
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## 📊 Tính năng thống kê

### Biểu đồ cột doanh thu
- Theo giờ: 24 giờ gần nhất
- Theo ngày: 7 ngày gần nhất
- Theo tuần: 4 tuần gần nhất
- Theo tháng: 12 tháng gần nhất

### Biểu đồ tròn danh mục
- Phân tích tỷ trọng doanh thu theo danh mục sản phẩm
- Hiển thị phần trăm đóng góp của mỗi danh mục

### Thống kê so sánh
- So sánh với kỳ trước (giờ/ngày/tuần/tháng)
- Hiển thị % tăng/giảm
- Trend indicators (lên/xuống)

## 🎨 Frontend Setup (Tự làm)

Thư mục `frontend/` đã có sẵn `package.json` cơ bản. Bạn có thể:

### 1. Khởi tạo Next.js với TypeScript:
```bash
cd frontend
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"
```

### 2. Cài đặt thêm dependencies:
```bash
npm install axios @tanstack/react-query react-hot-toast recharts lucide-react
npm install -D @types/node tailwindcss-animate
```

### 3. Cấu hình API:
- Tạo file `src/lib/api.ts` để connect với backend
- Sử dụng `NEXT_PUBLIC_API_URL=http://localhost:3001` trong `.env.local`

### 4. Cấu trúc gợi ý:
```
frontend/src/
├── app/           # Next.js App Router
├── components/    # UI Components
├── lib/          # Utilities & API client
├── hooks/        # Custom React hooks
└── types/        # TypeScript types
```

## 🛠️ Công nghệ sử dụng

### Backend
- **Node.js** + **Express.js**
- **Sequelize ORM** + **MySQL**
- **JWT Authentication**
- **Cloudinary** cho upload ảnh
- **Swagger** documentation

### Frontend (tự setup)
- **Next.js 14** + **TypeScript**
- **Tailwind CSS** + **Custom UI components**
- **Axios** + **React Query** cho API calls
- **Recharts** cho biểu đồ thống kê
- **React Hot Toast** cho notifications

### Frontend (tự setup)
- **Next.js 14** + **TypeScript**
- **Tailwind CSS** (khuyến nghị)
- **React Query** cho state management
- **Recharts** cho biểu đồ

### DevOps
- **Docker** + **Docker Compose**
- **ESLint** + **Prettier**
- **Nodemon** cho development

## 📝 Scripts hữu ích

```bash
# Chạy tất cả services
npm run dev

# Chỉ chạy backend
npm run dev:backend

# Chỉ chạy frontend
npm run dev:frontend

# Build production
npm run build

# Migrate database
npm run migrate

# Seed database
npm run seed
```

## 🔒 Bảo mật

- JWT token authentication
- Password hashing với bcrypt
- CORS protection
- Rate limiting
- Input validation với Joi

## 📚 API Response Format

```json
{
  "success": true,
  "data": { /* response data */ },
  "message": "Success message",
  "pagination": {
    "total": 100,
    "page": 1,
    "limit": 10,
    "totalPages": 10
  }
}
```

## 🤝 Đóng góp

1. Fork project
2. Tạo feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Tạo Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Liên hệ

- Email: your-email@example.com
- GitHub: [your-github](https://github.com/your-github)

---

**Lưu ý**: Frontend folder hiện tại chỉ có cấu trúc cơ bản. Bạn cần tự setup giao diện Next.js + TypeScript theo yêu cầu của mình.
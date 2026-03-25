# Kiot Monorepo

Monorepo hệ thống POS gồm:
- Backend API (`Node.js + Express + Sequelize + MySQL`)
- Frontend (`Next.js App Router + TypeScript`)

## Cấu trúc dự án

```text
kiot/
├── backend/
│   ├── src/
│   ├── migrations/
│   ├── docs/
│   ├── package.json
│   └── Dockerfile
├── frontend/
│   ├── src/
│   ├── docs/
│   ├── package.json
│   └── ARCHITECTURE.md
├── docker-compose.yml
├── package.json
└── README.md
```

## Yêu cầu môi trường

- Node.js `>= 18`
- npm `>= 8`
- MySQL `8.x`

## Chạy local nhanh

1. Cài dependencies:

```bash
npm install
npm install --workspace=backend
npm install --workspace=frontend
```

2. Tạo database MySQL (ví dụ: `kiot`) và cấu hình `backend/.env`.

3. Chạy migrations:

```bash
npm run migrate
```

4. Chạy backend + frontend:

```bash
npm run dev
```

## URLs mặc định

- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:3001`
- Health: `http://localhost:3001/health`
- Swagger: `http://localhost:3001/api/docs`

## Scripts root

```bash
npm run dev           # chạy backend + frontend
npm run dev:backend   # chạy backend
npm run dev:frontend  # chạy frontend
npm run build         # build frontend
npm run start         # start backend + frontend
npm run migrate       # chạy migrations backend
npm run seed          # chạy seeders backend
```

## Docker

Repo hiện có:
- `backend/Dockerfile`
- `docker-compose.yml` (backend + frontend + mysql + phpmyadmin)

Lưu ý:
- `docker-compose.yml` đang khai báo service frontend dùng `frontend/Dockerfile`.
- Hiện repo chưa có `frontend/Dockerfile`, nên compose full sẽ lỗi build frontend cho đến khi bổ sung file này.

## Backend API

Base URL: `http://localhost:3001/api`

Nhóm endpoint chính:
- `auth`: login, logout
- `users`: CRUD user, đổi trạng thái
- `roles`, `permission-groups`, `permissions`: quản lý phân quyền
- `categories`, `brands`, `colors`, `sizes`: danh mục thuộc tính
- `customers`: CRUD + tìm kiếm + phân trang
- `products`, `product-variants`, `images`: quản lý hàng hóa + ảnh
- `orders`, `order-items`: quản lý đơn hàng
- `statistics`: báo cáo/tổng quan
- `payments`: Bank QR create/confirm

Chi tiết request/response xem trên Swagger: `http://localhost:3001/api/docs`

## Frontend

Frontend chia module theo route group:
- `src/app/admin/*`: admin dashboard
- `src/app/user/*`: storefront
- `src/features/admin/*`: hooks/services/components admin
- `src/features/user/*`: hooks/providers/components user
- `src/shared/*`: API client, providers, utils, types dùng chung

Route nổi bật:
- `/` landing page
- `/admin/login`
- `/admin/dashboard`, `/admin/products`, `/admin/orders`, `/admin/reports`, ...
- `/user/home`, `/user/shop`, `/user/cart`, `/user/checkout`, `/user/profile`

## Biến môi trường frontend

```env
NEXT_PUBLIC_API_URL=
NEXT_PUBLIC_API_URL_QA=
NEXT_PUBLIC_APP_NAME=
NEXT_PUBLIC_APP_VERSION=
```

Logic base URL trong `frontend/src/shared/lib/api/client.ts`:
- Development: ưu tiên `NEXT_PUBLIC_API_URL`
- Production: ưu tiên `NEXT_PUBLIC_API_URL_QA`, fallback `NEXT_PUBLIC_API_URL`

## Biến môi trường backend

```env
APP_PORT=
JWT_SECRET=

DB_HOST=
DB_PORT=
DB_USER=
DB_PASSWORD=
DB_NAME=
DB_DIALECT=
DB_TIMEZONE=

CLOUDINARY_URL=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
CLOUDINARY_FOLDER=
API_KEY=
API_SECRET=

BANK_QR_BIN=
BANK_QR_ACCOUNT_NO=
BANK_QR_ACCOUNT_NAME=
BANK_QR_BANK_NAME=
BANK_QR_TEMPLATE=
BANK_QR_DEFAULT_CONTENT=
```

## CI/CD

Workflow: `.github/workflows/ci-kiot.yml`

- Push `develop` hoặc `main` -> install deps, test backend, build frontend
- `develop` -> verify deploy DEV
- `main` -> production deploy status job

## Tài liệu chi tiết

Frontend:
- `frontend/docs/README.md`
- `frontend/ARCHITECTURE.md`

Backend:
- `backend/docs/README.md`

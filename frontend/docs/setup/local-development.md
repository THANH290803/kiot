# Local Development

## 1. Chạy backend

Tại root monorepo:

```bash
npm install
npm install --workspace=backend
npm run migrate
npm run dev:backend
```

Backend mặc định chạy `http://localhost:3001`.

## 2. Cấu hình frontend env

Tạo/cập nhật `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_APP_NAME=Kiot POS
NEXT_PUBLIC_APP_VERSION=1.0.0
```

## 3. Chạy frontend

```bash
npm install --workspace=frontend
npm run dev:frontend
```

Frontend mặc định chạy `http://localhost:3000`.

## 4. Kiểm tra nhanh

- Frontend root: `http://localhost:3000`
- User storefront: `http://localhost:3000/user/home`
- Admin login: `http://localhost:3000/admin/login`
- Backend health: `http://localhost:3001/health`
- Swagger: `http://localhost:3001/api/docs`

## 5. Vấn đề thường gặp

- `401` liên tục ở admin: xóa `localStorage.token` rồi login lại.
- Lỗi CORS: kiểm tra backend `allowedOrigins` có chứa origin frontend hiện tại.
- Sai API URL: kiểm tra `NEXT_PUBLIC_API_URL`.

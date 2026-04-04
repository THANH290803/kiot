# Local Development

## 1. Cài dependencies

```bash
cd backend
npm install
```

## 2. Cấu hình môi trường

Tạo/điền `backend/.env` (xem chi tiết ở `setup/environment.md`).

## 3. Chạy migrations

```bash
npm run migrate
```

## 4. Chạy server

```bash
npm run dev
```

## 5. Kiểm tra nhanh

- `GET http://localhost:3001/health` -> `{ status: "ok", service: "backend" }`
- `GET http://localhost:3001/` -> API running
- `GET http://localhost:3001/api/docs` -> Swagger UI

## Ghi chú port

- App đọc `APP_PORT`, mặc định `3001`.
- Nếu port bận, server tự tăng port kế tiếp (tối đa 10 lần thử).

# Deployment

## Build frontend

Từ root monorepo:

```bash
npm install
npm install --workspace=frontend
npm run build --workspace=frontend
```

## Production env tối thiểu

```env
NEXT_PUBLIC_API_URL=https://<backend-domain>
NEXT_PUBLIC_API_URL_QA=https://<qa-backend-domain>
NEXT_PUBLIC_APP_NAME=Kiot POS
NEXT_PUBLIC_APP_VERSION=1.0.0
```

## CI tham chiếu

Workflow hiện tại: `.github/workflows/ci-kiot.yml`

- Build & test khi push `develop` hoặc `main`.
- Có bước verify deploy cho môi trường develop.

## Post-deploy checks

1. Mở frontend URL và kiểm tra route `/admin/login`, `/user/home`.
2. Login admin và gọi thử dữ liệu dashboard/orders.
3. Kiểm tra upload ảnh sản phẩm (nếu đã cấu hình Cloudinary).
4. Tạo đơn hàng POS với phương thức QR ngân hàng và kiểm tra dialog QR hiển thị đúng.
5. Kiểm tra console/network không có lỗi CORS/401 bất thường.

# API Environment

## Env keys đang dùng

Frontend hiện sử dụng các biến:

- `NEXT_PUBLIC_API_URL`
- `NEXT_PUBLIC_API_URL_QA`
- `NEXT_PUBLIC_APP_NAME`
- `NEXT_PUBLIC_APP_VERSION`

Các file env hiện có:

- `.env.local`
- `.env.development`
- `.env.production`

## Cách chọn base URL

Trong `src/shared/lib/api/client.ts`:

- Khi `NODE_ENV=development`:
  - ưu tiên `NEXT_PUBLIC_API_URL`
  - fallback `http://localhost:3001`
- Khi production:
  - ưu tiên `NEXT_PUBLIC_API_URL_QA`
  - fallback `NEXT_PUBLIC_API_URL`
  - fallback cuối `http://localhost:3001`

## Khuyến nghị cấu hình local

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_APP_NAME=Kiot POS
NEXT_PUBLIC_APP_VERSION=1.0.0
```

## Lưu ý

- Nếu backend đổi port, bắt buộc cập nhật `NEXT_PUBLIC_API_URL`.
- Frontend hiện không dùng Next.js API proxy layer; gọi trực tiếp backend URL.

# Request Lifecycle

Luồng xử lý chuẩn trong backend:

1. Request vào Express app.
2. CORS check theo `allowedOrigins`.
3. Route matcher theo prefix `/api/*`.
4. (Nếu có) `authMiddleware` verify JWT từ `Authorization` header.
5. Controller validate input và thao tác model Sequelize.
6. Trả JSON response + HTTP status phù hợp.

## Ví dụ endpoint protected

`PATCH /api/orders/:id/status`:

- Route -> `authMiddleware` -> `orderController`.
- Middleware decode JWT và gắn `req.user`.
- Controller cập nhật order status trong DB.

## Ví dụ endpoint upload

`POST /api/images/upload`:

- Route dùng `upload.array("images", 10)`.
- Multer + CloudinaryStorage upload file lên Cloudinary.
- Controller nhận thông tin URL ảnh và lưu bản ghi DB.

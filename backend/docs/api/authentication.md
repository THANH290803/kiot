# Authentication

Backend dùng JWT theo mô hình stateless.

## Login

- Endpoint: `POST /api/auth/login`
- Body: `username`, `password`
- Response trả:
  - `token`
  - `expires_at`
  - `user` object

## Bearer token

Endpoint protected yêu cầu header:

```http
Authorization: Bearer <token>
```

`authMiddleware` sẽ:

1. Kiểm tra header tồn tại.
2. Parse token từ Bearer format.
3. `jwt.verify(token, JWT_SECRET)`.
4. Gắn payload vào `req.user`.

Nếu fail -> `401 Unauthorized`.

## Logout

- Endpoint: `POST /api/auth/logout`
- Backend không quản lý session state, chỉ trả thông báo thành công.
- Client tự xóa token local.

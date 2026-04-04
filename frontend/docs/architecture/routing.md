# Routing

## Redirects

- `/admin` -> `/admin/login`
- `/login` -> `/admin/login`
- `/user` -> `/user/home`

## Admin routes

Thư mục vật lý: `src/app/admin/(protected)/*`.
URL thực tế không chứa `(protected)`:

- `/admin/dashboard`
- `/admin/pos`
- `/admin/products`
- `/admin/products/:id`
- `/admin/orders`
- `/admin/orders/:id`
- `/admin/customers`
- `/admin/employees`
- `/admin/employees/:id`
- `/admin/attributes`
- `/admin/brands`
- `/admin/categories`
- `/admin/roles`
- `/admin/permissions`
- `/admin/permission-groups`
- `/admin/reports`
- `/admin/settings`
- `/admin/profile`

## User routes

- `/user/home`
- `/user/shop`
- `/user/product/:id`
- `/user/cart`
- `/user/checkout`
- `/user/login`
- `/user/signup`
- `/user/profile`

## Payment flow notes

- Luồng QR ngân hàng hiện không cần route return riêng trên frontend.
- POS gọi `POST /api/payments/bank-qr/create` để lấy QR.
- Khi đã nhận tiền, admin xác nhận đơn qua endpoint `PATCH /api/payments/bank-qr/:orderId/confirm`.

## Layout ownership

- `src/app/layout.tsx`: root layout + global providers
- `src/app/admin/(protected)/layout.tsx`: admin guard + admin shell
- `src/app/user/layout.tsx`: `UserProviders` (auth/cart cho storefront)

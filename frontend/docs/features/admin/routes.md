# Admin Routes

## Public

- `/admin/login`

## Protected

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

## Guard behavior

- Nếu chưa có session hợp lệ trong `AuthContext`, guard redirect về `/admin/login`.
- Khi API trả `401`, Axios interceptor xóa session local và redirect `/admin/login`.

# API Routes Map

Route mount trong `src/app.js`:

- `/api/auth` -> `auth.routes.js`
- `/api/users` -> `user.routes.js`
- `/api/roles` -> `role.routes.js`
- `/api/permission-groups` -> `permission_group.routes.js`
- `/api/permissions` -> `permission.route.js`
- `/api/categories` -> `category.route.js`
- `/api/brands` -> `brand.routes.js`
- `/api/colors` -> `color.routes.js`
- `/api/sizes` -> `size.routes.js`
- `/api/customers` -> `customer.routes.js`
- `/api/products` -> `product.routes.js`
- `/api/product-variants` -> `product_variant.routes.js`
- `/api/images` -> `image.routes.js`
- `/api/orders` -> `order.routes.js`
- `/api/order-items` -> `order_item.routes.js`
- `/api/statistics` -> `statistics.routes.js`
- `/api/payments` -> `payment.routes.js`

## Nhóm chức năng chính

- Auth + RBAC: users, roles, permission-groups, permissions.
- Catalog: categories, brands, colors, sizes, products, product-variants, images.
- Sales: customers, orders, order-items, payments.
- Analytics: statistics.

Chi tiết request/response theo từng endpoint xem tại Swagger `/api/docs`.

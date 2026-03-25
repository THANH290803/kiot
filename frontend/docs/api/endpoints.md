# API Endpoints

Danh sách dưới đây là các endpoint frontend admin/user đang gọi trong code hiện tại.

## Auth

- `POST /api/auth/login`

## Dashboard/Reports

- `GET /api/statistics/overview`
- `GET /api/statistics/revenue-chart`
- `GET /api/statistics/revenue-bar-chart`
- `GET /api/statistics/category-revenue-pie`
- `GET /api/statistics/top-products`

## Products / Variants / Images

- `GET /api/products/get-all-with-variants`
- `GET /api/products/get-details-with-variants/:id`
- `POST /api/products/create-with-variants`
- `PATCH /api/products/:id`
- `PATCH /api/products/:id/status`
- `DELETE /api/products/:id`
- `PATCH /api/product-variants/:id`
- `DELETE /api/product-variants/:id`
- `POST /api/images/upload`
- `GET /api/products/export/excel`

## Attributes

- `GET/POST/PATCH/DELETE /api/colors`
- `GET/POST/PATCH/DELETE /api/sizes`
- `GET/POST/PATCH/DELETE /api/categories`
- `GET/POST/PATCH/DELETE /api/brands`

## Orders

- `GET /api/orders`
- `PATCH /api/orders/:id/status`
- `GET /api/orders/:id`
- `POST /api/orders`

## Customers

- `GET /api/customers`

## Employees / Users

- `GET /api/users`
- `POST /api/users`
- `PATCH /api/users/:id`
- `PATCH /api/users/:id/status`
- `DELETE /api/users/:id`

## Roles / Permissions

- `GET/POST/PATCH/DELETE /api/roles`
- `PATCH /api/roles/:id/permissions`
- `GET/POST/PATCH/DELETE /api/permission-groups`
- `GET/POST/PATCH/DELETE /api/permissions`

## Payments (QR ngân hàng flow)

- `POST /api/payments/bank-qr/create`
- `PATCH /api/payments/bank-qr/:orderId/confirm`

## Ghi chú

- Nhiều endpoint có yêu cầu Bearer token.
- Chi tiết schema request/response tra cứu tại Swagger backend: `http://localhost:3001/api/docs`.

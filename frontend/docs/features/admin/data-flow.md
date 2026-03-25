# Admin Data Flow

## Luồng chuẩn

1. Route page (`src/app/admin/(protected)/*/page.tsx`) render screen/component.
2. Screen dùng hook feature để quản lý filter/state/pagination.
3. Hook gọi service hoặc `api` trực tiếp tới backend.
4. Dữ liệu API được map sang view model trước khi render.
5. Mutation xong cập nhật state local hoặc refetch.

## Ví dụ: Orders page

1. Route `/admin/orders` render page.
2. `useOrdersPage` gọi `GET /api/orders` với params filter.
3. Hook map dữ liệu sang `OrderView`.
4. UI render bảng + action chuyển trạng thái.
5. Khi đổi trạng thái, hook gọi `PATCH /api/orders/:id/status`.

## Ví dụ: Products page

1. `useProductsPage` tải categories + brands.
2. Gọi `GET /api/products/get-all-with-variants`.
3. Map API product + variants + images sang `ProductView`.
4. CRUD dùng endpoint products/product-variants/images.

## Auth + permission flow

- Login: `authService.login` -> nhận token/user -> lưu localStorage.
- Request kế tiếp tự có Bearer token.
- Nếu token hết hạn, interceptor xử lý logout cưỡng bức.

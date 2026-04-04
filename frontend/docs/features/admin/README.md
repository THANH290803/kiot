# Admin Feature Docs

Admin là luồng vận hành chính cho POS: đăng nhập, dashboard, hàng hóa, giao dịch, phân quyền.

## Thành phần chính

- `components/`
  - Guard, layout shell, sidebar, header nav, product dialogs, tables...
- `hooks/`
  - Hook theo page/domain: orders, products, employees, roles, permissions...
- `services/`
  - `auth.service.ts`, `dashboard.service.ts`
- `types/`
  - DTO/view model cho dashboard, orders, products...

## Auth model

- Login qua backend: `POST /api/auth/login`.
- Token + user lưu `localStorage` (`token`, `user`).
- Route protected qua `AdminAuthGuard` + `useAdminSession`.
- API client auto attach `Authorization` header.

## Navigation chính

Theo `features/admin/lib/navigation.ts`:

- Tổng quan
- POS
- Hàng hóa
- Giao dịch
- Đối tác
- Nhân viên & Quyền
- Báo cáo
- Thiết lập

# Architecture Overview

Frontend dùng Next.js App Router theo hướng module hóa:

- Route layer: `src/app/*`
- Feature layer: `src/features/admin`, `src/features/user`
- Shared layer: `src/shared/*`
- UI primitives: `src/components/ui/*`

## Nguyên tắc tách lớp

- Route file chỉ compose screen/providers/guard.
- Business logic đặt trong `features/*/hooks` và `features/*/services`.
- Reusable cross-feature utilities đặt trong `shared/*`.
- Primitive component (button, table, dialog...) giữ ở `components/ui`.

## Hai luồng chính

- Admin:
  - Auth dựa trên token backend (`/api/auth/login`).
  - Route protected qua `AdminAuthGuard`.
  - Data lấy từ backend API.
- User storefront:
  - Demo flow dựa trên mock data + localStorage.
  - Auth/cart dùng context riêng trong `features/user/lib`.

## Providers toàn app

Root providers chain trong `AppProviders`:

- `ThemeProvider`
- `QueryProvider` (React Query)
- `AuthProvider` (admin auth context ở `src/app/auth-context.tsx`)

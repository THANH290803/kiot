# Shared Layer Docs

`src/shared/*` chứa các phần dùng chung giữa nhiều route/feature.

## Thành phần hiện có

- `shared/components`
  - `theme-provider.tsx`
- `shared/hooks`
  - `use-mobile.ts`
- `shared/lib/api`
  - `client.ts` (Axios instance)
- `shared/lib/providers`
  - `app-providers.tsx`
  - `query-provider.tsx`
- `shared/types`
  - auth-related types
- `shared/utils`
  - `cn` utility

## Boundary

- Shared không chứa business logic đặc thù admin/user.
- Nếu logic chỉ thuộc 1 feature, để lại trong feature đó.

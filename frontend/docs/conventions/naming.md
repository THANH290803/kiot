# Naming Conventions

## Feature

- Tên feature dùng domain rõ ràng: `admin`, `user`.
- Không đặt tên generic khó đoán như `common-feature`.

## Components

- Component file dùng kebab-case: `admin-layout-shell.tsx`.
- Export component dùng PascalCase: `AdminLayoutShell`.

## Hooks

- Bắt đầu bằng `use`: `useOrdersPage`, `useProductsPage`.
- Hook theo screen nên đặt tên gắn với page/domain.

## Services

- File service kết thúc bằng `.service.ts`.
- Service object export theo domain: `authService`, `dashboardService`.

## Types

- Type/interface dùng PascalCase: `OrderView`, `LoginResponse`.
- Type theo feature đặt ở `features/<name>/types/*`.

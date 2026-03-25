# Import Conventions

## Alias chính

- Dùng alias `@/*` (khai báo trong `tsconfig.json`).
- Ưu tiên import tuyệt đối qua alias thay vì relative dài.

Ví dụ:

- `@/features/admin/hooks/use-orders-page`
- `@/features/user/lib/cart-context`
- `@/shared/lib/api/client`
- `@/components/ui/button`

## Quy tắc theo layer

- `app/*` được import từ `features/*`, `shared/*`, `components/ui/*`.
- `features/*` được import từ chính feature đó, `shared/*`, `components/ui/*`.
- `shared/*` không import ngược từ `features/*`.
- `components/ui/*` là primitive, không phụ thuộc business domain.

## Cross-feature import

- Tránh import trực tiếp giữa `features/admin` và `features/user`.
- Nếu cần dùng chung, trích xuất sang `shared/*`.

# Conventions

## Mục tiêu

- Dễ đọc, dễ mở rộng, không trộn logic giữa route và feature.
- Giữ boundary rõ giữa admin, user, shared.

## Quy ước cốt lõi

- Route file không chứa business logic nặng.
- Hook chịu trách nhiệm state/query/mutation theo screen.
- Service chứa API calls hoặc data adapters.
- Types đặt gần feature; chỉ đưa vào `shared/types` khi dùng đa feature.

## Tài liệu con

- `naming.md`
- `imports.md`

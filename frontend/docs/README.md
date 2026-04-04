# Frontend Documentation

Tài liệu nội bộ cho frontend `kiot/frontend`.

## Mục lục

- `api/`
  - `api/README.md`: tổng quan contract frontend-facing API
  - `api/environment.md`: cách chọn base URL theo môi trường
  - `api/endpoints.md`: endpoint frontend đang gọi thực tế
- `architecture/`
  - `architecture/overview.md`: tổng quan kiến trúc App Router + feature modules
  - `architecture/folder-structure.md`: cấu trúc thư mục chi tiết
  - `architecture/routing.md`: quy ước route, redirect, layout ownership
- `conventions/`
  - `conventions/README.md`: quy ước chung
  - `conventions/imports.md`: quy ước import path
  - `conventions/naming.md`: quy ước đặt tên
- `features/admin/`
  - `README.md`: tổng quan feature admin
  - `routes.md`: route map admin
  - `data-flow.md`: data flow admin
- `features/user/`
  - `README.md`: tổng quan storefront user
  - `QUICKSTART.md`: quickstart cho luồng user
  - `routes.md`: route map user
  - `data-flow.md`: data flow user
  - `UPDATES.md`: các cập nhật chính gần đây
- `setup/`
  - `README.md`: checklist setup tổng quát
  - `local-development.md`: chạy local end-to-end
  - `deployment.md`: build/deploy và post-check
- `shared/`
  - `README.md`: shared layer boundary
  - `providers.md`: providers chain
  - `ui.md`: design system primitives (`src/components/ui`)

## Mục tiêu tài liệu

- Giúp onboard nhanh thành viên mới.
- Chuẩn hóa cách mở rộng code theo feature boundaries.
- Giảm sai lệch giữa code thật và tài liệu.

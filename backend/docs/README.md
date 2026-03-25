# Backend Docs

Tài liệu kỹ thuật cho backend Node.js/Express của dự án Kiot.

## Mục lục

- `setup/`
  - `setup/README.md`: checklist setup backend
  - `setup/local-development.md`: chạy local end-to-end
  - `setup/environment.md`: biến môi trường và ý nghĩa
- `architecture/`
  - `architecture/overview.md`: tổng quan kiến trúc backend
  - `architecture/folder-structure.md`: cấu trúc thư mục
  - `architecture/request-lifecycle.md`: luồng request từ route -> controller -> model
- `api/`
  - `api/README.md`: tổng quan API
  - `api/authentication.md`: cơ chế JWT auth
  - `api/routes.md`: route map theo module
- `database/`
  - `database/README.md`: mô hình dữ liệu và ORM
  - `database/migrations.md`: migrations hiện có
- `integrations/`
  - `integrations/cloudinary.md`: upload ảnh bằng Cloudinary
  - `integrations/bank-qr.md`: luồng thanh toán QR ngân hàng

## Links nhanh

- Health: `GET /health`
- Root: `GET /`
- Swagger UI: `/api/docs`

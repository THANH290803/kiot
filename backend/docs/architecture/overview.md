# Architecture Overview

Backend dùng:

- Express.js (HTTP layer)
- Sequelize ORM + MySQL (data layer)
- JWT auth (stateless)
- Swagger (API docs)

## Các lớp chính

- `src/routes/*`: định nghĩa endpoint và middleware chain
- `src/controllers/*`: business logic theo module
- `src/models/*`: Sequelize models + associations
- `src/middlewares/*`: cross-cutting concerns (auth/upload)
- `src/utils/*`: tiện ích tích hợp bên ngoài (Cloudinary)

## Khởi động app (`src/app.js`)

1. Load env (`dotenv`).
2. Init Express + `express.json()`.
3. Cấu hình CORS.
4. `sequelize.authenticate()` để kiểm tra DB connection.
5. Mount toàn bộ route `/api/*`.
6. Mount swagger `/api/docs`.
7. Start server với cơ chế fallback port khi bị `EADDRINUSE`.

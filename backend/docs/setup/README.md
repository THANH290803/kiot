# Backend Setup

## Yêu cầu

- Node.js `>= 18`
- npm `>= 8`
- MySQL `8.x`

## Scripts chính (`backend/package.json`)

- `npm run dev`: chạy backend với nodemon
- `npm run start`: chạy production mode
- `npm run migrate`: chạy migrations
- `npm run migrate:undo`: rollback 1 migration
- `npm run seed`: chạy seeders
- `npm run seed:undo`: undo seeders
- `npm run test`: chạy test (Jest, pass khi chưa có test)

## Bắt đầu nhanh

1. Tạo database MySQL (ví dụ: `kiot`).
2. Cấu hình `backend/.env`.
3. Chạy `npm install` trong `backend`.
4. Chạy `npm run migrate`.
5. Chạy `npm run dev`.

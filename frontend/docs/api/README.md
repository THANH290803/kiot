# API Docs

Tài liệu API dưới đây mô tả theo góc nhìn frontend và bám theo code hiện tại:

- API client: `src/shared/lib/api/client.ts`
- Alias export: `src/lib/api.ts`
- Nguồn endpoint sử dụng chủ yếu: `src/features/admin/hooks/*`, `src/features/admin/services/*`, `src/app/admin/(protected)/pos/page.tsx`

## Nguyên tắc chung

- Frontend gọi API qua `api` hoặc `apiClient` (Axios instance).
- `Authorization: Bearer <token>` được tự động gắn từ `localStorage.token`.
- Khi gặp `401`, client xóa token/user local và redirect về `/admin/login`.
- Base URL được resolve từ env (xem `api/environment.md`).

## Tài liệu liên quan

- `api/environment.md`
- `api/endpoints.md`

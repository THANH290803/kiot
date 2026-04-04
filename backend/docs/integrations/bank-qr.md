# Bank QR Integration

## Endpoints

- `POST /api/payments/bank-qr/create`
- `PATCH /api/payments/bank-qr/:orderId/confirm`

## Biến môi trường

Bắt buộc:

- `BANK_QR_BIN`
- `BANK_QR_ACCOUNT_NO`
- `BANK_QR_ACCOUNT_NAME`

Tuỳ chọn:

- `BANK_QR_BANK_NAME`
- `BANK_QR_TEMPLATE` (mặc định `compact2`)
- `BANK_QR_DEFAULT_CONTENT`

## Flow tóm tắt

1. Frontend/POS tạo đơn hàng trước.
2. Gọi `POST /api/payments/bank-qr/create` với `order_id`.
3. Backend trả `qr_url`, thông tin tài khoản và nội dung chuyển khoản.
4. Thu ngân/khách quét QR và chuyển khoản.
5. Khi đã nhận tiền, gọi `PATCH /api/payments/bank-qr/:orderId/confirm` để chốt đơn `completed`.

## Trạng thái đơn

- Khi tạo đơn bằng QR: nên để `status = pending`, `payment_method = bank_transfer`.
- Khi xác nhận đã nhận tiền: `status = completed`.

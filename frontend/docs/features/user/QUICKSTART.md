# User Quickstart

## 1. Chạy ứng dụng

```bash
cd frontend
npm install
npm run dev
```

Mở `http://localhost:3000/user/home`.

## 2. Tài khoản demo

- Email: `an@example.com`
- Mật khẩu: `password123`

## 3. Luồng mua hàng nhanh

1. Vào `/user/shop` để tìm sản phẩm.
2. Mở `/user/product/:id`, chọn size/màu, thêm vào giỏ.
3. Vào `/user/cart`, có thể áp mã `WELCOME10`, `SAVE20`, `SUMMER15`.
4. Checkout tại `/user/checkout`.
5. Sau khi đặt hàng, xem lịch sử ở `/user/profile`.

## 4. Hành vi quan trọng

- Chưa login mà checkout: chuyển về `/user/login`.
- Cart trống mà vào checkout: chuyển về `/user/cart`.
- Đơn mới được lưu vào `localStorage.user_orders`.

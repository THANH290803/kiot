# User Feature Docs

User feature hiện là storefront demo độc lập với admin backend workflow.

## Công nghệ và phạm vi

- Dùng `AuthProvider` + `CartProvider` riêng trong `features/user/lib`.
- Dữ liệu sản phẩm và user demo lấy từ `mock-data.ts`.
- Giỏ hàng, user session, đơn hàng demo lưu localStorage.

## Các trang chính

- `/user/home`: landing cho storefront
- `/user/shop`: tìm kiếm/lọc/sắp xếp sản phẩm
- `/user/product/:id`: chi tiết sản phẩm, chọn size/màu/số lượng
- `/user/cart`: giỏ hàng + mã giảm giá demo
- `/user/checkout`: checkout flow (demo)
- `/user/profile`: profile + lịch sử đơn hàng (lọc + phân trang)
- `/user/login`, `/user/signup`: auth demo

## Lưu trữ local

- `currentUser`: thông tin user đã login
- `cart`: giỏ hàng hiện tại
- `user_orders`: đơn đặt hàng đã tạo từ checkout
- `user_profile`: profile form đã chỉnh sửa

# User Feature Updates

Cập nhật theo code hiện tại:

## Landing page tách riêng

- `/` là landing page thương hiệu tổng quát của project.
- Luồng storefront user bắt đầu tại `/user/home`.

## Storefront user đầy đủ route

- Bổ sung route group `/user/*` với layout/provider riêng.
- Có đủ trang: home, shop, product detail, cart, checkout, profile, login, signup.

## Cart/Checkout/Profile cải tiến

- Cart có hỗ trợ mã giảm giá demo (`WELCOME10`, `SAVE20`, `SUMMER15`).
- Checkout có form địa chỉ chi tiết và ghi chú đơn hàng.
- Profile có lọc trạng thái + phân trang lịch sử đơn.

## Tách boundary admin và user

- Admin auth/context độc lập với user auth/cart context.
- User flow hiện vẫn dùng mock data + localStorage để demo UX nhanh.

## Payment update

- Luồng thanh toán admin POS đã chuyển từ cổng thanh toán sang QR ngân hàng.

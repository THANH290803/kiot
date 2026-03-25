# User Data Flow

## Luồng storefront hiện tại

1. Route user render page component.
2. Page đọc dữ liệu từ context (`useAuth`, `useCart`) hoặc `mockProducts`.
3. Thao tác người dùng cập nhật state context.
4. Context đồng bộ dữ liệu xuống localStorage.

## Auth flow

- Login/signup kiểm tra trên `mockUsers`.
- Thành công lưu `currentUser`.
- Logout xóa `currentUser`.

## Cart flow

- Add item: merge theo khóa `productId + size + color`.
- Update quantity: quantity <= 0 thì remove item.
- Mỗi thay đổi cart tự sync vào `localStorage.cart`.

## Checkout flow

- Tạo order object local (không gọi backend).
- Ghi vào `localStorage.user_orders`.
- Clear cart và chuyển sang `/user/profile`.

## Profile flow

- Load đơn từ `mockOrders` + `localStorage.user_orders`.
- Hỗ trợ lọc trạng thái và phân trang.
- Có thể hủy đơn bằng cập nhật local state/storage.

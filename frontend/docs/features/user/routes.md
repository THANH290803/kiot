# User Routes

## Route map

- `/user` -> redirect `/user/home`
- `/user/home`
- `/user/shop`
- `/user/product/:id`
- `/user/cart`
- `/user/checkout`
- `/user/profile`
- `/user/login`
- `/user/signup`

## Layout behavior

- Tất cả route dưới `/user/*` dùng `src/app/user/layout.tsx`.
- `UserLayout` bọc `UserProviders`:
  - `AuthProvider` (storefront auth)
  - `CartProvider` (cart state)

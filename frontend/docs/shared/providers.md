# Providers

## Root providers

`src/shared/lib/providers/app-providers.tsx`:

1. `ThemeProvider`
2. `QueryProvider`
3. `AuthProvider` (admin auth context tại `src/app/auth-context.tsx`)

## User route providers

`src/features/user/providers/user-providers.tsx`:

1. `AuthProvider` (storefront auth dựa trên mock/localStorage)
2. `CartProvider`

## Vai trò từng provider

- `ThemeProvider`: quản lý theme class theo `next-themes`.
- `QueryProvider`: cung cấp `QueryClient` với default options.
- Admin `AuthProvider`: giữ session token/user của admin.
- User providers: giữ state auth/cart của storefront user.

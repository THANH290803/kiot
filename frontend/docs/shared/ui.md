# Shared UI

`src/components/ui/*` là primitive components (shadcn-style) dùng toàn app.

## Danh sách primitives hiện có

- Form/input: `input`, `label`, `checkbox`, `radio-group`, `select`, `toggle`
- Overlay: `dialog`, `alert-dialog`, `popover`, `sheet`, `tooltip`
- Navigation/layout: `sidebar`, `tabs`, `scroll-area`, `separator`
- Data display: `card`, `badge`, `avatar`, `table`, `skeleton`
- Feedback: `toast`, `toaster`, `sonner`, `alert`
- Others: `button`, `command`, `dropdown-menu`, `collapsible`, `pagination`

## Khi nào thêm component mới vào `components/ui`

- Component đủ generic để tái sử dụng nhiều feature.
- Không chứa domain logic cụ thể (orders/products/user profile).

## Khi nào để trong feature

- Component gắn chặt nghiệp vụ admin/user.
- Component cần state/query riêng của một feature.

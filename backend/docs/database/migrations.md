# Migrations

## Lệnh thường dùng

```bash
cd backend
npm run migrate
npm run migrate:undo
```

## Danh sách migration hiện có

- `20251231210342-create_colors_table.js`
- `20251231210844-create_sizes_table.js`
- `20260101130233-create_roles_table.js`
- `20260101130622-create_permission_groups_table.js`
- `20260101130629-create_permissions_table.js`
- `20260101130712-create_role_permissions_table.js`
- `20260101130805-create_users_table.js`
- `20260101131002-create_categories_table.js`
- `20260101131016-create_brands_table.js`
- `20260101131314-create_customers_table.js`
- `20260101131645-create_products_table.js`
- `20260101131652-create_product_variants_table.js`
- `20260101131656-create_orders_table.js`
- `20260101131701-create_order_items_variants_table.js`
- `20260101135205-create_images_table.js`
- `20260301113223-add-quantity-to-product-variants.js`
- `20260322090000-move-avatar-from-product-variants-to-products.js`

## Lưu ý

- Migration là source of truth cho schema.
- Khi thay đổi schema, luôn thêm migration mới thay vì sửa migration cũ đã apply.

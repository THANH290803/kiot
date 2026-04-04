# Database Layer

## Công nghệ

- Sequelize v6
- MySQL (`mysql2`)

## Cấu hình Sequelize CLI

File `.sequelizerc`:

- config: `src/config/config.js`
- models: `src/models`
- migrations: `migrations`
- seeders: `seeders`

## Model domains hiện có

- User/Roles/Permissions
- Product/Catalog (category, brand, color, size)
- ProductVariant/Image
- Customer
- Order/OrderItem

## Timezone

- Sequelize config dùng `DB_TIMEZONE` (default `+07:00`).

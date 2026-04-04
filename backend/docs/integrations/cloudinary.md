# Cloudinary Integration

## Cấu hình

`src/utils/cloudinary.js` đọc:

- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`

## Upload middleware

`src/middlewares/upload.middleware.js` dùng:

- `multer`
- `multer-storage-cloudinary`

## Quy tắc folder

- Có `product_id` + `variant_id`:
  - `kiot/product/{product_id}/variant/{variant_id}`
- Upload field `avatar`:
  - `CLOUDINARY_FOLDER` hoặc `avatarProduct`
- Mặc định:
  - `kiot/product/pending/variant`

## Endpoint liên quan

- `POST /api/images/upload`

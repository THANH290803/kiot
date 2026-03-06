const express = require("express");
const productController = require("../controllers/product.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const upload = require("../middlewares/upload.middleware");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Product management
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         name:
 *           type: string
 *         description:
 *           type: string
 *         status:
 *           type: integer
 *           example: 1
 *         category_id:
 *           type: integer
 *         brand_id:
 *           type: integer
 *         category:
 *           type: object
 *           properties:
 *             id:
 *               type: integer
 *             name:
 *               type: string
 *         brand:
 *           type: object
 *           properties:
 *             id:
 *               type: integer
 *             name:
 *               type: string
 *         deleted_at:
 *           type: string
 *           nullable: true
 *         created_at:
 *           type: string
 *         updated_at:
 *           type: string
 */

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Get all products (DESC, soft-delete filtered). Search by name, filter by category and brand.
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Search by product name (LIKE)
 *       - in: query
 *         name: category_id
 *         schema:
 *           type: integer
 *         description: Filter by category ID
 *       - in: query
 *         name: brand_id
 *         schema:
 *           type: integer
 *         description: Filter by brand ID
 *       - in: query
 *         name: status
 *         schema:
 *           type: integer
 *         description: Filter by product status (1=active, 2=inactive, 3=out of stock)
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: List of products with pagination
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 products:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Product'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                     page:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                     totalPages:
 *                       type: integer
 */
router.get("/", authMiddleware, productController.findAll);

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Get product by ID
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Product detail
 *       404:
 *         description: Product not found
 */
router.get("/:id", authMiddleware, productController.findOne);

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Create product
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - category_id
 *               - brand_id
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               status:
 *                 type: integer
 *               category_id:
 *                 type: integer
 *               brand_id:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Product created
 */
router.post("/", authMiddleware, productController.create);

/**
 * @swagger
 * /api/products/{id}:
 *   patch:
 *     summary: Update product
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               status:
 *                 type: integer
 *               category_id:
 *                 type: integer
 *               brand_id:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Product updated
 *       404:
 *         description: Product not found
 */
router.patch("/:id", authMiddleware, productController.update);

/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Soft delete product
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Product deleted
 *       404:
 *         description: Product not found
 */
router.delete("/:id", authMiddleware, productController.delete);

/**
 * @swagger
 * /api/products/{id}/status:
 *   patch:
 *     summary: Change product status
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       200:
 *         description: Product status updated
 *       404:
 *         description: Product not found
 */
router.patch("/:id/status", authMiddleware, productController.changeStatus);

/**
 * @swagger
 * /api/products/create-with-variants:
 *   post:
 *     summary: Tạo sản phẩm + nhiều biến thể (mỗi biến thể nhiều ảnh)
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - category_id
 *               - brand_id
 *               - variants
 *               - image_map
 *             properties:
 *               name:
 *                 type: string
 *                 example: Áo thun nam
 *               description:
 *                 type: string
 *                 example: Áo thun cotton 100%
 *               category_id:
 *                 type: integer
 *                 example: 1
 *               brand_id:
 *                 type: integer
 *                 example: 2
 *
 *               avatar:
 *                 type: string
 *                 format: binary
 *                 description: Ảnh đại diện sản phẩm (1 ảnh)
 *
 *               variants:
 *                 type: string
 *                 description: >
 *                   JSON string mô tả danh sách biến thể.
 *                   Ví dụ:
 *                   [
 *                     {"color_id":1,"size_id":1,"price":120000,"quantity":10},
 *                     {"color_id":2,"size_id":3,"price":130000,"quantity":5}
 *                   ]
 *
 *               image_map:
 *                 type: string
 *                 description: >
 *                   JSON string ánh xạ ảnh → biến thể.
 *                   KHÔNG cần đổi tên file.
 *                   Dùng index của req.files.
 *
 *                   Ví dụ:
 *                   {
 *                     "0": {"color_id":1,"size_id":1},
 *                     "1": {"color_id":1,"size_id":1},
 *                     "2": {"color_id":2,"size_id":3}
 *                   }
 *
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: >
 *                   Upload nhiều ảnh.
 *                   Tất cả ảnh dùng chung key `images`.
 *                   Mapping biến thể dựa vào image_map.
 *
 *     responses:
 *       201:
 *         description: Tạo sản phẩm và biến thể thành công
 *         content:
 *           application/json:
 *             example:
 *               product:
 *                 id: 1
 *                 name: Áo thun nam
 *                 avatar: https://res.cloudinary.com/xxx/avatar.jpg
 *               variants:
 *                 - id: 10
 *                   color_id: 1
 *                   size_id: 1
 *                   price: 120000
 *                   quantity: 10
 *                   images:
 *                     - https://res.cloudinary.com/xxx/img1.jpg
 *                     - https://res.cloudinary.com/xxx/img2.jpg
 *
 *       400:
 *         description: Dữ liệu không hợp lệ
 *       500:
 *         description: Lỗi server
 */
router.post(
    "/create-with-variants",
    upload.any(), // ❗ giữ nguyên
    productController.createProductWithVariants
);

module.exports = router;

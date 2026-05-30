const express = require("express");
const router = express.Router();

const productVariantController = require("../controllers/product_variant.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const { optionalAuthMiddleware } = require("../middlewares/auth.middleware");

/**
 * @swagger
 * tags:
 *   name: ProductVariants
 *   description: Quản lý biến thể sản phẩm
 */

/**
 * @swagger
 * /api/product-variants:
 *   get:
 *     summary: Lấy danh sách product variant
 *     tags: [ProductVariants]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: sku
 *         schema:
 *           type: string
 *       - in: query
 *         name: product_id
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: OK
 */
router.get(
    "/",
    optionalAuthMiddleware,
    productVariantController.findAll
);

/**
 * @swagger
 * /api/product-variants/{id}:
 *   get:
 *     summary: Lấy chi tiết product variant
 *     tags: [ProductVariants]
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
 *         description: OK
 *       404:
 *         description: Not found
 */
router.get(
    "/:id",
    optionalAuthMiddleware,
    productVariantController.findOne
);

/**
 * @swagger
 * /api/product-variants:
 *   post:
 *     summary: Tạo product variant
 *     tags: [ProductVariants]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - product_id
 *               - price
 *               - color_id
 *               - size_id
 *             properties:
 *               product_id:
 *                 type: integer
 *               sku:
 *                 type: string
 *               price:
 *                 type: integer
 *               color_id:
 *                 type: integer
 *               size_id:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Created
 */
router.post(
    "/",
    authMiddleware,
    productVariantController.create
);

/**
 * @swagger
 * /api/product-variants/{id}:
 *   patch:
 *     summary: Update product variant
 *     tags: [ProductVariants]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               sku:
 *                 type: string
 *               price:
 *                 type: integer
 *               color_id:
 *                 type: integer
 *               size_id:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Updated
 *       404:
 *         description: Not found
 */
router.patch(
    "/:id",
    authMiddleware,
    productVariantController.update
);

/**
 * @swagger
 * /api/product-variants/{id}:
 *   delete:
 *     summary: Xoá mềm product variant
 *     tags: [ProductVariants]
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
 *         description: Deleted
 */
router.delete(
    "/:id",
    authMiddleware,
    productVariantController.delete
);

module.exports = router;

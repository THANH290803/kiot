const express = require("express");
const productVariantController = require("../controllers/product_variant.controller");
const authMiddleware = require("../middlewares/auth.middleware");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: ProductVariants
 *   description: Product variants management
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     ProductVariant:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         product_id:
 *           type: integer
 *         sku:
 *           type: string
 *         price:
 *           type: integer
 *         avatar:
 *           type: string
 *         color_id:
 *           type: integer
 *         size_id:
 *           type: integer
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
 * /api/product-variants:
 *   get:
 *     summary: Get all product variants (DESC, soft-delete filtered). Search by sku, filter by product_id.
 *     tags: [ProductVariants]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: sku
 *         schema:
 *           type: string
 *         description: Search by SKU (LIKE)
 *       - in: query
 *         name: product_id
 *         schema:
 *           type: integer
 *         description: Filter by product_id
 *     responses:
 *       200:
 *         description: List of product variants
 */
router.get("/", authMiddleware, productVariantController.findAll);

/**
 * @swagger
 * /api/product-variants/{id}:
 *   get:
 *     summary: Get product variant by ID
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
 *         description: Product variant detail
 *       404:
 *         description: Product variant not found
 */
router.get("/:id", authMiddleware, productVariantController.findOne);

/**
 * @swagger
 * /api/product-variants:
 *   post:
 *     summary: Create product variant (avatar uploads to Cloudinary if provided)
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
 *               - sku
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
 *               avatar:
 *                 type: string
 *                 description: Base64 hoặc url để upload Cloudinary
 *               color_id:
 *                 type: integer
 *               size_id:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Product variant created
 */
router.post("/", authMiddleware, productVariantController.create);

/**
 * @swagger
 * /api/product-variants/{id}:
 *   patch:
 *     summary: Update product variant (avatar uploads to Cloudinary if provided)
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
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               product_id:
 *                 type: integer
 *               sku:
 *                 type: string
 *               price:
 *                 type: integer
 *               avatar:
 *                 type: string
 *                 description: Base64 hoặc url để upload Cloudinary
 *               color_id:
 *                 type: integer
 *               size_id:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Product variant updated
 *       404:
 *         description: Product variant not found
 */
router.patch("/:id", authMiddleware, productVariantController.update);

/**
 * @swagger
 * /api/product-variants/{id}:
 *   delete:
 *     summary: Soft delete product variant
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
 *         description: Product variant deleted
 *       404:
 *         description: Product variant not found
 */
router.delete("/:id", authMiddleware, productVariantController.delete);

module.exports = router;

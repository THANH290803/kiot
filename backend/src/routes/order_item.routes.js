const express = require("express");
const orderItemController = require("../controllers/order_item.controller");
const authMiddleware = require("../middlewares/auth.middleware");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: OrderItems
 *   description: Order item management
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     CreateOrderItemRequest:
 *       type: object
 *       required:
 *         - order_id
 *         - product_id
 *         - quantity
 *       properties:
 *         order_id:
 *           type: integer
 *           description: Order ID
 *         product_id:
 *           type: integer
 *           description: Product ID
 *         variant_id:
 *           type: integer
 *           description: Optional product variant ID
 *         quantity:
 *           type: integer
 *           minimum: 1
 *         price:
 *           type: integer
 *           description: Optional price, will be auto-filled from product/variant if not provided
 *
 *     UpdateOrderItemRequest:
 *       type: object
 *       properties:
 *         quantity:
 *           type: integer
 *           minimum: 1
 *         price:
 *           type: integer
 */

// ================= ORDER ITEM ROUTES =================

/**
 * @swagger
 * /order-items:
 *   post:
 *     summary: Create new order item
 *     tags: [OrderItems]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateOrderItemRequest'
 *     responses:
 *       201:
 *         description: Order item created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OrderItem'
 *       400:
 *         description: Validation error
 *       404:
 *         description: Order or product not found
 */
router.post("/", authMiddleware, orderItemController.create);

/**
 * @swagger
 * /order-items:
 *   get:
 *     summary: Get all order items (DESC, soft-delete filtered). Filter by order_id and product_id.
 *     tags: [OrderItems]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: order_id
 *         schema:
 *           type: integer
 *         description: Filter by order ID
 *       - in: query
 *         name: product_id
 *         schema:
 *           type: integer
 *         description: Filter by product ID
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
 *         description: List of order items with pagination
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 orderItems:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/OrderItem'
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
router.get("/", authMiddleware, orderItemController.findAll);

/**
 * @swagger
 * /order-items/{id}:
 *   get:
 *     summary: Get order item by ID
 *     tags: [OrderItems]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Order item ID
 *     responses:
 *       200:
 *         description: Order item details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OrderItem'
 *       404:
 *         description: Order item not found
 */
router.get("/:id", authMiddleware, orderItemController.findOne);

/**
 * @swagger
 * /order-items/{id}:
 *   patch:
 *     summary: Update order item
 *     tags: [OrderItems]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Order item ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateOrderItemRequest'
 *     responses:
 *       200:
 *         description: Order item updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OrderItem'
 *       404:
 *         description: Order item not found
 */
router.patch("/:id", authMiddleware, orderItemController.update);

/**
 * @swagger
 * /order-items/{id}:
 *   delete:
 *     summary: Soft delete order item
 *     tags: [OrderItems]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Order item ID
 *     responses:
 *       200:
 *         description: Order item deleted successfully
 *       404:
 *         description: Order item not found
 */
router.delete("/:id", authMiddleware, orderItemController.delete);

module.exports = router;
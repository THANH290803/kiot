const express = require("express");
const orderController = require("../controllers/order.controller");
const authMiddleware = require("../middlewares/auth.middleware");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: Order management
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Order:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         order_code:
 *           type: string
 *         customer_id:
 *           type: integer
 *           nullable: true
 *         user_id:
 *           type: integer
 *         total_quantity:
 *           type: integer
 *         total_amount:
 *           type: integer
 *         payment_method:
 *           type: string
 *           enum: [cash, bank_transfer, momo, vnpay, card]
 *         status:
 *           type: string
 *           enum: [pending, completed, cancelled]
 *         note:
 *           type: string
 *           nullable: true
 *         customer:
 *           $ref: '#/components/schemas/Customer'
 *         user:
 *           $ref: '#/components/schemas/User'
 *         orderItems:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/OrderItem'
 *         created_at:
 *           type: string
 *           format: date-time
 *         updated_at:
 *           type: string
 *           format: date-time
 *
 *     OrderItem:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         order_id:
 *           type: integer
 *         product_id:
 *           type: integer
 *         variant_id:
 *           type: integer
 *           nullable: true
 *         quantity:
 *           type: integer
 *         price:
 *           type: integer
 *         total:
 *           type: integer
 *         product:
 *           $ref: '#/components/schemas/Product'
 *         variant:
 *           $ref: '#/components/schemas/ProductVariant'
 *         created_at:
 *           type: string
 *           format: date-time
 *         updated_at:
 *           type: string
 *           format: date-time
 *
 *     CreateOrderRequest:
 *       type: object
 *       required:
 *         - user_id
 *         - order_items
 *       properties:
 *         customer_id:
 *           type: integer
 *           description: Optional customer ID
 *         user_id:
 *           type: integer
 *           description: Required user ID who created the order
 *         order_items:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/CreateOrderItemRequest'
 *         payment_method:
 *           type: string
 *           enum: [cash, bank_transfer, momo, vnpay, card]
 *           default: cash
 *         status:
 *           type: string
 *           enum: [pending, completed, cancelled]
 *           default: pending
 *         note:
 *           type: string
 *
 *     CreateOrderItemRequest:
 *       type: object
 *       required:
 *         - product_id
 *         - quantity
 *       properties:
 *         product_id:
 *           type: integer
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
 *     UpdateOrderRequest:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           enum: [pending, completed, cancelled]
 *         note:
 *           type: string
 *         payment_method:
 *           type: string
 *           enum: [cash, bank_transfer, momo, vnpay, card]
 */

// ================= ORDER ROUTES =================

/**
 * @swagger
 * /api/orders:
 *   post:
 *     summary: Create new order with order items
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateOrderRequest'
 *     responses:
 *       201:
 *         description: Order created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       400:
 *         description: Validation error
 *       404:
 *         description: Product not found
 */
router.post("/", authMiddleware, orderController.create);

/**
 * @swagger
 * /api/orders:
 *   get:
 *     summary: Get all orders (DESC, soft-delete filtered). Search by order_code, filter by customer name and status.
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: order_code
 *         schema:
 *           type: string
 *         description: Search by order code (LIKE)
 *       - in: query
 *         name: customer_name
 *         schema:
 *           type: string
 *         description: Search by customer name (LIKE)
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, completed, cancelled]
 *         description: Filter by order status
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
 *         description: List of orders with pagination
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 orders:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Order'
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
router.get("/", authMiddleware, orderController.findAll);

/**
 * @swagger
 * /api/orders/{id}:
 *   get:
 *     summary: Get order by ID
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Order ID
 *     responses:
 *       200:
 *         description: Order details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       404:
 *         description: Order not found
 */
router.get("/:id", authMiddleware, orderController.findOne);

/**
 * @swagger
 * /api/orders/{id}:
 *   patch:
 *     summary: Update order
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Order ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateOrderRequest'
 *     responses:
 *       200:
 *         description: Order updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       404:
 *         description: Order not found
 */
router.patch("/:id", authMiddleware, orderController.update);

/**
 * @swagger
 * /api/orders/{id}:
 *   delete:
 *     summary: Soft delete order
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Order ID
 *     responses:
 *       200:
 *         description: Order deleted successfully
 *       404:
 *         description: Order not found
 */
router.delete("/:id", authMiddleware, orderController.delete);

module.exports = router;
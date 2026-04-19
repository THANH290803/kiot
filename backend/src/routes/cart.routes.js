const express = require("express");
const cartController = require("../controllers/cart.controller");
const { customerAuthMiddleware } = require("../middlewares/auth.middleware");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Cart
 *   description: Customer cart management
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     CartItemRequest:
 *       type: object
 *       required:
 *         - product_variant_id
 *       properties:
 *         product_variant_id:
 *           type: integer
 *           example: 12
 *         quantity:
 *           type: integer
 *           example: 2
 *       description: price is calculated on server = variant price x quantity
 *     UpdateCartItemRequest:
 *       type: object
 *       required:
 *         - quantity
 *       properties:
 *         quantity:
 *           type: integer
 *           example: 3
 *       description: price is recalculated on server = variant price x quantity
 */

/**
 * @swagger
 * /api/cart:
 *   get:
 *     summary: Get current customer's cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cart fetched successfully
 *       401:
 *         description: Unauthorized
 */
router.get("/", customerAuthMiddleware, cartController.getMyCart);

/**
 * @swagger
 * /api/cart/items:
 *   post:
 *     summary: Add item to cart
 *     tags: [Cart]
 *     description: Server calculates item price as unit price x quantity.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CartItemRequest'
 *     responses:
 *       200:
 *         description: Item added and cart returned
 *       400:
 *         description: Invalid payload or quantity exceeds stock
 *       404:
 *         description: Product variant not found
 *       401:
 *         description: Unauthorized
 */
router.post("/items", customerAuthMiddleware, cartController.addItem);

/**
 * @swagger
 * /api/cart/items/{itemId}:
 *   patch:
 *     summary: Update cart item quantity
 *     tags: [Cart]
 *     description: Server recalculates item price as unit price x quantity.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: itemId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateCartItemRequest'
 *     responses:
 *       200:
 *         description: Item updated and cart returned
 *       400:
 *         description: Invalid quantity or exceeds stock
 *       404:
 *         description: Cart item not found
 *       401:
 *         description: Unauthorized
 */
router.patch("/items/:itemId", customerAuthMiddleware, cartController.updateItem);

/**
 * @swagger
 * /api/cart/items/{itemId}:
 *   delete:
 *     summary: Remove item from cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: itemId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Item removed and cart returned
 *       404:
 *         description: Cart item not found
 *       401:
 *         description: Unauthorized
 */
router.delete("/items/:itemId", customerAuthMiddleware, cartController.removeItem);

/**
 * @swagger
 * /api/cart/clear:
 *   delete:
 *     summary: Clear all items in current customer's cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cart cleared successfully
 *       401:
 *         description: Unauthorized
 */
router.delete("/clear", customerAuthMiddleware, cartController.clearMyCart);

module.exports = router;

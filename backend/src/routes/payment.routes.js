const express = require("express");
const paymentController = require("../controllers/payment.controller");
const authMiddleware = require("../middlewares/auth.middleware");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Payments
 *   description: Payment & VNPAY
 */

/**
 * @swagger
 * /api/payments/vnpay/create:
 *   post:
 *     tags: [Payments]
 *     summary: Tạo link thanh toán VNPAY
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [order_id]
 *             properties:
 *               order_id:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Tạo link thanh toán thành công
 *       404:
 *         description: Order không tồn tại
 */
router.post(
  "/vnpay/create",
  authMiddleware,
  paymentController.createVnpayPayment
);

/**
 * @swagger
 * /api/payments/vnpay/ipn:
 *   get:
 *     tags: [Payments]
 *     summary: VNPAY IPN callback
 *     responses:
 *       200:
 *         description: Xử lý IPN từ VNPAY
 */
router.get("/vnpay/ipn", paymentController.vnpayIPN);

module.exports = router;

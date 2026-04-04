const express = require("express");
const paymentController = require("../controllers/payment.controller");
const authMiddleware = require("../middlewares/auth.middleware");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Payments
 *   description: Payment & Bank QR
 */

/**
 * @swagger
 * /api/payments/bank-qr/create:
 *   post:
 *     tags: [Payments]
 *     summary: Tạo thông tin QR ngân hàng để chuyển khoản
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               order_id:
 *                 type: integer
 *                 description: ID đơn hàng đã tạo sẵn
 *               amount:
 *                 type: integer
 *                 description: Số tiền thanh toán (nếu không truyền order_id)
 *               transferContent:
 *                 type: string
 *                 description: Nội dung chuyển khoản hiển thị trên QR
 *     responses:
 *       200:
 *         description: Tạo QR thành công
 *       404:
 *         description: Order không tồn tại
 */
router.post("/bank-qr/create", authMiddleware, paymentController.createBankQrPayment);

/**
 * @swagger
 * /api/payments/bank-qr/{orderId}/confirm:
 *   patch:
 *     tags: [Payments]
 *     summary: Xác nhận đơn đã thanh toán QR
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Xác nhận thành công
 *       404:
 *         description: Không tìm thấy đơn hàng
 */
router.patch("/bank-qr/:orderId/confirm", authMiddleware, paymentController.confirmBankQrPayment);

module.exports = router;

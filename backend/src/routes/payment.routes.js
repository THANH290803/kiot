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
 *             properties:
 *               order_id:
 *                 type: integer
 *                 description: ID đơn hàng đã tạo sẵn. Không bắt buộc nếu thanh toán trước rồi mới tạo đơn.
 *               amount:
 *                 type: integer
 *                 description: Số tiền thanh toán. Bắt buộc nếu không truyền order_id.
 *               orderDescription:
 *                 type: string
 *                 description: Nội dung đơn hàng hiển thị trên VNPay.
 *               orderType:
 *                 type: string
 *                 default: other
 *               language:
 *                 type: string
 *                 default: vn
 *               bankCode:
 *                 type: string
 *                 description: Mã ngân hàng, nếu muốn chỉ định trước.
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
 * /api/payments/vnpay/verify-return:
 *   get:
 *     tags: [Payments]
 *     summary: Xác thực dữ liệu trả về từ VNPay
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Xác thực thành công
 *       400:
 *         description: Chữ ký hoặc dữ liệu không hợp lệ
 */
router.get("/vnpay/verify-return", authMiddleware, paymentController.verifyVnpayReturn);

/**
 * @swagger
 * /api/payments/vnpay/return:
 *   get:
 *     tags: [Payments]
 *     summary: Redirect từ VNPay về frontend
 *     responses:
 *       302:
 *         description: Redirect về frontend return page
 */
router.get("/vnpay/return", paymentController.vnpayReturnRedirect);

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

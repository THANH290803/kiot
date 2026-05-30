const express = require("express");
const customerVoucherController = require("../controllers/customer_voucher.controller");
const authMiddleware = require("../middlewares/auth.middleware");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Customer Vouchers
 *   description: Customer voucher assignment and management
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     CustomerVoucher:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         customer_id:
 *           type: integer
 *         voucher_id:
 *           type: integer
 *         status:
 *           type: string
 *           enum: [available, used, expired]
 *         assigned_at:
 *           type: string
 *           format: date-time
 *         used_at:
 *           type: string
 *           format: date-time
 *           nullable: true
 *         expired_at:
 *           type: string
 *           format: date-time
 *           nullable: true
 *         customer:
 *           $ref: '#/components/schemas/Customer'
 *         voucher:
 *           $ref: '#/components/schemas/Voucher'
 *         created_at:
 *           type: string
 *           format: date-time
 *         updated_at:
 *           type: string
 *           format: date-time
 *
 *     CustomerVoucherListResponse:
 *       type: object
 *       properties:
 *         customer_vouchers:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/CustomerVoucher'
 *         pagination:
 *           type: object
 *           properties:
 *             total:
 *               type: integer
 *             page:
 *               type: integer
 *             limit:
 *               type: integer
 *             totalPages:
 *               type: integer
 */

/**
 * @swagger
 * /api/customer-vouchers:
 *   get:
 *     summary: Get customer vouchers with filters and pagination
 *     tags: [Customer Vouchers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: customer_id
 *         schema:
 *           type: integer
 *       - in: query
 *         name: voucher_id
 *         schema:
 *           type: integer
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [available, used, expired]
 *       - in: query
 *         name: keyword
 *         schema:
 *           type: string
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: List of customer vouchers
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CustomerVoucherListResponse'
 */
router.get("/", authMiddleware, customerVoucherController.findAll);

/**
 * @swagger
 * /api/customer-vouchers/{id}:
 *   get:
 *     summary: Get customer voucher by ID
 *     tags: [Customer Vouchers]
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
 *         description: Customer voucher detail
 *       404:
 *         description: Customer voucher not found
 */
router.get("/:id", authMiddleware, customerVoucherController.findOne);

/**
 * @swagger
 * /api/customer-vouchers:
 *   post:
 *     summary: Assign voucher to customer
 *     tags: [Customer Vouchers]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - customer_id
 *               - voucher_id
 *             properties:
 *               customer_id:
 *                 type: integer
 *               voucher_id:
 *                 type: integer
 *               status:
 *                 type: string
 *                 enum: [available, used, expired]
 *               expired_at:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       201:
 *         description: Customer voucher assigned
 */
router.post("/", authMiddleware, customerVoucherController.assign);

/**
 * @swagger
 * /api/customer-vouchers/{id}:
 *   patch:
 *     summary: Update customer voucher
 *     tags: [Customer Vouchers]
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
 *               status:
 *                 type: string
 *                 enum: [available, used, expired]
 *               expired_at:
 *                 type: string
 *                 format: date-time
 *                 nullable: true
 *     responses:
 *       200:
 *         description: Customer voucher updated
 *       404:
 *         description: Customer voucher not found
 */
router.patch("/:id", authMiddleware, customerVoucherController.update);

/**
 * @swagger
 * /api/customer-vouchers/{id}:
 *   delete:
 *     summary: Soft delete customer voucher
 *     tags: [Customer Vouchers]
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
 *         description: Customer voucher deleted
 *       404:
 *         description: Customer voucher not found
 */
router.delete("/:id", authMiddleware, customerVoucherController.delete);

module.exports = router;

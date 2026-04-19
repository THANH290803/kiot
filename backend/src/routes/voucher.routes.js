const express = require("express");
const voucherController = require("../controllers/voucher.controller");
const authMiddleware = require("../middlewares/auth.middleware");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Vouchers
 *   description: Voucher management
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Voucher:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         code:
 *           type: string
 *         description:
 *           type: string
 *           nullable: true
 *         discount_type:
 *           type: string
 *           enum: [percent, fixed]
 *         discount_value:
 *           type: integer
 *         max_use:
 *           type: integer
 *         used_count:
 *           type: integer
 *         status:
 *           type: string
 *           enum: [active, inactive]
 *         start_date:
 *           type: string
 *           format: date
 *         end_date:
 *           type: string
 *           format: date
 *         deleted_at:
 *           type: string
 *           format: date-time
 *           nullable: true
 *         created_at:
 *           type: string
 *           format: date-time
 *         updated_at:
 *           type: string
 *           format: date-time
 *
 *     VoucherListResponse:
 *       type: object
 *       properties:
 *         vouchers:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Voucher'
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
 * /api/vouchers:
 *   get:
 *     summary: Get vouchers with pagination and filters
 *     tags: [Vouchers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: keyword
 *         schema:
 *           type: string
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [active, inactive]
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
 *         description: List of vouchers
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/VoucherListResponse'
 */
router.get("/", authMiddleware, voucherController.findAll);

/**
 * @swagger
 * /api/vouchers/{id}:
 *   get:
 *     summary: Get voucher by ID
 *     tags: [Vouchers]
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
 *         description: Voucher detail
 *       404:
 *         description: Voucher not found
 */
router.get("/:id", authMiddleware, voucherController.findOne);

/**
 * @swagger
 * /api/vouchers:
 *   post:
 *     summary: Create voucher
 *     tags: [Vouchers]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - code
 *               - discount_type
 *               - discount_value
 *               - max_use
 *               - start_date
 *               - end_date
 *             properties:
 *               code:
 *                 type: string
 *               description:
 *                 type: string
 *               discount_type:
 *                 type: string
 *                 enum: [percent, fixed]
 *               discount_value:
 *                 type: integer
 *               max_use:
 *                 type: integer
 *               used_count:
 *                 type: integer
 *               status:
 *                 type: string
 *                 enum: [active, inactive]
 *               start_date:
 *                 type: string
 *                 format: date
 *               end_date:
 *                 type: string
 *                 format: date
 *     responses:
 *       201:
 *         description: Voucher created
 */
router.post("/", authMiddleware, voucherController.create);

/**
 * @swagger
 * /api/vouchers/{id}:
 *   patch:
 *     summary: Update voucher
 *     tags: [Vouchers]
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
 *               code:
 *                 type: string
 *               description:
 *                 type: string
 *               discount_type:
 *                 type: string
 *                 enum: [percent, fixed]
 *               discount_value:
 *                 type: integer
 *               max_use:
 *                 type: integer
 *               used_count:
 *                 type: integer
 *               status:
 *                 type: string
 *                 enum: [active, inactive]
 *               start_date:
 *                 type: string
 *                 format: date
 *               end_date:
 *                 type: string
 *                 format: date
 *     responses:
 *       200:
 *         description: Voucher updated
 *       404:
 *         description: Voucher not found
 */
router.patch("/:id", authMiddleware, voucherController.update);

/**
 * @swagger
 * /api/vouchers/{id}:
 *   delete:
 *     summary: Soft delete voucher
 *     tags: [Vouchers]
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
 *         description: Voucher deleted
 *       404:
 *         description: Voucher not found
 */
router.delete("/:id", authMiddleware, voucherController.delete);

module.exports = router;

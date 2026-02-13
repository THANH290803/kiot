const express = require("express");
const permissionController = require("../controllers/permission.controller");
const authMiddleware = require("../middlewares/auth.middleware");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Permissions
 *   description: Quản lý quyền (Permissions)
 */

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *
 *   schemas:
 *     Permission:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         code:
 *           type: string
 *         name:
 *           type: string
 *         description:
 *           type: string
 *         group_id:
 *           type: integer
 *         group:
 *           type: object
 *           properties:
 *             id:
 *               type: integer
 *             name:
 *               type: string
 *         created_at:
 *           type: string
 *           format: date-time
 *         updated_at:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /api/permissions:
 *   get:
 *     summary: Lấy danh sách quyền
 *     tags: [Permissions]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Danh sách quyền
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Permission'
 *       500:
 *         description: Lỗi server
 */
router.get("/", authMiddleware, permissionController.findAll);

/**
 * @swagger
 * /api/permissions/{id}:
 *   get:
 *     summary: Lấy quyền theo ID
 *     tags: [Permissions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID của permission
 *     responses:
 *       200:
 *         description: Thông tin quyền
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Permission'
 *       404:
 *         description: Không tìm thấy quyền
 *       500:
 *         description: Lỗi server
 */
router.get("/:id", authMiddleware, permissionController.findOne);

/**
 * @swagger
 * /api/permissions:
 *   post:
 *     summary: Tạo quyền mới
 *     tags: [Permissions]
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
 *               - name
 *               - group_id
 *             properties:
 *               code:
 *                 type: string
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               group_id:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Tạo quyền thành công
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Permission'
 *       400:
 *         description: Dữ liệu không hợp lệ
 *       500:
 *         description: Lỗi server
 */
router.post("/", authMiddleware, permissionController.create);

/**
 * @swagger
 * /api/permissions/{id}:
 *   patch:
 *     summary: Cập nhật quyền
 *     tags: [Permissions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID của permission
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               code:
 *                 type: string
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               group_id:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 *       404:
 *         description: Không tìm thấy quyền
 *       500:
 *         description: Lỗi server
 */
router.patch("/:id", authMiddleware, permissionController.update);

/**
 * @swagger
 * /api/permissions/{id}:
 *   delete:
 *     summary: Xoá mềm quyền
 *     tags: [Permissions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID của permission
 *     responses:
 *       200:
 *         description: Xoá quyền thành công
 *       404:
 *         description: Không tìm thấy quyền
 *       500:
 *         description: Lỗi server
 */
router.delete("/:id", authMiddleware, permissionController.delete);

module.exports = router;

const express = require("express");
const permissionGroupController = require("../controllers/permission_group.controller");
const authMiddleware = require("../middlewares/auth.middleware");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Permission Groups
 *   description: Permission group management
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     PermissionGroup:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         name:
 *           type: string
 */

/**
 * @swagger
 * /permission-groups:
 *   get:
 *     summary: Get all permission groups (DESC)
 *     tags: [Permission Groups]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/PermissionGroup'
 */
router.get("/", authMiddleware, permissionGroupController.findAll);

/**
 * @swagger
 * /permission-groups/{id}:
 *   get:
 *     summary: Get permission group by ID
 *     tags: [Permission Groups]
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
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PermissionGroup'
 */
router.get("/:id", authMiddleware, permissionGroupController.findOne);

/**
 * @swagger
 * /permission-groups:
 *   post:
 *     summary: Create permission group
 *     tags: [Permission Groups]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       201:
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PermissionGroup'
 */
router.post("/", authMiddleware, permissionGroupController.create);

/**
 * @swagger
 * /permission-groups/{id}:
 *   patch:
 *     summary: Update permission group
 *     tags: [Permission Groups]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       200:
 *         description: Updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PermissionGroup'
 */
router.patch("/:id", authMiddleware, permissionGroupController.update);

/**
 * @swagger
 * /permission-groups/{id}:
 *   delete:
 *     summary: Delete permission group
 *     tags: [Permission Groups]
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
 *         description: Deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
router.delete("/:id", authMiddleware, permissionGroupController.delete);

module.exports = router;

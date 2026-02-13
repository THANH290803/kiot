const express = require("express");
const roleController = require("../controllers/role.controller");
const authMiddleware = require("../middlewares/auth.middleware");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Roles
 *   description: Role management
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Role:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         name:
 *           type: string
 *           example: ADMIN
 *         description:
 *           type: string
 *           example: Quản trị hệ thống
 *         created_at:
 *           type: string
 *           example: 2026-01-01T10:00:00Z
 *         updated_at:
 *           type: string
 *           example: 2026-01-01T10:00:00Z
 */

/**
 * @swagger
 * /api/roles:
 *   get:
 *     summary: Get all roles (not deleted)
 *     tags: [Roles]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of roles
 */
router.get("/", authMiddleware, roleController.findAll);

/**
 * @swagger
 * /api/roles/{id}:
 *   get:
 *     summary: Get role by ID
 *     tags: [Roles]
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
 *         description: Role detail
 *       404:
 *         description: Role not found
 */
router.get("/:id", authMiddleware, roleController.findOne);

/**
 * @swagger
 * /api/roles:
 *   post:
 *     summary: Create new role
 *     tags: [Roles]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name]
 *             properties:
 *               name:
 *                 type: string
 *                 example: ADMIN
 *               description:
 *                 type: string
 *                 example: Quản trị hệ thống
 *     responses:
 *       201:
 *         description: Role created
 *       409:
 *         description: Role name already exists
 */
router.post("/", authMiddleware, roleController.create);

/**
 * @swagger
 * /api/roles/{id}:
 *   patch:
 *     summary: Update role (partial)
 *     tags: [Roles]
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
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Role updated
 *       409:
 *         description: Duplicate role name
 *       404:
 *         description: Role not found
 */
router.patch("/:id", authMiddleware, roleController.update);

/**
 * @swagger
 * /api/roles/{id}:
 *   delete:
 *     summary: Soft delete role
 *     tags: [Roles]
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
 *         description: Role deleted
 *       404:
 *         description: Role not found
 */
router.delete("/:id", authMiddleware, roleController.delete);

/**
 * @swagger
 * /api/roles/{id}/permissions:
 *   get:
 *     summary: Get permissions of a role
 *     tags: [Roles]
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
 *         description: List permissions
 */
router.get("/:id/permissions", authMiddleware, roleController.getPermissions);

/**
 * @swagger
 * /api/roles/{id}/permissions:
 *   patch:
 *     summary: Update permissions for a role (replace by checkbox selection)
 *     tags: [Roles]
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
 *             required:
 *               - permission_ids
 *             properties:
 *               permission_ids:
 *                 type: array
 *                 items:
 *                   type: integer
 *     responses:
 *       200:
 *         description: Permissions updated successfully
 *       400:
 *         description: Invalid request body
 *       404:
 *         description: Role not found
 */
router.patch("/:id/permissions", authMiddleware, roleController.setPermissions);

/**
 * @swagger
 * /api/roles/{id}/permissions/{permissionId}:
 *   delete:
 *     summary: Remove one permission from role
 *     tags: [Roles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: permissionId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Permission removed
 *       404:
 *         description: Role or Permission not found
 */
router.delete(
  "/:id/permissions/:permissionId",
  authMiddleware,
  roleController.removePermission
);

module.exports = router;

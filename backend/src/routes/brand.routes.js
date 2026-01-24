const express = require("express");
const brandController = require("../controllers/brand.controller");
const authMiddleware = require("../middlewares/auth.middleware");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Brands
 *   description: Brand management
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Brand:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         name:
 *           type: string
 *           example: Nike
 *         deleted_at:
 *           type: string
 *           nullable: true
 *         created_at:
 *           type: string
 *         updated_at:
 *           type: string
 */

/**
 * @swagger
 * /api/brands:
 *   get:
 *     summary: Get all brands (DESC)
 *     tags: [Brands]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of brands
 */
router.get("/", authMiddleware, brandController.findAll);

/**
 * @swagger
 * /api/brands/{id}:
 *   get:
 *     summary: Get brand by ID
 *     tags: [Brands]
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
 *         description: Brand detail
 *       404:
 *         description: Brand not found
 */
router.get("/:id", authMiddleware, brandController.findOne);

/**
 * @swagger
 * /api/brands:
 *   post:
 *     summary: Create brand
 *     tags: [Brands]
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
 *                 example: Nike
 *     responses:
 *       201:
 *         description: Brand created
 */
router.post("/", authMiddleware, brandController.create);

/**
 * @swagger
 * /api/brands/{id}:
 *   patch:
 *     summary: Update brand
 *     tags: [Brands]
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
 *               name:
 *                 type: string
 *                 example: Nike
 *     responses:
 *       200:
 *         description: Brand updated
 *       404:
 *         description: Brand not found
 */
router.patch("/:id", authMiddleware, brandController.update);

/**
 * @swagger
 * /api/brands/{id}:
 *   delete:
 *     summary: Soft delete brand
 *     tags: [Brands]
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
 *         description: Brand deleted
 *       404:
 *         description: Brand not found
 */
router.delete("/:id", authMiddleware, brandController.delete);

module.exports = router;

const express = require("express");
const sizeController = require("../controllers/size.controller");
const authMiddleware = require("../middlewares/auth.middleware");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Sizes
 *   description: Size management
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Size:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         name:
 *           type: string
 *           example: M
 */

/**
 * @swagger
 * /sizes:
 *   get:
 *     summary: Get all sizes (DESC)
 *     tags: [Sizes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of sizes
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               items:
 *                 $ref: '#/components/schemas/Size'
 */
router.get("/", authMiddleware, sizeController.findAll);

/**
 * @swagger
 * /sizes/{id}:
 *   get:
 *     summary: Get size by ID
 *     tags: [Sizes]
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
 *         description: Size data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Size'
 *       404:
 *         description: Size not found
 */
router.get("/:id", authMiddleware, sizeController.findOne);

/**
 * @swagger
 * /sizes:
 *   post:
 *     summary: Create new size
 *     tags: [Sizes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: L
 *     responses:
 *       201:
 *         description: Size created
 */
router.post("/", authMiddleware, sizeController.create);

/**
 * @swagger
 * /sizes/{id}:
 *   patch:
 *     summary: Update size by ID
 *     tags: [Sizes]
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
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       200:
 *         description: Size updated
 */
router.patch("/:id", authMiddleware, sizeController.update);

/**
 * @swagger
 * /sizes/{id}:
 *   delete:
 *     summary: Delete size by ID
 *     tags: [Sizes]
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
 *         description: Size deleted
 */
router.delete("/:id", authMiddleware, sizeController.delete);

module.exports = router;

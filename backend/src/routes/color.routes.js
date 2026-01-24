const express = require("express");
const colorController = require("../controllers/color.controller");
const authMiddleware = require("../middlewares/auth.middleware");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Colors
 *   description: Color management
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Color:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         name:
 *           type: string
 *         code:
 *           type: string
 *
 *     DeleteMessage:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 */

/**
 * @swagger
 * /api/colors:
 *   get:
 *     summary: Get all colors (DESC)
 *     tags: [Colors]
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
 *                 $ref: '#/components/schemas/Color'
 */
router.get("/", authMiddleware, colorController.findAll);

/**
 * @swagger
 * /api/colors/{id}:
 *   get:
 *     summary: Get color by ID
 *     tags: [Colors]
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
 *               $ref: '#/components/schemas/Color'
 *       404:
 *         description: Not found
 */
router.get("/:id", authMiddleware, colorController.findOne);

/**
 * @swagger
 * /api/colors:
 *   post:
 *     summary: Create color
 *     tags: [Colors]
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
 *               - code
 *             properties:
 *               name:
 *                 type: string
 *               code:
 *                 type: string
 *     responses:
 *       201:
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Color'
 */
router.post("/", authMiddleware, colorController.create);

/**
 * @swagger
 * /api/colors/{id}:
 *   patch:
 *     summary: Update color
 *     tags: [Colors]
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
 *               code:
 *                 type: string
 *     responses:
 *       200:
 *         description: Updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Color'
 */
router.patch("/:id", authMiddleware, colorController.update);

/**
 * @swagger
 * /api/colors/{id}:
 *   delete:
 *     summary: Delete color
 *     tags: [Colors]
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
 *               $ref: '#/components/schemas/DeleteMessage'
 */
router.delete("/:id", authMiddleware, colorController.delete);

module.exports = router;

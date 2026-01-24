const express = require("express");
const customerController = require("../controllers/customer.controller");
const authMiddleware = require("../middlewares/auth.middleware");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Customers
 *   description: Customer management
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Customer:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         name:
 *           type: string
 *           example: Nguyen Van A
 *         email:
 *           type: string
 *           example: a@gmail.com
 *         phone_number:
 *           type: string
 *           nullable: true
 *           example: "0900000000"
 *         address:
 *           type: string
 *           nullable: true
 *           example: "HCM"
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
 * /api/customers:
 *   get:
 *     summary: Get all customers (DESC)
 *     tags: [Customers]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of customers
 */
router.get("/", authMiddleware, customerController.findAll);

/**
 * @swagger
 * /api/customers/{id}:
 *   get:
 *     summary: Get customer by ID
 *     tags: [Customers]
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
 *         description: Customer detail
 *       404:
 *         description: Customer not found
 */
router.get("/:id", authMiddleware, customerController.findOne);

/**
 * @swagger
 * /api/customers:
 *   post:
 *     summary: Create customer (password will be hashed)
 *     tags: [Customers]
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
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               phone_number:
 *                 type: string
 *               address:
 *                 type: string
 *     responses:
 *       201:
 *         description: Customer created
 */
router.post("/", authMiddleware, customerController.create);

/**
 * @swagger
 * /api/customers/{id}:
 *   patch:
 *     summary: Update customer (if password provided, will be re-hashed)
 *     tags: [Customers]
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
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               phone_number:
 *                 type: string
 *               address:
 *                 type: string
 *     responses:
 *       200:
 *         description: Customer updated
 *       404:
 *         description: Customer not found
 */
router.patch("/:id", authMiddleware, customerController.update);

/**
 * @swagger
 * /api/customers/{id}:
 *   delete:
 *     summary: Soft delete customer
 *     tags: [Customers]
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
 *         description: Customer deleted
 *       404:
 *         description: Customer not found
 */
router.delete("/:id", authMiddleware, customerController.delete);

module.exports = router;

const express = require("express");
const authController = require("../controllers/auth.controller");
const authMiddleware = require("../middlewares/auth.middleware");

const app = express();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication
 */

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 example: admin01
 *               password:
 *                 type: string
 *                 example: Admin01
 *     responses:
 *       200:
 *         description: Login successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: JWT token
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *                 expires_at:
 *                   type: string
 *                   format: date-time
 *                   description: Token expiration datetime (ISO 8601)
 *                   example: 2026-01-18T10:30:00.000Z
 *                 user:
 *                   type: object
 *                   description: Logged in user info
 *       400:
 *         description: Invalid credentials
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */

app.post("/login", authController.login);

/**
 * @swagger
 * /api/auth/login/verify-2fa:
 *   post:
 *     summary: Verify admin login OTP when 2FA is enabled
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - temp_token
 *               - otp_code
 *             properties:
 *               temp_token:
 *                 type: string
 *               otp_code:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: Login verified successfully
 *       400:
 *         description: Invalid or expired OTP
 *       404:
 *         description: User not found
 */
app.post("/login/verify-2fa", authController.verifyLoginTwoFactor);

/**
 * @swagger
 * /api/auth/customer-login:
 *   post:
 *     summary: Login customer account
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: customer@example.com
 *               password:
 *                 type: string
 *                 example: 123456
 *     responses:
 *       200:
 *         description: Login successfully
 *       400:
 *         description: Invalid credentials
 *       404:
 *         description: Customer not found
 */
app.post("/customer-login", authController.customerLogin);

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register customer account (store in customers table)
 *     tags: [Auth]
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
 *                 example: Nguyen Van A
 *               email:
 *                 type: string
 *                 example: customer@example.com
 *               password:
 *                 type: string
 *                 example: 123456
 *               phone_number:
 *                 type: string
 *                 example: 0912345678
 *               address:
 *                 type: string
 *                 example: District 1, Ho Chi Minh City
 *     responses:
 *       201:
 *         description: Register successfully
 *       400:
 *         description: Invalid payload
 *       409:
 *         description: Email or phone already registered
 *       500:
 *         description: Server error
 */
app.post("/register", authController.register);

/**
 * @swagger
 * /api/auth/2fa/status:
 *   get:
 *     summary: Get current admin 2FA status
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Current 2FA status
 *       401:
 *         description: Unauthorized
 */
app.get("/2fa/status", authMiddleware, authController.getTwoFactorStatus);

/**
 * @swagger
 * /api/auth/2fa/request:
 *   post:
 *     summary: Send OTP email to enable or disable 2FA
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - action
 *             properties:
 *               action:
 *                 type: string
 *                 enum: [enable, disable]
 *     responses:
 *       200:
 *         description: OTP sent
 *       400:
 *         description: Invalid action or current state
 *       401:
 *         description: Unauthorized
 */
app.post("/2fa/request", authMiddleware, authController.requestTwoFactorAction);

/**
 * @swagger
 * /api/auth/2fa/confirm:
 *   post:
 *     summary: Confirm enable or disable 2FA using OTP
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - action
 *               - otp_code
 *             properties:
 *               action:
 *                 type: string
 *                 enum: [enable, disable]
 *               otp_code:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: 2FA state updated
 *       400:
 *         description: Invalid or expired OTP
 *       401:
 *         description: Unauthorized
 */
app.post("/2fa/confirm", authMiddleware, authController.confirmTwoFactorAction);

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Logout user
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logout successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
app.post("/logout", authController.logout);

module.exports = app;

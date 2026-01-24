const express = require("express");
const orderController = require("../controllers/order.controller");
const authMiddleware = require("../middlewares/auth.middleware");

const router = express.Router();

// ================= ORDER ROUTES =================

// Create order with order items
router.post("/", authMiddleware, orderController.create);

// Get all orders (with search and pagination)
router.get("/", authMiddleware, orderController.findAll);

// Get order by id
router.get("/:id", authMiddleware, orderController.findOne);

// Update order
router.put("/:id", authMiddleware, orderController.update);

// Soft delete order
router.delete("/:id", authMiddleware, orderController.delete);

module.exports = router;
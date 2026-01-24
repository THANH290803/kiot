const express = require("express");
const orderItemController = require("../controllers/order_item.controller");
const authMiddleware = require("../middlewares/auth.middleware");

const router = express.Router();

// ================= ORDER ITEM ROUTES =================

// Create order item
router.post("/", authMiddleware, orderItemController.create);

// Get all order items (with pagination)
router.get("/", authMiddleware, orderItemController.findAll);

// Get order item by id
router.get("/:id", authMiddleware, orderItemController.findOne);

// Update order item
router.put("/:id", authMiddleware, orderItemController.update);

// Soft delete order item
router.delete("/:id", authMiddleware, orderItemController.delete);

module.exports = router;
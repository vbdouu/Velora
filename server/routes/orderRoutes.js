// This file contains the routes for orders.
// All order operations require authentication.

const express = require("express");
const orderController = require("../controllers/orderController");
const { requireAuth, requireClient } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(requireAuth, requireClient);

// Place a new order
router.post("/", orderController.placeOrder);

// Get order history
router.get("/", orderController.getOrders);

// Get a specific order
router.get("/:id", orderController.getOrderById);

// Cancel an order (only pending)
router.put("/:id/cancel", orderController.cancelOrder);

module.exports = router;

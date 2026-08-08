// This file contains the routes for the shopping cart.
// All cart operations require authentication.

const express = require("express");
const cartController = require("../controllers/cartController");
const { requireAuth, requireClient } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(requireAuth, requireClient);

// Get the current user's cart
router.get("/", cartController.getCart);

// Add a product to the cart
router.post("/", cartController.addToCart);

// Clear the entire cart — must be declared BEFORE /:id to avoid being shadowed
router.delete("/", cartController.clearCart);

// Update cart item quantity
router.put("/:id", cartController.updateQuantity);

// Remove an item from the cart
router.delete("/:id", cartController.removeFromCart);

module.exports = router;

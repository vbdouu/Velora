// This file contains the routes for the wishlist.
// All wishlist operations require authentication.

const express = require("express");
const wishlistController = require("../controllers/wishlistController");
const { requireAuth, requireClient } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(requireAuth, requireClient);

// Get the current user's wishlist
router.get("/", wishlistController.getWishlist);

// Add a product to the wishlist
router.post("/", wishlistController.addToWishlist);

// Remove a product from the wishlist
router.delete("/:id", wishlistController.removeFromWishlist);

module.exports = router;

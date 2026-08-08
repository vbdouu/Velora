// This file contains the routes for products.
// Products are publicly accessible (no authentication required).

const express = require("express");
const productController = require("../controllers/productController");

const router = express.Router();

// Get all products (supports query filters: ?category=, ?search=, ?featured=)
router.get("/", productController.listProducts);

// Get a single product by id
router.get("/:id", productController.getProductById);

module.exports = router;

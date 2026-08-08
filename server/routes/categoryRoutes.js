// This file contains the routes for categories.
// Categories are publicly accessible (no authentication required).

const express = require("express");
const categoryController = require("../controllers/categoryController");

const router = express.Router();

// Get all categories
router.get("/", categoryController.listCategories);

// Get a single category by id
router.get("/:id", categoryController.getCategoryById);

module.exports = router;

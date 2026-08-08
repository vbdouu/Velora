// This file contains routes for site-wide settings.
// Public route for storefront, admin routes for management.

const express = require("express");
const settingsController = require("../controllers/settingsController");
const { requireAuth, requireAdmin } = require("../middleware/authMiddleware");

const router = express.Router();

// Public: get storefront settings (no auth required)
router.get("/", settingsController.getPublicSettings);

// Public: get wilaya shipping rates (used on checkout page)
router.get("/wilayas", settingsController.getWilayas);

// Admin: get all settings
router.get("/admin", requireAuth, requireAdmin, settingsController.getAllSettings);

// Admin: update settings
router.put("/admin", requireAuth, requireAdmin, settingsController.updateSettings);

module.exports = router;

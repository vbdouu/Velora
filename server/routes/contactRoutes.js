// ============================================================
// CONTACTROUTES.JS — Routes for Contact Form & Admin Message API
// Velora Jewelry Boutique — 2026
// ============================================================

const express = require("express");
const contactController = require("../controllers/contactController");
const { requireAuth, requireAdmin } = require("../middleware/authMiddleware");

const router = express.Router();

// Public route: Submit contact form
router.post("/", contactController.submitContactForm);

// Protected Admin routes
router.get("/admin", requireAuth, requireAdmin, contactController.getAllMessages);
router.get("/admin/:id", requireAuth, requireAdmin, contactController.getMessageById);
router.put("/admin/:id/status", requireAuth, requireAdmin, contactController.updateStatus);
router.delete("/admin/:id", requireAuth, requireAdmin, contactController.deleteMessage);

module.exports = router;

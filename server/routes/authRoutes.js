// This file contains the routes for authentication.
// It defines paths for registration, login, logout, profile management,
// password change and email change.

const express = require("express");
const authController = require("../controllers/authController");
const upload = require("../middleware/uploadMiddleware");
const { requireAuth } = require("../middleware/authMiddleware");

const router = express.Router();

// Register a new user
router.post("/register", authController.register);

// Log in
router.post("/login", authController.login);

// Log out
router.post("/logout", authController.logout);

// Get the currently logged-in user
router.get("/me", authController.currentUser);

// Get full profile
router.get("/profile", requireAuth, authController.getProfile);

// Update profile
router.put("/profile", requireAuth, authController.updateProfile);

// Update profile photo
router.put("/photo", requireAuth, upload.single("photo"), authController.updatePhoto);

// Remove profile photo
router.delete("/photo", requireAuth, authController.removePhoto);

// Change password
router.put("/password", requireAuth, authController.changePassword);

// Change email
router.put("/email", requireAuth, authController.changeEmail);

module.exports = router;

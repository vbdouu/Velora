// This file contains the routes reserved for administrators.

const express = require("express");
const adminController = require("../controllers/adminController");
const upload = require("../middleware/uploadMiddleware");
const { requireAuth, requireAdmin, requireSuperAdmin } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(requireAuth, requireAdmin);

// Dashboard statistics
router.get("/stats", adminController.getStatistics);

// Product management
router.post("/products", upload.single("image"), adminController.createProduct);
router.put("/products/:id", upload.single("image"), adminController.updateProduct);
router.delete("/products/:id", adminController.deleteProduct);
router.put("/products/:id/archive", adminController.archiveProduct);
router.put("/products/:id/restore", adminController.restoreProduct);
router.post("/products/:id/duplicate", adminController.duplicateProduct);

// Product extra images management
router.post("/products/:id/images", upload.single("image"), adminController.addProductImage);
router.delete("/products/:id/images/:imageId", adminController.deleteProductImageById);

// Category management
router.post("/categories", upload.single("image"), adminController.createCategory);
router.put("/categories/:id", upload.single("image"), adminController.updateCategory);
router.delete("/categories/:id", adminController.deleteCategory);

// User management
router.get("/users", adminController.listUsers);
router.put("/users/:id/block", adminController.blockUser);
router.put("/users/:id/unblock", adminController.unblockUser);

// Order management
router.get("/orders", adminController.listOrders);
router.get("/orders/:id", adminController.getOrderById);
router.put("/orders/:id/status", adminController.updateOrderStatus);
router.put("/orders/:id/notes", adminController.updateOrderNotes);

// Exports
router.get("/export/orders", adminController.exportOrdersCsv);
router.get("/export/users", adminController.exportUsersCsv);

// Admin user management (super_admin only)
router.get("/admins", requireSuperAdmin, adminController.listAdmins);
router.post("/admins", requireSuperAdmin, adminController.createAdmin);
router.put("/admins/:id", requireSuperAdmin, adminController.updateAdmin);
router.put("/admins/:id/password", requireSuperAdmin, adminController.resetAdminPassword);
router.put("/admins/:id/deactivate", requireSuperAdmin, adminController.deactivateAdmin);
router.put("/admins/:id/activate", requireSuperAdmin, adminController.activateAdmin);

module.exports = router;

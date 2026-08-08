// This file contains the logic for admin dashboard operations.
// It handles statistics, product/category management, users, orders,
// admin user management, exports, and product archiving/duplication.

const path = require("path");
const fs = require("fs");
const bcrypt = require("bcrypt");
const adminModel = require("../models/adminModel");
const productModel = require("../models/productModel");
const categoryModel = require("../models/categoryModel");
const orderModel = require("../models/orderModel");
const userModel = require("../models/userModel");
const db = require("../config/db");

// ── Dashboard Statistics ──

async function getStatistics(req, res) {
    try {
        const [
            totalUsers,
            totalProducts,
            totalCategories,
            totalOrders,
            revenue,
            monthlyRevenue,
            todayOrders,
            pendingOrders,
            ordersByStatus,
            recentUsers,
            recentOrders,
            lowStockProducts,
            bestSellers,
            revenueByPeriod,
            ordersByPeriod
        ] = await Promise.all([
            adminModel.count("users"),
            adminModel.count("products"),
            adminModel.count("categories"),
            adminModel.count("orders"),
            adminModel.totalRevenue(),
            adminModel.monthlyRevenue(),
            adminModel.todayOrders(),
            adminModel.pendingOrdersCount(),
            adminModel.ordersByStatus(),
            adminModel.recentUsers(),
            adminModel.recentOrders(),
            adminModel.lowStockProducts(),
            adminModel.bestSellers(),
            adminModel.revenueByPeriodStats(),
            adminModel.ordersByPeriodStats()
        ]);

        res.status(200).json({
            statistics: {
                totalUsers,
                totalProducts,
                totalCategories,
                totalOrders,
                revenue,
                monthlyRevenue,
                todayOrders,
                pendingOrders,
                ordersByStatus,
                revenueByPeriod,
                ordersByPeriod,
                recentUsers,
                recentOrders,
                lowStockProducts,
                bestSellers
            }
        });
    } catch (error) {
        console.error("Admin statistics error:", error.message);
        res.status(500).json({ message: "Erreur serveur." });
    }
}


// ── Product CRUD ──

async function createProduct(req, res) {
    try {
        const { name, description, material, color, dimensions, careInstructions, deliveryInfo, returnPolicy, price, stock, categoryId, isFeatured, isVisible, sku } = req.body;
        const image = req.file ? "/uploads/" + req.file.filename : null;

        if (!name || !price) {
            return res.status(400).json({
                message: "Nom et prix sont obligatoires."
            });
        }

        const result = await productModel.createProduct(
            name,
            description || null,
            material || null,
            color || null,
            price,
            stock || 0,
            categoryId || null,
            image,
            isFeatured === "true" || isFeatured === true,
            isVisible !== "false" && isVisible !== false,
            sku || null,
            dimensions || null,
            careInstructions || null,
            deliveryInfo || null,
            returnPolicy || null
        );

        res.status(201).json({
            message: "Produit créé avec succès.",
            productId: result.insertId
        });

    } catch (error) {
        console.error("Create product error:", error.message);
        res.status(500).json({ message: "Erreur serveur." });
    }
}

async function updateProduct(req, res) {
    try {
        const { name, description, material, color, dimensions, careInstructions, deliveryInfo, returnPolicy, price, stock, categoryId, isFeatured, isVisible, sku } = req.body;

        const product = await productModel.findProductById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: "Produit introuvable." });
        }

        let image = req.body.existingImage || null;

        if (req.file) {
            image = "/uploads/" + req.file.filename;
            if (product.image) {
                const oldFilePath = path.join(__dirname, "../../client/public", product.image);
                if (fs.existsSync(oldFilePath)) {
                    fs.unlinkSync(oldFilePath);
                }
            }
        } else if (!image && product.image) {
            image = product.image;
        }

        if (!name || !price) {
            return res.status(400).json({
                message: "Nom et prix sont obligatoires."
            });
        }

        await productModel.updateProduct(
            req.params.id,
            name,
            description || null,
            material || null,
            color || null,
            price,
            stock || 0,
            categoryId || null,
            image,
            isFeatured === "true" || isFeatured === true,
            isVisible !== "false" && isVisible !== false,
            sku || null,
            dimensions || null,
            careInstructions || null,
            deliveryInfo || null,
            returnPolicy || null
        );

        res.status(200).json({ message: "Produit modifié avec succès." });


    } catch (error) {
        console.error("Update product error:", error.message);
        res.status(500).json({ message: "Erreur serveur." });
    }
}

async function deleteProduct(req, res) {
    try {
        const product = await productModel.findProductById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: "Produit introuvable." });
        }

        // Delete extra images from disk before removing the product
        const extraImages = await productModel.findProductImages(req.params.id);
        for (const img of extraImages) {
            const imgPath = path.join(__dirname, "../../client/public", img.image_path);
            if (fs.existsSync(imgPath)) {
                fs.unlinkSync(imgPath);
            }
        }

        await productModel.deleteProduct(req.params.id);

        if (product.image) {
            const filePath = path.join(__dirname, "../../client/public", product.image);
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        }

        res.status(200).json({ message: "Produit supprimé avec succès." });

    } catch (error) {
        console.error("Delete product error:", error.message);
        res.status(500).json({ message: "Erreur serveur." });
    }
}

// Archive a product (soft delete)
async function archiveProduct(req, res) {
    try {
        const product = await productModel.findProductById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: "Produit introuvable." });
        }

        await productModel.archiveProduct(req.params.id);
        res.status(200).json({ message: "Produit archivé avec succès." });

    } catch (error) {
        console.error("Archive product error:", error.message);
        res.status(500).json({ message: "Erreur serveur." });
    }
}

// Restore an archived product
async function restoreProduct(req, res) {
    try {
        const product = await productModel.findProductById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: "Produit introuvable." });
        }

        await productModel.restoreProduct(req.params.id);
        res.status(200).json({ message: "Produit restauré avec succès." });

    } catch (error) {
        console.error("Restore product error:", error.message);
        res.status(500).json({ message: "Erreur serveur." });
    }
}

// Duplicate a product
async function duplicateProduct(req, res) {
    try {
        const result = await productModel.duplicateProduct(req.params.id);
        if (!result) {
            return res.status(404).json({ message: "Produit introuvable." });
        }

        res.status(201).json({
            message: "Produit dupliqué avec succès.",
            productId: result.insertId
        });

    } catch (error) {
        console.error("Duplicate product error:", error.message);
        res.status(500).json({ message: "Erreur serveur." });
    }
}

// Add an extra image to a product
async function addProductImage(req, res) {
    try {
        const { id } = req.params;

        const product = await productModel.findProductById(id);
        if (!product) {
            return res.status(404).json({ message: "Produit introuvable." });
        }

        if (!req.file) {
            return res.status(400).json({ message: "Aucune image fournie." });
        }

        const imagePath = "/uploads/" + req.file.filename;

        // Determine next display_order
        const existingImages = await productModel.findProductImages(id);
        const displayOrder = existingImages.length;

        const result = await productModel.addProductImage(id, imagePath, displayOrder);

        res.status(201).json({
            message: "Image ajoutée avec succès.",
            imageId: result.insertId,
            imagePath
        });

    } catch (error) {
        console.error("Add product image error:", error.message);
        res.status(500).json({ message: "Erreur serveur." });
    }
}

// Delete an extra image from a product
async function deleteProductImageById(req, res) {
    try {
        const image = await productModel.findProductImageById(req.params.imageId);
        if (!image) {
            return res.status(404).json({ message: "Image introuvable." });
        }

        // Verify the image belongs to the specified product
        if (String(image.product_id) !== String(req.params.id)) {
            return res.status(400).json({ message: "Cette image n'appartient pas à ce produit." });
        }

        // Delete file from disk
        const filePath = path.join(__dirname, "../../client/public", image.image_path);
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        await productModel.deleteProductImage(req.params.imageId);

        res.status(200).json({ message: "Image supprimée avec succès." });

    } catch (error) {
        console.error("Delete product image error:", error.message);
        res.status(500).json({ message: "Erreur serveur." });
    }
}


// ── Category CRUD ──

async function createCategory(req, res) {
    try {
        const { name, description } = req.body;
        const image = req.file ? "/uploads/" + req.file.filename : null;

        if (!name) {
            return res.status(400).json({
                message: "Le nom de la catégorie est obligatoire."
            });
        }

        const result = await categoryModel.createCategory(name, description || null, image);

        res.status(201).json({
            message: "Catégorie créée avec succès.",
            categoryId: result.insertId
        });

    } catch (error) {
        console.error("Create category error:", error.message);
        res.status(500).json({ message: "Erreur serveur." });
    }
}

async function updateCategory(req, res) {
    try {
        const { name, description } = req.body;

        const category = await categoryModel.findCategoryById(req.params.id);
        if (!category) {
            return res.status(404).json({ message: "Catégorie introuvable." });
        }

        let image = req.body.existingImage || null;

        if (req.file) {
            image = "/uploads/" + req.file.filename;
            if (category.image) {
                const oldFilePath = path.join(__dirname, "../../client/public", category.image);
                if (fs.existsSync(oldFilePath)) {
                    fs.unlinkSync(oldFilePath);
                }
            }
        } else if (!image && category.image) {
            image = category.image;
        }

        if (!name) {
            return res.status(400).json({
                message: "Le nom de la catégorie est obligatoire."
            });
        }

        await categoryModel.updateCategory(req.params.id, name, description || null, image);

        res.status(200).json({ message: "Catégorie modifiée avec succès." });

    } catch (error) {
        console.error("Update category error:", error.message);
        res.status(500).json({ message: "Erreur serveur." });
    }
}

async function deleteCategory(req, res) {
    try {
        const category = await categoryModel.findCategoryById(req.params.id);
        if (!category) {
            return res.status(404).json({ message: "Catégorie introuvable." });
        }

        if (category.total_products > 0) {
            return res.status(400).json({
                message: `Impossible de supprimer cette catégorie car elle contient ${category.total_products} produit(s). Déplacez ou supprimez les produits d'abord.`
            });
        }

        await categoryModel.deleteCategory(req.params.id);

        if (category.image) {
            const filePath = path.join(__dirname, "../../client/public", category.image);
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        }

        res.status(200).json({ message: "Catégorie supprimée avec succès." });

    } catch (error) {
        console.error("Delete category error:", error.message);
        res.status(500).json({ message: "Erreur serveur." });
    }
}


// ── Users (with server-side sorting/filtering/pagination) ──

async function listUsers(req, res) {
    try {
        const result = await adminModel.listUsers({
            search: req.query.search || null,
            status: req.query.status || null,
            hasOrders: req.query.hasOrders || null,
            sortBy: req.query.sortBy || "created_at",
            sortDir: req.query.sortDir || "desc",
            page: req.query.page || 1,
            pageSize: req.query.pageSize || 25
        });

        res.status(200).json(result);

    } catch (error) {
        console.error("Admin list users error:", error.message);
        res.status(500).json({ message: "Erreur serveur." });
    }
}

async function blockUser(req, res) {
    try {
        const { reason } = req.body;
        const blockReason = (reason && reason.trim().length >= 5) ? reason.trim() : "Comportement inapproprié.";

        const user = await adminModel.findUserById(req.params.id);

        if (!user) {
            return res.status(404).json({ message: "Utilisateur introuvable." });
        }

        if (user.role !== "client") {
            return res.status(400).json({ message: "Impossible de bloquer un administrateur." });
        }

        const result = await adminModel.blockUser(req.params.id, blockReason);

        if (result.affectedRows === 0) {
            return res.status(400).json({ message: "Blocage impossible." });
        }

        res.status(200).json({ message: "Utilisateur bloqué avec succès." });

    } catch (error) {
        console.error("Block user error:", error.message);
        res.status(500).json({ message: "Erreur serveur." });
    }
}

async function unblockUser(req, res) {
    try {
        const user = await adminModel.findUserById(req.params.id);

        if (!user) {
            return res.status(404).json({ message: "Utilisateur introuvable." });
        }

        const result = await adminModel.unblockUser(req.params.id);

        if (result.affectedRows === 0) {
            return res.status(400).json({ message: "Déblocage impossible." });
        }

        res.status(200).json({ message: "Utilisateur débloqué avec succès." });

    } catch (error) {
        console.error("Unblock user error:", error.message);
        res.status(500).json({ message: "Erreur serveur." });
    }
}


// ── Orders (with server-side sorting/filtering/pagination) ──

async function listOrders(req, res) {
    try {
        const result = await orderModel.findAllOrders({
            search: req.query.search || null,
            status: req.query.status || null,
            city: req.query.city || null,
            dateFrom: req.query.dateFrom || null,
            dateTo: req.query.dateTo || null,
            sortBy: req.query.sortBy || "date",
            sortDir: req.query.sortDir || "desc",
            page: req.query.page || 1,
            pageSize: req.query.pageSize || 25
        });

        res.status(200).json(result);

    } catch (error) {
        console.error("Admin list orders error:", error.message);
        res.status(500).json({ message: "Erreur serveur." });
    }
}

async function updateOrderStatus(req, res) {
    try {
        const { status } = req.body;
        const validStatuses = ["pending", "confirmed", "shipped", "delivered", "cancelled"];

        if (!status || !validStatuses.includes(status)) {
            return res.status(400).json({ message: "Statut invalide." });
        }

        // Get current order to record old status
        const order = await orderModel.findOrderById(req.params.id);
        if (!order) {
            return res.status(404).json({ message: "Commande introuvable." });
        }

        const result = await orderModel.updateOrderStatus(req.params.id, status);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Commande introuvable." });
        }

        // Restore stock when admin cancels a non-already-cancelled order
        if (status === "cancelled" && order.status !== "cancelled") {
            const items = await orderModel.findOrderItems(order.id);
            for (const item of items) {
                if (item.product_id) {
                    await db.promise().query(
                        "UPDATE products SET stock = stock + ?, sales_count = GREATEST(sales_count - ?, 0) WHERE id = ?",
                        [item.quantity, item.quantity, item.product_id]
                    );
                }
            }
        }

        // Record status change in history
        await adminModel.addStatusHistory(
            req.params.id,
            order.status,
            status,
            req.session.user.id,
            null
        );

        res.status(200).json({ message: "Statut de la commande mis à jour." });

    } catch (error) {
        console.error("Update order status error:", error.message);
        res.status(500).json({ message: "Erreur serveur." });
    }
}

async function getOrderById(req, res) {
    try {
        const order = await orderModel.findOrderById(req.params.id);

        if (!order) {
            return res.status(404).json({ message: "Commande introuvable." });
        }

        const items = await orderModel.findOrderItems(order.id);
        const history = await adminModel.getStatusHistory(order.id);

        res.status(200).json({ order, items, history });

    } catch (error) {
        console.error("Admin get order error:", error.message);
        res.status(500).json({ message: "Erreur serveur." });
    }
}

// Update admin notes on an order
async function updateOrderNotes(req, res) {
    try {
        const { notes } = req.body;

        const order = await orderModel.findOrderById(req.params.id);
        if (!order) {
            return res.status(404).json({ message: "Commande introuvable." });
        }

        await orderModel.updateAdminNotes(req.params.id, notes || null);

        res.status(200).json({ message: "Notes mises à jour." });

    } catch (error) {
        console.error("Update order notes error:", error.message);
        res.status(500).json({ message: "Erreur serveur." });
    }
}


// ── Admin User Management (super_admin only) ──

async function listAdmins(req, res) {
    try {
        const admins = await adminModel.listAdmins();
        res.status(200).json({ admins });

    } catch (error) {
        console.error("List admins error:", error.message);
        res.status(500).json({ message: "Erreur serveur." });
    }
}

async function createAdmin(req, res) {
    try {
        const { firstName, lastName, email, password, phone, gender } = req.body;

        if (!firstName || !lastName || !email || !password) {
            return res.status(400).json({
                message: "Tous les champs obligatoires doivent être remplis."
            });
        }

        if (password.length < 8) {
            return res.status(400).json({
                message: "Le mot de passe doit contenir au moins 8 caractères."
            });
        }

        const existingUser = await userModel.findUserByEmail(email);
        if (existingUser) {
            return res.status(400).json({
                message: "Un compte avec cet e-mail existe déjà."
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await adminModel.createAdmin(firstName, lastName, email, hashedPassword, phone, "admin", gender || "female");

        res.status(201).json({ message: "Administrateur créé avec succès." });

    } catch (error) {
        console.error("Create admin error:", error.message);
        res.status(500).json({ message: "Erreur serveur." });
    }
}

async function updateAdmin(req, res) {
    try {
        const { firstName, lastName, email, phone, gender } = req.body;

        if (!firstName || !lastName || !email) {
            return res.status(400).json({
                message: "Prénom, nom et email sont obligatoires."
            });
        }

        const admin = await adminModel.findUserById(req.params.id);
        if (!admin || (admin.role !== "admin" && admin.role !== "super_admin")) {
            return res.status(404).json({ message: "Administrateur introuvable." });
        }

        // Check email uniqueness if changed
        if (email !== admin.email) {
            const existingUser = await userModel.findUserByEmail(email);
            if (existingUser) {
                return res.status(400).json({
                    message: "Un compte avec cet e-mail existe déjà."
                });
            }
        }

        await adminModel.updateAdmin(req.params.id, firstName, lastName, email, phone, gender || "female");

        res.status(200).json({ message: "Administrateur modifié avec succès." });

    } catch (error) {
        console.error("Update admin error:", error.message);
        res.status(500).json({ message: "Erreur serveur." });
    }
}

async function resetAdminPassword(req, res) {
    try {
        const { password } = req.body;

        if (!password || password.length < 8) {
            return res.status(400).json({
                message: "Le mot de passe doit contenir au moins 8 caractères."
            });
        }

        const admin = await adminModel.findUserById(req.params.id);
        if (!admin || (admin.role !== "admin" && admin.role !== "super_admin")) {
            return res.status(404).json({ message: "Administrateur introuvable." });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await adminModel.resetAdminPassword(req.params.id, hashedPassword);

        res.status(200).json({ message: "Mot de passe réinitialisé avec succès." });

    } catch (error) {
        console.error("Reset admin password error:", error.message);
        res.status(500).json({ message: "Erreur serveur." });
    }
}

async function deactivateAdmin(req, res) {
    try {
        const admin = await adminModel.findUserById(req.params.id);
        if (!admin) {
            return res.status(404).json({ message: "Administrateur introuvable." });
        }

        if (admin.role === "super_admin") {
            return res.status(400).json({
                message: "Impossible de désactiver un super administrateur."
            });
        }

        if (admin.id === req.session.user.id) {
            return res.status(400).json({
                message: "Vous ne pouvez pas vous désactiver vous-même."
            });
        }

        await adminModel.deactivateAdmin(req.params.id);
        res.status(200).json({ message: "Administrateur désactivé." });

    } catch (error) {
        console.error("Deactivate admin error:", error.message);
        res.status(500).json({ message: "Erreur serveur." });
    }
}

async function activateAdmin(req, res) {
    try {
        const admin = await adminModel.findUserById(req.params.id);
        if (!admin) {
            return res.status(404).json({ message: "Administrateur introuvable." });
        }

        await adminModel.activateAdmin(req.params.id);
        res.status(200).json({ message: "Administrateur réactivé." });

    } catch (error) {
        console.error("Activate admin error:", error.message);
        res.status(500).json({ message: "Erreur serveur." });
    }
}


// ── CSV Exports ──

async function exportOrdersCsv(req, res) {
    try {
        const result = await orderModel.findAllOrders({
            status: req.query.status || null,
            unlimited: true
        });

        const orders = result.orders;
        const header = "ID,Client,Email,Ville,Téléphone,Total,Frais livraison,Statut,Date\n";
        const rows = orders.map(o =>
            `${o.id},"${(o.first_name + " " + o.last_name).replace(/"/g, '""')}","${o.email}","${(o.shipping_city || "").replace(/"/g, '""')}","${o.shipping_phone || ""}",${o.total},${o.shipping_fee || 0},"${o.status}","${new Date(o.created_at).toLocaleDateString("fr-FR")}"`
        ).join("\n");

        res.setHeader("Content-Type", "text/csv; charset=utf-8");
        res.setHeader("Content-Disposition", "attachment; filename=commandes_velora.csv");
        res.send("\uFEFF" + header + rows);

    } catch (error) {
        console.error("Export orders error:", error.message);
        res.status(500).json({ message: "Erreur serveur." });
    }
}

async function exportUsersCsv(req, res) {
    try {
        const result = await adminModel.listUsers({
            unlimited: true
        });

        const users = result.users;
        const header = "ID,Prénom,Nom,Email,Téléphone,Commandes,Total dépensé,Statut,Inscription\n";
        const rows = users.map(u =>
            `${u.id},"${u.first_name}","${u.last_name}","${u.email}","${u.phone || ""}",${u.order_count},${u.total_spent},"${u.account_status}","${new Date(u.created_at).toLocaleDateString("fr-FR")}"`
        ).join("\n");

        res.setHeader("Content-Type", "text/csv; charset=utf-8");
        res.setHeader("Content-Disposition", "attachment; filename=clients_velora.csv");
        res.send("\uFEFF" + header + rows);

    } catch (error) {
        console.error("Export users error:", error.message);
        res.status(500).json({ message: "Erreur serveur." });
    }
}


module.exports = {
    getStatistics,
    createProduct,
    updateProduct,
    deleteProduct,
    archiveProduct,
    restoreProduct,
    duplicateProduct,
    addProductImage,
    deleteProductImageById,
    createCategory,
    updateCategory,
    deleteCategory,
    listUsers,
    blockUser,
    unblockUser,
    listOrders,
    getOrderById,
    updateOrderStatus,
    updateOrderNotes,
    listAdmins,
    createAdmin,
    updateAdmin,
    resetAdminPassword,
    deactivateAdmin,
    activateAdmin,
    exportOrdersCsv,
    exportUsersCsv
};

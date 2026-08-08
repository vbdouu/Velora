// This file contains the logic for category-related operations.
// It uses categoryModel.js to interact with the categories table.

const categoryModel = require("../models/categoryModel");

// Get all categories
async function listCategories(req, res) {
    try {
        // Admins can request hidden categories via ?includeHidden=true
        const isAdmin = req.session && req.session.user &&
            (req.session.user.role === "admin" || req.session.user.role === "super_admin");
        const includeHidden = isAdmin && req.query.includeHidden === "true";

        const categories = await categoryModel.findAllCategories(includeHidden);

        res.status(200).json({
            categories
        });

    } catch (error) {
        console.error("List categories error:", error.message);

        res.status(500).json({
            message: "Erreur serveur."
        });
    }
}

// Get a single category by id
async function getCategoryById(req, res) {
    try {
        const category = await categoryModel.findCategoryById(req.params.id);

        if (!category) {
            return res.status(404).json({
                message: "Catégorie introuvable."
            });
        }

        res.status(200).json({
            category
        });

    } catch (error) {
        console.error("Get category error:", error.message);

        res.status(500).json({
            message: "Erreur serveur."
        });
    }
}

module.exports = {
    listCategories,
    getCategoryById
};

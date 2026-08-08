// This file contains the logic for product-related operations.
// It uses productModel.js to interact with the products table.

const productModel = require("../models/productModel");

// Get all products (with optional filters, sorting, pagination)
async function listProducts(req, res) {
    try {
        const isAdmin = req.session && req.session.user && (req.session.user.role === "admin" || req.session.user.role === "super_admin");

        let sortBy = req.query.sortBy || null;
        let sortDir = req.query.sortDir || null;

        if (req.query.sort) {
            if (req.query.sort === "price_asc") {
                sortBy = "price";
                sortDir = "asc";
            } else if (req.query.sort === "price_desc") {
                sortBy = "price";
                sortDir = "desc";
            } else if (req.query.sort === "newest") {
                sortBy = "created_at";
                sortDir = "desc";
            }
        }

        const filters = {
            categoryId: req.query.category || req.query.categoryId || null,
            search: req.query.search || null,
            featured: req.query.featured === "true",
            limit: req.query.limit || null,
            admin: req.query.admin === "true" || isAdmin,
            visibility: req.query.visibility || null,
            stockStatus: req.query.stockStatus || null,
            showArchived: req.query.showArchived === "true",
            sortBy,
            sortDir,
            page: req.query.page || null,
            pageSize: req.query.pageSize || null
        };

        const result = await productModel.findAllProducts(filters);

        // If paginated, return with metadata
        if (filters.page && result.products) {
            res.status(200).json(result);
        } else {
            res.status(200).json({ products: result });
        }

    } catch (error) {
        console.error("List products error:", error.message);

        res.status(500).json({
            message: "Erreur serveur."
        });
    }
}

// Get a single product by id
async function getProductById(req, res) {
    try {
        const product = await productModel.findProductById(req.params.id);

        if (!product) {
            return res.status(404).json({
                message: "Produit introuvable."
            });
        }

        // Block public access to hidden or archived products
        const isAdmin = req.session && req.session.user &&
            (req.session.user.role === "admin" || req.session.user.role === "super_admin");

        if (!isAdmin && (product.is_visible === 0 || product.is_archived === 1)) {
            return res.status(404).json({
                message: "Produit introuvable."
            });
        }

        const images = await productModel.findProductImages(product.id);

        res.status(200).json({
            product,
            images
        });

    } catch (error) {
        console.error("Get product error:", error.message);

        res.status(500).json({
            message: "Erreur serveur."
        });
    }
}

module.exports = {
    listProducts,
    getProductById
};

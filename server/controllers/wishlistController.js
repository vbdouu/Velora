// This file contains the logic for wishlist operations.
// It uses wishlistModel.js to manage saved favorites.

const wishlistModel = require("../models/wishlistModel");
const productModel = require("../models/productModel");

// Get the current user's wishlist
async function getWishlist(req, res) {
    try {
        const items = await wishlistModel.findWishlistByUserId(req.session.user.id);

        res.status(200).json({
            items
        });

    } catch (error) {
        console.error("Get wishlist error:", error.message);

        res.status(500).json({
            message: "Erreur serveur."
        });
    }
}

// Add a product to the wishlist
async function addToWishlist(req, res) {
    try {
        const { productId } = req.body;

        if (!productId) {
            return res.status(400).json({
                message: "Produit requis."
            });
        }

        const product = await productModel.findProductById(productId);

        if (!product) {
            return res.status(404).json({
                message: "Produit introuvable."
            });
        }

        const existing = await wishlistModel.isInWishlist(req.session.user.id, productId);

        if (existing) {
            return res.status(400).json({
                message: "Ce produit est déjà dans vos favoris."
            });
        }

        await wishlistModel.addToWishlist(req.session.user.id, productId);

        res.status(200).json({
            message: "Produit ajouté aux favoris."
        });

    } catch (error) {
        console.error("Add to wishlist error:", error.message);

        res.status(500).json({
            message: "Erreur serveur."
        });
    }
}

// Remove a product from the wishlist
async function removeFromWishlist(req, res) {
    try {
        const result = await wishlistModel.removeFromWishlist(req.params.id, req.session.user.id);

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Article introuvable dans les favoris."
            });
        }

        res.status(200).json({
            message: "Produit retiré des favoris."
        });

    } catch (error) {
        console.error("Remove from wishlist error:", error.message);

        res.status(500).json({
            message: "Erreur serveur."
        });
    }
}

module.exports = {
    getWishlist,
    addToWishlist,
    removeFromWishlist
};

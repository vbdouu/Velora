// This file contains the logic for shopping cart operations.
// It uses cartModel.js to manage the user's cart.

const cartModel = require("../models/cartModel");
const productModel = require("../models/productModel");

// Get the current user's cart
async function getCart(req, res) {
    try {
        const items = await cartModel.findCartByUserId(req.session.user.id);

        const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

        res.status(200).json({
            items,
            total: Math.round(total * 100) / 100
        });

    } catch (error) {
        console.error("Get cart error:", error.message);

        res.status(500).json({
            message: "Erreur serveur."
        });
    }
}

// Add a product to the cart
async function addToCart(req, res) {
    try {
        const { productId, quantity } = req.body;

        if (!productId || !quantity || quantity < 1) {
            return res.status(400).json({
                message: "Produit et quantité sont obligatoires."
            });
        }

        const product = await productModel.findProductById(productId);

        if (!product) {
            return res.status(404).json({
                message: "Produit introuvable."
            });
        }

        // Retrieve the quantity already in the cart for this product
        const currentCart = await cartModel.findCartByUserId(req.session.user.id);
        const existingItem = currentCart.find(item => item.product_id === Number(productId));
        const existingQty = existingItem ? existingItem.quantity : 0;

        // Check that total requested quantity does not exceed available stock
        if (existingQty + quantity > product.stock) {
            return res.status(400).json({
                message: `Stock insuffisant. Il ne reste que ${product.stock} unité(s) disponible(s) (vous en avez déjà ${existingQty} dans votre panier).`
            });
        }

        await cartModel.addToCart(req.session.user.id, productId, quantity);

        res.status(200).json({
            message: "Produit ajouté au panier."
        });

    } catch (error) {
        console.error("Add to cart error:", error.message);

        res.status(500).json({
            message: "Erreur serveur."
        });
    }
}

// Update cart item quantity
async function updateQuantity(req, res) {
    try {
        const { quantity } = req.body;

        if (!quantity || quantity < 1) {
            return res.status(400).json({
                message: "Quantité invalide."
            });
        }

        // Retrieve the cart item to get its product_id and current stock
        const cartItem = await cartModel.findCartItemById(req.params.id, req.session.user.id);

        if (!cartItem) {
            return res.status(404).json({
                message: "Article introuvable dans le panier."
            });
        }

        // Check that the requested quantity does not exceed available stock
        if (quantity > cartItem.stock) {
            return res.status(400).json({
                message: `Stock insuffisant. Il ne reste que ${cartItem.stock} unité(s) disponible(s) (vous en avez déjà ${cartItem.quantity} dans votre panier).`
            });
        }

        const result = await cartModel.updateCartQuantity(req.params.id, req.session.user.id, quantity);

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Article introuvable dans le panier."
            });
        }

        res.status(200).json({
            message: "Quantité mise à jour."
        });

    } catch (error) {
        console.error("Update cart error:", error.message);

        res.status(500).json({
            message: "Erreur serveur."
        });
    }
}

// Remove an item from the cart
async function removeFromCart(req, res) {
    try {
        const result = await cartModel.removeFromCart(req.params.id, req.session.user.id);

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Article introuvable dans le panier."
            });
        }

        res.status(200).json({
            message: "Article retiré du panier."
        });

    } catch (error) {
        console.error("Remove from cart error:", error.message);

        res.status(500).json({
            message: "Erreur serveur."
        });
    }
}

// Clear the entire cart
async function clearCart(req, res) {
    try {
        await cartModel.clearCart(req.session.user.id);

        res.status(200).json({
            message: "Panier vidé."
        });

    } catch (error) {
        console.error("Clear cart error:", error.message);

        res.status(500).json({
            message: "Erreur serveur."
        });
    }
}

module.exports = {
    getCart,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart
};

// This file contains the logic for order operations.
// It handles checkout with product snapshots and shipping fees,
// order history, order details, and customer cancellation.

const orderModel = require("../models/orderModel");
const cartModel = require("../models/cartModel");
const productModel = require("../models/productModel");
const settingsModel = require("../models/settingsModel");
const db = require("../config/db");

// Place a new order from the current cart
async function placeOrder(req, res) {
    const connection = await db.promise().getConnection();

    try {
        const { shippingAddress, shippingCity, shippingPhone, shippingFee, notes } = req.body;

        if (!shippingAddress || !shippingCity || !shippingPhone) {
            return res.status(400).json({
                message: "Adresse, ville et téléphone sont obligatoires."
            });
        }

        const cartItems = await cartModel.findCartByUserId(req.session.user.id);

        if (cartItems.length === 0) {
            return res.status(400).json({
                message: "Votre panier est vide."
            });
        }

        // Verify stock and calculate total before starting the transaction
        let subtotal = 0;

        for (const item of cartItems) {
            if (item.stock < item.quantity) {
                return res.status(400).json({
                    message: `Stock insuffisant pour "${item.name}".`
                });
            }

            subtotal += item.price * item.quantity;
        }

        subtotal = Math.round(subtotal * 100) / 100;
        const fee = Number(shippingFee) || 0;
        const total = Math.round((subtotal + fee) * 100) / 100;

        // Begin transaction — all writes are atomic
        await connection.beginTransaction();

        // Create the order (with shipping fee)
        const [orderResult] = await connection.query(
            "INSERT INTO orders (user_id, total, shipping_fee, shipping_address, shipping_city, shipping_phone, notes) VALUES (?, ?, ?, ?, ?, ?, ?)",
            [req.session.user.id, total, fee, shippingAddress, shippingCity, shippingPhone, notes || null]
        );

        const orderId = orderResult.insertId;

        // Create order items with product snapshots and update stock atomically
        for (const item of cartItems) {
            const productName = item.product_name || item.name || "";
            const productImage = item.product_image || item.image || null;

            await connection.query(
                "INSERT INTO order_items (order_id, product_id, quantity, unit_price, product_name_snapshot, product_image_snapshot) VALUES (?, ?, ?, ?, ?, ?)",
                [orderId, item.product_id, item.quantity, item.price, productName, productImage]
            );

            const [updateResult] = await connection.query(
                "UPDATE products SET stock = stock - ?, sales_count = sales_count + ? WHERE id = ? AND stock >= ?",
                [item.quantity, item.quantity, item.product_id, item.quantity]
            );

            if (updateResult.affectedRows === 0) {
                throw new Error(`Stock insuffisant pour "${productName}" lors de la validation.`);
            }
        }

        // Record initial status in history
        await connection.query(
            "INSERT INTO order_status_history (order_id, old_status, new_status, changed_by, note) VALUES (?, NULL, 'pending', ?, 'Commande passée')",
            [orderId, req.session.user.id]
        );

        // Clear the cart
        await connection.query(
            "DELETE FROM cart_items WHERE user_id = ?",
            [req.session.user.id]
        );

        // Commit everything
        await connection.commit();

        res.status(201).json({
            message: "Commande passée avec succès.",
            orderId
        });

    } catch (error) {
        // Roll back all changes if anything failed
        try {
            await connection.rollback();
        } catch (rollbackError) {
            console.error("Rollback error:", rollbackError.message);
        }

        console.error("Place order error:", error.message);

        res.status(500).json({
            message: error.message || "Erreur serveur."
        });

    } finally {
        // Always release the connection back to the pool, no matter what
        connection.release();
    }
}

// Get order history for the current user
async function getOrders(req, res) {
    try {
        const orders = await orderModel.findOrdersByUserId(req.session.user.id);

        res.status(200).json({
            orders
        });

    } catch (error) {
        console.error("Get orders error:", error.message);
        res.status(500).json({ message: "Erreur serveur." });
    }
}

// Get details of a specific order (client can only see their own)
async function getOrderById(req, res) {
    try {
        const order = await orderModel.findOrderById(req.params.id);

        if (!order) {
            return res.status(404).json({
                message: "Commande introuvable."
            });
        }

        // Clients may only access their own orders
        if (order.user_id !== req.session.user.id) {
            return res.status(403).json({
                message: "Accès refusé."
            });
        }

        const items = await orderModel.findOrderItems(order.id);

        res.status(200).json({
            order,
            items
        });

    } catch (error) {
        console.error("Get order detail error:", error.message);
        res.status(500).json({ message: "Erreur serveur." });
    }
}

// Cancel an order (customer — only pending orders)
async function cancelOrder(req, res) {
    try {
        const order = await orderModel.findOrderById(req.params.id);

        if (!order) {
            return res.status(404).json({
                message: "Commande introuvable."
            });
        }

        if (order.user_id !== req.session.user.id) {
            return res.status(403).json({
                message: "Accès refusé."
            });
        }

        if (order.status !== "pending") {
            return res.status(400).json({
                message: "Seules les commandes en attente peuvent être annulées."
            });
        }

        await orderModel.updateOrderStatus(req.params.id, "cancelled");

        // Restore stock for cancelled items
        const items = await orderModel.findOrderItems(order.id);
        for (const item of items) {
            if (item.product_id) {
                await db.promise().query(
                    "UPDATE products SET stock = stock + ?, sales_count = GREATEST(sales_count - ?, 0) WHERE id = ?",
                    [item.quantity, item.quantity, item.product_id]
                );
            }
        }

        res.status(200).json({
            message: "Commande annulée avec succès."
        });

    } catch (error) {
        console.error("Cancel order error:", error.message);
        res.status(500).json({ message: "Erreur serveur." });
    }
}

module.exports = {
    placeOrder,
    getOrders,
    getOrderById,
    cancelOrder
};

// This file contains the SQL queries related to the cart_items table.
// Used by controllers to manage the shopping cart for logged-in users.

const db = require("../config/db");

// Get all cart items for a user with product details
async function findCartByUserId(userId) {
    const sql = `
        SELECT
            cart_items.id,
            cart_items.quantity,
            products.id AS product_id,
            products.name AS product_name,
            products.price,
            products.image AS product_image,
            products.stock,
            COALESCE(categories.name, 'Sans catégorie') AS category_name
        FROM cart_items
        JOIN products ON cart_items.product_id = products.id
        LEFT JOIN categories ON products.category_id = categories.id
        WHERE cart_items.user_id = ?
        ORDER BY cart_items.created_at DESC
    `;

    const [results] = await db.promise().query(sql, [userId]);
    return results;
}

// Add a product to the cart (or update quantity if already exists)
async function addToCart(userId, productId, quantity) {
    const sql = `
        INSERT INTO cart_items (user_id, product_id, quantity)
        VALUES (?, ?, ?)
        ON DUPLICATE KEY UPDATE quantity = quantity + VALUES(quantity)
    `;

    const [result] = await db.promise().query(sql, [userId, productId, quantity]);
    return result;
}

// Find a specific cart item by id and userId (to retrieve product_id for stock check)
async function findCartItemById(id, userId) {
    const sql = `
        SELECT cart_items.*, products.stock
        FROM cart_items
        JOIN products ON cart_items.product_id = products.id
        WHERE cart_items.id = ? AND cart_items.user_id = ?
    `;

    const [results] = await db.promise().query(sql, [id, userId]);
    return results[0];
}

// Update cart item quantity
async function updateCartQuantity(id, userId, quantity) {
    const sql = `
        UPDATE cart_items
        SET quantity = ?
        WHERE id = ? AND user_id = ?
    `;

    const [result] = await db.promise().query(sql, [quantity, id, userId]);
    return result;
}

// Remove an item from the cart
async function removeFromCart(id, userId) {
    const sql = "DELETE FROM cart_items WHERE id = ? AND user_id = ?";
    const [result] = await db.promise().query(sql, [id, userId]);
    return result;
}

// Clear all items from a user's cart
async function clearCart(userId) {
    const sql = "DELETE FROM cart_items WHERE user_id = ?";
    const [result] = await db.promise().query(sql, [userId]);
    return result;
}

// Count items in user's cart
async function countCartItems(userId) {
    const sql = "SELECT COUNT(*) AS total FROM cart_items WHERE user_id = ?";
    const [results] = await db.promise().query(sql, [userId]);
    return results[0].total;
}

module.exports = {
    findCartByUserId,
    findCartItemById,
    addToCart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    countCartItems
};

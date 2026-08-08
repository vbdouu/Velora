// This file contains the SQL queries related to the wishlist_items table.
// Used by controllers to manage saved favorites for logged-in users.

const db = require("../config/db");

// Get all wishlist items for a user with product details
async function findWishlistByUserId(userId) {
    const sql = `
        SELECT
            wishlist_items.id,
            wishlist_items.created_at AS added_at,
            products.id AS product_id,
            products.name AS product_name,
            products.price,
            products.image AS product_image,
            products.stock,
            COALESCE(categories.name, 'Sans catégorie') AS category_name
        FROM wishlist_items
        JOIN products ON wishlist_items.product_id = products.id
        LEFT JOIN categories ON products.category_id = categories.id
        WHERE wishlist_items.user_id = ?
        ORDER BY wishlist_items.created_at DESC
    `;

    const [results] = await db.promise().query(sql, [userId]);
    return results;
}

// Add a product to the wishlist
async function addToWishlist(userId, productId) {
    const sql = `
        INSERT INTO wishlist_items (user_id, product_id)
        VALUES (?, ?)
    `;

    const [result] = await db.promise().query(sql, [userId, productId]);
    return result;
}

// Remove a product from the wishlist
async function removeFromWishlist(productId, userId) {
    const sql = "DELETE FROM wishlist_items WHERE product_id = ? AND user_id = ?";
    const [result] = await db.promise().query(sql, [productId, userId]);
    return result;
}

// Check if a product is in the user's wishlist
async function isInWishlist(userId, productId) {
    const sql = "SELECT id FROM wishlist_items WHERE user_id = ? AND product_id = ?";
    const [results] = await db.promise().query(sql, [userId, productId]);
    return results[0] || null;
}

// Count wishlist items for a user
async function countWishlistItems(userId) {
    const sql = "SELECT COUNT(*) AS total FROM wishlist_items WHERE user_id = ?";
    const [results] = await db.promise().query(sql, [userId]);
    return results[0].total;
}

module.exports = {
    findWishlistByUserId,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    countWishlistItems
};

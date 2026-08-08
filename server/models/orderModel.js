// This file contains the SQL queries related to the orders table.
// Used by controllers to create and manage customer orders.
// Supports order immutability via product snapshots.

const db = require("../config/db");

// Create a new order (with shipping fee)
async function createOrder(userId, total, shippingFee, shippingAddress, shippingCity, shippingPhone, notes) {
    const sql = `
        INSERT INTO orders (user_id, total, shipping_fee, shipping_address, shipping_city, shipping_phone, notes)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    const [result] = await db.promise().query(sql, [
        userId, total, shippingFee || 0, shippingAddress, shippingCity, shippingPhone, notes || null
    ]);
    return result;
}

// Add an item to an order (with product snapshot)
async function createOrderItem(orderId, productId, quantity, unitPrice, productName, productImage) {
    const sql = `
        INSERT INTO order_items (order_id, product_id, quantity, unit_price, product_name_snapshot, product_image_snapshot)
        VALUES (?, ?, ?, ?, ?, ?)
    `;

    const [result] = await db.promise().query(sql, [
        orderId, productId, quantity, unitPrice, productName || "", productImage || null
    ]);
    return result;
}

// Get all orders for a user
async function findOrdersByUserId(userId) {
    const sql = `
        SELECT * FROM orders
        WHERE user_id = ?
        ORDER BY created_at DESC
    `;

    const [results] = await db.promise().query(sql, [userId]);
    return results;
}

// Get order details with items (includes user info for admin view)
async function findOrderById(orderId) {
    const sql = `
        SELECT
            orders.*,
            COALESCE(users.first_name, 'Utilisateur') AS first_name,
            COALESCE(users.last_name, 'supprimé') AS last_name,
            COALESCE(users.email, '') AS email,
            users.phone
        FROM orders
        LEFT JOIN users ON orders.user_id = users.id
        WHERE orders.id = ?
    `;
    const [results] = await db.promise().query(sql, [orderId]);
    return results[0];
}

// Get items for an order (uses snapshots with fallback to live data)
async function findOrderItems(orderId) {
    const sql = `
        SELECT
            order_items.*,
            COALESCE(NULLIF(order_items.product_name_snapshot, ''), products.name, 'Produit supprimé') AS product_name,
            COALESCE(order_items.product_image_snapshot, products.image) AS image,
            COALESCE(categories.name, '') AS category_name
        FROM order_items
        LEFT JOIN products ON order_items.product_id = products.id
        LEFT JOIN categories ON products.category_id = categories.id
        WHERE order_items.order_id = ?
    `;

    const [results] = await db.promise().query(sql, [orderId]);
    return results;
}

// Update order status
async function updateOrderStatus(orderId, status) {
    const sql = `
        UPDATE orders
        SET status = ?
        WHERE id = ?
    `;

    const [result] = await db.promise().query(sql, [status, orderId]);
    return result;
}

// Update admin notes on an order
async function updateAdminNotes(orderId, notes) {
    const sql = `
        UPDATE orders
        SET admin_notes = ?
        WHERE id = ?
    `;

    const [result] = await db.promise().query(sql, [notes, orderId]);
    return result;
}

// Get all orders with server-side sorting, filtering, pagination (admin)
async function findAllOrders(options = {}) {
    const { search, status, city, dateFrom, dateTo, sortBy, sortDir, page, pageSize } = options;

    let sql = `
        SELECT
            orders.*,
            COALESCE(users.first_name, 'Utilisateur') AS first_name,
            COALESCE(users.last_name, 'supprimé') AS last_name,
            COALESCE(users.email, '') AS email
        FROM orders
        LEFT JOIN users ON orders.user_id = users.id
    `;

    const conditions = [];
    const params = [];

    if (search) {
        conditions.push("(orders.id LIKE ? OR users.first_name LIKE ? OR users.last_name LIKE ? OR users.email LIKE ? OR orders.shipping_phone LIKE ?)");
        const s = `%${search}%`;
        params.push(s, s, s, s, s);
    }

    if (status) {
        conditions.push("orders.status = ?");
        params.push(status);
    }

    if (city) {
        conditions.push("orders.shipping_city LIKE ?");
        params.push(`%${city}%`);
    }

    if (dateFrom) {
        conditions.push("DATE(orders.created_at) >= ?");
        params.push(dateFrom);
    }

    if (dateTo) {
        conditions.push("DATE(orders.created_at) <= ?");
        params.push(dateTo);
    }

    if (conditions.length > 0) {
        sql += " WHERE " + conditions.join(" AND ");
    }

    // Count total
    const countSql = `SELECT COUNT(*) AS total FROM (${sql}) AS sub`;
    const [countResult] = await db.promise().query(countSql, [...params]);
    const total = countResult[0].total;

    // Sorting
    const allowedSorts = {
        id: "orders.id",
        customer: "users.first_name",
        city: "orders.shipping_city",
        date: "orders.created_at",
        total: "orders.total",
        status: "orders.status"
    };

    const sortColumn = allowedSorts[sortBy] || "orders.created_at";
    const direction = sortDir === "asc" ? "ASC" : "DESC";
    sql += ` ORDER BY ${sortColumn} ${direction}`;

    if (options.unlimited) {
        const [results] = await db.promise().query(sql, params);
        return {
            orders: results,
            total: results.length
        };
    }

    // Pagination
    const limit = Math.min(Math.max(parseInt(pageSize) || 25, 1), 100);
    const currentPage = Math.max(parseInt(page) || 1, 1);
    const offset = (currentPage - 1) * limit;

    sql += " LIMIT ? OFFSET ?";
    params.push(limit, offset);

    const [results] = await db.promise().query(sql, params);

    return {
        orders: results,
        total,
        page: currentPage,
        pageSize: limit,
        totalPages: Math.ceil(total / limit)
    };
}

module.exports = {
    createOrder,
    createOrderItem,
    findOrdersByUserId,
    findOrderById,
    findOrderItems,
    updateOrderStatus,
    updateAdminNotes,
    findAllOrders
};

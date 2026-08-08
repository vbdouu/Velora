// This file contains the SQL queries used by the admin dashboard.
// Provides statistics, user management, order oversight,
// admin CRUD, and order status history tracking.

const db = require("../config/db");
const bcrypt = require("bcrypt");

// ── Statistics ──

// Count rows in a table (with optional condition)
async function count(table, condition) {
    const allowedTables = ["users", "categories", "products", "orders", "order_items", "cart_items", "wishlist_items"];

    if (!allowedTables.includes(table)) {
        throw new Error("Table not allowed.");
    }

    let sql = `SELECT COUNT(*) AS total FROM ${table}`;
    const params = [];

    if (table === "products") {
        sql += " WHERE is_archived = 0";
    }
    if (table === "users") {
        sql += " WHERE role = 'client'";
    }

    const [results] = await db.promise().query(sql, params);
    return results[0].total;
}

// Count orders grouped by status
async function ordersByStatus() {
    const sql = `
        SELECT status, COUNT(*) AS total
        FROM orders
        GROUP BY status
    `;

    const [results] = await db.promise().query(sql);
    return results;
}

// Get recent users
async function recentUsers() {
    const sql = `
        SELECT id, first_name, last_name, email, role, created_at
        FROM users
        WHERE role = 'client'
        ORDER BY created_at DESC
        LIMIT 8
    `;

    const [results] = await db.promise().query(sql);
    return results;
}

// Get recent orders
async function recentOrders(limit = 10) {
    const sql = `
        SELECT
            orders.id,
            orders.total,
            orders.status,
            orders.created_at,
            orders.shipping_city,
            COALESCE(users.first_name, 'Utilisateur') AS first_name,
            COALESCE(users.last_name, 'supprimé') AS last_name,
            COALESCE(users.email, '') AS email
        FROM orders
        LEFT JOIN users ON orders.user_id = users.id
        ORDER BY orders.created_at DESC
        LIMIT ?
    `;

    const [results] = await db.promise().query(sql, [Number(limit) || 10]);
    return results;
}

// Get total revenue (confirmed, shipped, delivered orders)
async function totalRevenue() {
    const sql = `
        SELECT COALESCE(SUM(total), 0) AS revenue
        FROM orders
        WHERE status IN ('confirmed', 'shipped', 'delivered')
    `;

    const [results] = await db.promise().query(sql);
    return results[0].revenue;
}

// Revenue this month
async function monthlyRevenue() {
    const sql = `
        SELECT COALESCE(SUM(total), 0) AS revenue
        FROM orders
        WHERE status IN ('confirmed', 'shipped', 'delivered')
        AND MONTH(created_at) = MONTH(CURDATE())
        AND YEAR(created_at) = YEAR(CURDATE())
    `;

    const [results] = await db.promise().query(sql);
    return results[0].revenue;
}

// Revenue grouped by period
async function revenueByPeriodStats() {
    const sql = `
        SELECT 
            COALESCE(SUM(CASE WHEN MONTH(created_at) = MONTH(CURDATE()) AND YEAR(created_at) = YEAR(CURDATE()) THEN total ELSE 0 END), 0) AS month,
            COALESCE(SUM(CASE WHEN YEAR(created_at) = YEAR(CURDATE()) THEN total ELSE 0 END), 0) AS year,
            COALESCE(SUM(total), 0) AS \`all\`
        FROM orders
        WHERE status IN ('confirmed', 'shipped', 'delivered')
    `;
    const [results] = await db.promise().query(sql);
    return results[0];
}

// Orders counts grouped by period
async function ordersByPeriodStats() {
    const sql = `
        SELECT 
            COUNT(CASE WHEN DATE(created_at) = CURDATE() THEN 1 END) AS today,
            COUNT(CASE WHEN YEARWEEK(created_at, 1) = YEARWEEK(CURDATE(), 1) THEN 1 END) AS week,
            COUNT(CASE WHEN MONTH(created_at) = MONTH(CURDATE()) AND YEAR(created_at) = YEAR(CURDATE()) THEN 1 END) AS month,
            COUNT(CASE WHEN created_at >= DATE_SUB(NOW(), INTERVAL 3 MONTH) THEN 1 END) AS \`3months\`,
            COUNT(CASE WHEN YEAR(created_at) = YEAR(CURDATE()) THEN 1 END) AS year,
            COUNT(*) AS \`all\`
        FROM orders
    `;
    const [results] = await db.promise().query(sql);
    const baseStats = results[0];

    const yearSql = `
        SELECT YEAR(created_at) AS y, COUNT(*) AS total
        FROM orders
        GROUP BY YEAR(created_at)
    `;
    const [yearResults] = await db.promise().query(yearSql);
    const years = {};
    for (const row of yearResults) {
        if (row.y) years[row.y] = row.total;
    }

    return { ...baseStats, years };
}

// Orders placed today
async function todayOrders() {
    const sql = `
        SELECT COUNT(*) AS total
        FROM orders
        WHERE DATE(created_at) = CURDATE()
    `;

    const [results] = await db.promise().query(sql);
    return results[0].total;
}

// Count of pending orders
async function pendingOrdersCount() {
    const sql = `
        SELECT COUNT(*) AS total
        FROM orders
        WHERE status = 'pending'
    `;

    const [results] = await db.promise().query(sql);
    return results[0].total;
}

// Products with low stock (5 or fewer)
async function lowStockProducts() {
    const sql = `
        SELECT id, name, stock, image
        FROM products
        WHERE stock <= 5
        AND is_visible = 1
        AND is_archived = 0
        ORDER BY stock ASC
        LIMIT 10
    `;

    const [results] = await db.promise().query(sql);
    return results;
}

// Best-selling products by quantity
async function bestSellers(limit = 10) {
    const sql = `
        SELECT
            products.id,
            products.name,
            products.image,
            products.price,
            CAST(COALESCE(SUM(order_items.quantity), products.sales_count, 0) AS UNSIGNED) AS total_sold
        FROM products
        LEFT JOIN order_items ON products.id = order_items.product_id
        WHERE products.is_archived = 0
        GROUP BY products.id
        ORDER BY total_sold DESC, products.id ASC
        LIMIT ?
    `;

    const [results] = await db.promise().query(sql, [Number(limit) || 10]);
    return results;
}


// ── Users (with server-side sorting, filtering, search) ──

async function listUsers(options = {}) {
    const { search, status, hasOrders, sortBy, sortDir, page, pageSize } = options;

    let sql = `
        SELECT
            users.id,
            users.first_name,
            users.last_name,
            users.email,
            users.phone,
            users.role,
            users.account_status,
            users.block_reason,
            users.blocked_at,
            users.created_at,
            COUNT(orders.id) AS order_count,
            COALESCE(SUM(CASE WHEN orders.status NOT IN ('cancelled') THEN orders.total ELSE 0 END), 0) AS total_spent,
            MAX(orders.created_at) AS last_order_at
        FROM users
        LEFT JOIN orders ON users.id = orders.user_id
    `;

    const conditions = ["users.role = 'client'"];
    const params = [];

    if (search) {
        conditions.push("(users.first_name LIKE ? OR users.last_name LIKE ? OR users.email LIKE ? OR users.phone LIKE ?)");
        const s = `%${search}%`;
        params.push(s, s, s, s);
    }

    if (status === "active" || status === "blocked") {
        conditions.push("users.account_status = ?");
        params.push(status);
    }

    if (conditions.length > 0) {
        sql += " WHERE " + conditions.join(" AND ");
    }

    sql += " GROUP BY users.id";

    // HAVING clause for hasOrders filter (applied after GROUP BY)
    if (hasOrders === "yes") {
        sql += " HAVING order_count > 0";
    } else if (hasOrders === "no") {
        sql += " HAVING order_count = 0";
    }

    // Count total before pagination
    const countSql = `SELECT COUNT(*) AS total FROM (${sql}) AS sub`;
    const [countResult] = await db.promise().query(countSql, params);
    const total = countResult[0].total;

    // Sorting
    const allowedSorts = {
        name: "users.first_name",
        email: "users.email",
        created_at: "users.created_at",
        order_count: "order_count",
        total_spent: "total_spent",
        status: "users.account_status"
    };

    const sortColumn = allowedSorts[sortBy] || "users.created_at";
    const direction = sortDir === "asc" ? "ASC" : "DESC";
    sql += ` ORDER BY ${sortColumn} ${direction}`;

    if (options.unlimited) {
        const [results] = await db.promise().query(sql, params);
        return {
            users: results,
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
        users: results,
        total,
        page: currentPage,
        pageSize: limit,
        totalPages: Math.ceil(total / limit)
    };
}


// ── Find user by id ──

async function findUserById(id) {
    const sql = `
        SELECT
            id, first_name, last_name, email, role, phone,
            account_status, block_reason, blocked_at
        FROM users
        WHERE id = ?
    `;

    const [results] = await db.promise().query(sql, [id]);
    return results[0];
}

// Block a user
async function blockUser(id, reason) {
    const sql = `
        UPDATE users
        SET account_status = 'blocked',
            block_reason = ?,
            blocked_at = NOW()
        WHERE id = ?
        AND role = 'client'
    `;

    const [result] = await db.promise().query(sql, [reason, id]);
    return result;
}

// Unblock a user
async function unblockUser(id) {
    const sql = `
        UPDATE users
        SET account_status = 'active',
            block_reason = NULL,
            blocked_at = NULL
        WHERE id = ?
        AND role = 'client'
    `;

    const [result] = await db.promise().query(sql, [id]);
    return result;
}


// ── Admin user management (super_admin only) ──

async function listAdmins() {
    const sql = `
        SELECT id, first_name, last_name, email, phone, role, gender, account_status, created_at
        FROM users
        WHERE role IN ('admin', 'super_admin')
        ORDER BY created_at ASC
    `;

    const [results] = await db.promise().query(sql);
    return results;
}

async function createAdmin(firstName, lastName, email, hashedPassword, phone, role, gender) {
    const sql = `
        INSERT INTO users (first_name, last_name, email, password, role, phone, gender)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    const [result] = await db.promise().query(sql, [firstName, lastName, email, hashedPassword, role || "admin", phone || null, gender || "female"]);
    return result;
}

async function updateAdmin(id, firstName, lastName, email, phone, gender) {
    const sql = `
        UPDATE users
        SET first_name = ?, last_name = ?, email = ?, phone = ?, gender = ?
        WHERE id = ?
        AND role IN ('admin', 'super_admin')
    `;

    const [result] = await db.promise().query(sql, [firstName, lastName, email, phone || null, gender || "female", id]);
    return result;
}

async function resetAdminPassword(id, hashedPassword) {
    const sql = `
        UPDATE users
        SET password = ?
        WHERE id = ?
        AND role IN ('admin', 'super_admin')
    `;

    const [result] = await db.promise().query(sql, [hashedPassword, id]);
    return result;
}

async function deactivateAdmin(id) {
    const sql = `
        UPDATE users
        SET account_status = 'blocked',
            block_reason = 'Compte désactivé par un super administrateur.',
            blocked_at = NOW()
        WHERE id = ?
        AND role = 'admin'
    `;

    const [result] = await db.promise().query(sql, [id]);
    return result;
}

async function activateAdmin(id) {
    const sql = `
        UPDATE users
        SET account_status = 'active',
            block_reason = NULL,
            blocked_at = NULL
        WHERE id = ?
        AND role IN ('admin', 'super_admin')
    `;

    const [result] = await db.promise().query(sql, [id]);
    return result;
}


// ── Order status history ──

async function addStatusHistory(orderId, oldStatus, newStatus, changedBy, note) {
    const sql = `
        INSERT INTO order_status_history (order_id, old_status, new_status, changed_by, note)
        VALUES (?, ?, ?, ?, ?)
    `;

    const [result] = await db.promise().query(sql, [orderId, oldStatus, newStatus, changedBy, note || null]);
    return result;
}

async function getStatusHistory(orderId) {
    const sql = `
        SELECT
            osh.*,
            COALESCE(users.first_name, 'Système') AS changed_by_name
        FROM order_status_history osh
        LEFT JOIN users ON osh.changed_by = users.id
        WHERE osh.order_id = ?
        ORDER BY osh.created_at ASC
    `;

    const [results] = await db.promise().query(sql, [orderId]);
    return results;
}


module.exports = {
    count,
    ordersByStatus,
    recentUsers,
    recentOrders,
    totalRevenue,
    monthlyRevenue,
    revenueByPeriodStats,
    ordersByPeriodStats,
    todayOrders,
    pendingOrdersCount,
    lowStockProducts,
    bestSellers,
    listUsers,
    findUserById,
    blockUser,
    unblockUser,
    listAdmins,
    createAdmin,
    updateAdmin,
    resetAdminPassword,
    deactivateAdmin,
    activateAdmin,
    addStatusHistory,
    getStatusHistory
};

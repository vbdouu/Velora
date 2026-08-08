// ============================================================
// CONTACTMODEL.JS — Contact Messages Database Operations
// Manages contact_messages table creation and SQL queries.
// Velora Jewelry Boutique — 2026
// ============================================================

const db = require("../config/db");

// Auto-create table if it doesn't exist yet
async function initTable() {
    const sql = `
        CREATE TABLE IF NOT EXISTS contact_messages (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            email VARCHAR(255) NOT NULL,
            phone VARCHAR(50) NOT NULL,
            subject VARCHAR(255) NOT NULL,
            message TEXT NOT NULL,
            status ENUM('unread', 'read', 'archived') NOT NULL DEFAULT 'unread',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            INDEX idx_contact_status (status),
            INDEX idx_contact_created_at (created_at)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `;
    try {
        await db.promise().query(sql);
    } catch (err) {
        console.error("Error initializing contact_messages table:", err.message);
    }
}

// Call table initialization on module load
initTable();

// Insert a new contact message
async function createMessage({ name, email, phone, subject, message }) {
    const sql = `
        INSERT INTO contact_messages (name, email, phone, subject, message, status)
        VALUES (?, ?, ?, ?, ?, 'unread')
    `;
    const [result] = await db.promise().query(sql, [name, email, phone, subject, message]);
    return result.insertId;
}

// Get messages for admin with pagination, search, and status filter
async function getMessages({ status, search, limit = 20, offset = 0 } = {}) {
    let sql = `SELECT * FROM contact_messages WHERE 1=1`;
    const params = [];

    if (status && status !== "all") {
        sql += ` AND status = ?`;
        params.push(status);
    }

    if (search) {
        sql += ` AND (name LIKE ? OR email LIKE ? OR phone LIKE ? OR subject LIKE ? OR message LIKE ?)`;
        const term = `%${search}%`;
        params.push(term, term, term, term, term);
    }

    sql += ` ORDER BY created_at DESC LIMIT ? OFFSET ?`;
    params.push(Number(limit), Number(offset));

    const [rows] = await db.promise().query(sql, params);

    // Count query for total
    let countSql = `SELECT COUNT(*) AS total FROM contact_messages WHERE 1=1`;
    const countParams = [];

    if (status && status !== "all") {
        countSql += ` AND status = ?`;
        countParams.push(status);
    }

    if (search) {
        countSql += ` AND (name LIKE ? OR email LIKE ? OR phone LIKE ? OR subject LIKE ? OR message LIKE ?)`;
        const term = `%${search}%`;
        countParams.push(term, term, term, term, term);
    }

    const [countRows] = await db.promise().query(countSql, countParams);
    const total = countRows[0]?.total || 0;

    return { messages: rows, total };
}

// Get message by ID
async function getMessageById(id) {
    const sql = `SELECT * FROM contact_messages WHERE id = ?`;
    const [rows] = await db.promise().query(sql, [id]);
    return rows[0] || null;
}

// Update message status
async function updateMessageStatus(id, status) {
    const sql = `UPDATE contact_messages SET status = ? WHERE id = ?`;
    const [result] = await db.promise().query(sql, [status, id]);
    return result.affectedRows > 0;
}

// Delete a message
async function deleteMessage(id) {
    const sql = `DELETE FROM contact_messages WHERE id = ?`;
    const [result] = await db.promise().query(sql, [id]);
    return result.affectedRows > 0;
}

// Get unread message count
async function getUnreadCount() {
    const sql = `SELECT COUNT(*) AS unreadCount FROM contact_messages WHERE status = 'unread'`;
    const [rows] = await db.promise().query(sql);
    return rows[0]?.unreadCount || 0;
}

module.exports = {
    createMessage,
    getMessages,
    getMessageById,
    updateMessageStatus,
    deleteMessage,
    getUnreadCount
};

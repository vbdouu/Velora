// This file contains the SQL queries for the settings table.
// Settings are stored as key/value pairs in the database.

const db = require("../config/db");

// Get all settings as a key-value object
async function getAll() {
    const sql = "SELECT setting_key, setting_value FROM settings";
    const [rows] = await db.promise().query(sql);

    const result = {};
    for (const row of rows) {
        result[row.setting_key] = row.setting_value;
    }
    return result;
}

// Get a single setting value
async function get(key) {
    const sql = "SELECT setting_value FROM settings WHERE setting_key = ?";
    const [rows] = await db.promise().query(sql, [key]);
    return rows[0]?.setting_value ?? null;
}

// Set a single setting
async function set(key, value) {
    const sql = `
        INSERT INTO settings (setting_key, setting_value)
        VALUES (?, ?)
        ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value)
    `;
    const [result] = await db.promise().query(sql, [key, value]);
    return result;
}

// Set multiple settings at once
async function setBulk(updates) {
    if (!updates || Object.keys(updates).length === 0) return;

    const entries = Object.entries(updates);
    const sql = `
        INSERT INTO settings (setting_key, setting_value)
        VALUES ${entries.map(() => "(?, ?)").join(", ")}
        ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value)
    `;
    const params = entries.flat();
    const [result] = await db.promise().query(sql, params);
    return result;
}

// Get all wilayas shipping rates
async function getWilayas() {
    const sql = "SELECT wilaya_code, wilaya_name, home_fee, desk_fee, is_active FROM wilaya_shipping ORDER BY wilaya_code ASC";
    try {
        const [rows] = await db.promise().query(sql);
        return rows;
    } catch (e) {
        // Fallback if table doesn't exist yet
        return [];
    }
}

// Update single wilaya shipping rate
async function updateWilaya(code, homeFee, deskFee, isActive = 1) {
    const sql = `
        UPDATE wilaya_shipping 
        SET home_fee = ?, desk_fee = ?, is_active = ?
        WHERE wilaya_code = ?
    `;
    const [result] = await db.promise().query(sql, [homeFee, deskFee, isActive, code]);
    return result;
}

// Bulk update wilayas shipping rates
async function bulkUpdateWilayas(rates) {
    if (!Array.isArray(rates) || rates.length === 0) return;
    for (const r of rates) {
        await updateWilaya(r.wilaya_code, r.home_fee, r.desk_fee, r.is_active ?? 1);
    }
}

module.exports = {
    getAll,
    get,
    set,
    setBulk,
    getWilayas,
    updateWilaya,
    bulkUpdateWilayas
};


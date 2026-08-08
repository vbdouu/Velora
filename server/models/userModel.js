// This file contains the SQL queries related to the users table.
// Used by controllers to create, find, update users,
// manage passwords and email changes.

const db = require("../config/db");

// Find a user by email
async function findUserByEmail(email) {
    const sql = "SELECT * FROM users WHERE email = ?";
    const [results] = await db.promise().query(sql, [email]);
    return results[0];
}

// Create a new user
async function createUser(firstName, lastName, email, hashedPassword, role, phone) {
    const sql = `
        INSERT INTO users (first_name, last_name, email, password, role, phone)
        VALUES (?, ?, ?, ?, ?, ?)
    `;

    const [result] = await db.promise().query(sql, [firstName, lastName, email, hashedPassword, role, phone || null]);
    return result;
}

// Find a user by id
async function findUserById(id) {
    const sql = `
        SELECT id, first_name, last_name, email, role, phone, profile_photo, account_status
        FROM users
        WHERE id = ?
    `;

    const [results] = await db.promise().query(sql, [id]);
    return results[0];
}

// Find a user by id (with password — for password verification)
async function findUserByIdWithPassword(id) {
    const sql = `
        SELECT id, first_name, last_name, email, password, role, phone, profile_photo, account_status
        FROM users
        WHERE id = ?
    `;

    const [results] = await db.promise().query(sql, [id]);
    return results[0];
}

// Update user profile
async function updateProfile(userId, firstName, lastName, phone) {
    const sql = `
        UPDATE users
        SET first_name = ?, last_name = ?, phone = ?
        WHERE id = ?
    `;

    const [result] = await db.promise().query(sql, [firstName, lastName, phone, userId]);
    return result;
}

// Update profile photo
async function updateProfilePhoto(userId, photoPath) {
    const sql = `
        UPDATE users
        SET profile_photo = ?
        WHERE id = ?
    `;

    const [result] = await db.promise().query(sql, [photoPath, userId]);
    return result;
}

// Remove profile photo
async function removeProfilePhoto(userId) {
    const sql = `
        UPDATE users
        SET profile_photo = NULL
        WHERE id = ?
    `;

    const [result] = await db.promise().query(sql, [userId]);
    return result;
}

// Update password
async function updatePassword(userId, hashedPassword) {
    const sql = `
        UPDATE users
        SET password = ?
        WHERE id = ?
    `;

    const [result] = await db.promise().query(sql, [hashedPassword, userId]);
    return result;
}

// Update email
async function updateEmail(userId, newEmail) {
    const sql = `
        UPDATE users
        SET email = ?
        WHERE id = ?
    `;

    const [result] = await db.promise().query(sql, [newEmail, userId]);
    return result;
}

module.exports = {
    findUserByEmail,
    createUser,
    findUserById,
    findUserByIdWithPassword,
    updateProfile,
    updateProfilePhoto,
    removeProfilePhoto,
    updatePassword,
    updateEmail
};

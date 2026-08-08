// This file contains the SQL queries related to the categories table.
// Used by controllers to retrieve and manage jewelry categories.

const db = require("../config/db");

// Get all categories — public by default filters on is_visible = 1
async function findAllCategories(includeHidden = false) {
    const sql = `
        SELECT
            categories.*,
            (
                SELECT COUNT(*)
                FROM products
                WHERE products.category_id = categories.id
            ) AS total_products
        FROM categories
        ${includeHidden ? "" : "WHERE categories.is_visible = 1"}
        ORDER BY categories.name ASC
    `;

    const [results] = await db.promise().query(sql);
    return results;
}

// Find a category by id
async function findCategoryById(id) {
    const sql = `
        SELECT
            categories.*,
            (
                SELECT COUNT(*)
                FROM products
                WHERE products.category_id = categories.id
            ) AS total_products
        FROM categories
        WHERE categories.id = ?
    `;

    const [results] = await db.promise().query(sql, [id]);
    return results[0];
}

// Create a category
async function createCategory(name, description, image) {
    const sql = `
        INSERT INTO categories (name, description, image)
        VALUES (?, ?, ?)
    `;

    const [result] = await db.promise().query(sql, [name, description, image]);
    return result;
}

// Update a category
async function updateCategory(id, name, description, image) {
    // Build the SET clause dynamically so we never overwrite the image with null
    // when no new image was provided.
    const fields = ["name = ?", "description = ?"];
    const params = [name, description];

    if (image !== null && image !== undefined) {
        fields.push("image = ?");
        params.push(image);
    }

    params.push(id);

    const sql = `UPDATE categories SET ${fields.join(", ")} WHERE id = ?`;
    const [result] = await db.promise().query(sql, params);
    return result;
}

// Delete a category
async function deleteCategory(id) {
    const sql = "DELETE FROM categories WHERE id = ?";
    const [result] = await db.promise().query(sql, [id]);
    return result;
}

module.exports = {
    findAllCategories,
    findCategoryById,
    createCategory,
    updateCategory,
    deleteCategory
};

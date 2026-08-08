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
async function createCategory(name, description, image, showInFooter = 0, isVisible = 1) {
    const sql = `
        INSERT INTO categories (name, description, image, show_in_footer, is_visible)
        VALUES (?, ?, ?, ?, ?)
    `;

    const [result] = await db.promise().query(sql, [
        name,
        description,
        image,
        showInFooter ? 1 : 0,
        isVisible ? 1 : 0
    ]);
    return result;
}

// Update a category
async function updateCategory(id, name, description, image, showInFooter = 0, isVisible = 1) {
    const fields = ["name = ?", "description = ?", "show_in_footer = ?", "is_visible = ?"];
    const params = [name, description, showInFooter ? 1 : 0, isVisible ? 1 : 0];

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

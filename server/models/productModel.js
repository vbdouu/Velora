// This file contains the SQL queries related to the products table.
// Used by controllers to retrieve, create, update, delete,
// archive, duplicate, and sort products.

const db = require("../config/db");

// Get all products with optional filters, sorting, and pagination
async function findAllProducts(filters = {}) {
    let sql = `
        SELECT
            products.*,
            COALESCE(categories.name, 'Sans catégorie') AS category_name
        FROM products
        LEFT JOIN categories ON products.category_id = categories.id
    `;

    const conditions = [];
    const params = [];

    // Public-facing queries hide invisible and archived products
    if (!filters.admin) {
        conditions.push("products.is_visible = 1");
        conditions.push("products.is_archived = 0");
    } else if (!filters.showArchived) {
        // Admin default: hide archived unless explicitly requested
        conditions.push("products.is_archived = 0");
    }

    if (filters.categoryId) {
        conditions.push("products.category_id = ?");
        params.push(filters.categoryId);
    }

    if (filters.search) {
        conditions.push("(products.name LIKE ? OR products.description LIKE ? OR products.sku LIKE ?)");
        const searchTerm = `%${filters.search}%`;
        params.push(searchTerm, searchTerm, searchTerm);
    }

    if (filters.featured) {
        conditions.push("products.is_featured = 1");
    }

    if (filters.visibility === "visible") {
        conditions.push("products.is_visible = 1");
    } else if (filters.visibility === "hidden") {
        conditions.push("products.is_visible = 0");
    }

    if (filters.stockStatus === "out") {
        conditions.push("products.stock = 0");
    } else if (filters.stockStatus === "low") {
        conditions.push("products.stock > 0 AND products.stock <= 5");
    } else if (filters.stockStatus === "in") {
        conditions.push("products.stock > 5");
    }

    if (conditions.length > 0) {
        sql += " WHERE " + conditions.join(" AND ");
    }

    // Count total before pagination
    const countSql = `SELECT COUNT(*) AS total FROM (${sql}) AS sub`;
    const [countResult] = await db.promise().query(countSql, [...params]);
    const total = countResult[0].total;

    // Sorting
    const allowedSorts = {
        name: "products.name",
        price: "products.price",
        stock: "products.stock",
        sales: "products.sales_count",
        created_at: "products.created_at",
        category: "category_name"
    };

    const sortColumn = allowedSorts[filters.sortBy] || "products.created_at";
    const direction = filters.sortDir === "asc" ? "ASC" : "DESC";
    sql += ` ORDER BY ${sortColumn} ${direction}`;

    // Pagination
    if (filters.page && filters.pageSize) {
        const limit = Math.min(Math.max(parseInt(filters.pageSize) || 25, 1), 100);
        const currentPage = Math.max(parseInt(filters.page) || 1, 1);
        const offset = (currentPage - 1) * limit;

        sql += " LIMIT ? OFFSET ?";
        params.push(limit, offset);

        const [results] = await db.promise().query(sql, params);
        return {
            products: results,
            total,
            page: currentPage,
            pageSize: limit,
            totalPages: Math.ceil(total / limit)
        };
    }

    // No pagination: simple limit
    if (filters.limit) {
        sql += " LIMIT ?";
        params.push(Number(filters.limit));
    }

    const [results] = await db.promise().query(sql, params);
    return filters.page ? { products: results, total } : results;
}

// Find a product by id
async function findProductById(id) {
    const sql = `
        SELECT
            products.*,
            COALESCE(categories.name, 'Sans catégorie') AS category_name
        FROM products
        LEFT JOIN categories ON products.category_id = categories.id
        WHERE products.id = ?
    `;

    const [results] = await db.promise().query(sql, [id]);
    return results[0];
}

// Get images for a product
async function findProductImages(productId) {
    const sql = `
        SELECT * FROM product_images
        WHERE product_id = ?
        ORDER BY display_order ASC
    `;

    const [results] = await db.promise().query(sql, [productId]);
    return results;
}

// Get a single product image by id
async function findProductImageById(imageId) {
    const sql = "SELECT * FROM product_images WHERE id = ?";
    const [results] = await db.promise().query(sql, [imageId]);
    return results[0];
}

// Add an extra image to a product
async function addProductImage(productId, imagePath, displayOrder) {
    const sql = `
        INSERT INTO product_images (product_id, image_path, display_order)
        VALUES (?, ?, ?)
    `;
    const [result] = await db.promise().query(sql, [productId, imagePath, displayOrder]);
    return result;
}

// Delete a single product image by id
async function deleteProductImage(imageId) {
    const sql = "DELETE FROM product_images WHERE id = ?";
    const [result] = await db.promise().query(sql, [imageId]);
    return result;
}

// Delete all extra images for a product (used when deleting the product)
async function deleteProductImagesByProductId(productId) {
    const sql = "DELETE FROM product_images WHERE product_id = ?";
    const [result] = await db.promise().query(sql, [productId]);
    return result;
}

// Create a product
async function createProduct(name, description, material, color, price, stock, categoryId, image, isFeatured, isVisible, sku, dimensions = null, careInstructions = null, deliveryInfo = null, returnPolicy = null) {
    const sql = `
        INSERT INTO products (name, description, material, color, dimensions, care_instructions, delivery_info, return_policy, price, stock, category_id, image, is_featured, is_visible, sku)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const [result] = await db.promise().query(sql, [
        name, description, material || null, color || null, dimensions || null, careInstructions || null, deliveryInfo || null, returnPolicy || null,
        price, stock, categoryId || null, image,
        isFeatured ? 1 : 0,
        isVisible !== false ? 1 : 0,
        sku || null
    ]);
    return result;
}

// Update a product
async function updateProduct(id, name, description, material, color, price, stock, categoryId, image, isFeatured, isVisible, sku, dimensions = null, careInstructions = null, deliveryInfo = null, returnPolicy = null) {
    const fields = [
        "name = ?", "description = ?", "material = ?", "color = ?", "dimensions = ?", "care_instructions = ?", "delivery_info = ?", "return_policy = ?", "price = ?", "stock = ?",
        "category_id = ?", "is_featured = ?", "is_visible = ?", "sku = ?"
    ];
    const params = [
        name, description, material || null, color || null, dimensions || null, careInstructions || null, deliveryInfo || null, returnPolicy || null,
        price, stock, categoryId || null,
        isFeatured ? 1 : 0,
        isVisible !== false ? 1 : 0,
        sku || null
    ];

    if (image !== null && image !== undefined) {
        fields.push("image = ?");
        params.push(image);
    }

    params.push(id);

    const sql = `UPDATE products SET ${fields.join(", ")} WHERE id = ?`;
    const [result] = await db.promise().query(sql, params);
    return result;
}


// Delete a product
async function deleteProduct(id) {
    const sql = "DELETE FROM products WHERE id = ?";
    const [result] = await db.promise().query(sql, [id]);
    return result;
}

// Archive a product (soft delete)
async function archiveProduct(id) {
    const sql = "UPDATE products SET is_archived = 1, is_visible = 0 WHERE id = ?";
    const [result] = await db.promise().query(sql, [id]);
    return result;
}

// Restore an archived product
async function restoreProduct(id) {
    const sql = "UPDATE products SET is_archived = 0 WHERE id = ?";
    const [result] = await db.promise().query(sql, [id]);
    return result;
}

// Duplicate a product
async function duplicateProduct(id) {
    const product = await findProductById(id);
    if (!product) return null;

    const sql = `
        INSERT INTO products (name, description, material, color, dimensions, care_instructions, delivery_info, return_policy, price, stock, category_id, image, is_featured, is_visible, sku)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, 0, ?)
    `;

    const [result] = await db.promise().query(sql, [
        product.name + " (copie)",
        product.description,
        product.material,
        product.color,
        product.dimensions,
        product.care_instructions,
        product.delivery_info,
        product.return_policy,
        product.price,
        0,
        product.category_id,
        product.image,
        null
    ]);

    return result;
}

// Update product stock
async function updateStock(id, stock) {
    const sql = "UPDATE products SET stock = ? WHERE id = ?";
    const [result] = await db.promise().query(sql, [stock, id]);
    return result;
}

// Increment sales count
async function incrementSalesCount(id, quantity) {
    const sql = "UPDATE products SET sales_count = sales_count + ? WHERE id = ?";
    const [result] = await db.promise().query(sql, [quantity, id]);
    return result;
}

module.exports = {
    findAllProducts,
    findProductById,
    findProductImages,
    findProductImageById,
    addProductImage,
    deleteProductImage,
    deleteProductImagesByProductId,
    createProduct,
    updateProduct,
    deleteProduct,
    archiveProduct,
    restoreProduct,
    duplicateProduct,
    updateStock,
    incrementSalesCount
};

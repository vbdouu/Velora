-- Velora — Jewelry e-commerce database schema (Canonical Production Schema)
-- This file creates the velora_db database and all 12 required tables.

DROP DATABASE IF EXISTS velora_db;
CREATE DATABASE velora_db CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE velora_db;

-- ─────────────────────────────────────────────────────────────────
-- 1. Users table: stores all accounts (clients and admins)
-- ─────────────────────────────────────────────────────────────────
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('client', 'admin') NOT NULL DEFAULT 'client',
    profile_photo VARCHAR(255) DEFAULT NULL,
    phone VARCHAR(20) DEFAULT NULL,
    account_status ENUM('active', 'blocked') DEFAULT 'active',
    block_reason TEXT DEFAULT NULL,
    blocked_at DATETIME DEFAULT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

    INDEX idx_users_role (role),
    INDEX idx_users_account_status (account_status),
    INDEX idx_users_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ─────────────────────────────────────────────────────────────────
-- 2. Categories table: jewelry categories (Rings, Necklaces, etc.)
-- ─────────────────────────────────────────────────────────────────
CREATE TABLE categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    description TEXT DEFAULT NULL,
    image VARCHAR(255) DEFAULT NULL,
    is_visible TINYINT(1) NOT NULL DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ─────────────────────────────────────────────────────────────────
-- 3. Products table: jewelry items available for purchase
-- ─────────────────────────────────────────────────────────────────
CREATE TABLE products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    sku VARCHAR(100) DEFAULT NULL,
    description TEXT DEFAULT NULL,
    material VARCHAR(255) DEFAULT NULL,
    color VARCHAR(100) DEFAULT NULL,
    dimensions VARCHAR(255) DEFAULT NULL,
    care_instructions TEXT DEFAULT NULL,
    delivery_info TEXT DEFAULT NULL,
    return_policy TEXT DEFAULT NULL,
    price DECIMAL(10, 2) NOT NULL,
    stock INT NOT NULL DEFAULT 0,
    category_id INT DEFAULT NULL,
    image VARCHAR(255) DEFAULT NULL,
    is_featured TINYINT(1) DEFAULT 0,
    is_visible TINYINT(1) NOT NULL DEFAULT 1,
    is_archived TINYINT(1) NOT NULL DEFAULT 0,
    sales_count INT NOT NULL DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL,

    INDEX idx_products_category_id (category_id),
    INDEX idx_products_is_visible (is_visible),
    INDEX idx_products_is_featured (is_featured),
    INDEX idx_products_is_archived (is_archived),
    INDEX idx_products_created_at (created_at),
    INDEX idx_products_price (price),
    INDEX idx_products_stock (stock),
    INDEX idx_products_sales_count (sales_count)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ─────────────────────────────────────────────────────────────────
-- 4. Product images: multiple images per product
-- ─────────────────────────────────────────────────────────────────
CREATE TABLE product_images (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL,
    image_path VARCHAR(255) NOT NULL,
    display_order INT DEFAULT 0,

    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ─────────────────────────────────────────────────────────────────
-- 5. Cart items: shopping cart linked to logged-in users
-- ─────────────────────────────────────────────────────────────────
CREATE TABLE cart_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,

    UNIQUE KEY unique_user_product (user_id, product_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ─────────────────────────────────────────────────────────────────
-- 6. Wishlist items: saved favorites for logged-in users
-- ─────────────────────────────────────────────────────────────────
CREATE TABLE wishlist_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    product_id INT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,

    UNIQUE KEY unique_user_wishlist (user_id, product_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ─────────────────────────────────────────────────────────────────
-- 7. Orders: completed purchases with status tracking
-- ─────────────────────────────────────────────────────────────────
CREATE TABLE orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT DEFAULT NULL,
    total DECIMAL(10, 2) NOT NULL,
    shipping_fee DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    status ENUM('pending', 'confirmed', 'shipped', 'delivered', 'cancelled') DEFAULT 'pending',
    shipping_address TEXT NOT NULL,
    shipping_city VARCHAR(255) NOT NULL,
    shipping_phone VARCHAR(20) NOT NULL,
    payment_method ENUM('cash_on_delivery') DEFAULT 'cash_on_delivery',
    notes TEXT DEFAULT NULL,
    admin_notes TEXT DEFAULT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,

    INDEX idx_orders_user_id (user_id),
    INDEX idx_orders_status (status),
    INDEX idx_orders_created_at (created_at),
    INDEX idx_orders_shipping_city (shipping_city)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ─────────────────────────────────────────────────────────────────
-- 8. Order items: individual products within an order
-- ─────────────────────────────────────────────────────────────────
CREATE TABLE order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    product_id INT DEFAULT NULL,
    quantity INT NOT NULL,
    unit_price DECIMAL(10, 2) NOT NULL,
    product_name_snapshot VARCHAR(255) NOT NULL DEFAULT '',
    product_image_snapshot VARCHAR(255) DEFAULT NULL,

    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE SET NULL,

    INDEX idx_order_items_order_id (order_id),
    INDEX idx_order_items_product_id (product_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ─────────────────────────────────────────────────────────────────
-- 9. Order status history: audit trail for status modifications
-- ─────────────────────────────────────────────────────────────────
CREATE TABLE order_status_history (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    old_status VARCHAR(50) DEFAULT NULL,
    new_status VARCHAR(50) NOT NULL,
    changed_by INT DEFAULT NULL,
    note TEXT DEFAULT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (changed_by) REFERENCES users(id) ON DELETE SET NULL,

    INDEX idx_status_history_order (order_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ─────────────────────────────────────────────────────────────────
-- 10. Settings: key/value store for site-wide configuration
-- ─────────────────────────────────────────────────────────────────
CREATE TABLE settings (
    setting_key VARCHAR(100) PRIMARY KEY,
    setting_value TEXT DEFAULT NULL,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Default settings
INSERT INTO settings (setting_key, setting_value) VALUES
    ('store_name',            'Velora'),
    ('store_phone',           '+213 555 000 000'),
    ('store_whatsapp',        '+213 555 000 000'),
    ('store_email',           'bonjour@velora.dz'),
    ('store_address',         'Alger, Algérie'),
    ('instagram_url',         'https://www.instagram.com/velora.dz'),
    ('facebook_url',          'https://www.facebook.com/velora.dz'),
    ('free_threshold',        '5000'),
    ('announcement_enabled',  '1'),
    ('announcement',          'Livraison offerte dès 5 000 DA d''achat · Paiement à la livraison disponible'),
    ('announcement_bg',       'gold'),
    ('seo_title',             'Velora — Bijoux de Prestige'),
    ('seo_description',       'Bijoux élégants façonnés avec soin. Bagues, colliers, bracelets et boucles d''oreilles pour sublimer chaque moment de votre vie.')
ON DUPLICATE KEY UPDATE setting_key = setting_key;

-- ─────────────────────────────────────────────────────────────────
-- 11. Wilaya shipping rates table (58 Wilayas)
-- ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS wilaya_shipping (
    wilaya_code INT PRIMARY KEY,
    wilaya_name VARCHAR(100) NOT NULL,
    home_fee DECIMAL(10, 2) NOT NULL DEFAULT 600.00,
    desk_fee DECIMAL(10, 2) NOT NULL DEFAULT 400.00,
    is_active TINYINT(1) NOT NULL DEFAULT 1,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ─────────────────────────────────────────────────────────────────
-- 12. Contact messages table: stores submitted contact form entries
-- ─────────────────────────────────────────────────────────────────
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



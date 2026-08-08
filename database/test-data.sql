-- Velora - Realistic Test Data
USE velora_db;

SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE wilaya_shipping;
TRUNCATE TABLE order_items;
TRUNCATE TABLE orders;
TRUNCATE TABLE wishlist_items;
TRUNCATE TABLE cart_items;
TRUNCATE TABLE product_images;
TRUNCATE TABLE products;
TRUNCATE TABLE categories;
TRUNCATE TABLE users;
SET FOREIGN_KEY_CHECKS = 1;

-- Admin
INSERT INTO users (id, first_name, last_name, email, password, role, phone, created_at) VALUES (1, 'Sara', 'Admin', 'sara@velora.dz', '$2b$10$ZvtJksTTMdXk81.SJ5vPOemHnCAp3dok/KxrcpwbtRdkmah/mb.RW', 'admin', '0555123456', '2023-01-01 10:00:00');
INSERT INTO users (id, first_name, last_name, email, password, role, phone, created_at) VALUES (1001, 'Amine', 'Admin', 'amine@velora.dz', '$2b$10$ZvtJksTTMdXk81.SJ5vPOemHnCAp3dok/KxrcpwbtRdkmah/mb.RW', 'admin', '0555123457', '2023-01-01 10:00:00');

-- Clients
INSERT INTO users (id, first_name, last_name, email, password, role, phone, created_at) VALUES (2, 'Yasmine', 'Belkacem', 'yasmine.belkacem2@example.com', '$2b$10$StuGh4hmzeDXv.f3qvYPveT8N4rezDO8iE.uoAtSr3HDP5UJ1NZju', 'client', '0781379154', '2023-08-30 23:56:57');
INSERT INTO users (id, first_name, last_name, email, password, role, phone, created_at) VALUES (3, 'Manel', 'Toumi', 'manel.toumi3@example.com', '$2b$10$StuGh4hmzeDXv.f3qvYPveT8N4rezDO8iE.uoAtSr3HDP5UJ1NZju', 'client', '0560369177', '2024-01-17 23:20:26');
INSERT INTO users (id, first_name, last_name, email, password, role, phone, created_at) VALUES (4, 'Lydia', 'Yelles', 'lydia.yelles4@example.com', '$2b$10$StuGh4hmzeDXv.f3qvYPveT8N4rezDO8iE.uoAtSr3HDP5UJ1NZju', 'client', '0693623268', '2023-07-12 07:25:22');
INSERT INTO users (id, first_name, last_name, email, password, role, phone, created_at) VALUES (5, 'Fatima', 'Ziani', 'fatima.ziani5@example.com', '$2b$10$StuGh4hmzeDXv.f3qvYPveT8N4rezDO8iE.uoAtSr3HDP5UJ1NZju', 'client', '0748535119', '2023-09-21 12:32:37');
INSERT INTO users (id, first_name, last_name, email, password, role, phone, created_at) VALUES (6, 'Rania', 'Cherif', 'rania.cherif6@example.com', '$2b$10$StuGh4hmzeDXv.f3qvYPveT8N4rezDO8iE.uoAtSr3HDP5UJ1NZju', 'client', '0740141975', '2023-05-14 16:11:16');
INSERT INTO users (id, first_name, last_name, email, password, role, phone, created_at) VALUES (7, 'Amina', 'Djabali', 'amina.djabali7@example.com', '$2b$10$StuGh4hmzeDXv.f3qvYPveT8N4rezDO8iE.uoAtSr3HDP5UJ1NZju', 'client', '0517128789', '2023-09-04 06:23:17');
INSERT INTO users (id, first_name, last_name, email, password, role, phone, created_at) VALUES (8, 'Amina', 'Saidi', 'amina.saidi8@example.com', '$2b$10$StuGh4hmzeDXv.f3qvYPveT8N4rezDO8iE.uoAtSr3HDP5UJ1NZju', 'client', '0716055849', '2023-01-17 19:26:18');
INSERT INTO users (id, first_name, last_name, email, password, role, phone, created_at) VALUES (9, 'Celia', 'Yelles', 'celia.yelles9@example.com', '$2b$10$StuGh4hmzeDXv.f3qvYPveT8N4rezDO8iE.uoAtSr3HDP5UJ1NZju', 'client', '0677537054', '2023-07-12 04:14:09');
INSERT INTO users (id, first_name, last_name, email, password, role, phone, created_at) VALUES (10, 'Khadija', 'Hamadi', 'khadija.hamadi10@example.com', '$2b$10$StuGh4hmzeDXv.f3qvYPveT8N4rezDO8iE.uoAtSr3HDP5UJ1NZju', 'client', '0574960071', '2023-07-03 19:22:20');
INSERT INTO users (id, first_name, last_name, email, password, role, phone, created_at) VALUES (11, 'Celia', 'Yelles', 'celia.yelles11@example.com', '$2b$10$StuGh4hmzeDXv.f3qvYPveT8N4rezDO8iE.uoAtSr3HDP5UJ1NZju', 'client', '0632081057', '2024-04-25 02:08:31');
INSERT INTO users (id, first_name, last_name, email, password, role, phone, created_at) VALUES (12, 'Celia', 'Khelil', 'celia.khelil12@example.com', '$2b$10$StuGh4hmzeDXv.f3qvYPveT8N4rezDO8iE.uoAtSr3HDP5UJ1NZju', 'client', '0686643838', '2023-03-22 22:42:11');
INSERT INTO users (id, first_name, last_name, email, password, role, phone, created_at) VALUES (13, 'Rania', 'Cherif', 'rania.cherif13@example.com', '$2b$10$StuGh4hmzeDXv.f3qvYPveT8N4rezDO8iE.uoAtSr3HDP5UJ1NZju', 'client', '0772913094', '2024-02-06 14:50:24');
INSERT INTO users (id, first_name, last_name, email, password, role, phone, created_at) VALUES (14, 'Yasmine', 'Boussad', 'yasmine.boussad14@example.com', '$2b$10$StuGh4hmzeDXv.f3qvYPveT8N4rezDO8iE.uoAtSr3HDP5UJ1NZju', 'client', '0622525439', '2023-06-11 13:00:27');
INSERT INTO users (id, first_name, last_name, email, password, role, phone, created_at) VALUES (15, 'Amina', 'Othmani', 'amina.othmani15@example.com', '$2b$10$StuGh4hmzeDXv.f3qvYPveT8N4rezDO8iE.uoAtSr3HDP5UJ1NZju', 'client', '0587365470', '2023-09-21 11:47:26');
INSERT INTO users (id, first_name, last_name, email, password, role, phone, created_at) VALUES (16, 'Amina', 'Boussad', 'amina.boussad16@example.com', '$2b$10$StuGh4hmzeDXv.f3qvYPveT8N4rezDO8iE.uoAtSr3HDP5UJ1NZju', 'client', '0798147884', '2023-01-19 19:35:02');
INSERT INTO users (id, first_name, last_name, email, password, role, phone, created_at) VALUES (17, 'Amina', 'Djabali', 'amina.djabali17@example.com', '$2b$10$StuGh4hmzeDXv.f3qvYPveT8N4rezDO8iE.uoAtSr3HDP5UJ1NZju', 'client', '0517351620', '2024-02-06 10:06:50');
INSERT INTO users (id, first_name, last_name, email, password, role, phone, created_at) VALUES (18, 'Lina', 'Haddad', 'lina.haddad18@example.com', '$2b$10$StuGh4hmzeDXv.f3qvYPveT8N4rezDO8iE.uoAtSr3HDP5UJ1NZju', 'client', '0681575199', '2024-03-31 12:48:19');
INSERT INTO users (id, first_name, last_name, email, password, role, phone, created_at) VALUES (19, 'Zineb', 'Belkacem', 'zineb.belkacem19@example.com', '$2b$10$StuGh4hmzeDXv.f3qvYPveT8N4rezDO8iE.uoAtSr3HDP5UJ1NZju', 'client', '0648161763', '2023-06-12 14:47:09');
INSERT INTO users (id, first_name, last_name, email, password, role, phone, created_at) VALUES (20, 'Lina', 'Ait Ahmed', 'lina.ait ahmed20@example.com', '$2b$10$StuGh4hmzeDXv.f3qvYPveT8N4rezDO8iE.uoAtSr3HDP5UJ1NZju', 'client', '0645954267', '2023-04-04 19:41:43');
INSERT INTO users (id, first_name, last_name, email, password, role, phone, created_at) VALUES (21, 'Fatima', 'Lounis', 'fatima.lounis21@example.com', '$2b$10$StuGh4hmzeDXv.f3qvYPveT8N4rezDO8iE.uoAtSr3HDP5UJ1NZju', 'client', '0668239948', '2024-04-04 03:40:13');
INSERT INTO users (id, first_name, last_name, email, password, role, phone, created_at) VALUES (22, 'Lydia', 'Mansouri', 'lydia.mansouri22@example.com', '$2b$10$StuGh4hmzeDXv.f3qvYPveT8N4rezDO8iE.uoAtSr3HDP5UJ1NZju', 'client', '0538134973', '2023-08-24 17:49:57');
INSERT INTO users (id, first_name, last_name, email, password, role, phone, created_at) VALUES (23, 'Celia', 'Ziani', 'celia.ziani23@example.com', '$2b$10$StuGh4hmzeDXv.f3qvYPveT8N4rezDO8iE.uoAtSr3HDP5UJ1NZju', 'client', '0620134708', '2024-02-23 16:26:16');
INSERT INTO users (id, first_name, last_name, email, password, role, phone, created_at) VALUES (24, 'Hamza', 'Dahmani', 'hamza.dahmani24@example.com', '$2b$10$StuGh4hmzeDXv.f3qvYPveT8N4rezDO8iE.uoAtSr3HDP5UJ1NZju', 'client', '0759034048', '2023-01-25 13:00:29');
INSERT INTO users (id, first_name, last_name, email, password, role, phone, created_at) VALUES (25, 'Yasmine', 'Dahmani', 'yasmine.dahmani25@example.com', '$2b$10$StuGh4hmzeDXv.f3qvYPveT8N4rezDO8iE.uoAtSr3HDP5UJ1NZju', 'client', '0672234717', '2024-04-28 06:14:25');
INSERT INTO users (id, first_name, last_name, email, password, role, phone, created_at) VALUES (26, 'Amira', 'Boussad', 'amira.boussad26@example.com', '$2b$10$StuGh4hmzeDXv.f3qvYPveT8N4rezDO8iE.uoAtSr3HDP5UJ1NZju', 'client', '0626636865', '2023-07-11 00:14:01');
INSERT INTO users (id, first_name, last_name, email, password, role, phone, created_at) VALUES (27, 'Fatima', 'Haddad', 'fatima.haddad27@example.com', '$2b$10$StuGh4hmzeDXv.f3qvYPveT8N4rezDO8iE.uoAtSr3HDP5UJ1NZju', 'client', '0659740270', '2024-04-13 01:37:34');
INSERT INTO users (id, first_name, last_name, email, password, role, phone, created_at) VALUES (28, 'Zineb', 'Khelil', 'zineb.khelil28@example.com', '$2b$10$StuGh4hmzeDXv.f3qvYPveT8N4rezDO8iE.uoAtSr3HDP5UJ1NZju', 'client', '0547729245', '2023-09-10 08:15:05');
INSERT INTO users (id, first_name, last_name, email, password, role, phone, created_at) VALUES (29, 'Sarah', 'Khelil', 'sarah.khelil29@example.com', '$2b$10$StuGh4hmzeDXv.f3qvYPveT8N4rezDO8iE.uoAtSr3HDP5UJ1NZju', 'client', '0685606306', '2023-07-26 11:31:58');
INSERT INTO users (id, first_name, last_name, email, password, role, phone, created_at) VALUES (30, 'Zineb', 'Brahimi', 'zineb.brahimi30@example.com', '$2b$10$StuGh4hmzeDXv.f3qvYPveT8N4rezDO8iE.uoAtSr3HDP5UJ1NZju', 'client', '0549728948', '2023-11-13 08:21:51');
INSERT INTO users (id, first_name, last_name, email, password, role, phone, created_at) VALUES (31, 'Rania', 'Cherif', 'rania.cherif31@example.com', '$2b$10$StuGh4hmzeDXv.f3qvYPveT8N4rezDO8iE.uoAtSr3HDP5UJ1NZju', 'client', '0623025254', '2024-03-18 18:58:05');
INSERT INTO users (id, first_name, last_name, email, password, role, phone, created_at) VALUES (32, 'Amina', 'Boussad', 'amina.boussad32@example.com', '$2b$10$StuGh4hmzeDXv.f3qvYPveT8N4rezDO8iE.uoAtSr3HDP5UJ1NZju', 'client', '0523612883', '2023-02-02 06:26:38');
INSERT INTO users (id, first_name, last_name, email, password, role, phone, created_at) VALUES (33, 'Imene', 'Hamadi', 'imene.hamadi33@example.com', '$2b$10$StuGh4hmzeDXv.f3qvYPveT8N4rezDO8iE.uoAtSr3HDP5UJ1NZju', 'client', '0596543486', '2024-01-27 22:03:07');
INSERT INTO users (id, first_name, last_name, email, password, role, phone, created_at) VALUES (34, 'Walid', 'Othmani', 'walid.othmani34@example.com', '$2b$10$StuGh4hmzeDXv.f3qvYPveT8N4rezDO8iE.uoAtSr3HDP5UJ1NZju', 'client', '0734442853', '2024-01-15 04:05:10');
INSERT INTO users (id, first_name, last_name, email, password, role, phone, created_at) VALUES (35, 'Lina', 'Lounis', 'lina.lounis35@example.com', '$2b$10$StuGh4hmzeDXv.f3qvYPveT8N4rezDO8iE.uoAtSr3HDP5UJ1NZju', 'client', '0727223708', '2023-02-06 05:05:26');
INSERT INTO users (id, first_name, last_name, email, password, role, phone, created_at) VALUES (36, 'Mehdi', 'Djabali', 'mehdi.djabali36@example.com', '$2b$10$StuGh4hmzeDXv.f3qvYPveT8N4rezDO8iE.uoAtSr3HDP5UJ1NZju', 'client', '0686162576', '2024-05-19 07:45:01');
INSERT INTO users (id, first_name, last_name, email, password, role, phone, created_at) VALUES (37, 'Asma', 'Ait Ahmed', 'asma.ait ahmed37@example.com', '$2b$10$StuGh4hmzeDXv.f3qvYPveT8N4rezDO8iE.uoAtSr3HDP5UJ1NZju', 'client', '0633547828', '2023-08-01 02:17:06');
INSERT INTO users (id, first_name, last_name, email, password, role, phone, created_at) VALUES (38, 'Samira', 'Boussad', 'samira.boussad38@example.com', '$2b$10$StuGh4hmzeDXv.f3qvYPveT8N4rezDO8iE.uoAtSr3HDP5UJ1NZju', 'client', '0717493361', '2023-12-30 06:21:41');
INSERT INTO users (id, first_name, last_name, email, password, role, phone, created_at) VALUES (39, 'Mehdi', 'Ait Ahmed', 'mehdi.ait ahmed39@example.com', '$2b$10$StuGh4hmzeDXv.f3qvYPveT8N4rezDO8iE.uoAtSr3HDP5UJ1NZju', 'client', '0576509868', '2023-03-15 04:07:51');
INSERT INTO users (id, first_name, last_name, email, password, role, phone, created_at) VALUES (40, 'Sarah', 'Slimani', 'sarah.slimani40@example.com', '$2b$10$StuGh4hmzeDXv.f3qvYPveT8N4rezDO8iE.uoAtSr3HDP5UJ1NZju', 'client', '0521564910', '2024-03-07 21:18:42');
INSERT INTO users (id, first_name, last_name, email, password, role, phone, created_at) VALUES (41, 'Imene', 'Lounis', 'imene.lounis41@example.com', '$2b$10$StuGh4hmzeDXv.f3qvYPveT8N4rezDO8iE.uoAtSr3HDP5UJ1NZju', 'client', '0743364772', '2023-08-27 23:07:16');

-- Categories
INSERT INTO categories (id, name, description, image, show_in_footer, created_at) VALUES (1, 'Bagues', 'Bagues élégantes et raffinées pour toutes les occasions.', '/uploads/category-rings.jpg', 1, '2023-01-01 12:00:00');
INSERT INTO categories (id, name, description, image, show_in_footer, created_at) VALUES (2, 'Bracelets', 'Bracelets tendance pour sublimer votre poignet.', '/uploads/category-bracelets.jpg', 1, '2023-01-01 12:00:00');
INSERT INTO categories (id, name, description, image, show_in_footer, created_at) VALUES (3, 'Colliers', 'Colliers délicats et pendentifs uniques.', '/uploads/category-necklaces.jpg', 1, '2023-01-01 12:00:00');
INSERT INTO categories (id, name, description, image, show_in_footer, created_at) VALUES (4, 'Boucles d''oreilles', 'Boucles d''oreilles pour apporter une touche d''éclat.', '/uploads/category-earrings.jpg', 1, '2023-01-01 12:00:00');
INSERT INTO categories (id, name, description, image, show_in_footer, created_at) VALUES (5, 'Coffrets cadeaux', 'Coffrets parfaits pour offrir à vos proches.', '/uploads/category-bracelets.jpg', 0, '2023-01-01 12:00:00');
INSERT INTO categories (id, name, description, image, show_in_footer, created_at) VALUES (6, 'Accessoires', 'Accessoires divers pour compléter votre style.', '/uploads/category-rings.jpg', 0, '2023-01-01 12:00:00');
INSERT INTO categories (id, name, description, image, show_in_footer, created_at) VALUES (7, 'Bijoux personnalisés', 'Bijoux avec gravure ou prénom personnalisé.', '/uploads/category-necklaces.jpg', 0, '2023-01-01 12:00:00');

-- Products
INSERT INTO products (id, name, sku, description, material, color, dimensions, care_instructions, delivery_info, return_policy, price, stock, category_id, image, is_featured, is_visible, is_archived, sales_count, created_at) VALUES (1, 'Coffret cadeau Saint-Valentin 65', 'SKU-1', 'Magnifique coffret cadeau saint-valentin 65 pour compléter votre tenue. Un choix parfait pour toutes les occasions, alliant élégance et finesse.', 'Plaqué Or', 'Doré', '45cm + 5cm extension', 'Éviter l''eau, le parfum et les produits chimiques pour préserver l''éclat.', 'Livraison rapide sous 24h à 48h partout en Algérie.', 'Retours acceptés sous 7 jours après réception.', 7500, 31, 5, '/uploads/category-bracelets.jpg', 1, 1, 0, 0, '2023-03-25 13:56:28');
INSERT INTO products (id, name, sku, description, material, color, dimensions, care_instructions, delivery_info, return_policy, price, stock, category_id, image, is_featured, is_visible, is_archived, sales_count, created_at) VALUES (2, 'Boucles d''oreilles modernes 25', 'SKU-2', 'Magnifique boucles d''oreilles modernes 25 pour compléter votre tenue. Un choix parfait pour toutes les occasions, alliant élégance et finesse.', 'Acier Inoxydable', 'Or Rose', '45cm + 5cm extension', 'Éviter l''eau, le parfum et les produits chimiques pour préserver l''éclat.', 'Livraison rapide sous 24h à 48h partout en Algérie.', 'Retours acceptés sous 7 jours après réception.', 2200, 25, 4, '/uploads/category-earrings.jpg', 0, 1, 0, 0, '2024-06-17 14:17:32');
INSERT INTO products (id, name, sku, description, material, color, dimensions, care_instructions, delivery_info, return_policy, price, stock, category_id, image, is_featured, is_visible, is_archived, sales_count, created_at) VALUES (3, 'Collier pendentif lune et étoile 92', 'SKU-3', 'Magnifique collier pendentif lune et étoile 92 pour compléter votre tenue. Un choix parfait pour toutes les occasions, alliant élégance et finesse.', 'Plaqué Or', 'Argenté', '45cm + 5cm extension', 'Éviter l''eau, le parfum et les produits chimiques pour préserver l''éclat.', 'Livraison rapide sous 24h à 48h partout en Algérie.', 'Retours acceptés sous 7 jours après réception.', 2800, 33, 3, '/uploads/category-necklaces.jpg', 0, 1, 0, 0, '2023-11-18 16:22:15');
INSERT INTO products (id, name, sku, description, material, color, dimensions, care_instructions, delivery_info, return_policy, price, stock, category_id, image, is_featured, is_visible, is_archived, sales_count, created_at) VALUES (4, 'Bague ajustable motif floral 69', 'SKU-4', 'Magnifique bague ajustable motif floral 69 pour compléter votre tenue. Un choix parfait pour toutes les occasions, alliant élégance et finesse.', 'Acier Inoxydable', 'Doré', 'Taille ajustable', 'Éviter l''eau, le parfum et les produits chimiques pour préserver l''éclat.', 'Livraison rapide sous 24h à 48h partout en Algérie.', 'Retours acceptés sous 7 jours après réception.', 3500, 36, 1, '/uploads/category-rings.jpg', 1, 1, 0, 0, '2024-03-26 18:56:37');
INSERT INTO products (id, name, sku, description, material, color, dimensions, care_instructions, delivery_info, return_policy, price, stock, category_id, image, is_featured, is_visible, is_archived, sales_count, created_at) VALUES (5, 'Collier prénom arabe 40', 'SKU-5', 'Magnifique collier prénom arabe 40 pour compléter votre tenue. Un choix parfait pour toutes les occasions, alliant élégance et finesse.', 'Plaqué Or', 'Or Rose', '45cm + 5cm extension', 'Éviter l''eau, le parfum et les produits chimiques pour préserver l''éclat.', 'Livraison rapide sous 24h à 48h partout en Algérie.', 'Retours acceptés sous 7 jours après réception.', 2500, 25, 7, '/uploads/category-necklaces.jpg', 0, 1, 0, 0, '2023-06-05 14:16:27');
INSERT INTO products (id, name, sku, description, material, color, dimensions, care_instructions, delivery_info, return_policy, price, stock, category_id, image, is_featured, is_visible, is_archived, sales_count, created_at) VALUES (6, 'Collier ras de cou velours 79', 'SKU-6', 'Magnifique collier ras de cou velours 79 pour compléter votre tenue. Un choix parfait pour toutes les occasions, alliant élégance et finesse.', 'Acier Inoxydable', 'Argenté', '45cm + 5cm extension', 'Éviter l''eau, le parfum et les produits chimiques pour préserver l''éclat.', 'Livraison rapide sous 24h à 48h partout en Algérie.', 'Retours acceptés sous 7 jours après réception.', 9000, 20, 3, '/uploads/category-necklaces.jpg', 0, 1, 0, 0, '2023-04-10 12:08:42');
INSERT INTO products (id, name, sku, description, material, color, dimensions, care_instructions, delivery_info, return_policy, price, stock, category_id, image, is_featured, is_visible, is_archived, sales_count, created_at) VALUES (7, 'Collier chaîne épaisse dorée 81', 'SKU-7', 'Magnifique collier chaîne épaisse dorée 81 pour compléter votre tenue. Un choix parfait pour toutes les occasions, alliant élégance et finesse.', 'Plaqué Or', 'Doré', '45cm + 5cm extension', 'Éviter l''eau, le parfum et les produits chimiques pour préserver l''éclat.', 'Livraison rapide sous 24h à 48h partout en Algérie.', 'Retours acceptés sous 7 jours après réception.', 7500, 21, 3, '/uploads/category-necklaces.jpg', 0, 1, 0, 0, '2024-05-07 15:13:00');
INSERT INTO products (id, name, sku, description, material, color, dimensions, care_instructions, delivery_info, return_policy, price, stock, category_id, image, is_featured, is_visible, is_archived, sales_count, created_at) VALUES (8, 'Coffret montre et bracelet 39', 'SKU-8', 'Magnifique coffret montre et bracelet 39 pour compléter votre tenue. Un choix parfait pour toutes les occasions, alliant élégance et finesse.', 'Acier Inoxydable', 'Or Rose', 'Taille ajustable', 'Éviter l''eau, le parfum et les produits chimiques pour préserver l''éclat.', 'Livraison rapide sous 24h à 48h partout en Algérie.', 'Retours acceptés sous 7 jours après réception.', 9000, 35, 5, '/uploads/category-bracelets.jpg', 0, 1, 0, 0, '2024-04-10 16:11:56');
INSERT INTO products (id, name, sku, description, material, color, dimensions, care_instructions, delivery_info, return_policy, price, stock, category_id, image, is_featured, is_visible, is_archived, sales_count, created_at) VALUES (9, 'Boucles d''oreilles plumes 94', 'SKU-9', 'Magnifique boucles d''oreilles plumes 94 pour compléter votre tenue. Un choix parfait pour toutes les occasions, alliant élégance et finesse.', 'Plaqué Or', 'Argenté', '45cm + 5cm extension', 'Éviter l''eau, le parfum et les produits chimiques pour préserver l''éclat.', 'Livraison rapide sous 24h à 48h partout en Algérie.', 'Retours acceptés sous 7 jours après réception.', 2800, 43, 4, '/uploads/category-earrings.jpg', 1, 1, 0, 0, '2023-06-07 05:16:02');
INSERT INTO products (id, name, sku, description, material, color, dimensions, care_instructions, delivery_info, return_policy, price, stock, category_id, image, is_featured, is_visible, is_archived, sales_count, created_at) VALUES (10, 'Bague de fiançailles fantaisie 27', 'SKU-10', 'Magnifique bague de fiançailles fantaisie 27 pour compléter votre tenue. Un choix parfait pour toutes les occasions, alliant élégance et finesse.', 'Acier Inoxydable', 'Doré', '45cm + 5cm extension', 'Éviter l''eau, le parfum et les produits chimiques pour préserver l''éclat.', 'Livraison rapide sous 24h à 48h partout en Algérie.', 'Retours acceptés sous 7 jours après réception.', 4800, 35, 1, '/uploads/category-rings.jpg', 0, 1, 0, 0, '2023-06-22 19:55:13');
INSERT INTO products (id, name, sku, description, material, color, dimensions, care_instructions, delivery_info, return_policy, price, stock, category_id, image, is_featured, is_visible, is_archived, sales_count, created_at) VALUES (11, 'Bague solitaire élégante 55', 'SKU-11', 'Magnifique bague solitaire élégante 55 pour compléter votre tenue. Un choix parfait pour toutes les occasions, alliant élégance et finesse.', 'Plaqué Or', 'Or Rose', '45cm + 5cm extension', 'Éviter l''eau, le parfum et les produits chimiques pour préserver l''éclat.', 'Livraison rapide sous 24h à 48h partout en Algérie.', 'Retours acceptés sous 7 jours après réception.', 3800, 5, 1, '/uploads/category-rings.jpg', 0, 1, 0, 0, '2024-06-29 17:15:04');
INSERT INTO products (id, name, sku, description, material, color, dimensions, care_instructions, delivery_info, return_policy, price, stock, category_id, image, is_featured, is_visible, is_archived, sales_count, created_at) VALUES (12, 'Coffret collier et boucles 75', 'SKU-12', 'Magnifique coffret collier et boucles 75 pour compléter votre tenue. Un choix parfait pour toutes les occasions, alliant élégance et finesse.', 'Acier Inoxydable', 'Argenté', 'Taille ajustable', 'Éviter l''eau, le parfum et les produits chimiques pour préserver l''éclat.', 'Livraison rapide sous 24h à 48h partout en Algérie.', 'Retours acceptés sous 7 jours après réception.', 4200, 24, 5, '/uploads/category-bracelets.jpg', 0, 1, 0, 0, '2024-04-23 11:38:19');
INSERT INTO products (id, name, sku, description, material, color, dimensions, care_instructions, delivery_info, return_policy, price, stock, category_id, image, is_featured, is_visible, is_archived, sales_count, created_at) VALUES (13, 'Boucles d''oreilles fleur de lys 65', 'SKU-13', 'Magnifique boucles d''oreilles fleur de lys 65 pour compléter votre tenue. Un choix parfait pour toutes les occasions, alliant élégance et finesse.', 'Plaqué Or', 'Doré', '45cm + 5cm extension', 'Éviter l''eau, le parfum et les produits chimiques pour préserver l''éclat.', 'Livraison rapide sous 24h à 48h partout en Algérie.', 'Retours acceptés sous 7 jours après réception.', 7500, 7, 4, '/uploads/category-earrings.jpg', 1, 1, 0, 0, '2024-07-05 01:16:16');
INSERT INTO products (id, name, sku, description, material, color, dimensions, care_instructions, delivery_info, return_policy, price, stock, category_id, image, is_featured, is_visible, is_archived, sales_count, created_at) VALUES (14, 'Coffret élégance dorée 70', 'SKU-14', 'Magnifique coffret élégance dorée 70 pour compléter votre tenue. Un choix parfait pour toutes les occasions, alliant élégance et finesse.', 'Acier Inoxydable', 'Or Rose', '45cm + 5cm extension', 'Éviter l''eau, le parfum et les produits chimiques pour préserver l''éclat.', 'Livraison rapide sous 24h à 48h partout en Algérie.', 'Retours acceptés sous 7 jours après réception.', 9000, 27, 5, '/uploads/category-bracelets.jpg', 1, 1, 0, 0, '2024-06-21 21:05:09');
INSERT INTO products (id, name, sku, description, material, color, dimensions, care_instructions, delivery_info, return_policy, price, stock, category_id, image, is_featured, is_visible, is_archived, sales_count, created_at) VALUES (15, 'Porte-clés bijou de sac 31', 'SKU-15', 'Magnifique porte-clés bijou de sac 31 pour compléter votre tenue. Un choix parfait pour toutes les occasions, alliant élégance et finesse.', 'Plaqué Or', 'Argenté', '45cm + 5cm extension', 'Éviter l''eau, le parfum et les produits chimiques pour préserver l''éclat.', 'Livraison rapide sous 24h à 48h partout en Algérie.', 'Retours acceptés sous 7 jours après réception.', 6500, 22, 6, '/uploads/category-rings.jpg', 0, 1, 0, 0, '2023-07-12 23:07:02');
INSERT INTO products (id, name, sku, description, material, color, dimensions, care_instructions, delivery_info, return_policy, price, stock, category_id, image, is_featured, is_visible, is_archived, sales_count, created_at) VALUES (16, 'Porte-clés personnalisable 42', 'SKU-16', 'Magnifique porte-clés personnalisable 42 pour compléter votre tenue. Un choix parfait pour toutes les occasions, alliant élégance et finesse.', 'Acier Inoxydable', 'Doré', 'Taille ajustable', 'Éviter l''eau, le parfum et les produits chimiques pour préserver l''éclat.', 'Livraison rapide sous 24h à 48h partout en Algérie.', 'Retours acceptés sous 7 jours après réception.', 3200, 8, 7, '/uploads/category-necklaces.jpg', 1, 1, 0, 0, '2024-06-06 09:48:27');
INSERT INTO products (id, name, sku, description, material, color, dimensions, care_instructions, delivery_info, return_policy, price, stock, category_id, image, is_featured, is_visible, is_archived, sales_count, created_at) VALUES (17, 'Coffret cadeau Saint-Valentin 46', 'SKU-17', 'Magnifique coffret cadeau saint-valentin 46 pour compléter votre tenue. Un choix parfait pour toutes les occasions, alliant élégance et finesse.', 'Plaqué Or', 'Or Rose', '45cm + 5cm extension', 'Éviter l''eau, le parfum et les produits chimiques pour préserver l''éclat.', 'Livraison rapide sous 24h à 48h partout en Algérie.', 'Retours acceptés sous 7 jours après réception.', 4200, 33, 5, '/uploads/category-bracelets.jpg', 0, 1, 0, 0, '2024-01-09 06:24:48');
INSERT INTO products (id, name, sku, description, material, color, dimensions, care_instructions, delivery_info, return_policy, price, stock, category_id, image, is_featured, is_visible, is_archived, sales_count, created_at) VALUES (18, 'Ear cuff sans perçage 31', 'SKU-18', 'Magnifique ear cuff sans perçage 31 pour compléter votre tenue. Un choix parfait pour toutes les occasions, alliant élégance et finesse.', 'Acier Inoxydable', 'Argenté', '45cm + 5cm extension', 'Éviter l''eau, le parfum et les produits chimiques pour préserver l''éclat.', 'Livraison rapide sous 24h à 48h partout en Algérie.', 'Retours acceptés sous 7 jours après réception.', 2200, 38, 4, '/uploads/category-earrings.jpg', 1, 1, 0, 0, '2024-05-17 22:48:28');
INSERT INTO products (id, name, sku, description, material, color, dimensions, care_instructions, delivery_info, return_policy, price, stock, category_id, image, is_featured, is_visible, is_archived, sales_count, created_at) VALUES (19, 'Pendentif photo gravée 60', 'SKU-19', 'Magnifique pendentif photo gravée 60 pour compléter votre tenue. Un choix parfait pour toutes les occasions, alliant élégance et finesse.', 'Plaqué Or', 'Doré', '45cm + 5cm extension', 'Éviter l''eau, le parfum et les produits chimiques pour préserver l''éclat.', 'Livraison rapide sous 24h à 48h partout en Algérie.', 'Retours acceptés sous 7 jours après réception.', 1800, 36, 7, '/uploads/category-necklaces.jpg', 0, 1, 0, 0, '2023-02-27 07:18:59');
INSERT INTO products (id, name, sku, description, material, color, dimensions, care_instructions, delivery_info, return_policy, price, stock, category_id, image, is_featured, is_visible, is_archived, sales_count, created_at) VALUES (20, 'Coffret cadeau Saint-Valentin 23', 'SKU-20', 'Magnifique coffret cadeau saint-valentin 23 pour compléter votre tenue. Un choix parfait pour toutes les occasions, alliant élégance et finesse.', 'Acier Inoxydable', 'Or Rose', 'Taille ajustable', 'Éviter l''eau, le parfum et les produits chimiques pour préserver l''éclat.', 'Livraison rapide sous 24h à 48h partout en Algérie.', 'Retours acceptés sous 7 jours après réception.', 7500, 19, 5, '/uploads/category-bracelets.jpg', 0, 1, 0, 0, '2024-04-06 18:09:47');
INSERT INTO products (id, name, sku, description, material, color, dimensions, care_instructions, delivery_info, return_policy, price, stock, category_id, image, is_featured, is_visible, is_archived, sales_count, created_at) VALUES (21, 'Coffret bijoux en argent 40', 'SKU-21', 'Magnifique coffret bijoux en argent 40 pour compléter votre tenue. Un choix parfait pour toutes les occasions, alliant élégance et finesse.', 'Plaqué Or', 'Argenté', '45cm + 5cm extension', 'Éviter l''eau, le parfum et les produits chimiques pour préserver l''éclat.', 'Livraison rapide sous 24h à 48h partout en Algérie.', 'Retours acceptés sous 7 jours après réception.', 4800, 45, 5, '/uploads/category-bracelets.jpg', 0, 1, 0, 0, '2023-03-19 10:20:37');
INSERT INTO products (id, name, sku, description, material, color, dimensions, care_instructions, delivery_info, return_policy, price, stock, category_id, image, is_featured, is_visible, is_archived, sales_count, created_at) VALUES (22, 'Boucles d''oreilles créoles 47', 'SKU-22', 'Magnifique boucles d''oreilles créoles 47 pour compléter votre tenue. Un choix parfait pour toutes les occasions, alliant élégance et finesse.', 'Acier Inoxydable', 'Doré', '45cm + 5cm extension', 'Éviter l''eau, le parfum et les produits chimiques pour préserver l''éclat.', 'Livraison rapide sous 24h à 48h partout en Algérie.', 'Retours acceptés sous 7 jours après réception.', 4200, 10, 4, '/uploads/category-earrings.jpg', 0, 1, 0, 0, '2023-02-04 21:34:53');
INSERT INTO products (id, name, sku, description, material, color, dimensions, care_instructions, delivery_info, return_policy, price, stock, category_id, image, is_featured, is_visible, is_archived, sales_count, created_at) VALUES (23, 'Créoles torsadées 98', 'SKU-23', 'Magnifique créoles torsadées 98 pour compléter votre tenue. Un choix parfait pour toutes les occasions, alliant élégance et finesse.', 'Plaqué Or', 'Or Rose', '45cm + 5cm extension', 'Éviter l''eau, le parfum et les produits chimiques pour préserver l''éclat.', 'Livraison rapide sous 24h à 48h partout en Algérie.', 'Retours acceptés sous 7 jours après réception.', 9000, 42, 4, '/uploads/category-earrings.jpg', 0, 1, 0, 0, '2024-01-29 13:32:48');
INSERT INTO products (id, name, sku, description, material, color, dimensions, care_instructions, delivery_info, return_policy, price, stock, category_id, image, is_featured, is_visible, is_archived, sales_count, created_at) VALUES (24, 'Bijou fantaisie chic 33', 'SKU-24', 'Magnifique bijou fantaisie chic 33 pour compléter votre tenue. Un choix parfait pour toutes les occasions, alliant élégance et finesse.', 'Acier Inoxydable', 'Argenté', 'Taille ajustable', 'Éviter l''eau, le parfum et les produits chimiques pour préserver l''éclat.', 'Livraison rapide sous 24h à 48h partout en Algérie.', 'Retours acceptés sous 7 jours après réception.', 2200, 17, 6, '/uploads/category-earrings.jpg', 0, 1, 0, 0, '2023-09-04 11:05:37');
INSERT INTO products (id, name, sku, description, material, color, dimensions, care_instructions, delivery_info, return_policy, price, stock, category_id, image, is_featured, is_visible, is_archived, sales_count, created_at) VALUES (25, 'Bracelet charm''s cœur 45', 'SKU-25', 'Magnifique bracelet charm''s cœur 45 pour compléter votre tenue. Un choix parfait pour toutes les occasions, alliant élégance et finesse.', 'Plaqué Or', 'Doré', '45cm + 5cm extension', 'Éviter l''eau, le parfum et les produits chimiques pour préserver l''éclat.', 'Livraison rapide sous 24h à 48h partout en Algérie.', 'Retours acceptés sous 7 jours après réception.', 3500, 40, 2, '/uploads/category-bracelets.jpg', 0, 1, 0, 0, '2023-08-08 04:39:50');
INSERT INTO products (id, name, sku, description, material, color, dimensions, care_instructions, delivery_info, return_policy, price, stock, category_id, image, is_featured, is_visible, is_archived, sales_count, created_at) VALUES (26, 'Porte-clés bijou de sac 45', 'SKU-26', 'Magnifique porte-clés bijou de sac 45 pour compléter votre tenue. Un choix parfait pour toutes les occasions, alliant élégance et finesse.', 'Acier Inoxydable', 'Or Rose', '45cm + 5cm extension', 'Éviter l''eau, le parfum et les produits chimiques pour préserver l''éclat.', 'Livraison rapide sous 24h à 48h partout en Algérie.', 'Retours acceptés sous 7 jours après réception.', 9000, 7, 6, '/uploads/category-rings.jpg', 0, 1, 0, 0, '2023-07-14 22:14:28');
INSERT INTO products (id, name, sku, description, material, color, dimensions, care_instructions, delivery_info, return_policy, price, stock, category_id, image, is_featured, is_visible, is_archived, sales_count, created_at) VALUES (27, 'Collier tendance été 42', 'SKU-27', 'Magnifique collier tendance été 42 pour compléter votre tenue. Un choix parfait pour toutes les occasions, alliant élégance et finesse.', 'Plaqué Or', 'Argenté', '45cm + 5cm extension', 'Éviter l''eau, le parfum et les produits chimiques pour préserver l''éclat.', 'Livraison rapide sous 24h à 48h partout en Algérie.', 'Retours acceptés sous 7 jours après réception.', 3200, 30, 3, '/uploads/category-earrings.jpg', 0, 1, 0, 0, '2024-03-10 08:23:49');
INSERT INTO products (id, name, sku, description, material, color, dimensions, care_instructions, delivery_info, return_policy, price, stock, category_id, image, is_featured, is_visible, is_archived, sales_count, created_at) VALUES (28, 'Barrette perles 81', 'SKU-28', 'Magnifique barrette perles 81 pour compléter votre tenue. Un choix parfait pour toutes les occasions, alliant élégance et finesse.', 'Acier Inoxydable', 'Doré', 'Taille ajustable', 'Éviter l''eau, le parfum et les produits chimiques pour préserver l''éclat.', 'Livraison rapide sous 24h à 48h partout en Algérie.', 'Retours acceptés sous 7 jours après réception.', 7500, 40, 6, '/uploads/category-rings.jpg', 1, 1, 0, 0, '2023-12-30 13:51:01');
INSERT INTO products (id, name, sku, description, material, color, dimensions, care_instructions, delivery_info, return_policy, price, stock, category_id, image, is_featured, is_visible, is_archived, sales_count, created_at) VALUES (29, 'Bague en acier inoxydable dorée 31', 'SKU-29', 'Magnifique bague en acier inoxydable dorée 31 pour compléter votre tenue. Un choix parfait pour toutes les occasions, alliant élégance et finesse.', 'Plaqué Or', 'Or Rose', '45cm + 5cm extension', 'Éviter l''eau, le parfum et les produits chimiques pour préserver l''éclat.', 'Livraison rapide sous 24h à 48h partout en Algérie.', 'Retours acceptés sous 7 jours après réception.', 3200, 43, 1, '/uploads/category-rings.jpg', 0, 1, 0, 0, '2023-02-06 12:05:58');
INSERT INTO products (id, name, sku, description, material, color, dimensions, care_instructions, delivery_info, return_policy, price, stock, category_id, image, is_featured, is_visible, is_archived, sales_count, created_at) VALUES (30, 'Collier goutte d''eau zircon 29', 'SKU-30', 'Magnifique collier goutte d''eau zircon 29 pour compléter votre tenue. Un choix parfait pour toutes les occasions, alliant élégance et finesse.', 'Acier Inoxydable', 'Argenté', '45cm + 5cm extension', 'Éviter l''eau, le parfum et les produits chimiques pour préserver l''éclat.', 'Livraison rapide sous 24h à 48h partout en Algérie.', 'Retours acceptés sous 7 jours après réception.', 3800, 20, 3, '/uploads/category-necklaces.jpg', 0, 1, 0, 0, '2023-09-22 12:58:13');
INSERT INTO products (id, name, sku, description, material, color, dimensions, care_instructions, delivery_info, return_policy, price, stock, category_id, image, is_featured, is_visible, is_archived, sales_count, created_at) VALUES (31, 'Ear cuff sans perçage 39', 'SKU-31', 'Magnifique ear cuff sans perçage 39 pour compléter votre tenue. Un choix parfait pour toutes les occasions, alliant élégance et finesse.', 'Plaqué Or', 'Doré', '45cm + 5cm extension', 'Éviter l''eau, le parfum et les produits chimiques pour préserver l''éclat.', 'Livraison rapide sous 24h à 48h partout en Algérie.', 'Retours acceptés sous 7 jours après réception.', 4500, 41, 4, '/uploads/category-earrings.jpg', 0, 1, 0, 0, '2023-09-09 05:16:05');
INSERT INTO products (id, name, sku, description, material, color, dimensions, care_instructions, delivery_info, return_policy, price, stock, category_id, image, is_featured, is_visible, is_archived, sales_count, created_at) VALUES (32, 'Collier pendentif lune et étoile 54', 'SKU-32', 'Magnifique collier pendentif lune et étoile 54 pour compléter votre tenue. Un choix parfait pour toutes les occasions, alliant élégance et finesse.', 'Acier Inoxydable', 'Or Rose', 'Taille ajustable', 'Éviter l''eau, le parfum et les produits chimiques pour préserver l''éclat.', 'Livraison rapide sous 24h à 48h partout en Algérie.', 'Retours acceptés sous 7 jours après réception.', 3500, 49, 3, '/uploads/category-necklaces.jpg', 0, 1, 0, 0, '2024-06-09 00:47:51');
INSERT INTO products (id, name, sku, description, material, color, dimensions, care_instructions, delivery_info, return_policy, price, stock, category_id, image, is_featured, is_visible, is_archived, sales_count, created_at) VALUES (33, 'Serre-tête bijou 25', 'SKU-33', 'Magnifique serre-tête bijou 25 pour compléter votre tenue. Un choix parfait pour toutes les occasions, alliant élégance et finesse.', 'Plaqué Or', 'Argenté', '45cm + 5cm extension', 'Éviter l''eau, le parfum et les produits chimiques pour préserver l''éclat.', 'Livraison rapide sous 24h à 48h partout en Algérie.', 'Retours acceptés sous 7 jours après réception.', 2800, 47, 6, '/uploads/category-rings.jpg', 0, 1, 0, 0, '2024-01-04 14:57:32');
INSERT INTO products (id, name, sku, description, material, color, dimensions, care_instructions, delivery_info, return_policy, price, stock, category_id, image, is_featured, is_visible, is_archived, sales_count, created_at) VALUES (34, 'Pendentif photo gravée 87', 'SKU-34', 'Magnifique pendentif photo gravée 87 pour compléter votre tenue. Un choix parfait pour toutes les occasions, alliant élégance et finesse.', 'Acier Inoxydable', 'Doré', '45cm + 5cm extension', 'Éviter l''eau, le parfum et les produits chimiques pour préserver l''éclat.', 'Livraison rapide sous 24h à 48h partout en Algérie.', 'Retours acceptés sous 7 jours après réception.', 4500, 50, 7, '/uploads/category-necklaces.jpg', 0, 1, 0, 0, '2023-07-22 08:51:00');
INSERT INTO products (id, name, sku, description, material, color, dimensions, care_instructions, delivery_info, return_policy, price, stock, category_id, image, is_featured, is_visible, is_archived, sales_count, created_at) VALUES (35, 'Collier ras de cou velours 74', 'SKU-35', 'Magnifique collier ras de cou velours 74 pour compléter votre tenue. Un choix parfait pour toutes les occasions, alliant élégance et finesse.', 'Plaqué Or', 'Or Rose', '45cm + 5cm extension', 'Éviter l''eau, le parfum et les produits chimiques pour préserver l''éclat.', 'Livraison rapide sous 24h à 48h partout en Algérie.', 'Retours acceptés sous 7 jours après réception.', 2800, 20, 3, '/uploads/category-necklaces.jpg', 0, 1, 0, 0, '2023-07-05 13:25:11');
INSERT INTO products (id, name, sku, description, material, color, dimensions, care_instructions, delivery_info, return_policy, price, stock, category_id, image, is_featured, is_visible, is_archived, sales_count, created_at) VALUES (36, 'Bracelet chaîne maille fine 25', 'SKU-36', 'Magnifique bracelet chaîne maille fine 25 pour compléter votre tenue. Un choix parfait pour toutes les occasions, alliant élégance et finesse.', 'Acier Inoxydable', 'Argenté', 'Taille ajustable', 'Éviter l''eau, le parfum et les produits chimiques pour préserver l''éclat.', 'Livraison rapide sous 24h à 48h partout en Algérie.', 'Retours acceptés sous 7 jours après réception.', 2500, 16, 2, '/uploads/category-bracelets.jpg', 0, 1, 0, 0, '2023-09-16 13:56:36');
INSERT INTO products (id, name, sku, description, material, color, dimensions, care_instructions, delivery_info, return_policy, price, stock, category_id, image, is_featured, is_visible, is_archived, sales_count, created_at) VALUES (37, 'Bracelet cuir prénom 78', 'SKU-37', 'Magnifique bracelet cuir prénom 78 pour compléter votre tenue. Un choix parfait pour toutes les occasions, alliant élégance et finesse.', 'Plaqué Or', 'Doré', '45cm + 5cm extension', 'Éviter l''eau, le parfum et les produits chimiques pour préserver l''éclat.', 'Livraison rapide sous 24h à 48h partout en Algérie.', 'Retours acceptés sous 7 jours après réception.', 3800, 5, 7, '/uploads/category-necklaces.jpg', 0, 1, 0, 0, '2023-07-23 21:18:10');
INSERT INTO products (id, name, sku, description, material, color, dimensions, care_instructions, delivery_info, return_policy, price, stock, category_id, image, is_featured, is_visible, is_archived, sales_count, created_at) VALUES (38, 'Bague ajustable motif floral 53', 'SKU-38', 'Magnifique bague ajustable motif floral 53 pour compléter votre tenue. Un choix parfait pour toutes les occasions, alliant élégance et finesse.', 'Acier Inoxydable', 'Or Rose', '45cm + 5cm extension', 'Éviter l''eau, le parfum et les produits chimiques pour préserver l''éclat.', 'Livraison rapide sous 24h à 48h partout en Algérie.', 'Retours acceptés sous 7 jours après réception.', 5500, 42, 1, '/uploads/category-rings.jpg', 1, 1, 0, 0, '2024-06-27 21:48:52');
INSERT INTO products (id, name, sku, description, material, color, dimensions, care_instructions, delivery_info, return_policy, price, stock, category_id, image, is_featured, is_visible, is_archived, sales_count, created_at) VALUES (39, 'Boucles d''oreilles modernes 41', 'SKU-39', 'Magnifique boucles d''oreilles modernes 41 pour compléter votre tenue. Un choix parfait pour toutes les occasions, alliant élégance et finesse.', 'Plaqué Or', 'Argenté', '45cm + 5cm extension', 'Éviter l''eau, le parfum et les produits chimiques pour préserver l''éclat.', 'Livraison rapide sous 24h à 48h partout en Algérie.', 'Retours acceptés sous 7 jours après réception.', 2800, 15, 4, '/uploads/category-earrings.jpg', 0, 1, 0, 0, '2024-02-22 09:35:28');
INSERT INTO products (id, name, sku, description, material, color, dimensions, care_instructions, delivery_info, return_policy, price, stock, category_id, image, is_featured, is_visible, is_archived, sales_count, created_at) VALUES (40, 'Boucles d''oreilles créoles 67', 'SKU-40', 'Magnifique boucles d''oreilles créoles 67 pour compléter votre tenue. Un choix parfait pour toutes les occasions, alliant élégance et finesse.', 'Acier Inoxydable', 'Doré', 'Taille ajustable', 'Éviter l''eau, le parfum et les produits chimiques pour préserver l''éclat.', 'Livraison rapide sous 24h à 48h partout en Algérie.', 'Retours acceptés sous 7 jours après réception.', 9000, 41, 4, '/uploads/category-earrings.jpg', 1, 1, 0, 0, '2023-02-19 23:05:56');
INSERT INTO products (id, name, sku, description, material, color, dimensions, care_instructions, delivery_info, return_policy, price, stock, category_id, image, is_featured, is_visible, is_archived, sales_count, created_at) VALUES (41, 'Boucles d''oreilles fleur de lys 39', 'SKU-41', 'Magnifique boucles d''oreilles fleur de lys 39 pour compléter votre tenue. Un choix parfait pour toutes les occasions, alliant élégance et finesse.', 'Plaqué Or', 'Or Rose', '45cm + 5cm extension', 'Éviter l''eau, le parfum et les produits chimiques pour préserver l''éclat.', 'Livraison rapide sous 24h à 48h partout en Algérie.', 'Retours acceptés sous 7 jours après réception.', 4200, 20, 4, '/uploads/category-earrings.jpg', 1, 1, 0, 0, '2024-06-08 21:52:43');
INSERT INTO products (id, name, sku, description, material, color, dimensions, care_instructions, delivery_info, return_policy, price, stock, category_id, image, is_featured, is_visible, is_archived, sales_count, created_at) VALUES (42, 'Broche élégante vintage 88', 'SKU-42', 'Magnifique broche élégante vintage 88 pour compléter votre tenue. Un choix parfait pour toutes les occasions, alliant élégance et finesse.', 'Acier Inoxydable', 'Argenté', '45cm + 5cm extension', 'Éviter l''eau, le parfum et les produits chimiques pour préserver l''éclat.', 'Livraison rapide sous 24h à 48h partout en Algérie.', 'Retours acceptés sous 7 jours après réception.', 7500, 34, 6, '/uploads/category-rings.jpg', 1, 1, 0, 0, '2023-10-31 14:29:13');
INSERT INTO products (id, name, sku, description, material, color, dimensions, care_instructions, delivery_info, return_policy, price, stock, category_id, image, is_featured, is_visible, is_archived, sales_count, created_at) VALUES (43, 'Collier date de naissance 65', 'SKU-43', 'Magnifique collier date de naissance 65 pour compléter votre tenue. Un choix parfait pour toutes les occasions, alliant élégance et finesse.', 'Plaqué Or', 'Doré', '45cm + 5cm extension', 'Éviter l''eau, le parfum et les produits chimiques pour préserver l''éclat.', 'Livraison rapide sous 24h à 48h partout en Algérie.', 'Retours acceptés sous 7 jours après réception.', 4200, 40, 7, '/uploads/category-necklaces.jpg', 0, 1, 0, 0, '2023-03-05 00:23:03');
INSERT INTO products (id, name, sku, description, material, color, dimensions, care_instructions, delivery_info, return_policy, price, stock, category_id, image, is_featured, is_visible, is_archived, sales_count, created_at) VALUES (44, 'Puces d''oreilles discrètes 59', 'SKU-44', 'Magnifique puces d''oreilles discrètes 59 pour compléter votre tenue. Un choix parfait pour toutes les occasions, alliant élégance et finesse.', 'Acier Inoxydable', 'Or Rose', 'Taille ajustable', 'Éviter l''eau, le parfum et les produits chimiques pour préserver l''éclat.', 'Livraison rapide sous 24h à 48h partout en Algérie.', 'Retours acceptés sous 7 jours après réception.', 9000, 6, 4, '/uploads/category-earrings.jpg', 0, 1, 0, 0, '2024-06-14 01:03:48');
INSERT INTO products (id, name, sku, description, material, color, dimensions, care_instructions, delivery_info, return_policy, price, stock, category_id, image, is_featured, is_visible, is_archived, sales_count, created_at) VALUES (45, 'Accessoire pour foulard 23', 'SKU-45', 'Magnifique accessoire pour foulard 23 pour compléter votre tenue. Un choix parfait pour toutes les occasions, alliant élégance et finesse.', 'Plaqué Or', 'Argenté', '45cm + 5cm extension', 'Éviter l''eau, le parfum et les produits chimiques pour préserver l''éclat.', 'Livraison rapide sous 24h à 48h partout en Algérie.', 'Retours acceptés sous 7 jours après réception.', 8000, 39, 6, '/uploads/category-rings.jpg', 0, 1, 0, 0, '2024-06-13 07:41:35');
INSERT INTO products (id, name, sku, description, material, color, dimensions, care_instructions, delivery_info, return_policy, price, stock, category_id, image, is_featured, is_visible, is_archived, sales_count, created_at) VALUES (46, 'Bracelet avec initiale 24', 'SKU-46', 'Magnifique bracelet avec initiale 24 pour compléter votre tenue. Un choix parfait pour toutes les occasions, alliant élégance et finesse.', 'Acier Inoxydable', 'Doré', '45cm + 5cm extension', 'Éviter l''eau, le parfum et les produits chimiques pour préserver l''éclat.', 'Livraison rapide sous 24h à 48h partout en Algérie.', 'Retours acceptés sous 7 jours après réception.', 5500, 29, 2, '/uploads/category-bracelets.jpg', 0, 1, 0, 0, '2024-03-12 15:37:24');
INSERT INTO products (id, name, sku, description, material, color, dimensions, care_instructions, delivery_info, return_policy, price, stock, category_id, image, is_featured, is_visible, is_archived, sales_count, created_at) VALUES (47, 'Collier goutte d''eau zircon 84', 'SKU-47', 'Magnifique collier goutte d''eau zircon 84 pour compléter votre tenue. Un choix parfait pour toutes les occasions, alliant élégance et finesse.', 'Plaqué Or', 'Or Rose', '45cm + 5cm extension', 'Éviter l''eau, le parfum et les produits chimiques pour préserver l''éclat.', 'Livraison rapide sous 24h à 48h partout en Algérie.', 'Retours acceptés sous 7 jours après réception.', 2200, 37, 3, '/uploads/category-necklaces.jpg', 0, 1, 0, 0, '2023-08-14 12:33:23');
INSERT INTO products (id, name, sku, description, material, color, dimensions, care_instructions, delivery_info, return_policy, price, stock, category_id, image, is_featured, is_visible, is_archived, sales_count, created_at) VALUES (48, 'Bracelet cheville coquillage 47', 'SKU-48', 'Magnifique bracelet cheville coquillage 47 pour compléter votre tenue. Un choix parfait pour toutes les occasions, alliant élégance et finesse.', 'Acier Inoxydable', 'Argenté', 'Taille ajustable', 'Éviter l''eau, le parfum et les produits chimiques pour préserver l''éclat.', 'Livraison rapide sous 24h à 48h partout en Algérie.', 'Retours acceptés sous 7 jours après réception.', 2500, 35, 2, '/uploads/category-bracelets.jpg', 0, 1, 0, 0, '2023-04-18 00:35:53');
INSERT INTO products (id, name, sku, description, material, color, dimensions, care_instructions, delivery_info, return_policy, price, stock, category_id, image, is_featured, is_visible, is_archived, sales_count, created_at) VALUES (49, 'Bracelet infini 36', 'SKU-49', 'Magnifique bracelet infini 36 pour compléter votre tenue. Un choix parfait pour toutes les occasions, alliant élégance et finesse.', 'Plaqué Or', 'Doré', '45cm + 5cm extension', 'Éviter l''eau, le parfum et les produits chimiques pour préserver l''éclat.', 'Livraison rapide sous 24h à 48h partout en Algérie.', 'Retours acceptés sous 7 jours après réception.', 6500, 16, 2, '/uploads/category-bracelets.jpg', 0, 1, 0, 0, '2023-07-22 11:37:35');
INSERT INTO products (id, name, sku, description, material, color, dimensions, care_instructions, delivery_info, return_policy, price, stock, category_id, image, is_featured, is_visible, is_archived, sales_count, created_at) VALUES (50, 'Boucles d''oreilles plumes 48', 'SKU-50', 'Magnifique boucles d''oreilles plumes 48 pour compléter votre tenue. Un choix parfait pour toutes les occasions, alliant élégance et finesse.', 'Acier Inoxydable', 'Or Rose', '45cm + 5cm extension', 'Éviter l''eau, le parfum et les produits chimiques pour préserver l''éclat.', 'Livraison rapide sous 24h à 48h partout en Algérie.', 'Retours acceptés sous 7 jours après réception.', 4800, 22, 4, '/uploads/category-earrings.jpg', 1, 1, 0, 0, '2023-05-03 15:03:24');
INSERT INTO products (id, name, sku, description, material, color, dimensions, care_instructions, delivery_info, return_policy, price, stock, category_id, image, is_featured, is_visible, is_archived, sales_count, created_at) VALUES (51, 'Bracelet cuir prénom 95', 'SKU-51', 'Magnifique bracelet cuir prénom 95 pour compléter votre tenue. Un choix parfait pour toutes les occasions, alliant élégance et finesse.', 'Plaqué Or', 'Argenté', '45cm + 5cm extension', 'Éviter l''eau, le parfum et les produits chimiques pour préserver l''éclat.', 'Livraison rapide sous 24h à 48h partout en Algérie.', 'Retours acceptés sous 7 jours après réception.', 1800, 43, 7, '/uploads/category-necklaces.jpg', 1, 1, 0, 0, '2024-06-24 01:35:53');
INSERT INTO products (id, name, sku, description, material, color, dimensions, care_instructions, delivery_info, return_policy, price, stock, category_id, image, is_featured, is_visible, is_archived, sales_count, created_at) VALUES (52, 'Bague fine avec pierre zircon 12', 'SKU-52', 'Magnifique bague fine avec pierre zircon 12 pour compléter votre tenue. Un choix parfait pour toutes les occasions, alliant élégance et finesse.', 'Acier Inoxydable', 'Doré', 'Taille ajustable', 'Éviter l''eau, le parfum et les produits chimiques pour préserver l''éclat.', 'Livraison rapide sous 24h à 48h partout en Algérie.', 'Retours acceptés sous 7 jours après réception.', 4200, 19, 1, '/uploads/category-rings.jpg', 0, 1, 0, 0, '2023-07-04 22:39:18');
INSERT INTO products (id, name, sku, description, material, color, dimensions, care_instructions, delivery_info, return_policy, price, stock, category_id, image, is_featured, is_visible, is_archived, sales_count, created_at) VALUES (53, 'Coffret montre et bracelet 47', 'SKU-53', 'Magnifique coffret montre et bracelet 47 pour compléter votre tenue. Un choix parfait pour toutes les occasions, alliant élégance et finesse.', 'Plaqué Or', 'Or Rose', '45cm + 5cm extension', 'Éviter l''eau, le parfum et les produits chimiques pour préserver l''éclat.', 'Livraison rapide sous 24h à 48h partout en Algérie.', 'Retours acceptés sous 7 jours après réception.', 4800, 8, 5, '/uploads/category-bracelets.jpg', 0, 1, 0, 0, '2023-06-03 04:57:11');
INSERT INTO products (id, name, sku, description, material, color, dimensions, care_instructions, delivery_info, return_policy, price, stock, category_id, image, is_featured, is_visible, is_archived, sales_count, created_at) VALUES (54, 'Chaîne de lunettes dorée 53', 'SKU-54', 'Magnifique chaîne de lunettes dorée 53 pour compléter votre tenue. Un choix parfait pour toutes les occasions, alliant élégance et finesse.', 'Acier Inoxydable', 'Argenté', '45cm + 5cm extension', 'Éviter l''eau, le parfum et les produits chimiques pour préserver l''éclat.', 'Livraison rapide sous 24h à 48h partout en Algérie.', 'Retours acceptés sous 7 jours après réception.', 2200, 19, 6, '/uploads/category-rings.jpg', 0, 1, 0, 0, '2023-11-01 23:01:19');
INSERT INTO products (id, name, sku, description, material, color, dimensions, care_instructions, delivery_info, return_policy, price, stock, category_id, image, is_featured, is_visible, is_archived, sales_count, created_at) VALUES (55, 'Bague large martelée 36', 'SKU-55', 'Magnifique bague large martelée 36 pour compléter votre tenue. Un choix parfait pour toutes les occasions, alliant élégance et finesse.', 'Plaqué Or', 'Doré', '45cm + 5cm extension', 'Éviter l''eau, le parfum et les produits chimiques pour préserver l''éclat.', 'Livraison rapide sous 24h à 48h partout en Algérie.', 'Retours acceptés sous 7 jours après réception.', 5500, 34, 1, '/uploads/category-rings.jpg', 0, 1, 0, 0, '2023-12-02 09:15:43');
INSERT INTO products (id, name, sku, description, material, color, dimensions, care_instructions, delivery_info, return_policy, price, stock, category_id, image, is_featured, is_visible, is_archived, sales_count, created_at) VALUES (56, 'Boucles d''oreilles dormeuses 61', 'SKU-56', 'Magnifique boucles d''oreilles dormeuses 61 pour compléter votre tenue. Un choix parfait pour toutes les occasions, alliant élégance et finesse.', 'Acier Inoxydable', 'Or Rose', 'Taille ajustable', 'Éviter l''eau, le parfum et les produits chimiques pour préserver l''éclat.', 'Livraison rapide sous 24h à 48h partout en Algérie.', 'Retours acceptés sous 7 jours après réception.', 2200, 42, 4, '/uploads/category-earrings.jpg', 0, 1, 0, 0, '2024-06-13 22:00:57');
INSERT INTO products (id, name, sku, description, material, color, dimensions, care_instructions, delivery_info, return_policy, price, stock, category_id, image, is_featured, is_visible, is_archived, sales_count, created_at) VALUES (57, 'Bague solitaire élégante 14', 'SKU-57', 'Magnifique bague solitaire élégante 14 pour compléter votre tenue. Un choix parfait pour toutes les occasions, alliant élégance et finesse.', 'Plaqué Or', 'Argenté', '45cm + 5cm extension', 'Éviter l''eau, le parfum et les produits chimiques pour préserver l''éclat.', 'Livraison rapide sous 24h à 48h partout en Algérie.', 'Retours acceptés sous 7 jours après réception.', 4500, 44, 1, '/uploads/category-rings.jpg', 0, 1, 0, 0, '2023-11-10 04:55:51');
INSERT INTO products (id, name, sku, description, material, color, dimensions, care_instructions, delivery_info, return_policy, price, stock, category_id, image, is_featured, is_visible, is_archived, sales_count, created_at) VALUES (58, 'Boucles d''oreilles perles 93', 'SKU-58', 'Magnifique boucles d''oreilles perles 93 pour compléter votre tenue. Un choix parfait pour toutes les occasions, alliant élégance et finesse.', 'Acier Inoxydable', 'Doré', '45cm + 5cm extension', 'Éviter l''eau, le parfum et les produits chimiques pour préserver l''éclat.', 'Livraison rapide sous 24h à 48h partout en Algérie.', 'Retours acceptés sous 7 jours après réception.', 1500, 42, 4, '/uploads/category-earrings.jpg', 0, 1, 0, 0, '2024-01-22 20:46:23');
INSERT INTO products (id, name, sku, description, material, color, dimensions, care_instructions, delivery_info, return_policy, price, stock, category_id, image, is_featured, is_visible, is_archived, sales_count, created_at) VALUES (59, 'Boucles d''oreilles géométriques 40', 'SKU-59', 'Magnifique boucles d''oreilles géométriques 40 pour compléter votre tenue. Un choix parfait pour toutes les occasions, alliant élégance et finesse.', 'Plaqué Or', 'Or Rose', '45cm + 5cm extension', 'Éviter l''eau, le parfum et les produits chimiques pour préserver l''éclat.', 'Livraison rapide sous 24h à 48h partout en Algérie.', 'Retours acceptés sous 7 jours après réception.', 7500, 12, 4, '/uploads/category-earrings.jpg', 0, 1, 0, 0, '2023-05-16 18:00:15');
INSERT INTO products (id, name, sku, description, material, color, dimensions, care_instructions, delivery_info, return_policy, price, stock, category_id, image, is_featured, is_visible, is_archived, sales_count, created_at) VALUES (60, 'Coffret bijoux en argent 98', 'SKU-60', 'Magnifique coffret bijoux en argent 98 pour compléter votre tenue. Un choix parfait pour toutes les occasions, alliant élégance et finesse.', 'Acier Inoxydable', 'Argenté', 'Taille ajustable', 'Éviter l''eau, le parfum et les produits chimiques pour préserver l''éclat.', 'Livraison rapide sous 24h à 48h partout en Algérie.', 'Retours acceptés sous 7 jours après réception.', 9000, 48, 5, '/uploads/category-bracelets.jpg', 0, 1, 0, 0, '2023-05-07 19:49:45');
INSERT INTO products (id, name, sku, description, material, color, dimensions, care_instructions, delivery_info, return_policy, price, stock, category_id, image, is_featured, is_visible, is_archived, sales_count, created_at) VALUES (61, 'Collier date de naissance 90', 'SKU-61', 'Magnifique collier date de naissance 90 pour compléter votre tenue. Un choix parfait pour toutes les occasions, alliant élégance et finesse.', 'Plaqué Or', 'Doré', '45cm + 5cm extension', 'Éviter l''eau, le parfum et les produits chimiques pour préserver l''éclat.', 'Livraison rapide sous 24h à 48h partout en Algérie.', 'Retours acceptés sous 7 jours après réception.', 6500, 32, 7, '/uploads/category-necklaces.jpg', 0, 1, 0, 0, '2024-01-07 21:14:55');
INSERT INTO products (id, name, sku, description, material, color, dimensions, care_instructions, delivery_info, return_policy, price, stock, category_id, image, is_featured, is_visible, is_archived, sales_count, created_at) VALUES (62, 'Bracelet manchette dorée 48', 'SKU-62', 'Magnifique bracelet manchette dorée 48 pour compléter votre tenue. Un choix parfait pour toutes les occasions, alliant élégance et finesse.', 'Acier Inoxydable', 'Or Rose', '45cm + 5cm extension', 'Éviter l''eau, le parfum et les produits chimiques pour préserver l''éclat.', 'Livraison rapide sous 24h à 48h partout en Algérie.', 'Retours acceptés sous 7 jours après réception.', 4800, 13, 2, '/uploads/category-bracelets.jpg', 0, 1, 0, 0, '2023-02-21 02:43:37');
INSERT INTO products (id, name, sku, description, material, color, dimensions, care_instructions, delivery_info, return_policy, price, stock, category_id, image, is_featured, is_visible, is_archived, sales_count, created_at) VALUES (63, 'Bracelet avec initiale 17', 'SKU-63', 'Magnifique bracelet avec initiale 17 pour compléter votre tenue. Un choix parfait pour toutes les occasions, alliant élégance et finesse.', 'Plaqué Or', 'Argenté', '45cm + 5cm extension', 'Éviter l''eau, le parfum et les produits chimiques pour préserver l''éclat.', 'Livraison rapide sous 24h à 48h partout en Algérie.', 'Retours acceptés sous 7 jours après réception.', 8000, 36, 2, '/uploads/category-bracelets.jpg', 0, 1, 0, 0, '2023-09-27 07:48:35');
INSERT INTO products (id, name, sku, description, material, color, dimensions, care_instructions, delivery_info, return_policy, price, stock, category_id, image, is_featured, is_visible, is_archived, sales_count, created_at) VALUES (64, 'Collier ras de cou velours 60', 'SKU-64', 'Magnifique collier ras de cou velours 60 pour compléter votre tenue. Un choix parfait pour toutes les occasions, alliant élégance et finesse.', 'Acier Inoxydable', 'Doré', 'Taille ajustable', 'Éviter l''eau, le parfum et les produits chimiques pour préserver l''éclat.', 'Livraison rapide sous 24h à 48h partout en Algérie.', 'Retours acceptés sous 7 jours après réception.', 6500, 25, 3, '/uploads/category-necklaces.jpg', 0, 1, 0, 0, '2023-03-27 07:59:18');
INSERT INTO products (id, name, sku, description, material, color, dimensions, care_instructions, delivery_info, return_policy, price, stock, category_id, image, is_featured, is_visible, is_archived, sales_count, created_at) VALUES (65, 'Boucles d''oreilles modernes 78', 'SKU-65', 'Magnifique boucles d''oreilles modernes 78 pour compléter votre tenue. Un choix parfait pour toutes les occasions, alliant élégance et finesse.', 'Plaqué Or', 'Or Rose', '45cm + 5cm extension', 'Éviter l''eau, le parfum et les produits chimiques pour préserver l''éclat.', 'Livraison rapide sous 24h à 48h partout en Algérie.', 'Retours acceptés sous 7 jours après réception.', 4500, 30, 4, '/uploads/category-earrings.jpg', 0, 1, 0, 0, '2024-02-09 17:53:00');
INSERT INTO products (id, name, sku, description, material, color, dimensions, care_instructions, delivery_info, return_policy, price, stock, category_id, image, is_featured, is_visible, is_archived, sales_count, created_at) VALUES (66, 'Boucles d''oreilles perles 20', 'SKU-66', 'Magnifique boucles d''oreilles perles 20 pour compléter votre tenue. Un choix parfait pour toutes les occasions, alliant élégance et finesse.', 'Acier Inoxydable', 'Argenté', '45cm + 5cm extension', 'Éviter l''eau, le parfum et les produits chimiques pour préserver l''éclat.', 'Livraison rapide sous 24h à 48h partout en Algérie.', 'Retours acceptés sous 7 jours après réception.', 4500, 21, 4, '/uploads/category-earrings.jpg', 0, 1, 0, 0, '2023-09-06 20:02:14');
INSERT INTO products (id, name, sku, description, material, color, dimensions, care_instructions, delivery_info, return_policy, price, stock, category_id, image, is_featured, is_visible, is_archived, sales_count, created_at) VALUES (67, 'Bracelet charm''s cœur 96', 'SKU-67', 'Magnifique bracelet charm''s cœur 96 pour compléter votre tenue. Un choix parfait pour toutes les occasions, alliant élégance et finesse.', 'Plaqué Or', 'Doré', '45cm + 5cm extension', 'Éviter l''eau, le parfum et les produits chimiques pour préserver l''éclat.', 'Livraison rapide sous 24h à 48h partout en Algérie.', 'Retours acceptés sous 7 jours après réception.', 9000, 37, 2, '/uploads/category-bracelets.jpg', 0, 1, 0, 0, '2023-04-28 21:50:44');
INSERT INTO products (id, name, sku, description, material, color, dimensions, care_instructions, delivery_info, return_policy, price, stock, category_id, image, is_featured, is_visible, is_archived, sales_count, created_at) VALUES (68, 'Coffret parure mariage 25', 'SKU-68', 'Magnifique coffret parure mariage 25 pour compléter votre tenue. Un choix parfait pour toutes les occasions, alliant élégance et finesse.', 'Acier Inoxydable', 'Or Rose', 'Taille ajustable', 'Éviter l''eau, le parfum et les produits chimiques pour préserver l''éclat.', 'Livraison rapide sous 24h à 48h partout en Algérie.', 'Retours acceptés sous 7 jours après réception.', 4800, 12, 5, '/uploads/category-bracelets.jpg', 0, 1, 0, 0, '2023-05-04 22:47:18');
INSERT INTO products (id, name, sku, description, material, color, dimensions, care_instructions, delivery_info, return_policy, price, stock, category_id, image, is_featured, is_visible, is_archived, sales_count, created_at) VALUES (69, 'Bracelet cordon prénom 97', 'SKU-69', 'Magnifique bracelet cordon prénom 97 pour compléter votre tenue. Un choix parfait pour toutes les occasions, alliant élégance et finesse.', 'Plaqué Or', 'Argenté', '45cm + 5cm extension', 'Éviter l''eau, le parfum et les produits chimiques pour préserver l''éclat.', 'Livraison rapide sous 24h à 48h partout en Algérie.', 'Retours acceptés sous 7 jours après réception.', 3800, 50, 7, '/uploads/category-necklaces.jpg', 1, 1, 0, 0, '2023-02-22 23:35:35');
INSERT INTO products (id, name, sku, description, material, color, dimensions, care_instructions, delivery_info, return_policy, price, stock, category_id, image, is_featured, is_visible, is_archived, sales_count, created_at) VALUES (70, 'Coffret trio bagues 69', 'SKU-70', 'Magnifique coffret trio bagues 69 pour compléter votre tenue. Un choix parfait pour toutes les occasions, alliant élégance et finesse.', 'Acier Inoxydable', 'Doré', '45cm + 5cm extension', 'Éviter l''eau, le parfum et les produits chimiques pour préserver l''éclat.', 'Livraison rapide sous 24h à 48h partout en Algérie.', 'Retours acceptés sous 7 jours après réception.', 3500, 20, 5, '/uploads/category-bracelets.jpg', 0, 1, 0, 0, '2023-04-07 12:48:14');
INSERT INTO products (id, name, sku, description, material, color, dimensions, care_instructions, delivery_info, return_policy, price, stock, category_id, image, is_featured, is_visible, is_archived, sales_count, created_at) VALUES (71, 'Coffret parure mariage 74', 'SKU-71', 'Magnifique coffret parure mariage 74 pour compléter votre tenue. Un choix parfait pour toutes les occasions, alliant élégance et finesse.', 'Plaqué Or', 'Or Rose', '45cm + 5cm extension', 'Éviter l''eau, le parfum et les produits chimiques pour préserver l''éclat.', 'Livraison rapide sous 24h à 48h partout en Algérie.', 'Retours acceptés sous 7 jours après réception.', 9000, 31, 5, '/uploads/category-bracelets.jpg', 0, 1, 0, 0, '2024-05-08 13:57:21');
INSERT INTO products (id, name, sku, description, material, color, dimensions, care_instructions, delivery_info, return_policy, price, stock, category_id, image, is_featured, is_visible, is_archived, sales_count, created_at) VALUES (72, 'Bracelet cuir prénom 98', 'SKU-72', 'Magnifique bracelet cuir prénom 98 pour compléter votre tenue. Un choix parfait pour toutes les occasions, alliant élégance et finesse.', 'Acier Inoxydable', 'Argenté', 'Taille ajustable', 'Éviter l''eau, le parfum et les produits chimiques pour préserver l''éclat.', 'Livraison rapide sous 24h à 48h partout en Algérie.', 'Retours acceptés sous 7 jours après réception.', 3500, 43, 7, '/uploads/category-necklaces.jpg', 0, 1, 0, 0, '2024-04-20 17:32:32');
INSERT INTO products (id, name, sku, description, material, color, dimensions, care_instructions, delivery_info, return_policy, price, stock, category_id, image, is_featured, is_visible, is_archived, sales_count, created_at) VALUES (73, 'Collier papillon délicat 82', 'SKU-73', 'Magnifique collier papillon délicat 82 pour compléter votre tenue. Un choix parfait pour toutes les occasions, alliant élégance et finesse.', 'Plaqué Or', 'Doré', '45cm + 5cm extension', 'Éviter l''eau, le parfum et les produits chimiques pour préserver l''éclat.', 'Livraison rapide sous 24h à 48h partout en Algérie.', 'Retours acceptés sous 7 jours après réception.', 4800, 45, 3, '/uploads/category-necklaces.jpg', 0, 1, 0, 0, '2024-06-13 05:45:06');
INSERT INTO products (id, name, sku, description, material, color, dimensions, care_instructions, delivery_info, return_policy, price, stock, category_id, image, is_featured, is_visible, is_archived, sales_count, created_at) VALUES (74, 'Collier date de naissance 75', 'SKU-74', 'Magnifique collier date de naissance 75 pour compléter votre tenue. Un choix parfait pour toutes les occasions, alliant élégance et finesse.', 'Acier Inoxydable', 'Or Rose', '45cm + 5cm extension', 'Éviter l''eau, le parfum et les produits chimiques pour préserver l''éclat.', 'Livraison rapide sous 24h à 48h partout en Algérie.', 'Retours acceptés sous 7 jours après réception.', 4200, 34, 7, '/uploads/category-necklaces.jpg', 0, 1, 0, 0, '2023-01-18 12:58:06');
INSERT INTO products (id, name, sku, description, material, color, dimensions, care_instructions, delivery_info, return_policy, price, stock, category_id, image, is_featured, is_visible, is_archived, sales_count, created_at) VALUES (75, 'Collier perles nacrées 17', 'SKU-75', 'Magnifique collier perles nacrées 17 pour compléter votre tenue. Un choix parfait pour toutes les occasions, alliant élégance et finesse.', 'Plaqué Or', 'Argenté', '45cm + 5cm extension', 'Éviter l''eau, le parfum et les produits chimiques pour préserver l''éclat.', 'Livraison rapide sous 24h à 48h partout en Algérie.', 'Retours acceptés sous 7 jours après réception.', 3800, 50, 3, '/uploads/category-necklaces.jpg', 0, 1, 0, 0, '2023-07-23 18:51:27');
INSERT INTO products (id, name, sku, description, material, color, dimensions, care_instructions, delivery_info, return_policy, price, stock, category_id, image, is_featured, is_visible, is_archived, sales_count, created_at) VALUES (76, 'Coffret collier et boucles 86', 'SKU-76', 'Magnifique coffret collier et boucles 86 pour compléter votre tenue. Un choix parfait pour toutes les occasions, alliant élégance et finesse.', 'Acier Inoxydable', 'Doré', 'Taille ajustable', 'Éviter l''eau, le parfum et les produits chimiques pour préserver l''éclat.', 'Livraison rapide sous 24h à 48h partout en Algérie.', 'Retours acceptés sous 7 jours après réception.', 4200, 17, 5, '/uploads/category-bracelets.jpg', 0, 1, 0, 0, '2023-08-04 14:45:13');
INSERT INTO products (id, name, sku, description, material, color, dimensions, care_instructions, delivery_info, return_policy, price, stock, category_id, image, is_featured, is_visible, is_archived, sales_count, created_at) VALUES (77, 'Boucles d''oreilles asymétriques 27', 'SKU-77', 'Magnifique boucles d''oreilles asymétriques 27 pour compléter votre tenue. Un choix parfait pour toutes les occasions, alliant élégance et finesse.', 'Plaqué Or', 'Or Rose', '45cm + 5cm extension', 'Éviter l''eau, le parfum et les produits chimiques pour préserver l''éclat.', 'Livraison rapide sous 24h à 48h partout en Algérie.', 'Retours acceptés sous 7 jours après réception.', 8000, 39, 4, '/uploads/category-earrings.jpg', 0, 1, 0, 0, '2023-05-16 01:44:19');
INSERT INTO products (id, name, sku, description, material, color, dimensions, care_instructions, delivery_info, return_policy, price, stock, category_id, image, is_featured, is_visible, is_archived, sales_count, created_at) VALUES (78, 'Bracelet cuir prénom 21', 'SKU-78', 'Magnifique bracelet cuir prénom 21 pour compléter votre tenue. Un choix parfait pour toutes les occasions, alliant élégance et finesse.', 'Acier Inoxydable', 'Argenté', '45cm + 5cm extension', 'Éviter l''eau, le parfum et les produits chimiques pour préserver l''éclat.', 'Livraison rapide sous 24h à 48h partout en Algérie.', 'Retours acceptés sous 7 jours après réception.', 2500, 13, 7, '/uploads/category-necklaces.jpg', 0, 1, 0, 0, '2023-02-23 09:15:19');
INSERT INTO products (id, name, sku, description, material, color, dimensions, care_instructions, delivery_info, return_policy, price, stock, category_id, image, is_featured, is_visible, is_archived, sales_count, created_at) VALUES (79, 'Bracelet charm''s cœur 35', 'SKU-79', 'Magnifique bracelet charm''s cœur 35 pour compléter votre tenue. Un choix parfait pour toutes les occasions, alliant élégance et finesse.', 'Plaqué Or', 'Doré', '45cm + 5cm extension', 'Éviter l''eau, le parfum et les produits chimiques pour préserver l''éclat.', 'Livraison rapide sous 24h à 48h partout en Algérie.', 'Retours acceptés sous 7 jours après réception.', 4800, 36, 2, '/uploads/category-bracelets.jpg', 0, 1, 0, 0, '2023-09-08 14:38:34');
INSERT INTO products (id, name, sku, description, material, color, dimensions, care_instructions, delivery_info, return_policy, price, stock, category_id, image, is_featured, is_visible, is_archived, sales_count, created_at) VALUES (80, 'Collier date de naissance 83', 'SKU-80', 'Magnifique collier date de naissance 83 pour compléter votre tenue. Un choix parfait pour toutes les occasions, alliant élégance et finesse.', 'Acier Inoxydable', 'Or Rose', 'Taille ajustable', 'Éviter l''eau, le parfum et les produits chimiques pour préserver l''éclat.', 'Livraison rapide sous 24h à 48h partout en Algérie.', 'Retours acceptés sous 7 jours après réception.', 4500, 40, 7, '/uploads/category-necklaces.jpg', 0, 1, 0, 0, '2023-11-10 14:34:37');
INSERT INTO products (id, name, sku, description, material, color, dimensions, care_instructions, delivery_info, return_policy, price, stock, category_id, image, is_featured, is_visible, is_archived, sales_count, created_at) VALUES (81, 'Bague solitaire élégante 30', 'SKU-81', 'Magnifique bague solitaire élégante 30 pour compléter votre tenue. Un choix parfait pour toutes les occasions, alliant élégance et finesse.', 'Plaqué Or', 'Argenté', '45cm + 5cm extension', 'Éviter l''eau, le parfum et les produits chimiques pour préserver l''éclat.', 'Livraison rapide sous 24h à 48h partout en Algérie.', 'Retours acceptés sous 7 jours après réception.', 1500, 22, 1, '/uploads/category-rings.jpg', 0, 1, 0, 0, '2023-06-21 20:38:24');
INSERT INTO products (id, name, sku, description, material, color, dimensions, care_instructions, delivery_info, return_policy, price, stock, category_id, image, is_featured, is_visible, is_archived, sales_count, created_at) VALUES (82, 'Collier prénom arabe 84', 'SKU-82', 'Magnifique collier prénom arabe 84 pour compléter votre tenue. Un choix parfait pour toutes les occasions, alliant élégance et finesse.', 'Acier Inoxydable', 'Doré', '45cm + 5cm extension', 'Éviter l''eau, le parfum et les produits chimiques pour préserver l''éclat.', 'Livraison rapide sous 24h à 48h partout en Algérie.', 'Retours acceptés sous 7 jours après réception.', 8000, 42, 7, '/uploads/category-necklaces.jpg', 0, 1, 0, 0, '2023-09-28 20:36:23');
INSERT INTO products (id, name, sku, description, material, color, dimensions, care_instructions, delivery_info, return_policy, price, stock, category_id, image, is_featured, is_visible, is_archived, sales_count, created_at) VALUES (83, 'Épingle à cheveux fleur 29', 'SKU-83', 'Magnifique épingle à cheveux fleur 29 pour compléter votre tenue. Un choix parfait pour toutes les occasions, alliant élégance et finesse.', 'Plaqué Or', 'Or Rose', '45cm + 5cm extension', 'Éviter l''eau, le parfum et les produits chimiques pour préserver l''éclat.', 'Livraison rapide sous 24h à 48h partout en Algérie.', 'Retours acceptés sous 7 jours après réception.', 8000, 33, 6, '/uploads/category-rings.jpg', 0, 1, 0, 0, '2023-10-01 08:18:13');
INSERT INTO products (id, name, sku, description, material, color, dimensions, care_instructions, delivery_info, return_policy, price, stock, category_id, image, is_featured, is_visible, is_archived, sales_count, created_at) VALUES (84, 'Boucles d''oreilles plumes 79', 'SKU-84', 'Magnifique boucles d''oreilles plumes 79 pour compléter votre tenue. Un choix parfait pour toutes les occasions, alliant élégance et finesse.', 'Acier Inoxydable', 'Argenté', 'Taille ajustable', 'Éviter l''eau, le parfum et les produits chimiques pour préserver l''éclat.', 'Livraison rapide sous 24h à 48h partout en Algérie.', 'Retours acceptés sous 7 jours après réception.', 7500, 43, 4, '/uploads/category-earrings.jpg', 0, 1, 0, 0, '2023-09-04 00:22:58');
INSERT INTO products (id, name, sku, description, material, color, dimensions, care_instructions, delivery_info, return_policy, price, stock, category_id, image, is_featured, is_visible, is_archived, sales_count, created_at) VALUES (85, 'Bracelet cordon prénom 52', 'SKU-85', 'Magnifique bracelet cordon prénom 52 pour compléter votre tenue. Un choix parfait pour toutes les occasions, alliant élégance et finesse.', 'Plaqué Or', 'Doré', '45cm + 5cm extension', 'Éviter l''eau, le parfum et les produits chimiques pour préserver l''éclat.', 'Livraison rapide sous 24h à 48h partout en Algérie.', 'Retours acceptés sous 7 jours après réception.', 2500, 30, 7, '/uploads/category-necklaces.jpg', 0, 1, 0, 0, '2024-03-16 01:41:30');
INSERT INTO products (id, name, sku, description, material, color, dimensions, care_instructions, delivery_info, return_policy, price, stock, category_id, image, is_featured, is_visible, is_archived, sales_count, created_at) VALUES (86, 'Bracelet jonc ouvert 45', 'SKU-86', 'Magnifique bracelet jonc ouvert 45 pour compléter votre tenue. Un choix parfait pour toutes les occasions, alliant élégance et finesse.', 'Acier Inoxydable', 'Or Rose', '45cm + 5cm extension', 'Éviter l''eau, le parfum et les produits chimiques pour préserver l''éclat.', 'Livraison rapide sous 24h à 48h partout en Algérie.', 'Retours acceptés sous 7 jours après réception.', 7500, 26, 2, '/uploads/category-bracelets.jpg', 0, 1, 0, 0, '2024-05-14 17:42:14');
INSERT INTO products (id, name, sku, description, material, color, dimensions, care_instructions, delivery_info, return_policy, price, stock, category_id, image, is_featured, is_visible, is_archived, sales_count, created_at) VALUES (87, 'Boucles d''oreilles dormeuses 52', 'SKU-87', 'Magnifique boucles d''oreilles dormeuses 52 pour compléter votre tenue. Un choix parfait pour toutes les occasions, alliant élégance et finesse.', 'Plaqué Or', 'Argenté', '45cm + 5cm extension', 'Éviter l''eau, le parfum et les produits chimiques pour préserver l''éclat.', 'Livraison rapide sous 24h à 48h partout en Algérie.', 'Retours acceptés sous 7 jours après réception.', 7500, 26, 4, '/uploads/category-earrings.jpg', 0, 1, 0, 0, '2023-11-07 12:08:39');
INSERT INTO products (id, name, sku, description, material, color, dimensions, care_instructions, delivery_info, return_policy, price, stock, category_id, image, is_featured, is_visible, is_archived, sales_count, created_at) VALUES (88, 'Bague minimaliste en argent 59', 'SKU-88', 'Magnifique bague minimaliste en argent 59 pour compléter votre tenue. Un choix parfait pour toutes les occasions, alliant élégance et finesse.', 'Acier Inoxydable', 'Doré', 'Taille ajustable', 'Éviter l''eau, le parfum et les produits chimiques pour préserver l''éclat.', 'Livraison rapide sous 24h à 48h partout en Algérie.', 'Retours acceptés sous 7 jours après réception.', 8000, 9, 1, '/uploads/category-rings.jpg', 0, 1, 0, 0, '2024-01-31 19:07:12');
INSERT INTO products (id, name, sku, description, material, color, dimensions, care_instructions, delivery_info, return_policy, price, stock, category_id, image, is_featured, is_visible, is_archived, sales_count, created_at) VALUES (89, 'Bague large martelée 14', 'SKU-89', 'Magnifique bague large martelée 14 pour compléter votre tenue. Un choix parfait pour toutes les occasions, alliant élégance et finesse.', 'Plaqué Or', 'Or Rose', '45cm + 5cm extension', 'Éviter l''eau, le parfum et les produits chimiques pour préserver l''éclat.', 'Livraison rapide sous 24h à 48h partout en Algérie.', 'Retours acceptés sous 7 jours après réception.', 1800, 27, 1, '/uploads/category-rings.jpg', 0, 1, 0, 0, '2023-09-22 11:17:15');
INSERT INTO products (id, name, sku, description, material, color, dimensions, care_instructions, delivery_info, return_policy, price, stock, category_id, image, is_featured, is_visible, is_archived, sales_count, created_at) VALUES (90, 'Collier date de naissance 82', 'SKU-90', 'Magnifique collier date de naissance 82 pour compléter votre tenue. Un choix parfait pour toutes les occasions, alliant élégance et finesse.', 'Acier Inoxydable', 'Argenté', '45cm + 5cm extension', 'Éviter l''eau, le parfum et les produits chimiques pour préserver l''éclat.', 'Livraison rapide sous 24h à 48h partout en Algérie.', 'Retours acceptés sous 7 jours après réception.', 2200, 17, 7, '/uploads/category-necklaces.jpg', 0, 1, 0, 0, '2023-12-09 02:18:26');
INSERT INTO products (id, name, sku, description, material, color, dimensions, care_instructions, delivery_info, return_policy, price, stock, category_id, image, is_featured, is_visible, is_archived, sales_count, created_at) VALUES (91, 'Parure élégance soir 83', 'SKU-91', 'Magnifique parure élégance soir 83 pour compléter votre tenue. Un choix parfait pour toutes les occasions, alliant élégance et finesse.', 'Plaqué Or', 'Doré', '45cm + 5cm extension', 'Éviter l''eau, le parfum et les produits chimiques pour préserver l''éclat.', 'Livraison rapide sous 24h à 48h partout en Algérie.', 'Retours acceptés sous 7 jours après réception.', 4200, 47, 5, '/uploads/category-earrings.jpg', 0, 1, 0, 0, '2024-02-06 16:41:12');
INSERT INTO products (id, name, sku, description, material, color, dimensions, care_instructions, delivery_info, return_policy, price, stock, category_id, image, is_featured, is_visible, is_archived, sales_count, created_at) VALUES (92, 'Gourmette bébé gravée 92', 'SKU-92', 'Magnifique gourmette bébé gravée 92 pour compléter votre tenue. Un choix parfait pour toutes les occasions, alliant élégance et finesse.', 'Acier Inoxydable', 'Or Rose', 'Taille ajustable', 'Éviter l''eau, le parfum et les produits chimiques pour préserver l''éclat.', 'Livraison rapide sous 24h à 48h partout en Algérie.', 'Retours acceptés sous 7 jours après réception.', 2500, 43, 7, '/uploads/category-necklaces.jpg', 0, 1, 0, 0, '2023-04-15 05:40:49');
INSERT INTO products (id, name, sku, description, material, color, dimensions, care_instructions, delivery_info, return_policy, price, stock, category_id, image, is_featured, is_visible, is_archived, sales_count, created_at) VALUES (93, 'Bague de fiançailles fantaisie 41', 'SKU-93', 'Magnifique bague de fiançailles fantaisie 41 pour compléter votre tenue. Un choix parfait pour toutes les occasions, alliant élégance et finesse.', 'Plaqué Or', 'Argenté', '45cm + 5cm extension', 'Éviter l''eau, le parfum et les produits chimiques pour préserver l''éclat.', 'Livraison rapide sous 24h à 48h partout en Algérie.', 'Retours acceptés sous 7 jours après réception.', 2800, 28, 1, '/uploads/category-rings.jpg', 1, 1, 0, 0, '2024-04-01 10:50:04');
INSERT INTO products (id, name, sku, description, material, color, dimensions, care_instructions, delivery_info, return_policy, price, stock, category_id, image, is_featured, is_visible, is_archived, sales_count, created_at) VALUES (94, 'Barrette perles 94', 'SKU-94', 'Magnifique barrette perles 94 pour compléter votre tenue. Un choix parfait pour toutes les occasions, alliant élégance et finesse.', 'Acier Inoxydable', 'Doré', '45cm + 5cm extension', 'Éviter l''eau, le parfum et les produits chimiques pour préserver l''éclat.', 'Livraison rapide sous 24h à 48h partout en Algérie.', 'Retours acceptés sous 7 jours après réception.', 4500, 31, 6, '/uploads/category-rings.jpg', 0, 1, 0, 0, '2024-06-22 15:51:19');
INSERT INTO products (id, name, sku, description, material, color, dimensions, care_instructions, delivery_info, return_policy, price, stock, category_id, image, is_featured, is_visible, is_archived, sales_count, created_at) VALUES (95, 'Collier ras de cou velours 68', 'SKU-95', 'Magnifique collier ras de cou velours 68 pour compléter votre tenue. Un choix parfait pour toutes les occasions, alliant élégance et finesse.', 'Plaqué Or', 'Or Rose', '45cm + 5cm extension', 'Éviter l''eau, le parfum et les produits chimiques pour préserver l''éclat.', 'Livraison rapide sous 24h à 48h partout en Algérie.', 'Retours acceptés sous 7 jours après réception.', 9000, 21, 3, '/uploads/category-necklaces.jpg', 0, 1, 0, 0, '2024-04-05 20:58:11');
INSERT INTO products (id, name, sku, description, material, color, dimensions, care_instructions, delivery_info, return_policy, price, stock, category_id, image, is_featured, is_visible, is_archived, sales_count, created_at) VALUES (96, 'Bracelet jonc ouvert 37', 'SKU-96', 'Magnifique bracelet jonc ouvert 37 pour compléter votre tenue. Un choix parfait pour toutes les occasions, alliant élégance et finesse.', 'Acier Inoxydable', 'Argenté', 'Taille ajustable', 'Éviter l''eau, le parfum et les produits chimiques pour préserver l''éclat.', 'Livraison rapide sous 24h à 48h partout en Algérie.', 'Retours acceptés sous 7 jours après réception.', 1500, 41, 2, '/uploads/category-bracelets.jpg', 0, 1, 0, 0, '2023-08-17 08:44:54');
INSERT INTO products (id, name, sku, description, material, color, dimensions, care_instructions, delivery_info, return_policy, price, stock, category_id, image, is_featured, is_visible, is_archived, sales_count, created_at) VALUES (97, 'Collier goutte d''eau zircon 89', 'SKU-97', 'Magnifique collier goutte d''eau zircon 89 pour compléter votre tenue. Un choix parfait pour toutes les occasions, alliant élégance et finesse.', 'Plaqué Or', 'Doré', '45cm + 5cm extension', 'Éviter l''eau, le parfum et les produits chimiques pour préserver l''éclat.', 'Livraison rapide sous 24h à 48h partout en Algérie.', 'Retours acceptés sous 7 jours après réception.', 2200, 50, 3, '/uploads/category-necklaces.jpg', 0, 1, 0, 0, '2023-09-13 22:33:08');
INSERT INTO products (id, name, sku, description, material, color, dimensions, care_instructions, delivery_info, return_policy, price, stock, category_id, image, is_featured, is_visible, is_archived, sales_count, created_at) VALUES (98, 'Bague initiale 30', 'SKU-98', 'Magnifique bague initiale 30 pour compléter votre tenue. Un choix parfait pour toutes les occasions, alliant élégance et finesse.', 'Acier Inoxydable', 'Or Rose', '45cm + 5cm extension', 'Éviter l''eau, le parfum et les produits chimiques pour préserver l''éclat.', 'Livraison rapide sous 24h à 48h partout en Algérie.', 'Retours acceptés sous 7 jours après réception.', 8000, 48, 7, '/uploads/category-necklaces.jpg', 0, 1, 0, 0, '2024-03-11 12:02:18');
INSERT INTO products (id, name, sku, description, material, color, dimensions, care_instructions, delivery_info, return_policy, price, stock, category_id, image, is_featured, is_visible, is_archived, sales_count, created_at) VALUES (99, 'Collier prénom arabe 35', 'SKU-99', 'Magnifique collier prénom arabe 35 pour compléter votre tenue. Un choix parfait pour toutes les occasions, alliant élégance et finesse.', 'Plaqué Or', 'Argenté', '45cm + 5cm extension', 'Éviter l''eau, le parfum et les produits chimiques pour préserver l''éclat.', 'Livraison rapide sous 24h à 48h partout en Algérie.', 'Retours acceptés sous 7 jours après réception.', 5500, 10, 7, '/uploads/category-necklaces.jpg', 1, 1, 0, 0, '2023-12-19 09:22:26');
INSERT INTO products (id, name, sku, description, material, color, dimensions, care_instructions, delivery_info, return_policy, price, stock, category_id, image, is_featured, is_visible, is_archived, sales_count, created_at) VALUES (100, 'Bague vintage perle 51', 'SKU-100', 'Magnifique bague vintage perle 51 pour compléter votre tenue. Un choix parfait pour toutes les occasions, alliant élégance et finesse.', 'Acier Inoxydable', 'Doré', 'Taille ajustable', 'Éviter l''eau, le parfum et les produits chimiques pour préserver l''éclat.', 'Livraison rapide sous 24h à 48h partout en Algérie.', 'Retours acceptés sous 7 jours après réception.', 8000, 33, 1, '/uploads/category-rings.jpg', 0, 1, 0, 0, '2023-09-06 17:19:38');

-- Cart Items
INSERT IGNORE INTO cart_items (user_id, product_id, quantity) VALUES (23, 45, 3);
INSERT IGNORE INTO cart_items (user_id, product_id, quantity) VALUES (3, 61, 1);
INSERT IGNORE INTO cart_items (user_id, product_id, quantity) VALUES (37, 90, 3);
INSERT IGNORE INTO cart_items (user_id, product_id, quantity) VALUES (34, 98, 1);
INSERT IGNORE INTO cart_items (user_id, product_id, quantity) VALUES (21, 28, 3);
INSERT IGNORE INTO cart_items (user_id, product_id, quantity) VALUES (37, 82, 2);
INSERT IGNORE INTO cart_items (user_id, product_id, quantity) VALUES (30, 68, 3);
INSERT IGNORE INTO cart_items (user_id, product_id, quantity) VALUES (6, 87, 3);
INSERT IGNORE INTO cart_items (user_id, product_id, quantity) VALUES (25, 38, 3);
INSERT IGNORE INTO cart_items (user_id, product_id, quantity) VALUES (25, 88, 2);
INSERT IGNORE INTO cart_items (user_id, product_id, quantity) VALUES (32, 8, 3);
INSERT IGNORE INTO cart_items (user_id, product_id, quantity) VALUES (28, 22, 3);
INSERT IGNORE INTO cart_items (user_id, product_id, quantity) VALUES (33, 37, 1);
INSERT IGNORE INTO cart_items (user_id, product_id, quantity) VALUES (9, 73, 1);
INSERT IGNORE INTO cart_items (user_id, product_id, quantity) VALUES (20, 87, 2);
INSERT IGNORE INTO cart_items (user_id, product_id, quantity) VALUES (33, 10, 2);
INSERT IGNORE INTO cart_items (user_id, product_id, quantity) VALUES (12, 15, 2);
INSERT IGNORE INTO cart_items (user_id, product_id, quantity) VALUES (17, 56, 2);
INSERT IGNORE INTO cart_items (user_id, product_id, quantity) VALUES (16, 60, 2);
INSERT IGNORE INTO cart_items (user_id, product_id, quantity) VALUES (39, 94, 2);
INSERT IGNORE INTO cart_items (user_id, product_id, quantity) VALUES (35, 44, 1);
INSERT IGNORE INTO cart_items (user_id, product_id, quantity) VALUES (23, 95, 3);
INSERT IGNORE INTO cart_items (user_id, product_id, quantity) VALUES (34, 56, 2);
INSERT IGNORE INTO cart_items (user_id, product_id, quantity) VALUES (17, 8, 2);
INSERT IGNORE INTO cart_items (user_id, product_id, quantity) VALUES (25, 10, 2);
INSERT IGNORE INTO cart_items (user_id, product_id, quantity) VALUES (20, 14, 1);
INSERT IGNORE INTO cart_items (user_id, product_id, quantity) VALUES (38, 76, 1);
INSERT IGNORE INTO cart_items (user_id, product_id, quantity) VALUES (5, 15, 2);
INSERT IGNORE INTO cart_items (user_id, product_id, quantity) VALUES (4, 28, 1);
INSERT IGNORE INTO cart_items (user_id, product_id, quantity) VALUES (16, 53, 3);
INSERT IGNORE INTO cart_items (user_id, product_id, quantity) VALUES (39, 11, 3);
INSERT IGNORE INTO cart_items (user_id, product_id, quantity) VALUES (31, 51, 3);
INSERT IGNORE INTO cart_items (user_id, product_id, quantity) VALUES (19, 2, 2);
INSERT IGNORE INTO cart_items (user_id, product_id, quantity) VALUES (2, 4, 1);
INSERT IGNORE INTO cart_items (user_id, product_id, quantity) VALUES (38, 54, 1);
INSERT IGNORE INTO cart_items (user_id, product_id, quantity) VALUES (30, 42, 1);
INSERT IGNORE INTO cart_items (user_id, product_id, quantity) VALUES (33, 33, 3);
INSERT IGNORE INTO cart_items (user_id, product_id, quantity) VALUES (14, 51, 1);
INSERT IGNORE INTO cart_items (user_id, product_id, quantity) VALUES (40, 89, 2);
INSERT IGNORE INTO cart_items (user_id, product_id, quantity) VALUES (34, 44, 3);
INSERT IGNORE INTO cart_items (user_id, product_id, quantity) VALUES (20, 13, 3);
INSERT IGNORE INTO cart_items (user_id, product_id, quantity) VALUES (31, 24, 3);
INSERT IGNORE INTO cart_items (user_id, product_id, quantity) VALUES (2, 10, 1);
INSERT IGNORE INTO cart_items (user_id, product_id, quantity) VALUES (2, 62, 2);
INSERT IGNORE INTO cart_items (user_id, product_id, quantity) VALUES (15, 1, 3);
INSERT IGNORE INTO cart_items (user_id, product_id, quantity) VALUES (27, 91, 2);
INSERT IGNORE INTO cart_items (user_id, product_id, quantity) VALUES (40, 31, 3);
INSERT IGNORE INTO cart_items (user_id, product_id, quantity) VALUES (14, 33, 1);
INSERT IGNORE INTO cart_items (user_id, product_id, quantity) VALUES (14, 55, 2);
INSERT IGNORE INTO cart_items (user_id, product_id, quantity) VALUES (21, 7, 2);

-- Wishlist Items
INSERT IGNORE INTO wishlist_items (user_id, product_id) VALUES (14, 90);
INSERT IGNORE INTO wishlist_items (user_id, product_id) VALUES (19, 60);
INSERT IGNORE INTO wishlist_items (user_id, product_id) VALUES (4, 72);
INSERT IGNORE INTO wishlist_items (user_id, product_id) VALUES (19, 57);
INSERT IGNORE INTO wishlist_items (user_id, product_id) VALUES (30, 32);
INSERT IGNORE INTO wishlist_items (user_id, product_id) VALUES (10, 61);
INSERT IGNORE INTO wishlist_items (user_id, product_id) VALUES (22, 48);
INSERT IGNORE INTO wishlist_items (user_id, product_id) VALUES (36, 4);
INSERT IGNORE INTO wishlist_items (user_id, product_id) VALUES (40, 54);
INSERT IGNORE INTO wishlist_items (user_id, product_id) VALUES (5, 70);
INSERT IGNORE INTO wishlist_items (user_id, product_id) VALUES (2, 1);
INSERT IGNORE INTO wishlist_items (user_id, product_id) VALUES (30, 10);
INSERT IGNORE INTO wishlist_items (user_id, product_id) VALUES (3, 59);
INSERT IGNORE INTO wishlist_items (user_id, product_id) VALUES (25, 66);
INSERT IGNORE INTO wishlist_items (user_id, product_id) VALUES (12, 46);
INSERT IGNORE INTO wishlist_items (user_id, product_id) VALUES (12, 47);
INSERT IGNORE INTO wishlist_items (user_id, product_id) VALUES (17, 3);
INSERT IGNORE INTO wishlist_items (user_id, product_id) VALUES (9, 9);
INSERT IGNORE INTO wishlist_items (user_id, product_id) VALUES (23, 39);
INSERT IGNORE INTO wishlist_items (user_id, product_id) VALUES (25, 16);
INSERT IGNORE INTO wishlist_items (user_id, product_id) VALUES (8, 30);
INSERT IGNORE INTO wishlist_items (user_id, product_id) VALUES (37, 17);
INSERT IGNORE INTO wishlist_items (user_id, product_id) VALUES (32, 63);
INSERT IGNORE INTO wishlist_items (user_id, product_id) VALUES (37, 100);
INSERT IGNORE INTO wishlist_items (user_id, product_id) VALUES (29, 71);
INSERT IGNORE INTO wishlist_items (user_id, product_id) VALUES (17, 33);
INSERT IGNORE INTO wishlist_items (user_id, product_id) VALUES (40, 76);
INSERT IGNORE INTO wishlist_items (user_id, product_id) VALUES (22, 62);
INSERT IGNORE INTO wishlist_items (user_id, product_id) VALUES (23, 31);
INSERT IGNORE INTO wishlist_items (user_id, product_id) VALUES (7, 11);
INSERT IGNORE INTO wishlist_items (user_id, product_id) VALUES (24, 90);
INSERT IGNORE INTO wishlist_items (user_id, product_id) VALUES (22, 86);
INSERT IGNORE INTO wishlist_items (user_id, product_id) VALUES (7, 55);
INSERT IGNORE INTO wishlist_items (user_id, product_id) VALUES (4, 11);
INSERT IGNORE INTO wishlist_items (user_id, product_id) VALUES (30, 93);
INSERT IGNORE INTO wishlist_items (user_id, product_id) VALUES (22, 2);
INSERT IGNORE INTO wishlist_items (user_id, product_id) VALUES (36, 66);
INSERT IGNORE INTO wishlist_items (user_id, product_id) VALUES (34, 46);
INSERT IGNORE INTO wishlist_items (user_id, product_id) VALUES (28, 60);
INSERT IGNORE INTO wishlist_items (user_id, product_id) VALUES (14, 42);
INSERT IGNORE INTO wishlist_items (user_id, product_id) VALUES (41, 35);
INSERT IGNORE INTO wishlist_items (user_id, product_id) VALUES (38, 9);
INSERT IGNORE INTO wishlist_items (user_id, product_id) VALUES (15, 65);
INSERT IGNORE INTO wishlist_items (user_id, product_id) VALUES (17, 24);
INSERT IGNORE INTO wishlist_items (user_id, product_id) VALUES (3, 48);
INSERT IGNORE INTO wishlist_items (user_id, product_id) VALUES (29, 83);
INSERT IGNORE INTO wishlist_items (user_id, product_id) VALUES (36, 83);
INSERT IGNORE INTO wishlist_items (user_id, product_id) VALUES (17, 57);
INSERT IGNORE INTO wishlist_items (user_id, product_id) VALUES (16, 84);
INSERT IGNORE INTO wishlist_items (user_id, product_id) VALUES (8, 74);
INSERT IGNORE INTO wishlist_items (user_id, product_id) VALUES (17, 26);
INSERT IGNORE INTO wishlist_items (user_id, product_id) VALUES (34, 84);
INSERT IGNORE INTO wishlist_items (user_id, product_id) VALUES (40, 13);
INSERT IGNORE INTO wishlist_items (user_id, product_id) VALUES (2, 61);
INSERT IGNORE INTO wishlist_items (user_id, product_id) VALUES (11, 30);
INSERT IGNORE INTO wishlist_items (user_id, product_id) VALUES (31, 40);
INSERT IGNORE INTO wishlist_items (user_id, product_id) VALUES (32, 13);
INSERT IGNORE INTO wishlist_items (user_id, product_id) VALUES (29, 93);
INSERT IGNORE INTO wishlist_items (user_id, product_id) VALUES (20, 16);
INSERT IGNORE INTO wishlist_items (user_id, product_id) VALUES (13, 20);

-- Orders and Order Items
INSERT INTO orders (id, user_id, total, status, shipping_address, shipping_city, shipping_phone, payment_method, created_at, updated_at) VALUES (1, 17, 46100, 'delivered', 'Rue 33, Cité 157 Logements', 'Bordj Bou Arreridj', '0570812907', 'cash_on_delivery', '2023-03-13 00:05:58', '2023-03-13 00:05:58');
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (1, 7, 3, 7500);
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (1, 57, 2, 4500);
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (1, 10, 2, 4800);
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (1, 5, 2, 2500);

INSERT INTO orders (id, user_id, total, status, shipping_address, shipping_city, shipping_phone, payment_method, created_at, updated_at) VALUES (2, 18, 58400, 'delivered', 'Rue 20, Cité 974 Logements', 'Blida', '0584517262', 'cash_on_delivery', '2024-06-07 19:57:54', '2024-06-07 19:57:54');
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (2, 76, 3, 4200);
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (2, 61, 1, 6500);
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (2, 75, 1, 3800);
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (2, 1, 3, 7500);
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (2, 64, 2, 6500);

INSERT INTO orders (id, user_id, total, status, shipping_address, shipping_city, shipping_phone, payment_method, created_at, updated_at) VALUES (3, 14, 27000, 'confirmed', 'Rue 23, Cité 660 Logements', 'Batna', '0797612308', 'cash_on_delivery', '2023-05-11 20:02:53', '2023-05-11 20:02:53');
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (3, 23, 3, 9000);

INSERT INTO orders (id, user_id, total, status, shipping_address, shipping_city, shipping_phone, payment_method, created_at, updated_at) VALUES (4, 12, 8400, 'delivered', 'Rue 24, Cité 113 Logements', 'Blida', '0545156539', 'cash_on_delivery', '2023-07-23 00:49:43', '2023-07-23 00:49:43');
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (4, 91, 2, 4200);

INSERT INTO orders (id, user_id, total, status, shipping_address, shipping_city, shipping_phone, payment_method, created_at, updated_at) VALUES (5, 32, 19200, 'shipped', 'Rue 22, Cité 491 Logements', 'Batna', '0791500527', 'cash_on_delivery', '2023-08-02 12:29:05', '2023-08-02 12:29:05');
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (5, 21, 2, 4800);
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (5, 79, 2, 4800);

INSERT INTO orders (id, user_id, total, status, shipping_address, shipping_city, shipping_phone, payment_method, created_at, updated_at) VALUES (6, 19, 46100, 'shipped', 'Rue 19, Cité 408 Logements', 'Blida', '0635328296', 'cash_on_delivery', '2024-07-08 12:28:14', '2024-07-08 12:28:14');
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (6, 3, 2, 2800);
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (6, 20, 3, 7500);
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (6, 44, 2, 9000);

INSERT INTO orders (id, user_id, total, status, shipping_address, shipping_city, shipping_phone, payment_method, created_at, updated_at) VALUES (7, 15, 15000, 'cancelled', 'Rue 48, Cité 540 Logements', 'Bordj Bou Arreridj', '0573567137', 'cash_on_delivery', '2023-02-09 14:30:51', '2023-02-09 14:30:51');
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (7, 13, 2, 7500);

INSERT INTO orders (id, user_id, total, status, shipping_address, shipping_city, shipping_phone, payment_method, created_at, updated_at) VALUES (8, 32, 14400, 'pending', 'Rue 8, Cité 316 Logements', 'Annaba', '0720203121', 'cash_on_delivery', '2023-05-17 09:22:00', '2023-05-17 09:22:00');
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (8, 10, 3, 4800);

INSERT INTO orders (id, user_id, total, status, shipping_address, shipping_city, shipping_phone, payment_method, created_at, updated_at) VALUES (9, 29, 25600, 'delivered', 'Rue 24, Cité 635 Logements', 'Annaba', '0555255986', 'cash_on_delivery', '2024-04-22 07:27:02', '2024-04-22 07:27:02');
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (9, 94, 3, 4500);
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (9, 18, 3, 2200);
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (9, 46, 1, 5500);

INSERT INTO orders (id, user_id, total, status, shipping_address, shipping_city, shipping_phone, payment_method, created_at, updated_at) VALUES (10, 14, 67400, 'confirmed', 'Rue 2, Cité 965 Logements', 'Batna', '0745044451', 'cash_on_delivery', '2023-12-24 21:24:12', '2023-12-24 21:24:12');
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (10, 3, 3, 2800);
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (10, 98, 1, 8000);
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (10, 88, 3, 8000);
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (10, 60, 3, 9000);

INSERT INTO orders (id, user_id, total, status, shipping_address, shipping_city, shipping_phone, payment_method, created_at, updated_at) VALUES (11, 16, 1800, 'delivered', 'Rue 12, Cité 432 Logements', 'Tlemcen', '0670565869', 'cash_on_delivery', '2024-01-10 20:54:25', '2024-01-10 20:54:25');
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (11, 51, 1, 1800);

INSERT INTO orders (id, user_id, total, status, shipping_address, shipping_city, shipping_phone, payment_method, created_at, updated_at) VALUES (12, 23, 29400, 'shipped', 'Rue 48, Cité 454 Logements', 'Bordj Bou Arreridj', '0778925481', 'cash_on_delivery', '2023-03-23 00:36:31', '2023-03-23 00:36:31');
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (12, 52, 2, 4200);
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (12, 82, 2, 8000);
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (12, 48, 2, 2500);

INSERT INTO orders (id, user_id, total, status, shipping_address, shipping_city, shipping_phone, payment_method, created_at, updated_at) VALUES (13, 12, 30400, 'delivered', 'Rue 17, Cité 135 Logements', 'Bejaia', '0776745721', 'cash_on_delivery', '2023-08-18 20:47:32', '2023-08-18 20:47:32');
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (13, 36, 1, 2500);
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (13, 92, 3, 2500);
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (13, 77, 2, 8000);
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (13, 24, 2, 2200);

INSERT INTO orders (id, user_id, total, status, shipping_address, shipping_city, shipping_phone, payment_method, created_at, updated_at) VALUES (14, 34, 11800, 'shipped', 'Rue 5, Cité 258 Logements', 'Alger', '0753128780', 'cash_on_delivery', '2023-08-12 22:05:40', '2023-08-12 22:05:40');
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (14, 47, 1, 2200);
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (14, 21, 2, 4800);

INSERT INTO orders (id, user_id, total, status, shipping_address, shipping_city, shipping_phone, payment_method, created_at, updated_at) VALUES (15, 13, 11700, 'shipped', 'Rue 18, Cité 842 Logements', 'Bejaia', '0741724332', 'cash_on_delivery', '2023-08-08 17:28:07', '2023-08-08 17:28:07');
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (15, 74, 1, 4200);
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (15, 85, 3, 2500);

INSERT INTO orders (id, user_id, total, status, shipping_address, shipping_city, shipping_phone, payment_method, created_at, updated_at) VALUES (16, 10, 11600, 'delivered', 'Rue 47, Cité 137 Logements', 'Setif', '0698749115', 'cash_on_delivery', '2023-07-05 03:41:06', '2023-07-05 03:41:06');
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (16, 54, 3, 2200);
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (16, 47, 1, 2200);
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (16, 93, 1, 2800);

INSERT INTO orders (id, user_id, total, status, shipping_address, shipping_city, shipping_phone, payment_method, created_at, updated_at) VALUES (17, 5, 22800, 'delivered', 'Rue 1, Cité 541 Logements', 'Annaba', '0777630910', 'cash_on_delivery', '2023-04-21 08:47:08', '2023-04-21 08:47:08');
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (17, 31, 2, 4500);
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (17, 73, 1, 4800);
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (17, 14, 1, 9000);

INSERT INTO orders (id, user_id, total, status, shipping_address, shipping_city, shipping_phone, payment_method, created_at, updated_at) VALUES (18, 19, 26200, 'delivered', 'Rue 48, Cité 432 Logements', 'Alger', '0635850229', 'cash_on_delivery', '2023-06-12 16:31:12', '2023-06-12 16:31:12');
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (18, 90, 1, 2200);
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (18, 88, 3, 8000);

INSERT INTO orders (id, user_id, total, status, shipping_address, shipping_city, shipping_phone, payment_method, created_at, updated_at) VALUES (19, 17, 7500, 'pending', 'Rue 31, Cité 333 Logements', 'Batna', '0797366610', 'cash_on_delivery', '2023-05-03 09:14:35', '2023-05-03 09:14:35');
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (19, 85, 3, 2500);

INSERT INTO orders (id, user_id, total, status, shipping_address, shipping_city, shipping_phone, payment_method, created_at, updated_at) VALUES (20, 12, 8400, 'delivered', 'Rue 18, Cité 604 Logements', 'Constantine', '0736242231', 'cash_on_delivery', '2023-11-15 06:38:44', '2023-11-15 06:38:44');
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (20, 76, 2, 4200);

INSERT INTO orders (id, user_id, total, status, shipping_address, shipping_city, shipping_phone, payment_method, created_at, updated_at) VALUES (21, 10, 11400, 'delivered', 'Rue 34, Cité 709 Logements', 'Oran', '0654105526', 'cash_on_delivery', '2024-06-17 06:41:05', '2024-06-17 06:41:05');
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (21, 19, 1, 1800);
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (21, 68, 2, 4800);

INSERT INTO orders (id, user_id, total, status, shipping_address, shipping_city, shipping_phone, payment_method, created_at, updated_at) VALUES (22, 2, 39000, 'shipped', 'Rue 3, Cité 320 Logements', 'Annaba', '0641898487', 'cash_on_delivery', '2023-10-17 16:15:34', '2023-10-17 16:15:34');
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (22, 13, 3, 7500);
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (22, 99, 1, 5500);
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (22, 55, 2, 5500);

INSERT INTO orders (id, user_id, total, status, shipping_address, shipping_city, shipping_phone, payment_method, created_at, updated_at) VALUES (23, 40, 7500, 'delivered', 'Rue 50, Cité 264 Logements', 'Bejaia', '0769089303', 'cash_on_delivery', '2024-01-18 08:19:58', '2024-01-18 08:19:58');
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (23, 92, 3, 2500);

INSERT INTO orders (id, user_id, total, status, shipping_address, shipping_city, shipping_phone, payment_method, created_at, updated_at) VALUES (24, 12, 20200, 'delivered', 'Rue 16, Cité 527 Logements', 'Batna', '0782071038', 'cash_on_delivery', '2024-07-08 20:48:25', '2024-07-08 20:48:25');
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (24, 76, 1, 4200);
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (24, 55, 2, 5500);
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (24, 85, 2, 2500);

INSERT INTO orders (id, user_id, total, status, shipping_address, shipping_city, shipping_phone, payment_method, created_at, updated_at) VALUES (25, 37, 1800, 'confirmed', 'Rue 3, Cité 794 Logements', 'Tizi Ouzou', '0516343376', 'cash_on_delivery', '2024-02-13 19:46:06', '2024-02-13 19:46:06');
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (25, 19, 1, 1800);

INSERT INTO orders (id, user_id, total, status, shipping_address, shipping_city, shipping_phone, payment_method, created_at, updated_at) VALUES (26, 18, 77200, 'delivered', 'Rue 42, Cité 142 Logements', 'Constantine', '0540117502', 'cash_on_delivery', '2024-01-22 01:40:29', '2024-01-22 01:40:29');
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (26, 18, 3, 2200);
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (26, 15, 3, 6500);
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (26, 38, 3, 5500);
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (26, 30, 2, 3800);
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (26, 95, 3, 9000);

INSERT INTO orders (id, user_id, total, status, shipping_address, shipping_city, shipping_phone, payment_method, created_at, updated_at) VALUES (27, 24, 24000, 'shipped', 'Rue 1, Cité 332 Logements', 'Skikda', '0675873072', 'cash_on_delivery', '2023-12-10 12:57:49', '2023-12-10 12:57:49');
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (27, 100, 3, 8000);

INSERT INTO orders (id, user_id, total, status, shipping_address, shipping_city, shipping_phone, payment_method, created_at, updated_at) VALUES (28, 34, 39700, 'delivered', 'Rue 37, Cité 383 Logements', 'Tizi Ouzou', '0579509572', 'cash_on_delivery', '2023-08-23 09:59:50', '2023-08-23 09:59:50');
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (28, 95, 3, 9000);
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (28, 32, 3, 3500);
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (28, 56, 1, 2200);

INSERT INTO orders (id, user_id, total, status, shipping_address, shipping_city, shipping_phone, payment_method, created_at, updated_at) VALUES (29, 24, 10900, 'delivered', 'Rue 19, Cité 805 Logements', 'Tizi Ouzou', '0535134966', 'cash_on_delivery', '2023-01-22 22:33:40', '2023-01-22 22:33:40');
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (29, 36, 1, 2500);
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (29, 91, 2, 4200);

INSERT INTO orders (id, user_id, total, status, shipping_address, shipping_city, shipping_phone, payment_method, created_at, updated_at) VALUES (30, 11, 32000, 'delivered', 'Rue 37, Cité 948 Logements', 'Constantine', '0776938538', 'cash_on_delivery', '2023-04-03 19:16:59', '2023-04-03 19:16:59');
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (30, 83, 3, 8000);
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (30, 100, 1, 8000);

INSERT INTO orders (id, user_id, total, status, shipping_address, shipping_city, shipping_phone, payment_method, created_at, updated_at) VALUES (31, 37, 16500, 'delivered', 'Rue 47, Cité 529 Logements', 'Bejaia', '0540143754', 'cash_on_delivery', '2023-05-16 10:56:31', '2023-05-16 10:56:31');
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (31, 99, 3, 5500);

INSERT INTO orders (id, user_id, total, status, shipping_address, shipping_city, shipping_phone, payment_method, created_at, updated_at) VALUES (32, 41, 34500, 'delivered', 'Rue 11, Cité 216 Logements', 'Tizi Ouzou', '0718762627', 'cash_on_delivery', '2024-01-06 22:10:47', '2024-01-06 22:10:47');
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (32, 55, 3, 5500);
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (32, 95, 2, 9000);

INSERT INTO orders (id, user_id, total, status, shipping_address, shipping_city, shipping_phone, payment_method, created_at, updated_at) VALUES (33, 27, 32500, 'pending', 'Rue 23, Cité 468 Logements', 'Tizi Ouzou', '0778724920', 'cash_on_delivery', '2023-01-30 16:44:38', '2023-01-30 16:44:38');
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (33, 95, 2, 9000);
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (33, 19, 2, 1800);
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (33, 15, 1, 6500);
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (33, 24, 2, 2200);

INSERT INTO orders (id, user_id, total, status, shipping_address, shipping_city, shipping_phone, payment_method, created_at, updated_at) VALUES (34, 27, 29700, 'delivered', 'Rue 3, Cité 215 Logements', 'Alger', '0695226175', 'cash_on_delivery', '2023-01-02 20:25:50', '2023-01-02 20:25:50');
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (34, 41, 1, 4200);
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (34, 52, 2, 4200);
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (34, 5, 3, 2500);
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (34, 29, 3, 3200);

INSERT INTO orders (id, user_id, total, status, shipping_address, shipping_city, shipping_phone, payment_method, created_at, updated_at) VALUES (35, 8, 27000, 'shipped', 'Rue 33, Cité 165 Logements', 'Constantine', '0738644659', 'cash_on_delivery', '2023-10-05 09:55:29', '2023-10-05 09:55:29');
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (35, 72, 1, 3500);
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (35, 77, 2, 8000);
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (35, 59, 1, 7500);

INSERT INTO orders (id, user_id, total, status, shipping_address, shipping_city, shipping_phone, payment_method, created_at, updated_at) VALUES (36, 26, 43800, 'delivered', 'Rue 10, Cité 354 Logements', 'Tlemcen', '0754860172', 'cash_on_delivery', '2024-03-12 05:09:15', '2024-03-12 05:09:15');
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (36, 34, 2, 4500);
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (36, 45, 2, 8000);
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (36, 43, 1, 4200);
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (36, 78, 2, 2500);
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (36, 79, 2, 4800);

INSERT INTO orders (id, user_id, total, status, shipping_address, shipping_city, shipping_phone, payment_method, created_at, updated_at) VALUES (37, 34, 19800, 'delivered', 'Rue 17, Cité 351 Logements', 'Batna', '0666276960', 'cash_on_delivery', '2023-07-02 14:22:53', '2023-07-02 14:22:53');
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (37, 16, 3, 3200);
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (37, 51, 1, 1800);
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (37, 43, 2, 4200);

INSERT INTO orders (id, user_id, total, status, shipping_address, shipping_city, shipping_phone, payment_method, created_at, updated_at) VALUES (38, 41, 2200, 'delivered', 'Rue 50, Cité 371 Logements', 'Oran', '0536706366', 'cash_on_delivery', '2023-12-01 04:19:35', '2023-12-01 04:19:35');
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (38, 2, 1, 2200);

INSERT INTO orders (id, user_id, total, status, shipping_address, shipping_city, shipping_phone, payment_method, created_at, updated_at) VALUES (39, 23, 37800, 'delivered', 'Rue 37, Cité 585 Logements', 'Batna', '0746946632', 'cash_on_delivery', '2023-02-15 00:22:10', '2023-02-15 00:22:10');
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (39, 90, 3, 2200);
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (39, 64, 3, 6500);
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (39, 48, 3, 2500);
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (39, 52, 1, 4200);

INSERT INTO orders (id, user_id, total, status, shipping_address, shipping_city, shipping_phone, payment_method, created_at, updated_at) VALUES (40, 6, 21300, 'delivered', 'Rue 19, Cité 489 Logements', 'Batna', '0522055770', 'cash_on_delivery', '2024-06-20 16:49:27', '2024-06-20 16:49:27');
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (40, 21, 1, 4800);
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (40, 85, 3, 2500);
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (40, 40, 1, 9000);

INSERT INTO orders (id, user_id, total, status, shipping_address, shipping_city, shipping_phone, payment_method, created_at, updated_at) VALUES (41, 25, 34100, 'delivered', 'Rue 17, Cité 138 Logements', 'Tlemcen', '0584084734', 'cash_on_delivery', '2023-06-03 02:16:42', '2023-06-03 02:16:42');
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (41, 79, 3, 4800);
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (41, 85, 3, 2500);
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (41, 13, 1, 7500);
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (41, 58, 1, 1500);
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (41, 16, 1, 3200);

INSERT INTO orders (id, user_id, total, status, shipping_address, shipping_city, shipping_phone, payment_method, created_at, updated_at) VALUES (42, 32, 50000, 'cancelled', 'Rue 39, Cité 654 Logements', 'Skikda', '0682346684', 'cash_on_delivery', '2024-05-25 11:49:07', '2024-05-25 11:49:07');
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (42, 60, 2, 9000);
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (42, 77, 2, 8000);
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (42, 88, 2, 8000);

INSERT INTO orders (id, user_id, total, status, shipping_address, shipping_city, shipping_phone, payment_method, created_at, updated_at) VALUES (43, 35, 9600, 'pending', 'Rue 21, Cité 760 Logements', 'Alger', '0567756913', 'cash_on_delivery', '2024-02-07 00:02:11', '2024-02-07 00:02:11');
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (43, 62, 2, 4800);

INSERT INTO orders (id, user_id, total, status, shipping_address, shipping_city, shipping_phone, payment_method, created_at, updated_at) VALUES (44, 37, 18000, 'delivered', 'Rue 27, Cité 526 Logements', 'Tlemcen', '0613341880', 'cash_on_delivery', '2023-01-07 01:12:14', '2023-01-07 01:12:14');
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (44, 14, 2, 9000);

INSERT INTO orders (id, user_id, total, status, shipping_address, shipping_city, shipping_phone, payment_method, created_at, updated_at) VALUES (45, 7, 2500, 'delivered', 'Rue 34, Cité 122 Logements', 'Skikda', '0677070963', 'cash_on_delivery', '2023-03-18 20:03:19', '2023-03-18 20:03:19');
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (45, 78, 1, 2500);

INSERT INTO orders (id, user_id, total, status, shipping_address, shipping_city, shipping_phone, payment_method, created_at, updated_at) VALUES (46, 25, 5000, 'delivered', 'Rue 24, Cité 569 Logements', 'Oran', '0545620310', 'cash_on_delivery', '2023-04-02 15:56:04', '2023-04-02 15:56:04');
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (46, 85, 2, 2500);

INSERT INTO orders (id, user_id, total, status, shipping_address, shipping_city, shipping_phone, payment_method, created_at, updated_at) VALUES (47, 36, 64500, 'delivered', 'Rue 22, Cité 488 Logements', 'Bejaia', '0685797674', 'cash_on_delivery', '2024-02-13 05:40:41', '2024-02-13 05:40:41');
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (47, 88, 3, 8000);
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (47, 56, 3, 2200);
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (47, 85, 1, 2500);
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (47, 67, 3, 9000);
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (47, 90, 2, 2200);

INSERT INTO orders (id, user_id, total, status, shipping_address, shipping_city, shipping_phone, payment_method, created_at, updated_at) VALUES (48, 11, 28400, 'delivered', 'Rue 13, Cité 641 Logements', 'Blida', '0692150758', 'cash_on_delivery', '2023-06-29 20:36:42', '2023-06-29 20:36:42');
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (48, 26, 1, 9000);
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (48, 10, 2, 4800);
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (48, 73, 1, 4800);
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (48, 85, 2, 2500);

INSERT INTO orders (id, user_id, total, status, shipping_address, shipping_city, shipping_phone, payment_method, created_at, updated_at) VALUES (49, 27, 25000, 'confirmed', 'Rue 15, Cité 699 Logements', 'Oran', '0568492785', 'cash_on_delivery', '2023-11-11 18:13:05', '2023-11-11 18:13:05');
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (49, 85, 1, 2500);
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (49, 28, 3, 7500);

INSERT INTO orders (id, user_id, total, status, shipping_address, shipping_city, shipping_phone, payment_method, created_at, updated_at) VALUES (50, 6, 40500, 'confirmed', 'Rue 39, Cité 688 Logements', 'Oran', '0767394733', 'cash_on_delivery', '2023-04-16 00:59:49', '2023-04-16 00:59:49');
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (50, 87, 3, 7500);
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (50, 81, 2, 1500);
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (50, 13, 2, 7500);

INSERT INTO orders (id, user_id, total, status, shipping_address, shipping_city, shipping_phone, payment_method, created_at, updated_at) VALUES (51, 14, 4500, 'delivered', 'Rue 43, Cité 741 Logements', 'Oran', '0538127118', 'cash_on_delivery', '2023-03-23 05:38:43', '2023-03-23 05:38:43');
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (51, 57, 1, 4500);

INSERT INTO orders (id, user_id, total, status, shipping_address, shipping_city, shipping_phone, payment_method, created_at, updated_at) VALUES (52, 18, 38500, 'shipped', 'Rue 43, Cité 925 Logements', 'Tizi Ouzou', '0610372085', 'cash_on_delivery', '2023-03-17 22:27:48', '2023-03-17 22:27:48');
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (52, 92, 1, 2500);
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (52, 67, 2, 9000);
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (52, 44, 2, 9000);

INSERT INTO orders (id, user_id, total, status, shipping_address, shipping_city, shipping_phone, payment_method, created_at, updated_at) VALUES (53, 41, 32100, 'confirmed', 'Rue 16, Cité 790 Logements', 'Batna', '0657626655', 'cash_on_delivery', '2023-05-03 19:30:16', '2023-05-03 19:30:16');
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (53, 35, 3, 2800);
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (53, 78, 1, 2500);
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (53, 54, 1, 2200);
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (53, 55, 2, 5500);
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (53, 63, 1, 8000);

INSERT INTO orders (id, user_id, total, status, shipping_address, shipping_city, shipping_phone, payment_method, created_at, updated_at) VALUES (54, 12, 24500, 'pending', 'Rue 13, Cité 154 Logements', 'Annaba', '0531571604', 'cash_on_delivery', '2023-04-16 19:20:09', '2023-04-16 19:20:09');
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (54, 75, 2, 3800);
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (54, 46, 1, 5500);
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (54, 21, 1, 4800);
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (54, 47, 3, 2200);

INSERT INTO orders (id, user_id, total, status, shipping_address, shipping_city, shipping_phone, payment_method, created_at, updated_at) VALUES (55, 4, 62900, 'delivered', 'Rue 31, Cité 433 Logements', 'Batna', '0562894003', 'cash_on_delivery', '2023-02-02 01:37:56', '2023-02-02 01:37:56');
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (55, 98, 3, 8000);
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (55, 13, 1, 7500);
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (55, 4, 2, 3500);
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (55, 91, 2, 4200);
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (55, 63, 2, 8000);

INSERT INTO orders (id, user_id, total, status, shipping_address, shipping_city, shipping_phone, payment_method, created_at, updated_at) VALUES (56, 3, 52100, 'pending', 'Rue 22, Cité 927 Logements', 'Bejaia', '0764188571', 'cash_on_delivery', '2024-04-15 12:56:32', '2024-04-15 12:56:32');
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (56, 28, 1, 7500);
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (56, 6, 3, 9000);
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (56, 63, 1, 8000);
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (56, 62, 2, 4800);

INSERT INTO orders (id, user_id, total, status, shipping_address, shipping_city, shipping_phone, payment_method, created_at, updated_at) VALUES (57, 28, 15000, 'delivered', 'Rue 6, Cité 361 Logements', 'Bejaia', '0597013780', 'cash_on_delivery', '2024-07-01 19:49:02', '2024-07-01 19:49:02');
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (57, 1, 2, 7500);

INSERT INTO orders (id, user_id, total, status, shipping_address, shipping_city, shipping_phone, payment_method, created_at, updated_at) VALUES (58, 4, 7600, 'delivered', 'Rue 48, Cité 857 Logements', 'Constantine', '0722347233', 'cash_on_delivery', '2023-11-10 13:28:59', '2023-11-10 13:28:59');
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (58, 97, 1, 2200);
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (58, 19, 3, 1800);

INSERT INTO orders (id, user_id, total, status, shipping_address, shipping_city, shipping_phone, payment_method, created_at, updated_at) VALUES (59, 16, 25500, 'delivered', 'Rue 25, Cité 111 Logements', 'Tlemcen', '0645988805', 'cash_on_delivery', '2023-05-17 13:33:51', '2023-05-17 13:33:51');
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (59, 99, 3, 5500);
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (59, 58, 1, 1500);
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (59, 92, 3, 2500);

INSERT INTO orders (id, user_id, total, status, shipping_address, shipping_city, shipping_phone, payment_method, created_at, updated_at) VALUES (60, 31, 19900, 'confirmed', 'Rue 19, Cité 403 Logements', 'Batna', '0711304832', 'cash_on_delivery', '2024-05-27 18:04:15', '2024-05-27 18:04:15');
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (60, 63, 1, 8000);
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (60, 56, 2, 2200);
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (60, 13, 1, 7500);

INSERT INTO orders (id, user_id, total, status, shipping_address, shipping_city, shipping_phone, payment_method, created_at, updated_at) VALUES (61, 31, 16300, 'delivered', 'Rue 7, Cité 339 Logements', 'Batna', '0594349950', 'cash_on_delivery', '2024-02-16 14:20:39', '2024-02-16 14:20:39');
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (61, 19, 1, 1800);
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (61, 36, 3, 2500);
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (61, 97, 1, 2200);
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (61, 68, 1, 4800);

INSERT INTO orders (id, user_id, total, status, shipping_address, shipping_city, shipping_phone, payment_method, created_at, updated_at) VALUES (62, 10, 66500, 'delivered', 'Rue 39, Cité 200 Logements', 'Tlemcen', '0563764061', 'cash_on_delivery', '2024-01-18 19:39:25', '2024-01-18 19:39:25');
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (62, 62, 3, 4800);
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (62, 90, 2, 2200);
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (62, 100, 3, 8000);
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (62, 52, 1, 4200);
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (62, 64, 3, 6500);

INSERT INTO orders (id, user_id, total, status, shipping_address, shipping_city, shipping_phone, payment_method, created_at, updated_at) VALUES (63, 29, 43900, 'confirmed', 'Rue 43, Cité 485 Logements', 'Alger', '0559867701', 'cash_on_delivery', '2024-07-05 07:18:34', '2024-07-05 07:18:34');
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (63, 2, 3, 2200);
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (63, 1, 2, 7500);
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (63, 11, 3, 3800);
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (63, 34, 1, 4500);
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (63, 29, 2, 3200);

INSERT INTO orders (id, user_id, total, status, shipping_address, shipping_city, shipping_phone, payment_method, created_at, updated_at) VALUES (64, 18, 18600, 'delivered', 'Rue 37, Cité 101 Logements', 'Tlemcen', '0640651203', 'cash_on_delivery', '2023-01-07 10:24:14', '2023-01-07 10:24:14');
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (64, 81, 1, 1500);
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (64, 43, 3, 4200);
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (64, 31, 1, 4500);

INSERT INTO orders (id, user_id, total, status, shipping_address, shipping_city, shipping_phone, payment_method, created_at, updated_at) VALUES (65, 33, 36600, 'shipped', 'Rue 2, Cité 950 Logements', 'Tlemcen', '0798295548', 'cash_on_delivery', '2023-06-05 12:35:18', '2023-06-05 12:35:18');
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (65, 74, 3, 4200);
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (65, 66, 3, 4500);
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (65, 4, 3, 3500);

INSERT INTO orders (id, user_id, total, status, shipping_address, shipping_city, shipping_phone, payment_method, created_at, updated_at) VALUES (66, 9, 4500, 'delivered', 'Rue 30, Cité 644 Logements', 'Alger', '0678793406', 'cash_on_delivery', '2023-03-06 08:57:04', '2023-03-06 08:57:04');
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (66, 81, 3, 1500);

INSERT INTO orders (id, user_id, total, status, shipping_address, shipping_city, shipping_phone, payment_method, created_at, updated_at) VALUES (67, 40, 7800, 'delivered', 'Rue 8, Cité 566 Logements', 'Blida', '0762142643', 'cash_on_delivery', '2024-05-27 02:48:23', '2024-05-27 02:48:23');
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (67, 93, 2, 2800);
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (67, 54, 1, 2200);

INSERT INTO orders (id, user_id, total, status, shipping_address, shipping_city, shipping_phone, payment_method, created_at, updated_at) VALUES (68, 17, 15900, 'delivered', 'Rue 49, Cité 633 Logements', 'Alger', '0787526466', 'cash_on_delivery', '2023-03-08 16:43:42', '2023-03-08 16:43:42');
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (68, 13, 1, 7500);
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (68, 22, 2, 4200);

INSERT INTO orders (id, user_id, total, status, shipping_address, shipping_city, shipping_phone, payment_method, created_at, updated_at) VALUES (69, 34, 11400, 'delivered', 'Rue 37, Cité 542 Logements', 'Bejaia', '0773788558', 'cash_on_delivery', '2023-06-10 06:03:37', '2023-06-10 06:03:37');
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (69, 36, 2, 2500);
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (69, 29, 2, 3200);

INSERT INTO orders (id, user_id, total, status, shipping_address, shipping_city, shipping_phone, payment_method, created_at, updated_at) VALUES (70, 41, 3500, 'confirmed', 'Rue 18, Cité 582 Logements', 'Alger', '0695126050', 'cash_on_delivery', '2024-02-14 18:54:21', '2024-02-14 18:54:21');
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (70, 32, 1, 3500);

INSERT INTO orders (id, user_id, total, status, shipping_address, shipping_city, shipping_phone, payment_method, created_at, updated_at) VALUES (71, 31, 35400, 'shipped', 'Rue 44, Cité 299 Logements', 'Batna', '0638258011', 'cash_on_delivery', '2023-01-05 09:07:31', '2023-01-05 09:07:31');
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (71, 1, 3, 7500);
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (71, 9, 3, 2800);
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (71, 80, 1, 4500);

INSERT INTO orders (id, user_id, total, status, shipping_address, shipping_city, shipping_phone, payment_method, created_at, updated_at) VALUES (72, 27, 35500, 'delivered', 'Rue 43, Cité 758 Logements', 'Skikda', '0721441968', 'cash_on_delivery', '2023-09-25 10:04:01', '2023-09-25 10:04:01');
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (72, 46, 1, 5500);
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (72, 88, 3, 8000);
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (72, 16, 1, 3200);
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (72, 33, 1, 2800);

INSERT INTO orders (id, user_id, total, status, shipping_address, shipping_city, shipping_phone, payment_method, created_at, updated_at) VALUES (73, 28, 26500, 'confirmed', 'Rue 32, Cité 657 Logements', 'Constantine', '0587470734', 'cash_on_delivery', '2023-10-12 11:36:26', '2023-10-12 11:36:26');
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (73, 63, 3, 8000);
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (73, 5, 1, 2500);

INSERT INTO orders (id, user_id, total, status, shipping_address, shipping_city, shipping_phone, payment_method, created_at, updated_at) VALUES (74, 16, 44900, 'delivered', 'Rue 36, Cité 994 Logements', 'Annaba', '0711736420', 'cash_on_delivery', '2023-10-13 00:09:36', '2023-10-13 00:09:36');
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (74, 32, 1, 3500);
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (74, 67, 1, 9000);
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (74, 73, 2, 4800);
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (74, 50, 1, 4800);
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (74, 95, 2, 9000);

INSERT INTO orders (id, user_id, total, status, shipping_address, shipping_city, shipping_phone, payment_method, created_at, updated_at) VALUES (75, 32, 48600, 'delivered', 'Rue 39, Cité 567 Logements', 'Batna', '0689003677', 'cash_on_delivery', '2023-07-07 03:34:29', '2023-07-07 03:34:29');
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (75, 26, 2, 9000);
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (75, 56, 3, 2200);
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (75, 22, 1, 4200);
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (75, 42, 2, 7500);
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (75, 62, 1, 4800);

INSERT INTO orders (id, user_id, total, status, shipping_address, shipping_city, shipping_phone, payment_method, created_at, updated_at) VALUES (76, 35, 5600, 'confirmed', 'Rue 20, Cité 710 Logements', 'Skikda', '0730170944', 'cash_on_delivery', '2023-02-22 05:26:41', '2023-02-22 05:26:41');
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (76, 33, 2, 2800);

INSERT INTO orders (id, user_id, total, status, shipping_address, shipping_city, shipping_phone, payment_method, created_at, updated_at) VALUES (77, 29, 34400, 'confirmed', 'Rue 14, Cité 678 Logements', 'Annaba', '0650325287', 'cash_on_delivery', '2023-04-23 18:38:27', '2023-04-23 18:38:27');
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (77, 12, 1, 4200);
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (77, 43, 3, 4200);
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (77, 68, 2, 4800);
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (77, 77, 1, 8000);

INSERT INTO orders (id, user_id, total, status, shipping_address, shipping_city, shipping_phone, payment_method, created_at, updated_at) VALUES (78, 38, 34600, 'delivered', 'Rue 15, Cité 855 Logements', 'Batna', '0568683706', 'cash_on_delivery', '2023-05-02 21:24:30', '2023-05-02 21:24:30');
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (78, 94, 2, 4500);
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (78, 10, 2, 4800);
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (78, 63, 2, 8000);

INSERT INTO orders (id, user_id, total, status, shipping_address, shipping_city, shipping_phone, payment_method, created_at, updated_at) VALUES (79, 21, 10200, 'delivered', 'Rue 31, Cité 561 Logements', 'Constantine', '0543894023', 'cash_on_delivery', '2023-11-01 08:51:41', '2023-11-01 08:51:41');
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (79, 90, 1, 2200);
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (79, 82, 1, 8000);

INSERT INTO orders (id, user_id, total, status, shipping_address, shipping_city, shipping_phone, payment_method, created_at, updated_at) VALUES (80, 37, 14800, 'delivered', 'Rue 29, Cité 941 Logements', 'Oran', '0652307437', 'cash_on_delivery', '2023-05-30 02:41:20', '2023-05-30 02:41:20');
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (80, 38, 2, 5500);
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (80, 11, 1, 3800);

-- Settings
INSERT IGNORE INTO settings (setting_key, setting_value) VALUES
    ('store_name', 'Velora'),
    ('store_phone', '+213 555 000 000'),
    ('store_whatsapp', '+213 555 000 000'),
    ('store_email', 'bonjour@velora.dz'),
    ('store_address', 'Alger, Algérie'),
    ('free_threshold', '5000'),
    ('announcement_enabled', '1'),
    ('announcement', 'Livraison offerte dès 5 000 DA d''achat · Paiement à la livraison disponible'),
    ('announcement_bg', 'gold');

-- 58 Wilayas Shipping Data
INSERT INTO wilaya_shipping (wilaya_code, wilaya_name, home_fee, desk_fee) VALUES
(1, 'Adrar', 1000.00, 700.00),
(2, 'Chlef', 600.00, 400.00),
(3, 'Laghouat', 800.00, 500.00),
(4, 'Oum El Bouaghi', 700.00, 450.00),
(5, 'Batna', 700.00, 450.00),
(6, 'Béjaïa', 600.00, 400.00),
(7, 'Biskra', 800.00, 500.00),
(8, 'Béchar', 1000.00, 700.00),
(9, 'Blida', 500.00, 300.00),
(10, 'Bouira', 550.00, 350.00),
(11, 'Tamanrasset', 1400.00, 1000.00),
(12, 'Tébessa', 750.00, 500.00),
(13, 'Tlemcen', 700.00, 450.00),
(14, 'Tiaret', 650.00, 400.00),
(15, 'Tizi Ouzou', 550.00, 350.00),
(16, 'Alger', 400.00, 250.00),
(17, 'Djelfa', 750.00, 500.00),
(18, 'Jijel', 650.00, 400.00),
(19, 'Sétif', 600.00, 400.00),
(20, 'Saïda', 700.00, 450.00),
(21, 'Skikda', 650.00, 400.00),
(22, 'Sidi Bel Abbès', 700.00, 450.00),
(23, 'Annaba', 650.00, 400.00),
(24, 'Guelma', 700.00, 450.00),
(25, 'Constantine', 600.00, 400.00),
(26, 'Médéa', 550.00, 350.00),
(27, 'Mostaganem', 650.00, 400.00),
(28, 'M''Sila', 700.00, 450.00),
(29, 'Mascara', 650.00, 400.00),
(30, 'Ouargla', 900.00, 600.00),
(31, 'Oran', 600.00, 400.00),
(32, 'El Bayadh', 900.00, 600.00),
(33, 'Illizi', 1400.00, 1000.00),
(34, 'Bordj Bou Arreridj', 600.00, 400.00),
(35, 'Boumerdès', 500.00, 300.00),
(36, 'El Tarf', 750.00, 500.00),
(37, 'Tindouf', 1400.00, 1000.00),
(38, 'Tissemsilt', 650.00, 400.00),
(39, 'El Oued', 850.00, 550.00),
(40, 'Khenchela', 750.00, 500.00),
(41, 'Souk Ahras', 750.00, 500.00),
(42, 'Tipaza', 500.00, 300.00),
(43, 'Mila', 650.00, 400.00),
(44, 'Aïn Defla', 550.00, 350.00),
(45, 'Naâma', 900.00, 600.00),
(46, 'Aïn Témouchent', 650.00, 400.00),
(47, 'Ghardaïa', 850.00, 550.00),
(48, 'Relizane', 650.00, 400.00),
(49, 'Timimoun', 1100.00, 800.00),
(50, 'Bordj Badji Mokhtar', 1500.00, 1100.00),
(51, 'Ouled Djellal', 800.00, 550.00),
(52, 'Béni Abbès', 1100.00, 800.00),
(53, 'In Salah', 1300.00, 950.00),
(54, 'In Guezzam', 1500.00, 1100.00),
(55, 'Touggourt', 900.00, 600.00),
(56, 'Djanet', 1500.00, 1100.00),
(57, 'El M''Ghair', 900.00, 600.00),
(58, 'El Meniaa', 1000.00, 700.00)
ON DUPLICATE KEY UPDATE home_fee=VALUES(home_fee), desk_fee=VALUES(desk_fee);


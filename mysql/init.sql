-- ==========================================================
-- PostgreSQL Migration Script
-- Project: PS09 E-commerce System (Best Practice Schema)
-- ==========================================================

-- PostgreSQL doesn't use 'USE database_name'. You connect to the database directly.
-- CREATE DATABASE ps09_system;

-- Drop tables in reverse order of dependencies
DROP TABLE IF EXISTS activity_logs;
DROP TABLE IF EXISTS reviews;
DROP TABLE IF EXISTS inventory_logs;
DROP TABLE IF EXISTS cart_items;
DROP TABLE IF EXISTS carts;
DROP TABLE IF EXISTS payments;
DROP TABLE IF EXISTS order_items;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS coupons;
DROP TABLE IF EXISTS product_variants;
DROP TABLE IF EXISTS product_images;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS brands;
DROP TABLE IF EXISTS user_addresses;
DROP TABLE IF EXISTS sub_districts;
DROP TABLE IF EXISTS districts;
DROP TABLE IF EXISTS provinces;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS roles;

-- Drop Types if they exist
DROP TYPE IF EXISTS user_status;
DROP TYPE IF EXISTS discount_type;
DROP TYPE IF EXISTS order_status;
DROP TYPE IF EXISTS payment_method;
DROP TYPE IF EXISTS payment_status;

-- CREATE TYPES (Enums in Postgres)
CREATE TYPE user_status AS ENUM ('active', 'inactive');
CREATE TYPE discount_type AS ENUM ('percent', 'fixed');
CREATE TYPE order_status AS ENUM ('pending','processing','shipped','delivered','cancelled', 'returned');
CREATE TYPE payment_method AS ENUM ('credit_card', 'bank_transfer', 'promptpay');
CREATE TYPE payment_status AS ENUM ('pending', 'completed', 'failed', 'refunded');

-- ==========================================================
-- 1. MASTER DATA
-- ==========================================================

CREATE TABLE roles (
    role_id SERIAL PRIMARY KEY,
    role_name VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    user_uuid VARCHAR(36) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    phone_number VARCHAR(20),
    role_id INT,
    reward_points INT DEFAULT 0,
    status user_status DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,
    CONSTRAINT fk_users_roles FOREIGN KEY (role_id) REFERENCES roles(role_id) ON DELETE SET NULL
);

CREATE TABLE provinces (
    province_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);

CREATE TABLE districts (
    district_id SERIAL PRIMARY KEY,
    province_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    CONSTRAINT fk_districts_provinces FOREIGN KEY (province_id) REFERENCES provinces(province_id)
);

CREATE TABLE sub_districts (
    sub_district_id SERIAL PRIMARY KEY,
    district_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    zip_code VARCHAR(10) NOT NULL,
    CONSTRAINT fk_sub_districts_districts FOREIGN KEY (district_id) REFERENCES districts(district_id)
);

CREATE TABLE user_addresses (
    address_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    address_line TEXT NOT NULL,
    sub_district_id INT NOT NULL,
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_addresses_users FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    CONSTRAINT fk_addresses_sub_districts FOREIGN KEY (sub_district_id) REFERENCES sub_districts(sub_district_id)
);

-- ==========================================================
-- 2. PRODUCT CATALOG
-- ==========================================================

CREATE TABLE brands (
    brand_id SERIAL PRIMARY KEY,
    brand_name VARCHAR(100) NOT NULL UNIQUE,
    logo_url VARCHAR(255)
);

CREATE TABLE categories (
    category_id SERIAL PRIMARY KEY,
    parent_id INT NULL,
    category_name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_categories_parent FOREIGN KEY (parent_id) REFERENCES categories(category_id) ON DELETE SET NULL
);

CREATE TABLE products (
    product_id SERIAL PRIMARY KEY,
    brand_id INT,
    category_id INT,
    product_name VARCHAR(200) NOT NULL,
    description TEXT,
    is_featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,
    CONSTRAINT fk_products_brands FOREIGN KEY (brand_id) REFERENCES brands(brand_id) ON DELETE SET NULL,
    CONSTRAINT fk_products_categories FOREIGN KEY (category_id) REFERENCES categories(category_id) ON DELETE SET NULL
);

-- Trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_product_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TABLE product_images (
    image_id SERIAL PRIMARY KEY,
    product_id INT NOT NULL,
    image_url VARCHAR(255) NOT NULL,
    is_primary BOOLEAN DEFAULT FALSE,
    display_order INT DEFAULT 0,
    CONSTRAINT fk_images_products FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE CASCADE
);

CREATE TABLE product_variants (
    variant_id SERIAL PRIMARY KEY,
    product_id INT NOT NULL,
    sku VARCHAR(100) NOT NULL UNIQUE,
    variant_name VARCHAR(100),
    cost_price DECIMAL(10,2) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    stock_qty INT DEFAULT 0,
    CONSTRAINT fk_variants_products FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE CASCADE
);

-- ==========================================================
-- 3. TRANSACTIONAL DATA
-- ==========================================================

CREATE TABLE coupons (
    coupon_id SERIAL PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    discount_type discount_type NOT NULL,
    discount_value DECIMAL(10,2) NOT NULL,
    min_purchase DECIMAL(10,2) DEFAULT 0,
    expires_at TIMESTAMP NULL
);

CREATE TABLE orders (
    order_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    shipping_name VARCHAR(100) NOT NULL,
    shipping_phone VARCHAR(20) NOT NULL,
    shipping_address_line TEXT NOT NULL,
    shipping_sub_district VARCHAR(100) NOT NULL,
    shipping_district VARCHAR(100) NOT NULL,
    shipping_province VARCHAR(100) NOT NULL,
    shipping_zip_code VARCHAR(10) NOT NULL,
    coupon_id INT,
    sub_total DECIMAL(12,2) NOT NULL,
    discount_amount DECIMAL(10,2) DEFAULT 0,
    shipping_fee DECIMAL(10,2) DEFAULT 0,
    tax_amount DECIMAL(10,2) DEFAULT 0,
    total_price DECIMAL(12,2) NOT NULL,
    order_status order_status DEFAULT 'pending',
    shipping_carrier VARCHAR(100),
    tracking_number VARCHAR(100),
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_orders_users FOREIGN KEY (user_id) REFERENCES users(user_id),
    CONSTRAINT fk_orders_coupons FOREIGN KEY (coupon_id) REFERENCES coupons(coupon_id) ON DELETE SET NULL
);

CREATE TABLE order_items (
    item_id SERIAL PRIMARY KEY,
    order_id INT NOT NULL,
    variant_id INT,
    product_name VARCHAR(200) NOT NULL,
    variant_name VARCHAR(100),
    sku VARCHAR(100) NOT NULL,
    quantity INT NOT NULL,
    unit_cost DECIMAL(10,2) NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    CONSTRAINT fk_items_orders FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE,
    CONSTRAINT fk_items_variants FOREIGN KEY (variant_id) REFERENCES product_variants(variant_id) ON DELETE SET NULL
);

CREATE TABLE payments (
    payment_id SERIAL PRIMARY KEY,
    order_id INT NOT NULL UNIQUE,
    payment_method payment_method NOT NULL,
    amount DECIMAL(12,2) NOT NULL,
    status payment_status DEFAULT 'pending',
    transaction_ref VARCHAR(255),
    paid_at TIMESTAMP NULL,
    CONSTRAINT fk_payments_orders FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE
);

-- ==========================================================
-- 4. LOGS & SUPPORTING FEATURES
-- ==========================================================

CREATE TABLE carts (
    cart_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL UNIQUE,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_carts_users FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE TRIGGER update_carts_updated_at BEFORE UPDATE ON carts FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TABLE cart_items (
    cart_item_id SERIAL PRIMARY KEY,
    cart_id INT NOT NULL,
    variant_id INT NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_cartitems_carts FOREIGN KEY (cart_id) REFERENCES carts(cart_id) ON DELETE CASCADE,
    CONSTRAINT fk_cartitems_variants FOREIGN KEY (variant_id) REFERENCES product_variants(variant_id) ON DELETE CASCADE
);

CREATE TABLE inventory_logs (
    log_id SERIAL PRIMARY KEY,
    variant_id INT NOT NULL,
    user_id INT NOT NULL,
    change_qty INT NOT NULL,
    reason VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_invlogs_variants FOREIGN KEY (variant_id) REFERENCES product_variants(variant_id) ON DELETE CASCADE,
    CONSTRAINT fk_invlogs_users FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE reviews (
    review_id SERIAL PRIMARY KEY,
    product_id INT NOT NULL,
    user_id INT NOT NULL,
    rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_reviews_products FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE CASCADE,
    CONSTRAINT fk_reviews_users FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE TABLE activity_logs (
    log_id BIGSERIAL PRIMARY KEY,
    user_id INT,
    action VARCHAR(100) NOT NULL,
    details JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_actlogs_users FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE SET NULL
);

-- ==========================================================
-- SEED DATA
-- ==========================================================

INSERT INTO roles (role_name) VALUES ('Admin'), ('Manager'), ('Customer');

INSERT INTO users (user_uuid, email, password_hash, first_name, last_name, role_id, status) VALUES 
('uuid-admin-001', 'admin@example.com', 'hashed_pass', 'System', 'Admin', 1, 'active'),
('uuid-admin-999', 'admin@admin.com', 'password', 'Super', 'Admin', 1, 'active'),
('uuid-user-001', 'user@example.com', 'hashed_pass', 'John', 'Doe', 3, 'active');

INSERT INTO categories (category_name) VALUES ('Electronics'), ('Clothing'), ('Home & Garden');
INSERT INTO brands (brand_name) VALUES ('Apple'), ('Samsung'), ('Nike');

INSERT INTO products (brand_id, category_id, product_name, description) VALUES 
(1, 1, 'iPhone 15', 'Latest smartphone from Apple'),
(3, 2, 'Air Max 2024', 'Comfortable running shoes');

INSERT INTO product_variants (product_id, sku, variant_name, cost_price, price, stock_qty) VALUES 
(1, 'IPH15-BLK-128', 'Black, 128GB', 25000.00, 32000.00, 50),
(2, 'NIK-AM24-W-10', 'White, Size 10', 3500.00, 5500.00, 20);

INSERT INTO orders (user_id, shipping_name, shipping_phone, shipping_address_line, shipping_sub_district, shipping_district, shipping_province, shipping_zip_code, sub_total, total_price, order_status) VALUES 
(2, 'John Doe', '0812345678', '123 Main St', 'Suriwong', 'Bang Rak', 'Bangkok', '10500', 32000.00, 32000.00, 'processing');

INSERT INTO order_items (order_id, variant_id, product_name, variant_name, sku, quantity, unit_cost, unit_price) VALUES 
(1, 1, 'iPhone 15', 'Black, 128GB', 'IPH15-BLK-128', 1, 25000.00, 32000.00);

-- ==========================================================
-- INDEXES
-- ==========================================================
CREATE INDEX idx_orders_date ON orders(order_date);
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_users_email ON users(email);

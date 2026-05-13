# Product Related Queries
ALL_PRODUCTS = """
    SELECT 
        p.product_id as id, 
        p.product_name as name, 
        c.category_name as category, 
        pv.price, 
        p.updated_at as updateat,
        p.user_id
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.category_id
    LEFT JOIN product_variants pv ON p.product_id = pv.product_id
    WHERE p.deleted_at IS NULL
    ORDER BY p.product_id ASC
"""

CHECK_USER_ID_COLUMN = "SELECT column_name FROM information_schema.columns WHERE table_name='products' AND column_name='user_id'"
ADD_USER_ID_COLUMN = "ALTER TABLE products ADD COLUMN user_id INTEGER"
SEED_USER_ID_COLUMN = "UPDATE products SET user_id = (SELECT user_id FROM users ORDER BY RANDOM() LIMIT 1)"

GET_CATEGORY_ID = "SELECT category_id FROM categories WHERE category_name = %s"
INSERT_CATEGORY = "INSERT INTO categories (category_name) VALUES (%s) RETURNING category_id"
INSERT_PRODUCT = "INSERT INTO products (product_name, category_id, user_id) VALUES (%s, %s, %s) RETURNING product_id"
INSERT_VARIANT = "INSERT INTO product_variants (product_id, sku, price, stock_qty) VALUES (%s, %s, %s, %s)"

UPDATE_PRODUCT_BASE = "UPDATE products SET product_name = %s, category_id = %s, user_id = %s, updated_at = NOW() WHERE product_id = %s"
UPDATE_PRODUCT_NO_CAT = "UPDATE products SET product_name = %s, user_id = %s, updated_at = NOW() WHERE product_id = %s"
UPDATE_VARIANT_PRICE = "UPDATE product_variants SET price = %s WHERE product_id = %s"

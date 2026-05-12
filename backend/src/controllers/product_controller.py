from flask import jsonify
from src.init import get_db_connection
from psycopg2.extras import RealDictCursor
import traceback

def get_all_products():
    conn = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor(cursor_factory=RealDictCursor)

        # Auto-migrate user_id column
        cursor.execute("SELECT column_name FROM information_schema.columns WHERE table_name='products' AND column_name='user_id'")
        if not cursor.fetchone():
            cursor.execute("ALTER TABLE products ADD COLUMN user_id INTEGER")
            cursor.execute("UPDATE products SET user_id = (SELECT user_id FROM users ORDER BY RANDOM() LIMIT 1)")
            conn.commit()

        # ดึงรายการสินค้าพร้อมหมวดหมู่และราคาล่าสุด
        query = """
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
        cursor.execute(query)
        products = cursor.fetchall()

        cursor.close()

        # Format price to string with $ for frontend consistency
        for p in products:
            p['price'] = f"$ {float(p['price']):,.2f}" if p['price'] else "$ 0.00"
            p['updateAt'] = p['updateat'].strftime('%Y/%m/%d') if p.get('updateat') else 'N/A'

        return jsonify(products)
    except Exception as e:
        print(f"ERROR in get_all_products: {e}")
        traceback.print_exc()
        return jsonify({"error": str(e), "trace": traceback.format_exc()}), 500
    finally:
        if conn:
            conn.close()

def create_product():
    from flask import request
    conn = None
    try:
        data = request.json
        name = data.get('name')
        category = data.get('category')
        price = data.get('price', 0)
        user_id = data.get('userId') or None
        
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # 1. Check/Insert category
        cursor.execute("SELECT category_id FROM categories WHERE category_name = %s", (category,))
        cat_row = cursor.fetchone()
        if cat_row:
            cat_id = cat_row[0]
        else:
            cursor.execute("INSERT INTO categories (category_name) VALUES (%s) RETURNING category_id", (category,))
            cat_id = cursor.fetchone()[0]

        # 2. Insert product
        cursor.execute("INSERT INTO products (product_name, category_id, user_id) VALUES (%s, %s, %s) RETURNING product_id", (name, cat_id, user_id))
        product_id = cursor.fetchone()[0]

        # 3. Insert variant with price
        sku = f"SKU-{product_id}-01"
        cursor.execute("INSERT INTO product_variants (product_id, sku, price, stock_qty) VALUES (%s, %s, %s, %s)", (product_id, sku, price, 0))

        conn.commit()
        cursor.close()
        return jsonify({"success": True, "product_id": product_id}), 201
    except Exception as e:
        if conn:
            conn.rollback()
        print(f"ERROR in create_product: {e}")
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500
    finally:
        if conn:
            conn.close()

def update_product(product_id):
    from flask import request
    conn = None
    try:
        data = request.json
        name = data.get('name')
        category = data.get('category')
        price = data.get('price')
        user_id = data.get('userId') or None

        conn = get_db_connection()
        cursor = conn.cursor()

        # Update category if needed
        if category:
            cursor.execute("SELECT category_id FROM categories WHERE category_name = %s", (category,))
            cat_row = cursor.fetchone()
            if cat_row:
                cat_id = cat_row[0]
            else:
                cursor.execute("INSERT INTO categories (category_name) VALUES (%s) RETURNING category_id", (category,))
                cat_id = cursor.fetchone()[0]
            cursor.execute("UPDATE products SET product_name = %s, category_id = %s, user_id = %s, updated_at = NOW() WHERE product_id = %s", (name, cat_id, user_id, product_id))
        else:
            cursor.execute("UPDATE products SET product_name = %s, user_id = %s, updated_at = NOW() WHERE product_id = %s", (name, user_id, product_id))

        if price is not None:
            cursor.execute("UPDATE product_variants SET price = %s WHERE product_id = %s", (price, product_id))

        conn.commit()
        cursor.close()
        return jsonify({"success": True, "product_id": product_id}), 200
    except Exception as e:
        if conn:
            conn.rollback()
        print(f"ERROR in update_product: {e}")
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500
    finally:
        if conn:
            conn.close()

from flask import jsonify
from src.init import get_db_connection
from psycopg2.extras import RealDictCursor
import traceback

from src.queries import product_queries

def get_all_products():
    conn = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor(cursor_factory=RealDictCursor)

        # Auto-migrate user_id column
        cursor.execute(product_queries.CHECK_USER_ID_COLUMN)
        if not cursor.fetchone():
            cursor.execute(product_queries.ADD_USER_ID_COLUMN)
            cursor.execute(product_queries.SEED_USER_ID_COLUMN)
            conn.commit()

        # ดึงรายการสินค้าพร้อมหมวดหมู่และราคาล่าสุด
        cursor.execute(product_queries.ALL_PRODUCTS)
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
        cursor.execute(product_queries.GET_CATEGORY_ID, (category,))
        cat_row = cursor.fetchone()
        if cat_row:
            cat_id = cat_row[0]
        else:
            cursor.execute(product_queries.INSERT_CATEGORY, (category,))
            cat_id = cursor.fetchone()[0]

        # 2. Insert product
        cursor.execute(product_queries.INSERT_PRODUCT, (name, cat_id, user_id))
        product_id = cursor.fetchone()[0]

        # 3. Insert variant with price
        sku = f"SKU-{product_id}-01"
        cursor.execute(product_queries.INSERT_VARIANT, (product_id, sku, price, 0))

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
            cursor.execute(product_queries.GET_CATEGORY_ID, (category,))
            cat_row = cursor.fetchone()
            if cat_row:
                cat_id = cat_row[0]
            else:
                cursor.execute(product_queries.INSERT_CATEGORY, (category,))
                cat_id = cursor.fetchone()[0]
            cursor.execute(product_queries.UPDATE_PRODUCT_BASE, (name, cat_id, user_id, product_id))
        else:
            cursor.execute(product_queries.UPDATE_PRODUCT_NO_CAT, (name, user_id, product_id))

        if price is not None:
            cursor.execute(product_queries.UPDATE_VARIANT_PRICE, (price, product_id))

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

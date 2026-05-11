from flask import jsonify
from src.init import get_db_connection
from psycopg2.extras import RealDictCursor
import traceback

def get_all_products():
    conn = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor(cursor_factory=RealDictCursor)

        # ดึงรายการสินค้าพร้อมหมวดหมู่และราคาล่าสุด
        query = """
            SELECT 
                p.product_id as id, 
                p.product_name as name, 
                c.category_name as category, 
                pv.price, 
                p.updated_at as updateat
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

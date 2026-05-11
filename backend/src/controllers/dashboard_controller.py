from flask import jsonify
from src.init import get_db_connection
from psycopg2.extras import RealDictCursor
import traceback

def get_dashboard_stats():
    conn = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor(cursor_factory=RealDictCursor)

        # 1. Total Revenue (Excluding cancelled orders)
        cursor.execute("SELECT SUM(total_price) as total_revenue FROM orders WHERE order_status::text != 'cancelled'")
        revenue_row = cursor.fetchone()
        revenue = revenue_row['total_revenue'] if revenue_row and revenue_row['total_revenue'] else 0

        # 2. Total Orders
        cursor.execute("SELECT COUNT(*) as total_orders FROM orders")
        orders_count = cursor.fetchone()['total_orders']

        # 3. Total Products
        cursor.execute("SELECT COUNT(*) as total_products FROM products")
        products_count = cursor.fetchone()['total_products']

        # 4. Total Users
        cursor.execute("SELECT COUNT(*) as total_users FROM users")
        users_count = cursor.fetchone()['total_users']

        cursor.close()

        return jsonify({
            "revenue": float(revenue),
            "orders": int(orders_count),
            "products": int(products_count),
            "users": int(users_count)
        })
    except Exception as e:
        print(f"ERROR in get_dashboard_stats: {e}")
        traceback.print_exc()
        return jsonify({"error": str(e), "trace": traceback.format_exc()}), 500
    finally:
        if conn:
            conn.close()

def get_recent_orders():
    conn = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor(cursor_factory=RealDictCursor)

        query = """
            SELECT o.order_id, o.shipping_name, o.total_price, o.order_status::text as order_status, o.order_date 
            FROM orders o 
            ORDER BY o.order_date DESC 
            LIMIT 5
        """
        cursor.execute(query)
        orders = cursor.fetchall()

        cursor.close()

        # Convert decimal prices to float
        for o in orders:
            o['total_price'] = float(o['total_price'])

        return jsonify(orders)
    except Exception as e:
        print(f"ERROR in get_recent_orders: {e}")
        traceback.print_exc()
        return jsonify({"error": str(e), "trace": traceback.format_exc()}), 500
    finally:
        if conn:
            conn.close()


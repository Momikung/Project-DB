from flask import jsonify
from src.init import get_db_connection

def get_dashboard_stats():
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)

        # 1. Total Revenue
        cursor.execute("SELECT SUM(total_price) as total_revenue FROM orders WHERE order_status != 'cancelled'")
        revenue = cursor.fetchone()['total_revenue'] or 0

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
        conn.close()

        return jsonify({
            "revenue": float(revenue),
            "orders": orders_count,
            "products": products_count,
            "users": users_count
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

def get_recent_orders():
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)

        query = """
            SELECT o.order_id, o.shipping_name, o.total_price, o.order_status, o.order_date 
            FROM orders o 
            ORDER BY o.order_date DESC 
            LIMIT 5
        """
        cursor.execute(query)
        orders = cursor.fetchall()

        cursor.close()
        conn.close()

        return jsonify(orders)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

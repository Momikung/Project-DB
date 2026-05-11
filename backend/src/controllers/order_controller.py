from flask import jsonify
from src.init import get_db_connection
from psycopg2.extras import RealDictCursor
import traceback

def get_all_orders():
    conn = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor(cursor_factory=RealDictCursor)

        # ดึงข้อมูลจากตาราง orders โดยตรง
        query = """
            SELECT 
                order_id as id, 
                shipping_name as customer, 
                order_date as date, 
                total_price as amount, 
                order_status::text as status
            FROM orders
            ORDER BY order_date DESC
            LIMIT 100
        """
        cursor.execute(query)
        orders = cursor.fetchall()

        # Get stats for the top cards
        cursor.execute("SELECT COUNT(*) as count FROM orders")
        total = cursor.fetchone()['count']
        
        cursor.execute("SELECT COUNT(*) as count FROM orders WHERE order_status::text = 'pending'")
        pending = cursor.fetchone()['count']
        
        cursor.execute("SELECT COUNT(*) as count FROM orders WHERE order_status::text IN ('shipped', 'delivered')")
        shipped = cursor.fetchone()['count']
        
        cursor.execute("SELECT COUNT(*) as count FROM orders WHERE order_status::text = 'cancelled'")
        cancelled = cursor.fetchone()['count']

        cursor.close()

        # Format for frontend
        for o in orders:
            o['display_id'] = f"Order #{o['id']}"
            o['amount_formatted'] = f"$ {float(o['amount']):,.2f}"
            o['date_formatted'] = o['date'].strftime('%Y - %m - %d')
            o['status'] = str(o['status']).title()

        return jsonify({
            "orders": orders,
            "stats": {
                "total": int(total),
                "pending": int(pending),
                "shipped": int(shipped),
                "cancelled": int(cancelled)
            }
        })
    except Exception as e:
        print(f"ERROR in get_all_orders: {e}")
        traceback.print_exc()
        return jsonify({"error": str(e), "trace": traceback.format_exc()}), 500
    finally:
        if conn:
            conn.close()

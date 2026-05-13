from flask import jsonify
from src.init import get_db_connection
from psycopg2.extras import RealDictCursor
import traceback
from decimal import Decimal

from src.queries import order_queries

def get_all_orders():
    conn = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor(cursor_factory=RealDictCursor)

        # ดึงข้อมูลจากตาราง orders โดยตรง
        cursor.execute(order_queries.ALL_ORDERS)
        orders = cursor.fetchall()

        # Get stats for the top cards
        cursor.execute(order_queries.TOTAL_ORDERS_COUNT)
        total = cursor.fetchone()['count']
        
        cursor.execute(order_queries.ORDER_STATS_PENDING)
        pending = cursor.fetchone()['count']
        
        cursor.execute(order_queries.ORDER_STATS_SHIPPED)
        shipped = cursor.fetchone()['count']
        
        cursor.execute(order_queries.ORDER_STATS_CANCELLED)
        cancelled = cursor.fetchone()['count']

        # Get all order items for these orders
        order_ids = [o['id'] for o in orders]
        items_dict = {o_id: [] for o_id in order_ids}
        
        if order_ids:
            cursor.execute(order_queries.ORDER_ITEMS_BY_IDS, (tuple(order_ids),))
            
            order_items = cursor.fetchall()
            for item in order_items:
                items_dict[item['order_id']].append({
                    "name": item['product_name'],
                    "qty": int(item['quantity'] or 0),
                    "price": float(item['unit_price'] or 0),
                    "total": float(item['quantity'] or 0) * float(item['unit_price'] or 0)
                })

        cursor.close()

        # Format for frontend
        for o in orders:
            raw_amount = float(o['amount']) if o['amount'] is not None else 0.0
            o['display_id'] = f"Order #{o['id']}"
            o['amount'] = raw_amount
            o['amount_formatted'] = f"$ {raw_amount:,.2f}"
            o['date_formatted'] = o['date'].strftime('%Y - %m - %d')
            o['status'] = str(o['status']).title()
            o['items'] = items_dict.get(o['id'], [])

        return jsonify({
            "orders": list(orders),
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

from flask import jsonify
from src.init import get_db_connection
from psycopg2.extras import RealDictCursor
import random
import traceback

from src.queries import user_queries

def get_all_users():
    conn = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor(cursor_factory=RealDictCursor)

        # ดึงรายชื่อผู้ใช้พร้อมยอดรวมการสั่งซื้อ
        cursor.execute(user_queries.ALL_USERS_WITH_SPENT)
        users = cursor.fetchall()

        # Stats
        cursor.execute(user_queries.TOTAL_USERS_COUNT)
        total = cursor.fetchone()['count']
        
        cursor.execute(user_queries.ACTIVE_USERS_COUNT)
        active = cursor.fetchone()['count']

        cursor.close()
        
        platforms = ['chrome', 'ios', 'safari', 'android']
        
        for u in users:
            try:
                spent = float(u['total_spent'])
                if spent >= 50000:
                    u['rank'] = 'Platinum'
                elif spent >= 20000:
                    u['rank'] = 'Gold'
                elif spent >= 5000:
                    u['rank'] = 'Silver'
                else:
                    u['rank'] = 'Bronze'
                
                u['status'] = str(u['status']).title() if u['status'] else 'Active'
                u['platform'] = random.choice(platforms)
                u['rank_display'] = f"{u['rank']} (${spent:,.2f})"
            except Exception as e:
                print(f"Error processing user {u.get('id')}: {e}")
                u['rank'] = 'Bronze'
                u['rank_display'] = 'Bronze ($0.00)'
                u['platform'] = 'chrome'

        return jsonify({
            "users": users,
            "stats": {
                "total": total,
                "active": active,
                "reported": random.randint(1, 5),
                "new": random.randint(5, 15)
            }
        })
    except Exception as e:
        print(f"ERROR in get_all_users: {e}")
        traceback.print_exc()
        return jsonify({"error": str(e), "trace": traceback.format_exc()}), 500
    finally:
        if conn:
            conn.close()

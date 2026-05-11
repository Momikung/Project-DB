import psycopg2
import random
from datetime import datetime, timedelta
import os
import json
from dotenv import load_dotenv

load_dotenv()

def get_db_connection():
    host = os.getenv('DB_HOST', 'db') 
    return psycopg2.connect(
        host=host,
        port=os.getenv('DB_PORT', '5432'),
        user=os.getenv('DB_USER', 'postgres'),
        password=os.getenv('DB_PASSWORD', 'root*'),
        dbname=os.getenv('DB_NAME', 'DB_project')
    )

def seed_extended_data():
    conn = get_db_connection()
    cur = conn.cursor()

    try:
        # 1. Seed Coupons
        print("Seeding coupons...")
        coupons = [
            ('WELCOME10', 'percent', 10, 500),
            ('SUMMER50', 'fixed', 50, 1000),
            ('BLACKFRIDAY', 'percent', 20, 2000)
        ]
        for code, dtype, val, min_p in coupons:
            cur.execute("INSERT INTO coupons (code, discount_type, discount_value, min_purchase) VALUES (%s, %s, %s, %s) ON CONFLICT (code) DO NOTHING", (code, dtype, val, min_p))
        
        cur.execute("SELECT coupon_id, code, discount_type, discount_value FROM coupons")
        coupon_list = cur.fetchall()

        # 2. Get existing orders and users
        cur.execute("SELECT order_id, total_price, order_date FROM orders")
        orders = cur.fetchall()
        cur.execute("SELECT user_id FROM users")
        user_ids = [u[0] for u in cur.fetchall()]
        cur.execute("SELECT variant_id, product_id FROM product_variants")
        variants = cur.fetchall()

        # 3. Seed Payments for each order
        print("Seeding payments...")
        payment_methods = ['credit_card', 'bank_transfer', 'promptpay']
        payment_statuses = ['completed', 'completed', 'completed', 'failed'] # Most completed
        for oid, amount, odate in orders:
            cur.execute("SELECT 1 FROM payments WHERE order_id = %s", (oid,))
            if not cur.fetchone():
                method = random.choice(payment_methods)
                status = random.choice(payment_statuses)
                paid_at = odate + timedelta(minutes=random.randint(5, 60)) if status == 'completed' else None
                cur.execute("""
                    INSERT INTO payments (order_id, payment_method, amount, status, transaction_ref, paid_at)
                    VALUES (%s, %s, %s, %s, %s, %s)
                """, (oid, method, amount, status, f'TXN-{oid}-{random.randint(1000,9999)}', paid_at))

        # 4. Seed Reviews
        print("Seeding reviews...")
        cur.execute("SELECT product_id FROM products")
        product_ids = [p[0] for p in cur.fetchall()]
        comments = [
            "Great product, highly recommend!", "Quality is okay for the price.",
            "Fast shipping, item as described.", "Not what I expected.",
            "Best purchase ever!", "Could be better.", "Amazing value.",
            "I love this brand.", "Very useful.", "Will buy again."
        ]
        for _ in range(50):
            pid = random.choice(product_ids)
            uid = random.choice(user_ids)
            rating = random.randint(3, 5) if random.random() > 0.2 else random.randint(1, 3)
            comment = random.choice(comments)
            cur.execute("INSERT INTO reviews (product_id, user_id, rating, comment) VALUES (%s, %s, %s, %s)", (pid, uid, rating, comment))

        # 5. Seed Activity Logs
        print("Seeding activity logs...")
        actions = ['login', 'view_product', 'add_to_cart', 'checkout_start']
        for _ in range(100):
            uid = random.choice(user_ids)
            action = random.choice(actions)
            details = json.dumps({"ip": "127.0.0.1", "device": "mobile" if random.random() > 0.5 else "desktop"})
            cur.execute("INSERT INTO activity_logs (user_id, action, details) VALUES (%s, %s, %s)", (uid, action, details))

        # 6. Seed Inventory Logs
        print("Seeding inventory logs...")
        reasons = ['Restock', 'Damage', 'Return', 'Initial Stock']
        for vid, pid in variants:
            uid = random.choice(user_ids) # Admin/Manager usually
            change = random.randint(10, 50)
            reason = random.choice(reasons)
            cur.execute("INSERT INTO inventory_logs (variant_id, user_id, change_qty, reason) VALUES (%s, %s, %s, %s)", (vid, uid, change, reason))

        conn.commit()
        print("Success! Extended data seeded.")

    except Exception as e:
        conn.rollback()
        print(f"Error: {e}")
    finally:
        cur.close()
        conn.close()

if __name__ == "__main__":
    seed_extended_data()

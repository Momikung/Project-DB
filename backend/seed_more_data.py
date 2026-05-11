import psycopg2
import random
from datetime import datetime, timedelta
import os
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

def seed_data():
    conn = get_db_connection()
    cur = conn.cursor()

    try:
        # 1. Add 2 new roles
        print("Adding roles...")
        new_roles = ['Manager', 'Editor']
        for r_name in new_roles:
            cur.execute("SELECT role_id FROM roles WHERE role_name = %s", (r_name,))
            if not cur.fetchone():
                cur.execute("INSERT INTO roles (role_name) VALUES (%s)", (r_name,))
        
        cur.execute("SELECT role_id FROM roles")
        role_ids = [r[0] for r in cur.fetchall()]

        # 2. Add 5 more users
        print("Adding users...")
        first_names = ['Somsak', 'Wichai', 'Malee', 'Ananda', 'Praew']
        last_names = ['Raksit', 'Ubon', 'Jit', 'Everingham', 'Ploy']
        for i in range(5):
            email = f'user{i+100}@example.com'
            cur.execute("SELECT user_id FROM users WHERE email = %s", (email,))
            if not cur.fetchone():
                cur.execute("""
                    INSERT INTO users (user_uuid, email, password_hash, first_name, last_name, role_id, status)
                    VALUES (%s, %s, %s, %s, %s, %s, %s)
                """, (
                    f'uuid-user-{i+100}', 
                    email, 
                    'hashed_pass', 
                    first_names[i], 
                    last_names[i], 
                    random.choice(role_ids), 
                    'active'
                ))

        # 3. Add 10 more products in different categories
        print("Adding products...")
        new_cats = ['Furniture', 'Sports', 'Books', 'Kitchen']
        for c_name in new_cats:
            cur.execute("SELECT category_id FROM categories WHERE category_name = %s", (c_name,))
            if not cur.fetchone():
                cur.execute("INSERT INTO categories (category_name) VALUES (%s)", (c_name,))
        
        cur.execute("SELECT category_id FROM categories")
        cat_ids = [c[0] for c in cur.fetchall()]

        product_names = [
            'Ergonomic Chair', 'Dumbbell Set', 'Python Cookbook', 'Air Fryer', 
            'Standing Desk', 'Yoga Mat', 'Harry Potter Boxset', 'Espresso Machine',
            'Gaming Mouse', 'Mechanical Keyboard'
        ]
        
        variant_ids = []
        for i, p_name in enumerate(product_names):
            cur.execute("INSERT INTO products (product_name, category_id) VALUES (%s, %s) RETURNING product_id", (p_name, random.choice(cat_ids)))
            pid = cur.fetchone()[0]
            price = random.uniform(500, 15000)
            cost_price = price * 0.7
            cur.execute("INSERT INTO product_variants (product_id, sku, cost_price, price, stock_qty) VALUES (%s, %s, %s, %s, %s) RETURNING variant_id", 
                        (pid, f'SKU-{pid}-{random.randint(1000,9999)}', cost_price, price, random.randint(10, 100)))
            variant_ids.append(cur.fetchone()[0])

        # 4. Generate 10 transactions per month (2024 - 2026 May)
        print("Adding transactions...")
        cur.execute("SELECT user_id FROM users")
        user_ids = [u[0] for u in cur.fetchall()]
        
        provinces = ['Bangkok', 'Chiang Mai', 'Phuket', 'Chonburi', 'Khon Kaen']
        statuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled']
        
        start_date = datetime(2024, 1, 1)
        end_date = datetime(2026, 5, 12)
        
        current_date = start_date
        while current_date <= end_date:
            print(f"  Seeding {current_date.strftime('%Y-%m')}...")
            for _ in range(10):
                uid = random.choice(user_ids)
                prov = random.choice(provinces)
                status = random.choice(statuses)
                day = random.randint(1, 28)
                order_date = current_date.replace(day=day)
                
                cur.execute("""
                    INSERT INTO orders (user_id, shipping_name, shipping_province, total_price, sub_total, order_status, order_date, 
                                      shipping_phone, shipping_address_line, shipping_sub_district, shipping_district, shipping_zip_code)
                    VALUES (%s, %s, %s, %s, %s, %s, %s, '0812345678', 'Address Line', 'SubDist', 'Dist', '10100') RETURNING order_id
                """, (uid, f'Customer {random.randint(1, 1000)}', prov, 0, 0, status, order_date))
                oid = cur.fetchone()[0]
                
                total = 0
                for _ in range(random.randint(1, 3)):
                    vid = random.choice(variant_ids)
                    cur.execute("SELECT price, cost_price, product_id, sku FROM product_variants WHERE variant_id = %s", (vid,))
                    res = cur.fetchone()
                    price = res[0]
                    cost = res[1]
                    pid = res[2]
                    sku = res[3]
                    
                    cur.execute("SELECT product_name FROM products WHERE product_id = %s", (pid,))
                    p_name = cur.fetchone()[0]
                    
                    qty = random.randint(1, 2)
                    cur.execute("""
                        INSERT INTO order_items (order_id, variant_id, quantity, unit_price, unit_cost, product_name, sku)
                        VALUES (%s, %s, %s, %s, %s, %s, %s)
                    """, (oid, vid, qty, price, cost, p_name, sku))
                    total += (price * qty)
                
                cur.execute("UPDATE orders SET total_price = %s, sub_total = %s WHERE order_id = %s", (total, total, oid))

            if current_date.month == 12:
                current_date = current_date.replace(year=current_date.year + 1, month=1)
            else:
                current_date = current_date.replace(month=current_date.month + 1)

        conn.commit()
        print("Success! Data seeded.")

    except Exception as e:
        conn.rollback()
        print(f"Error: {e}")
    finally:
        cur.close()
        conn.close()

if __name__ == "__main__":
    seed_data()

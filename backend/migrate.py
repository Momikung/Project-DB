import os
from dotenv import load_dotenv
import psycopg2

load_dotenv()

conn = psycopg2.connect(
    host=os.getenv("DB_HOST", "localhost"),
    database=os.getenv("DB_NAME", "ecom"),
    user=os.getenv("DB_USER", "postgres"),
    password=os.getenv("DB_PASSWORD", "postgres"),
    port=os.getenv("DB_PORT", "5432")
)
conn.autocommit = True
cur = conn.cursor()

try:
    cur.execute("ALTER TABLE products ADD COLUMN user_id INTEGER REFERENCES users(user_id);")
    print("Added user_id column to products.")
except Exception as e:
    print(f"Error (maybe already exists): {e}")

try:
    # Update existing products with random users just to populate
    cur.execute("UPDATE products SET user_id = (SELECT user_id FROM users ORDER BY RANDOM() LIMIT 1) WHERE user_id IS NULL;")
    print("Populated existing products with random user_id.")
except Exception as e:
    print(f"Error populating: {e}")

cur.close()
conn.close()

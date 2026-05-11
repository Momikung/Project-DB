import psycopg2
import os

def test_conn():
    try:
        print("Testing connection with root* ...")
        conn = psycopg2.connect(
            host="127.0.0.1",
            port=5433,
            user="postgres",
            password="root*",
            dbname="DB_project"
        )
        print("Connection successful!")
        conn.close()
    except Exception as e:
        print(f"Connection failed: {e}")

if __name__ == "__main__":
    test_conn()

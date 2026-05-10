import mysql.connector
import os
from dotenv import load_dotenv

load_dotenv()

def get_db_connection():
    db_config = {
        'host': os.getenv('DB_HOST', 'localhost'),
        'user': os.getenv('DB_USER', 'root'),
        'password': os.getenv('DB_PASSWORD', ''),
        'database': os.getenv('DB_NAME', 'ps09_system')
    }
    return mysql.connector.connect(**db_config)

def get_db_version():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT VERSION()")
    version = cursor.fetchone()
    cursor.close()
    conn.close()
    return version[0] if version else "Unknown"

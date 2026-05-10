from flask import jsonify
from src.init import get_db_version

def health_check_controller():
    return jsonify({"status": "Backend is running", "message": "Flask is connected!"})

def db_test_controller():
    try:
        version = get_db_version()
        return jsonify({
            "status": "Success",
            "database_version": version,
            "message": "Connected to MySQL successfully!"
        })
    except Exception as e:
        return jsonify({
            "status": "Error",
            "message": str(e)
        }), 500

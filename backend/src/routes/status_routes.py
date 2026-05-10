from flask import Blueprint
from src.controllers.status_controller import health_check_controller, db_test_controller

status_bp = Blueprint('status', __name__)

@status_bp.route('/health', methods=['GET'])
def health():
    return health_check_controller()

@status_bp.route('/db-test', methods=['GET'])
def db_test():
    return db_test_controller()

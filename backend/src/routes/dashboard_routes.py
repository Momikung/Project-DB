from flask import Blueprint
from src.controllers.dashboard_controller import get_dashboard_stats, get_recent_orders

dashboard_bp = Blueprint('dashboard', __name__)

@dashboard_bp.route('/stats', methods=['GET'])
def stats():
    return get_dashboard_stats()

@dashboard_bp.route('/recent-orders', methods=['GET'])
def recent_orders():
    return get_recent_orders()

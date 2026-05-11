from flask import Blueprint
from src.controllers.order_controller import get_all_orders

order_bp = Blueprint('orders', __name__)

@order_bp.route('/', methods=['GET'])
def list_orders():
    return get_all_orders()

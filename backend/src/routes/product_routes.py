from flask import Blueprint
from src.controllers.product_controller import get_all_products

product_bp = Blueprint('products', __name__)

@product_bp.route('/', methods=['GET'])
def list_products():
    return get_all_products()

from flask import Blueprint, request
from src.controllers.product_controller import get_all_products, create_product, update_product

product_bp = Blueprint('products', __name__)

@product_bp.route('/', methods=['GET'])
def list_products():
    return get_all_products()

@product_bp.route('/', methods=['POST'])
def add_product():
    return create_product()

@product_bp.route('/<int:product_id>', methods=['PUT'])
def edit_product(product_id):
    return update_product(product_id)

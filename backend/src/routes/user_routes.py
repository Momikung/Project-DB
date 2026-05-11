from flask import Blueprint
from src.controllers.user_controller import get_all_users

user_bp = Blueprint('users', __name__)

@user_bp.route('/', methods=['GET'])
def list_users():
    return get_all_users()

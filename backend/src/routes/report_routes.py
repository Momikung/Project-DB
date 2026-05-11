from flask import Blueprint
from src.controllers.report_controller import get_report_data

report_bp = Blueprint('reports', __name__)

@report_bp.route('/data', methods=['GET'])
def get_report():
    return get_report_data()

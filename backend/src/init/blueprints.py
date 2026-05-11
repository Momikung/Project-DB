from src.routes.status_routes import status_bp
from src.routes.dashboard_routes import dashboard_bp
from src.routes.product_routes import product_bp
from src.routes.order_routes import order_bp
from src.routes.user_routes import user_bp
from src.routes.report_routes import report_bp

def register_blueprints(app):
    app.register_blueprint(status_bp, url_prefix='/api')
    app.register_blueprint(dashboard_bp, url_prefix='/api/dashboard')
    app.register_blueprint(product_bp, url_prefix='/api/products')
    app.register_blueprint(order_bp, url_prefix='/api/orders')
    app.register_blueprint(user_bp, url_prefix='/api/users')
    app.register_blueprint(report_bp, url_prefix='/api/reports')


from src.routes.status_routes import status_bp
from src.routes.dashboard_routes import dashboard_bp

def register_blueprints(app):
    app.register_blueprint(status_bp, url_prefix='/api')
    app.register_blueprint(dashboard_bp, url_prefix='/api/dashboard')

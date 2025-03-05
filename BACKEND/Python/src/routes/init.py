from flask import Blueprint
from src.routes.auth_router import auth_blueprint
# from src.controllers.dashboard_routes import dashboard_bp

def init_routes(app):
    # Registrar Blueprints
    #Login
    app.register_blueprint(auth_blueprint, url_prefix="/auth")
    #Dashboards
    # app.register_blueprint(dashboard_bp, url_prefix="/dash")

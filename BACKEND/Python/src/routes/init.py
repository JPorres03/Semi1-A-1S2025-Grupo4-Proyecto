from flask import Blueprint
from src.routes.auth_router import auth_blueprint
from src.routes.user_router import user_blueprint
from src.routes.health_router import healtg_blueprint
from src.routes.admin_router import admin_blueprint
from src.routes.book_router import book_blueprint
from src.routes.catego_router import categorie_blueprint
# from src.controllers.dashboard_routes import dashboard_bp

def init_routes(app):
    # Registrar Blueprints
    #Login
    app.register_blueprint(healtg_blueprint)
    app.register_blueprint(auth_blueprint, url_prefix="/auth")
    app.register_blueprint(user_blueprint, url_prefix="/users")
    app.register_blueprint(book_blueprint, url_prefix="/books")
    app.register_blueprint(admin_blueprint, url_prefix="/admin")
    app.register_blueprint(categorie_blueprint, url_prefix="/categories")
    #Dashboards
    # app.register_blueprint(dashboard_bp, url_prefix="/dash")

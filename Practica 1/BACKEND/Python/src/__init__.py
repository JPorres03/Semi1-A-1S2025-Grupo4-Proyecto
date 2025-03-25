from flask import Flask
from src.utils.config import Config
from flask_cors import CORS
from src.routes.init import init_routes
from src.utils.db_connection import init_databases

def create_app():
    app = Flask(__name__)
    CORS(app)
    # Carga configuracion de db
    app.config.from_object(Config)
    
    # Inicializar bases de datos
    init_databases(app)

    # Registrar rutas
    init_routes(app)

    return app

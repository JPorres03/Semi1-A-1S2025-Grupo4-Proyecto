from flask_sqlalchemy import SQLAlchemy
# Extensiones de bases de datos
db = SQLAlchemy()

def init_databases(app):
    # Inicializar SQL Server
    db.init_app(app)
    
    from src.models.User import User
    from src.models.Book import Book
    from src.models.Category import Category
    from src.models.Adquisicion import Adquisicion
    from src.models.CategoryBooks import CategoryBooks

    with app.app_context():
        db.create_all()
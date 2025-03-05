from flask_sqlalchemy import SQLAlchemy


# Extensiones de bases de datos
db = SQLAlchemy()


def init_databases(app):
    # Inicializar SQL Server
    db.init_app(app)
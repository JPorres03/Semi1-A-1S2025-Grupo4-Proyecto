from werkzeug.security import generate_password_hash, check_password_hash
from src.utils.db_connection import db
from sqlalchemy.orm import relationship

class Category(db.Model):
    __tablename__="categorias"
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    nombre = db.Column(db.String)
    libros_categorias = relationship("CategoryBooks", back_populates="categoria")
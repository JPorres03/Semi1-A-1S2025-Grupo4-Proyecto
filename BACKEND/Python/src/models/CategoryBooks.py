from src.utils.db_connection import db
from sqlalchemy import ForeignKey
from sqlalchemy.orm import relationship

class CategoryBooks(db.Model):
    __tablename__="libros_categorias"
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    libro_id = db.Column(db.Integer, ForeignKey('libros.id'))
    categoria_id = db.Column(db.Integer, ForeignKey('categorias.id'))

    categoria = relationship("Category", back_populates="libros_categorias")
    libro = relationship("Book", back_populates="libros_categorias")
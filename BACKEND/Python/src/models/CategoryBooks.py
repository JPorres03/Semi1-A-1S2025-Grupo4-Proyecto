from utils.db_connection import db
from sqlalchemy import ForeignKey
from sqlalchemy.orm import relationship

class CategoryBooks(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    libro_id = db.Column(db.Integer, ForeignKey('libros.id'))
    categoria_id = db.Column(db.Integer, ForeignKey('categorias.id'))

    categoria = relationship("Category", back_populates="libros_categorias")
    libro = relationship("Book", back_populates="libros_categorias")
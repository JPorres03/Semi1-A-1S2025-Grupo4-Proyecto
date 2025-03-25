from sqlalchemy.orm import relationship
from src.utils.db_connection import db


class Book(db.Model):
    __tablename__ = "libros"
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    nombre = db.Column(db.String)
    autor = db.Column(db.String)
    sinopsis = db.Column(db.String)
    portada_url = db.Column(db.String)
    pdf_url = db.Column(db.String)
    anio_publicacion = db.Column(db.Integer)
    
    # Relaciones
    adquisiciones = relationship("Adquisicion", back_populates="libro")
    libros_categorias = relationship("CategoryBooks", back_populates="libro")
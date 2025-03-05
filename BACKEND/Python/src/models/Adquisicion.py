from utils.db_connection import db
from sqlalchemy import ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime

class Adquisicion(db.Model):
    __tablename__="adquisiciones"
    id = db.Column(db.Integer, primary_key=True)
    usuario_id = db.Column(db.Integer, ForeignKey('usuarios.id'))
    libro_id = db.Column(db.Integer, ForeignKey('libros.id'))
    fecha_adquisicion = db.Column(db.DateTime, default=datetime.utcnow)

    usuario = relationship("User", back_populates="adquisiciones")
    libro = relationship("Book", back_populates="adquisiciones")
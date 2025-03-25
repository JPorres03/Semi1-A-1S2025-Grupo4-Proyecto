from src.utils.db_connection import db
from sqlalchemy.orm import relationship
import bcrypt

class User(db.Model):
    __tablename__ = "usuarios"
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    nombres = db.Column(db.String)
    apellidos = db.Column(db.String)
    email = db.Column(db.String)
    password_hash = db.Column(db.String)
    foto_perfil_url = db.Column(db.String)
    fecha_nacimiento = db.Column(db.Date)
    rol = db.Column(db.String)
    adquisiciones = relationship("Adquisicion", back_populates="usuario")

    def set_password(self, password):
        self.password_hash = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

    def check_password(self, password):
        return bcrypt.checkpw(password.encode('utf8'), self.password_hash.encode('utf-8'))

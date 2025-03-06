from flask import jsonify, request
from src.models.User import User
from src.utils.db_connection import db

def test_connection_controller():
    try:
        users = User.query.all()
        user_list = [{"id": user.id, "username": user.nombres, "email": user.email, "contra": user.password_hash, "nacimiento": user.fecha_nacimiento} for user in users]
        return jsonify(user_list)
    except Exception as e:
        return jsonify({"error": str(e)})
    
def login_controller():
    try:
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')

        usuario = User.query.filter_by(email=email).first()

        if usuario and usuario.check_password(password):
            return jsonify(user_id = usuario.id, role = usuario.rol, email = usuario.email), 200
        else:
            return jsonify(mesagge = "Credenciales invalidas"), 401
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
def register_controller():
    try:
        data = request.get_json()
        nombres = data.get('nombres')
        apellidos = data.get('apellidos')
        email= data.get('email')
        password = data.get('password')
        # foto 
        fecha_nacimeinto = data.get('fecha_nacimiento')
        rol = data.get('rol')

        foto_perfil_url=""

        user_correo = User.query.filter_by(email=email).first()
        if user_correo:
            return jsonify(message="Correo Duplicado", descripcion='Este correo ya esta asignado'), 401
        
        new_user = User(
            nombres=nombres,
            apellidos=apellidos,
            email=email,
            password_hash=password,
            foto_perfil_url="",
            fecha_nacimiento=fecha_nacimeinto,
            rol=rol
        )

        new_user.set_password(new_user.password_hash)
        db.session.add(new_user)
        db.session.commit()

        return jsonify(user_id = new_user.id, role = new_user.rol, email = new_user.email), 200
    except Exception as e:
        db.session.rollback()
        return jsonify(error = str(e)),500
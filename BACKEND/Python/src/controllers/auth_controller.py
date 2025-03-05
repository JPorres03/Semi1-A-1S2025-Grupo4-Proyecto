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
            return jsonify(user = usuario.nombres, role = usuario.rol, email = usuario.email), 200
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

        return jsonify(user = new_user.nombres, role = new_user.rol, email = new_user.email, naciemiento=new_user.fecha_nacimiento), 200
    except Exception as e:
        db.session.rollback()
        return jsonify(error = str(e)),500
    
def update_controller(_id, data):
    try:
        user = User.query.get(_id)
        if not user:
            return jsonify(error="Usuario no encontrado"), 404
        
        if 'nombres' in data:
            user.nombres = data['nombres']
        if 'apellidos' in data:
            user.apellidos = data['apellidos']
        if 'email' in data:
            user.email = data['email']
        if 'password' in data:
            user.password = data['password']
        if 'fecha_nacimiento' in data:
            user.fecha_nacimiento = data['fecha_nacimiento']
        if 'rol' in data:
            user.rol = data['rol']
        
        db.session.commit()

        return jsonify(message = "Usuario actualizado con exito"), 200
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500
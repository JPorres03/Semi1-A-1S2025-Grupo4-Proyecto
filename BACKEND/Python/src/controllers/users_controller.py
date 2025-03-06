from flask import jsonify, request
from src.utils.db_connection import db
from sqlalchemy.orm import joinedload
from src.models.User import User
from src.models.Adquisicion import Adquisicion


def update_controller(_id, data):
    try:
        user = User.query.get(_id)
        if not user:
            return jsonify(error="Usuario no encontrado"), 404
        
        # Verificar solo si se intenta cambiar el email
        if 'email' in data:
            nuevo_email = data['email'].lower()
            if nuevo_email != user.email.lower():
                # Buscar si otro usuario ya tiene el nuevo email
                existing_user = User.query.filter(
                    User.email == nuevo_email,
                    User.id != user.id  # Excluir al usuario actual
                ).first()
                if existing_user:
                    return jsonify(error="El email ya está registrado en otro usuario"), 400
                user.email = nuevo_email  # Actualizar solo si pasa la validación

        # Actualizar otros campos si existen en 'data' y son diferentes
        if 'nombres' in data and data['nombres'] != user.nombres:
            user.nombres = data['nombres']
        if 'apellidos' in data and data['apellidos'] != user.apellidos:
            user.apellidos = data['apellidos']
        if 'fecha_nacimiento' in data and data['fecha_nacimiento'] != user.fecha_nacimiento:
            user.fecha_nacimiento = data['fecha_nacimiento']
        if 'rol' in data and data['rol'] != user.rol:
            user.rol = data['rol']

        db.session.commit()
        return jsonify(message="Usuario actualizado con éxito"), 200
    
    except Exception as e:
        db.session.rollback()  # Revertir cambios en caso de error
        return jsonify(error=str(e)), 500
    
def user_books_controller(_id):
    try:
        user = db.session.query(User)\
        .options(joinedload(User.adquisiciones).joinedload(Adquisicion.libro))\
        .filter(User.id == _id)\
        .first()

        if not user:
            return jsonify(error = "Usuario no encontrado"), 404
        
        book_list = [
            {
                "id": adquisicion.libro.id,
                "nombre": adquisicion.libro.nombre,
                "autor": adquisicion.libro.autor,
                "sinopsis": adquisicion.libro.sinopsis,
                "portada_url": adquisicion.libro.portada_url,
                "pdf_url": adquisicion.libro.pdf_url,
                "publicacion": adquisicion.libro.anio_publicacion
            }
            for adquisicion in user.adquisiciones
        ]

        if len(book_list) == 0:
            return jsonify(message = "El usuario no ha aquirido ningun libro!"), 404

        return jsonify(user_id= _id, total_books = len(book_list), books = book_list), 200
    except Exception as e:
        return jsonify(error = str(e)), 500
    
def get_user_controller(id):
    try:
        user = User.query.get(id)
        if not user:
            return jsonify(error="Usuario no encontrado"), 404
        
        return jsonify(
            id = user.id,
            nombres = user.nombres,
            apellidos = user.apellidos,
            email = user.email,
            password_hash = user.password_hash,
            foto_perfil_url = user.foto_perfil_url,
            fecha_nacimiento = user.fecha_nacimiento,
            rol = user.rol
        ), 200

    except Exception as e:
        return jsonify(error = str(e)), 500
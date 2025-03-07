from flask import jsonify, request
from src.models.User import User
from src.utils.db_connection import db
from werkzeug.utils import secure_filename
import boto3
import os
import uuid

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
    
def register_controller(data):
    try:
        nombres = request.form.get('nombres')
        apellidos = request.form.get('apellidos')
        email= request.form.get('email')
        password = request.form.get('password')
        # foto 
        fecha_nacimeinto = request.form.get('fecha_nacimiento')
        rol = request.form.get('rol')

        foto_perfil=request.files.get('foto_perfil')

        # nombre unico para la imagen
        if foto_perfil:
            filename = f"{uuid.uuid4()}_{secure_filename(foto_perfil.filename)}"
        else:
            return jsonify(error = "No se pudo cargar la foto del perfil"), 500

        s3 = boto3.client(
            's3',
            region_name = os.getenv('AWS_REGION'),
            aws_access_key_id = os.getenv('AWS_ACCESS_KEY_ID'),
            aws_secret_access_key = os.getenv('AWS_SECRET_ACCESS_KEY')
        )

        if foto_perfil:
            s3.upload_fileobj(
                foto_perfil,
                os.getenv('S3_BUCKET'),
                f"Fotos/{filename}",
                ExtraArgs={'ContentType': foto_perfil.content_type}
            )
            foto_url = f"https://{os.getenv('S3_BUCKET')}.s3.amazonaws.com/Fotos/{filename}"
        else:
            foto_url = None
            return jsonify(error = "No se pudo cargar la foto del perfil"), 500

        user_correo = User.query.filter_by(email=email).first()
        if user_correo:
            return jsonify(message="Correo Duplicado", descripcion='Este correo ya esta asignado'), 401
        
        new_user = User(
            nombres=nombres,
            apellidos=apellidos,
            email=email,
            password_hash=password,
            foto_perfil_url=foto_url,
            fecha_nacimiento=fecha_nacimeinto,
            rol=rol
        )

        new_user.set_password(new_user.password_hash)
        db.session.add(new_user)
        db.session.commit()

        return jsonify(user_id = new_user.id, role = new_user.rol, email = new_user.email, foto=foto_url), 200
    except Exception as e:
        db.session.rollback()
        return jsonify(error = str(e)),500
from flask import jsonify, request
from src.utils.db_connection import db
from src.models.Book import Book
from src.models.Category import Category
from src.models.Adquisicion import Adquisicion
from src.models.CategoryBooks import CategoryBooks
from werkzeug.utils import secure_filename
import boto3
import os
import uuid

def create_book_controller():
    try:
        nombre = request.form.get('nombre')
        autor = request.form.get('autor')
        sinopsis = request.form.get('sinopsis')
        portada = request.files.get('portada')
        pdf = request.files.get('pdf')
        anio_publicacion = request.form.get('anio_publicacion')
        categorias = request.form.getlist('categorias')

        book = Book.query.filter_by(nombre=nombre).first()
        if book:
            return jsonify(message="Nombre duplicado", descripcion='Este nombre ya esta asignado a otro libro'), 401
        
        categorias_count = db.session.query(Category.id)\
            .filter(Category.id.in_(categorias))\
            .distinct()\
            .count()
        
        if categorias_count != len(categorias) or len(categorias) < 1:
            return jsonify(error="Categorías inválidas o duplicadas"), 400

        # carga de foto a S3
        if portada:
            filename = f"{uuid.uuid4()}_{secure_filename(portada.filename)}"
        else:
            filename = None

        s3 = boto3.client(
            's3',
            region_name = os.getenv('AWS_REGION'),
            aws_access_key_id = os.getenv('AWS_ACCESS_KEY_ID'),
            aws_secret_access_key = os.getenv('AWS_SECRET_ACCESS_KEY')
        )

        if portada:
            s3.upload_fileobj(
                portada,
                os.getenv('S3_BUCKET'),
                f"Fotos/{filename}",
                ExtraArgs={'ContentType': portada.content_type}
            )
            portada_url = f"https://{os.getenv('S3_BUCKET')}.s3.amazonaws.com/Fotos/{filename}"
        else:
            portada_url = None
            return jsonify(error = "No se pudo cargar la portada del libro"), 500

        # Carga del libro a S3
        if pdf:
            filename = f"{uuid.uuid4()}_{secure_filename(pdf.filename)}"

            s3.upload_fileobj(
                pdf,
                os.getenv('S3_BUCKET'),
                f"Libros/{filename}",
                ExtraArgs={'ContentType':"application/pdf"}
            )
            pdf_url = f"https://{os.getenv('S3_BUCKET')}.s3.amazonaws.com/Libros/{filename}"
        else:
            pdf_url = None
            return jsonify(error = "No se pudo cargar el pdf"), 500


        new_book = Book(
            nombre=nombre,
            autor=autor,
            sinopsis=sinopsis,
            portada_url=portada_url,
            pdf_url=pdf_url,
            anio_publicacion=anio_publicacion
        )

        db.session.add(new_book)
        db.session.flush()

        categorias_data = [
            {"libro_id": new_book.id, "categoria_id": categoria_id}
            for categoria_id in categorias
        ]
        db.session.bulk_insert_mappings(CategoryBooks, categorias_data)

        db.session.commit()

        return jsonify(nombre=new_book.nombre, book_id=new_book.id), 200
    except Exception as e:
        db.session.rollback()
        return jsonify(error = str(e)), 500

def update_book_controller(id, data):
    try:
        book = Book.query.get(id)
        if not book:
            return jsonify(error="Libro no encontrado"), 404
        
        if 'nombre' in data and data['nombre'] != book.nombre:
            book.nombre = data['nombre']
        if 'autor' in data and data['autor'] != book.autor:
            book.autor = data['autor']
        if 'sinopsis' in data and data['sinopsis'] != book.sinopsis:
            book.sinopsis = data['sinopsis']
        if 'anio_publicacion' in data and data['anio_publicacion'] != book.anio_publicacion:
            book.anio_publicacion = data['anio_publicacion']

        db.session.commit()
        return jsonify(message = "Libro actualizado con exito")
    except Exception as e:
        db.session.rollback()
        return jsonify(error = str(e)), 500
    
def delete_book_controller(id):
    try:
        book = Book.query.get(id)
        if not book:
            return jsonify(error="Libro no encontrado"), 404
        
        Adquisicion.query.filter_by(libro_id=id).delete()
        CategoryBooks.query.filter_by(libro_id=id).delete()

        db.session.delete(book)
        db.session.commit()

        
        return jsonify(message = "Libro eliminado exitosamente"), 200
    except Exception as e:
        db.session.rollback()
        return jsonify(error = str(e)), 500
    
def update_portada_controller(id):
    try:
        book = Book.query.get(id)
        if not book:
            return jsonify(error = "libro no encontrado"), 404
        
        new_photo = request.files.get('nueva_foto')
        if new_photo:
            filename = f"{uuid.uuid4()}_{secure_filename(new_photo.filename)}"

            s3 = boto3.client(
                's3',
                region_name = os.getenv('AWS_REGION'),
                aws_access_key_id = os.getenv('AWS_ACCESS_KEY_ID'),
                aws_secret_access_key = os.getenv('AWS_SECRET_ACCESS_KEY')
            )
            s3.upload_fileobj(
                new_photo,
                os.getenv('S3_BUCKET'),
                f"Fotos/{filename}",
                ExtraArgs={'ContentType': new_photo.content_type}
            )
            foto_url = f"https://{os.getenv('S3_BUCKET')}.s3.amazonaws.com/Fotos/{filename}"
        else:
            return jsonify(error = "No se pudo actualizar foto perfil"), 501

        book.portada_url = foto_url

        db.session.commit()

        return jsonify(message = "Actualizacion exitosa"), 200


    except Exception as e:
        return jsonify(error = str(e)), 500

def update_pdf_controller(id):
    try:
        book = Book.query.get(id)
        if not book:
            return jsonify(error = "libro no encontrado"), 404
        
        nuevo_pdf = request.files.get('nuevo_pdf')
        if nuevo_pdf:
            filename = f"{uuid.uuid4()}_{secure_filename(nuevo_pdf.filename)}"

            s3 = boto3.client(
                's3',
                region_name = os.getenv('AWS_REGION'),
                aws_access_key_id = os.getenv('AWS_ACCESS_KEY_ID'),
                aws_secret_access_key = os.getenv('AWS_SECRET_ACCESS_KEY')
            )
            s3.upload_fileobj(
                nuevo_pdf,
                os.getenv('S3_BUCKET'),
                f"Fotos/{filename}",
                ExtraArgs={'ContentType': 'application/pdf'}
            )
            pdf_url = f"https://{os.getenv('S3_BUCKET')}.s3.amazonaws.com/Libros/{filename}"
        else:
            return jsonify(error = "No se pudo actualizar foto perfil"), 501

        book.pdf_url = pdf_url

        db.session.commit()

        return jsonify(message = "Actualizacion exitosa"), 200


    except Exception as e:
        return jsonify(error = str(e)), 500

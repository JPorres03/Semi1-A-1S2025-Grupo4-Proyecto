from flask import jsonify, request
from src.utils.db_connection import db
from sqlalchemy.orm import joinedload
from datetime import datetime
from src.models.User import User
from src.models.Book import Book
from src.models.Category import Category
from src.models.Adquisicion import Adquisicion
from src.models.CategoryBooks import CategoryBooks


def create_book_controller():
    try:
        data = request.get_json()
        nombre = data.get('nombre')
        autor = data.get('autor')
        sinopsis = data.get('sinopsis')
        portada_url = ""
        pdf_url = " "
        anio_publicacion = data.get('anio_publicacion')
        categorias = list(map(int, data.get('categorias')))

        book = Book.query.filter_by(nombre=nombre).first()
        if book:
            return jsonify(message="Nombre duplicado", descripcion='Este nombre ya esta asignado a otro libro'), 401
        
        categorias_count = db.session.query(Category.id)\
            .filter(Category.id.in_(categorias))\
            .distinct()\
            .count()
        
        if categorias_count != len(categorias) or len(categorias) < 1:
            return jsonify(error="Categorías inválidas o duplicadas"), 400


        new_book = Book(
            nombre=nombre,
            autor=autor,
            sinopsis=sinopsis,
            portada_url="http",
            pdf_url="http",
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

        # pendiente eliminacion de la nube

        db.session.delete(book)
        db.session.commit()

        
        return jsonify(message = "Libro eliminado exitosamente"), 200
    except Exception as e:
        db.session.rollback()
        return jsonify(error = str(e)), 500
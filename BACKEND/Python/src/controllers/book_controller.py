from flask import jsonify, request
from src.utils.db_connection import db
from sqlalchemy.orm import joinedload
from src.models.Book import Book
from src.models.User import User
from src.models.Category import Category
from src.models.Adquisicion import Adquisicion
from src.models.CategoryBooks import CategoryBooks

def all_books_controller():
    try:
        books = Book.query.all()

        books_list = []
        for book in books:
            data_book = {
                "id": book.id,
                "nombre": book.nombre,
                "autor": book.autor,
                "portada_url": book.portada_url
            }
            books_list.append(data_book)

        return jsonify(books_list), 200
    except Exception as e:
        return jsonify(error = str(e)), 500


def book_name_controller(data):
    try:
        nombre = data.get('nombre')
        book = Book.query.filter_by(nombre=nombre).first()
        if not book:
            return jsonify(error = "No se encontro ningun libro con ese nombre"), 404
        
        return jsonify(
                id = book.id,
                nombre = book.nombre,
                autor = book.autor,
                portada_url = book.portada_url
        ), 200
    except Exception as e:
        return jsonify(error = str(e)), 500
    
def book_details_controller(id):
    try:
        book = db.session.query(Book)\
            .options(
                joinedload(Book.libros_categorias)  # Cargar la relación libros_categorias
                .joinedload(CategoryBooks.categoria)  # Cargar la categoría desde la tabla intermedia
            )\
            .filter(Book.id == id)\
            .first()
        if not book:
            return jsonify(error = "No se encontro ningun libro con ese id"), 404
        
        categoria_list = [
            {
                "id": cd.categoria.id,
                "nombre": cd.categoria.nombre
            }
            for cd in book.libros_categorias
        ]

        return jsonify(
            id = book.id,
            nombre = book.nombre,
            autor = book.autor,
            sinopsis = book.sinopsis,
            portada_url = book.portada_url,
            pdf_url = book.pdf_url,
            anio = book.anio_publicacion,
            categoria = categoria_list
        ), 200
    except Exception as e:
        return jsonify(error = str(e)), 500
    
def acquire_book_controller(id, data):
    try:
        id_user = data.get('usuario_id')

        usuario = User.query.get(id_user)
        book = Book.query.get(id)

        if not usuario:
            return jsonify(error = "Usuario no encontrad"), 404
        if not book:
            return jsonify(error = "Libro no encontrado"), 404
        
        adquisicion_exists = Adquisicion.query.filter_by(usuario_id=id_user, libro_id=id).first()
        if adquisicion_exists:
            return jsonify({"error": "El usuario ya adquirió este libro"}), 400
        
        adquisicion = Adquisicion(
            usuario_id=usuario.id,
            libro_id=book.id
        )
        db.session.add(adquisicion)
        db.session.commit()

        return jsonify(message="Adquisicion realizada con exito"), 200

    except Exception as e:
        return jsonify(error = str(e)),500

def read_book_controller(id):
    try:
        book = Book.query.get(id)
        if not book:
            return jsonify(error = "No se encontro ningun libro con ese id"), 404
        
        return jsonify(pdf_url = book.pdf_url), 200

    except Exception as e:
        return jsonify(erro = str(e)), 500
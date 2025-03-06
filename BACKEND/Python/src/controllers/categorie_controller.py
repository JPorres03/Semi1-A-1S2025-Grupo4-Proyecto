from flask import jsonify, request
from src.utils.db_connection import db
from sqlalchemy.orm import joinedload
from datetime import datetime
from src.models.User import User
from src.models.Book import Book
from src.models.Category import Category
from src.models.Adquisicion import Adquisicion
from src.models.CategoryBooks import CategoryBooks

def categories_controller():
    try:
        categories = Category.query.all()

        categorie_list = []
        for categorie in categories:
            data_categorie = {
                "id": categorie.id,
                "nombre": categorie.nombre
            }
            categorie_list.append(data_categorie)
        
        return jsonify(categorie_list), 200

    except Exception as e:
        return jsonify(error = str(e)), 500
    
def categories_book_controller(id):
    try:
        categoria = Category.query.get(id)
        if not categoria:
            return jsonify(error = "No se encontro la categoria"), 404
        
        books_categorie = Book.query\
            .join(CategoryBooks)\
            .filter(CategoryBooks.categoria_id == id)\
            .options(
                joinedload(Book.libros_categorias)
                .joinedload(CategoryBooks.categoria)
            )\
            .order_by(Book.nombre.asc())
        
        book_list = []
        for book in books_categorie:
            book_list.append({
                "id": book.id,
                "nombre": book.nombre,
                "autor": book.autor,
                "sinopsis": book.sinopsis,
                "portada_url": book.portada_url,
                "pdf_url": book.pdf_url,
                "publicacion": book.anio_publicacion,
                "categories": [
                    {"id": cb.categoria.id, "nombre":cb.categoria.nombre}
                    for cb in book.libros_categorias
                ]
            })

        return jsonify(
         book_list
        ), 200

    except Exception as e:
        return jsonify(error = str(e)), 500
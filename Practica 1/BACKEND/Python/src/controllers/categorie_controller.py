from flask import jsonify, request
from src.utils.db_connection import db
from sqlalchemy.orm import joinedload
from datetime import datetime
from src.models.User import User
from src.models.Book import Book
from src.models.Category import Category
from src.models.Adquisicion import Adquisicion
from src.models.CategoryBooks import CategoryBooks

def new_categorie_controller():
    try:
        data = request.get_json()

        nombre = data.get('nombre')
        if not nombre:
            return jsonify(error="El campo 'nombre' es requerido"), 400

        # Validar si la categoría ya existe
        existing_category = Category.query.filter_by(nombre=nombre).first()
        if existing_category:
            return jsonify(error="Ya existe una categoría con este nombre"), 409
        
        new_category = Category(nombre=nombre)
        db.session.add(new_category)
        db.session.commit()

        return jsonify(
            id=new_category.id,
            nombre=new_category.nombre
        ), 201
        

    except Exception as e:
        return jsonify(error = str(e))

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
from flask import Blueprint, jsonify
from src.controllers.book_controller import *

book_blueprint = Blueprint('books', __name__)

@book_blueprint.route('/', methods=['GET'])
def all_books():
    return all_books_controller()

@book_blueprint.route('/search', methods=['POST'])
def book_name():
    return book_name_controller(request.get_json())

@book_blueprint.route('/<int:_id>', methods=['GET'])
def book_details(_id):
    return book_details_controller(_id)

@book_blueprint.route('/<int:_id>/acquire', methods=['POST'])
def acquire_book(_id):
    return acquire_book_controller(_id, request.get_json())

@book_blueprint.route('/<int:_id>/read', methods=['GET'])
def read_book(_id):
    return read_book_controller(_id)
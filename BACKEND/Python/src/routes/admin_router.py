from flask import Blueprint, jsonify
from src.controllers.admin_controller import *

admin_blueprint = Blueprint('admin', __name__)

@admin_blueprint.route('/books', methods=['POST'])
def create_book():
    return create_book_controller()

@admin_blueprint.route('/books/<int:_id>', methods=['PUT'])
def update_book(_id):
    return update_book_controller(_id, request.get_json())

@admin_blueprint.route('/books/<int:_id>', methods=['DELETE'])
def delete_book(_id):
    return delete_book_controller(_id)

@admin_blueprint.route('/books/update_portada/<int:_id>', methods=['PUT'])
def update_portada(_id):
    return update_portada_controller(_id)

@admin_blueprint.route('/books/update_pdf/<int:_id>', methods=['PUT'])
def update_pdf(_id):
    return update_pdf_controller(_id)


from flask import Blueprint, jsonify
from src.controllers.users_controller import *

user_blueprint = Blueprint('users', __name__)

@user_blueprint.route('/profile/<int:_id>', methods=['PUT'])
def update(_id):
    return update_controller(_id, request.get_json())

@user_blueprint.route('/profile/<int:_id>', methods=['GET'])
def obtener_user(_id):
    return get_user_controller(_id)

@user_blueprint.route('/books/<int:_id>', methods=['GET'])
def user_books(_id):
    return user_books_controller(_id)
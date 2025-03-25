from flask import Blueprint, jsonify
from src.controllers.categorie_controller import *

categorie_blueprint = Blueprint('categories', __name__)

@categorie_blueprint.route('',methods=['GET'])
def categories():
    return categories_controller()

@categorie_blueprint.route('/<int:_id>/books', methods=['GET'])
def categories_book(_id):
    return categories_book_controller(_id)

@categorie_blueprint.route('/create', methods=['POST'])
def new_categorie():
    return new_categorie_controller()
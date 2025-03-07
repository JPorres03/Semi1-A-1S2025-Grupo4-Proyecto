from flask import Blueprint, jsonify
from src.controllers.auth_controller import *

auth_blueprint = Blueprint('auth', __name__)

@auth_blueprint.route('/test_sql_conecction', methods=['GET'])
def test_connection_route():
    return test_connection_controller()

@auth_blueprint.route('/login', methods=['POST'])
def login():
    return login_controller()

@auth_blueprint.route('/register', methods=['POST'])
def register():
    return register_controller(request.ge)
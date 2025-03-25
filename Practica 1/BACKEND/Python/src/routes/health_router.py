from flask import Blueprint, jsonify

healtg_blueprint = Blueprint('health', __name__)

@healtg_blueprint.route('/', methods=['GET'])
def health_check():
    return jsonify({"status":"OK"}), 200